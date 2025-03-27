/**
 * Dashboard Controller
 * Handles dashboard data and job application history
 */

const Application = require('../models/Application');

/**
 * Get dashboard statistics
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get application count by status
    const statusCounts = await Application.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Format status counts
    const formattedStatusCounts = {
      applied: 0,
      interviewing: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0,
      saved: 0
    };
    
    statusCounts.forEach(status => {
      formattedStatusCounts[status._id] = status.count;
    });
    
    // Get total application count
    const totalApplications = await Application.countDocuments({ user: userId });
    
    // Get application count by date (for the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const applicationsByDate = await Application.aggregate([
      { 
        $match: { 
          user: userId,
          applicationDate: { $gte: thirtyDaysAgo }
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: '%Y-%m-%d', date: '$applicationDate' } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);
    
    // Get recent applications
    const recentApplications = await Application.find({ user: userId })
      .sort({ applicationDate: -1 })
      .limit(5)
      .select('company jobTitle applicationDate status applicationUrl');
    
    res.status(200).json({
      stats: {
        totalApplications,
        statusCounts: formattedStatusCounts,
        applicationsByDate,
        recentApplications
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get application history
 */
exports.getApplicationHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const sortField = req.query.sortField || 'applicationDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Build query
    const query = { user: userId };
    
    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Add company or job title search if provided
    if (req.query.search) {
      const search = req.query.search;
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { jobTitle: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get total count
    const totalCount = await Application.countDocuments(query);
    
    // Build sort object
    const sort = {};
    sort[sortField] = sortOrder;
    
    // Get applications
    const applications = await Application.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('company jobTitle applicationDate status applicationUrl source jobLocation jobType');
    
    res.status(200).json({
      applications,
      pagination: {
        total: totalCount,
        page,
        pages: Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get application detail
 */
exports.getApplicationDetail = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.id;
    
    // Find application
    const application = await Application.findOne({
      _id: applicationId,
      user: userId
    });
    
    if (!application) {
      return res.status(404).json({
        error: 'Application not found'
      });
    }
    
    res.status(200).json({ application });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Update application status
 */
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.id;
    const { status, notes } = req.body;
    
    // Validate status
    const validStatuses = ['applied', 'interviewing', 'offer', 'rejected', 'withdrawn', 'saved'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status value'
      });
    }
    
    // Find application
    const application = await Application.findOne({
      _id: applicationId,
      user: userId
    });
    
    if (!application) {
      return res.status(404).json({
        error: 'Application not found'
      });
    }
    
    // Update status
    application.status = status;
    
    // Add timeline entry
    application.timeline.push({
      status,
      date: new Date(),
      notes: notes || null
    });
    
    await application.save();
    
    res.status(200).json({
      message: 'Application status updated successfully',
      application: {
        id: application._id,
        company: application.company,
        jobTitle: application.jobTitle,
        status: application.status,
        timeline: application.timeline
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Add interview to application
 */
exports.addInterview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.id;
    const { interviewType, interviewDate, interviewerName, interviewerTitle, notes } = req.body;
    
    // Validate required fields
    if (!interviewType || !interviewDate) {
      return res.status(400).json({
        error: 'Interview type and date are required'
      });
    }
    
    // Find application
    const application = await Application.findOne({
      _id: applicationId,
      user: userId
    });
    
    if (!application) {
      return res.status(404).json({
        error: 'Application not found'
      });
    }
    
    // Add interview
    application.interviews.push({
      interviewType,
      interviewDate: new Date(interviewDate),
      interviewerName: interviewerName || null,
      interviewerTitle: interviewerTitle || null,
      notes: notes || null,
      outcome: 'pending'
    });
    
    // Update status to interviewing if not already
    if (application.status !== 'interviewing' && 
        application.status !== 'offer' && 
        application.status !== 'rejected') {
      application.status = 'interviewing';
      
      // Add timeline entry
      application.timeline.push({
        status: 'interviewing',
        date: new Date(),
        notes: `Added ${interviewType} interview`
      });
    }
    
    await application.save();
    
    res.status(200).json({
      message: 'Interview added successfully',
      application: {
        id: application._id,
        company: application.company,
        jobTitle: application.jobTitle,
        status: application.status,
        interviews: application.interviews
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Update interview outcome
 */
exports.updateInterviewOutcome = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.id;
    const interviewId = req.params.interviewId;
    const { outcome, notes } = req.body;
    
    // Validate outcome
    const validOutcomes = ['pending', 'passed', 'failed'];
    
    if (!outcome || !validOutcomes.includes(outcome)) {
      return res.status(400).json({
        error: 'Invalid outcome value'
      });
    }
    
    // Find application
    const application = await Application.findOne({
      _id: applicationId,
      user: userId
    });
    
    if (!application) {
      return res.status(404).json({
        error: 'Application not found'
      });
    }
    
    // Find interview
    const interviewIndex = application.interviews.findIndex(
      interview => interview._id.toString() === interviewId
    );
    
    if (interviewIndex === -1) {
      return res.status(404).json({
        error: 'Interview not found'
      });
    }
    
    // Update interview outcome
    application.interviews[interviewIndex].outcome = outcome;
    
    // Update notes if provided
    if (notes) {
      application.interviews[interviewIndex].notes = notes;
    }
    
    // If all interviews are complete, update application status
    if (outcome === 'failed') {
      application.status = 'rejected';
      
      // Add timeline entry
      application.timeline.push({
        status: 'rejected',
        date: new Date(),
        notes: 'Failed interview'
      });
    } else if (outcome === 'passed' && 
        application.interviews.every(interview => 
          interview.outcome === 'passed' || 
          (interview._id.toString() === interviewId && outcome === 'passed'))) {
      application.status = 'offer';
      
      // Add timeline entry
      application.timeline.push({
        status: 'offer',
        date: new Date(),
        notes: 'Passed all interviews'
      });
    }
    
    await application.save();
    
    res.status(200).json({
      message: 'Interview outcome updated successfully',
      application: {
        id: application._id,
        company: application.company,
        jobTitle: application.jobTitle,
        status: application.status,
        interviews: application.interviews
      }
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Delete application
 */
exports.deleteApplication = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const applicationId = req.params.id;
    
    // Find and delete application
    const application = await Application.findOneAndDelete({
      _id: applicationId,
      user: userId
    });
    
    if (!application) {
      return res.status(404).json({
        error: 'Application not found'
      });
    }
    
    res.status(200).json({
      message: 'Application deleted successfully'
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Get calendar data
 */
exports.getCalendarData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    
    // Build query
    const query = { user: userId };
    
    // Add date range if provided
    if (startDate && endDate) {
      query.applicationDate = {
        $gte: startDate,
        $lte: endDate
      };
    }
    
    // Get applications
    const applications = await Application.find(query)
      .select('company jobTitle applicationDate status');
    
    // Get interviews
    const applicationsWithInterviews = await Application.find({
      user: userId,
      'interviews.interviewDate': { $exists: true }
    }).select('company jobTitle interviews');
    
    // Format calendar events
    const calendarEvents = [];
    
    // Add application events
    applications.forEach(app => {
      calendarEvents.push({
        id: app._id,
        title: `Applied to ${app.company} - ${app.jobTitle}`,
        start: app.applicationDate,
        end: app.applicationDate,
        allDay: true,
        type: 'application',
        status: app.status
      });
    });
    
    // Add interview events
    applicationsWithInterviews.forEach(app => {
      app.interviews.forEach(interview => {
        if (interview.interviewDate) {
          // Check if interview date is within range
          if ((!startDate || interview.interviewDate >= startDate) && 
              (!endDate || interview.interviewDate <= endDate)) {
            calendarEvents.push({
              id: `${app._id}-${interview._id}`,
              title: `${interview.interviewType} Interview at ${app.company}`,
              start: interview.interviewDate,
              end: new Date(interview.interviewDate.getTime() + 3600000), // Add 1 hour
              type: 'interview',
              interviewType: interview.interviewType,
              outcome: interview.outcome
            });
          }
        }
      });
    });
    
    res.status(200).json({ calendarEvents });
    
  } catch (error) {
    next(error);
  }
};