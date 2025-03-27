import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  MapPinIcon,
  LinkIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ChatBubbleBottomCenterTextIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    timeline: true,
    interviews: true,
    formFields: false,
  });
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [addInterviewOpen, setAddInterviewOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    interviewType: '',
    interviewDate: '',
    interviewerName: '',
    interviewerTitle: '',
    notes: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  // Status colors
  const statusColors = {
    applied: 'bg-blue-100 text-blue-800',
    interviewing: 'bg-yellow-100 text-yellow-800',
    offer: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    withdrawn: 'bg-gray-100 text-gray-800',
    saved: 'bg-purple-100 text-purple-800',
  };
  
  // Status display names
  const statusNames = {
    applied: 'Applied',
    interviewing: 'Interviewing',
    offer: 'Offer Received',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn',
    saved: 'Saved',
  };
  
  // Fetch application data
  useEffect(() => {
    fetchApplication();
  }, [id]);
  
  const fetchApplication = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/dashboard/applications/${id}`);
      setApplication(response.data.application);
      // Set newStatus to current status for the update form
      setNewStatus(response.data.application.status);
      setError(null);
    } catch (err) {
      console.error('Error fetching application:', err);
      setError('Failed to load application details. Please try again later.');
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  
  // Update application status
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put(`/api/dashboard/applications/${id}/status`, {
        status: newStatus,
        notes: statusNote,
      });
      
      // Refetch application to get updated data
      await fetchApplication();
      toast.success('Status updated successfully');
      setStatusUpdateOpen(false);
      setStatusNote('');
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };
  
  // Add interview
  const handleAddInterview = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`/api/dashboard/applications/${id}/interviews`, interviewForm);
      
      // Refetch application to get updated data
      await fetchApplication();
      toast.success('Interview added successfully');
      setAddInterviewOpen(false);
      // Reset form
      setInterviewForm({
        interviewType: '',
        interviewDate: '',
        interviewerName: '',
        interviewerTitle: '',
        notes: '',
      });
    } catch (err) {
      console.error('Error adding interview:', err);
      toast.error('Failed to add interview');
    } finally {
      setLoading(false);
    }
  };
  
  // Update interview outcome
  const handleUpdateInterviewOutcome = async (interviewId, outcome) => {
    try {
      setLoading(true);
      await axios.put(`/api/dashboard/applications/${id}/interviews/${interviewId}`, {
        outcome,
      });
      
      // Refetch application to get updated data
      await fetchApplication();
      toast.success('Interview outcome updated');
    } catch (err) {
      console.error('Error updating interview outcome:', err);
      toast.error('Failed to update interview outcome');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete application
  const handleDeleteApplication = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/dashboard/applications/${id}`);
      
      toast.success('Application deleted successfully');
      navigate('/dashboard/applications');
    } catch (err) {
      console.error('Error deleting application:', err);
      toast.error('Failed to delete application');
      setDeleteConfirmOpen(false);
    } finally {
      setLoading(false);
    }
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    return (
      <span
        className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${statusColors[status]}`}
      >
        {statusNames[status]}
      </span>
    );
  };
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied':
        return <ArrowPathIcon className="h-5 w-5 text-blue-600" />;
      case 'interviewing':
        return <UserGroupIcon className="h-5 w-5 text-yellow-600" />;
      case 'offer':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'withdrawn':
        return <XCircleIcon className="h-5 w-5 text-gray-600" />;
      case 'saved':
        return <DocumentTextIcon className="h-5 w-5 text-purple-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };
  
  // Format interview type
  const formatInterviewType = (type) => {
    switch (type) {
      case 'phone':
        return 'Phone Interview';
      case 'video':
        return 'Video Interview';
      case 'in-person':
        return 'In-Person Interview';
      case 'technical':
        return 'Technical Interview';
      case 'other':
        return 'Other Interview';
      default:
        return type;
    }
  };
  
  // Get interview outcome badge
  const getInterviewOutcomeBadge = (outcome) => {
    switch (outcome) {
      case 'passed':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Passed
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Failed
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Pending
          </span>
        );
    }
  };
  
  // Loading state
  if (loading && !application) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error && !application) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Error Loading Application</h3>
              <p className="mt-2 text-gray-500">{error}</p>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={fetchApplication}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                >
                  Try Again
                </button>
                <Link
                  to="/dashboard/applications"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Back to Applications
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // If no application data yet, show nothing
  if (!application) {
    return null;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back navigation */}
      <div className="mb-4">
        <Link
          to="/dashboard/applications"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to Applications
        </Link>
      </div>
      
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex items-start">
              <div className="p-2 bg-gray-100 rounded-lg mr-4">
                <BriefcaseIcon className="h-8 w-8 text-gray-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{application.jobTitle}</h1>
                <div className="flex items-center mt-1 text-lg text-gray-700">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-500 mr-1" />
                  {application.company}
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {application.applicationDate && (
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Applied: {format(parseISO(application.applicationDate), 'MMM dd, yyyy')}
                    </div>
                  )}
                  
                  {application.jobLocation && (
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {application.jobLocation}
                    </div>
                  )}
                  
                  {application.jobType && (
                    <div className="flex items-center text-sm text-gray-500">
                      <BriefcaseIcon className="h-4 w-4 mr-1" />
                      {application.jobType}
                    </div>
                  )}
                  
                  {application.source && (
                    <div className="flex items-center text-sm text-gray-500">
                      <LinkIcon className="h-4 w-4 mr-1" />
                      Source: {application.source}
                    </div>
                  )}
                  
                  {application.salary && (
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-bold mr-1">$</span>
                      {application.salary}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col items-end">
            {getStatusBadge(application.status)}
            
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => setStatusUpdateOpen(true)}
                className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Update Status
              </button>
              <button
                onClick={() => setDeleteConfirmOpen(true)}
                className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 shadow-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
        
        {/* Application URL */}
        {application.applicationUrl && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <a
              href={application.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              View Original Job Posting
            </a>
          </div>
        )}
        
        {/* Job Description */}
        {application.jobDescription && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Job Description</h3>
            <div className="text-gray-700 prose max-w-none">
              <p>{application.jobDescription}</p>
            </div>
          </div>
        )}
        
        {/* Notes */}
        {application.notes && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
            <div className="text-gray-700 bg-gray-50 p-4 rounded-md">
              <p>{application.notes}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Status Update Modal */}
      {statusUpdateOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">Update Application Status</h2>
            <form onSubmit={handleStatusUpdate}>
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                >
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offer">Offer Received</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                  <option value="saved">Saved</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  rows="3"
                  placeholder="Add any notes about this status update..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setStatusUpdateOpen(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                      Updating...
                    </>
                  ) : (
                    'Update Status'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">Delete Application</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this application? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteApplication}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete Application'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Timeline Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <button
          onClick={() => toggleSection('timeline')}
          className="w-full flex items-center justify-between focus:outline-none"
        >
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Application Timeline</h2>
          </div>
          {expandedSections.timeline ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>
        
        {expandedSections.timeline && (
          <div className="mt-4">
            {application.timeline && application.timeline.length > 0 ? (
              <div className="flow-root">
                <ul className="-mb-8">
                  {application.timeline.map((event, index) => (
                    <li key={index}>
                      <div className="relative pb-8">
                        {index !== application.timeline.length - 1 ? (
                          <span
                            className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex items-start space-x-3">
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                              {getStatusIcon(event.status)}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <div className="text-sm">
                                <span className="font-medium text-gray-900">
                                  {statusNames[event.status]}
                                </span>
                              </div>
                              <p className="mt-0.5 text-sm text-gray-500">
                                {format(parseISO(event.date), 'MMM dd, yyyy h:mm a')}
                              </p>
                            </div>
                            {event.notes && (
                              <div className="mt-2 text-sm text-gray-700">
                                <p>{event.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No timeline events yet</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Interviews Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => toggleSection('interviews')}
            className="flex items-center justify-between focus:outline-none"
          >
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Interviews</h2>
            </div>
            {expandedSections.interviews ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          <button
            onClick={() => setAddInterviewOpen(true)}
            className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Interview
          </button>
        </div>
        
        {expandedSections.interviews && (
          <div className="mt-4">
            {application.interviews && application.interviews.length > 0 ? (
              <div className="space-y-4">
                {application.interviews.map((interview, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {formatInterviewType(interview.interviewType)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {format(parseISO(interview.interviewDate), 'EEEE, MMMM dd, yyyy h:mm a')}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">{getInterviewOutcomeBadge(interview.outcome)}</div>
                    </div>
                    
                    {(interview.interviewerName || interview.interviewerTitle) && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-700">
                          Interviewer: {interview.interviewerName}
                          {interview.interviewerTitle && ` (${interview.interviewerTitle})`}
                        </p>
                      </div>
                    )}
                    
                    {interview.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-700">{interview.notes}</p>
                      </div>
                    )}
                    
                    {interview.outcome === 'pending' && (
                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={() => handleUpdateInterviewOutcome(interview._id, 'passed')}
                          className="inline-flex items-center px-2 py-1 text-xs border border-green-300 rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none"
                        >
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Mark as Passed
                        </button>
                        <button
                          onClick={() => handleUpdateInterviewOutcome(interview._id, 'failed')}
                          className="inline-flex items-center px-2 py-1 text-xs border border-red-300 rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none"
                        >
                          <XCircleIcon className="h-3 w-3 mr-1" />
                          Mark as Failed
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No interviews scheduled</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Add Interview Modal */}
      {addInterviewOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6 overflow-y-auto max-h-[90vh]"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add Interview</h2>
            <form onSubmit={handleAddInterview}>
              <div className="mb-4">
                <label htmlFor="interviewType" className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Type
                </label>
                <select
                  id="interviewType"
                  value={interviewForm.interviewType}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewType: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="phone">Phone Interview</option>
                  <option value="video">Video Interview</option>
                  <option value="in-person">In-Person Interview</option>
                  <option value="technical">Technical Interview</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="interviewDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="interviewDate"
                  value={interviewForm.interviewDate}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewDate: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="interviewerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Interviewer Name (Optional)
                </label>
                <input
                  type="text"
                  id="interviewerName"
                  value={interviewForm.interviewerName}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewerName: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="e.g. John Smith"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="interviewerTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Interviewer Title (Optional)
                </label>
                <input
                  type="text"
                  id="interviewerTitle"
                  value={interviewForm.interviewerTitle}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewerTitle: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="e.g. HR Manager"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  rows="3"
                  placeholder="Add any notes about this interview..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAddInterviewOpen(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="animate-spin h-4 w-4 mr-2" />
                      Adding...
                    </>
                  ) : (
                    'Add Interview'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      
      {/* Form Fields Section */}
      {application.formFields && application.formFields.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <button
            onClick={() => toggleSection('formFields')}
            className="w-full flex items-center justify-between focus:outline-none"
          >
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Form Fields</h2>
            </div>
            {expandedSections.formFields ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {expandedSections.formFields && (
            <div className="mt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Field
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        AI Suggestion
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User Correction
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {application.formFields.map((field, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {field.fieldName || field.label}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {field.aiSuggestion || <span className="text-gray-400 italic">None</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${field.confidenceLevel === 'green' ? 'bg-green-100 text-green-800' : 
                                field.confidenceLevel === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}
                          >
                            {field.confidenceLevel === 'green' ? 'High' : 
                              field.confidenceLevel === 'yellow' ? 'Medium' : 'Low'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {field.userCorrection ? field.userCorrection : <span className="text-gray-400 italic">None</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationDetail;