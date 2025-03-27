import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, parseISO, subDays } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { useResume } from '../../contexts/ResumeContext';
import {
  DocumentTextIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { hasResume, isProcessing, resumeInfo } = useResume();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/dashboard/stats');
        setDashboardStats(response.data.stats);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare chart data for applications over time
  const prepareApplicationsChartData = () => {
    // If no data yet, return empty datasets
    if (!dashboardStats || !dashboardStats.applicationsByDate) {
      // Generate last 30 days
      const labels = Array.from({ length: 30 }, (_, i) => {
        return format(subDays(new Date(), 29 - i), 'MMM dd');
      });

      return {
        labels,
        datasets: [
          {
            label: 'Applications',
            data: Array(30).fill(0),
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.5)',
            tension: 0.3,
          },
        ],
      };
    }

    // Generate last 30 days
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return format(date, 'yyyy-MM-dd');
    });

    // Create a map of dates to counts
    const dateCountMap = {};
    dashboardStats.applicationsByDate.forEach((item) => {
      dateCountMap[item._id] = item.count;
    });

    // Fill in data for chart
    const data = last30Days.map((date) => dateCountMap[date] || 0);
    const labels = last30Days.map((date) => format(parseISO(date), 'MMM dd'));

    return {
      labels,
      datasets: [
        {
          label: 'Applications',
          data,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.5)',
          tension: 0.3,
        },
      ],
    };
  };

  // Prepare chart data for application status
  const prepareStatusChartData = () => {
    if (!dashboardStats || !dashboardStats.statusCounts) {
      return {
        labels: ['Applied', 'Interviewing', 'Offers', 'Rejected', 'Saved'],
        datasets: [
          {
            data: [0, 0, 0, 0, 0],
            backgroundColor: [
              'rgba(99, 102, 241, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(239, 68, 68, 0.7)',
              'rgba(107, 114, 128, 0.7)',
            ],
            borderColor: [
              'rgb(99, 102, 241)',
              'rgb(245, 158, 11)',
              'rgb(16, 185, 129)',
              'rgb(239, 68, 68)',
              'rgb(107, 114, 128)',
            ],
            borderWidth: 1,
          },
        ],
      };
    }

    return {
      labels: ['Applied', 'Interviewing', 'Offers', 'Rejected', 'Saved'],
      datasets: [
        {
          data: [
            dashboardStats.statusCounts.applied || 0,
            dashboardStats.statusCounts.interviewing || 0,
            dashboardStats.statusCounts.offer || 0,
            dashboardStats.statusCounts.rejected || 0,
            dashboardStats.statusCounts.saved || 0,
          ],
          backgroundColor: [
            'rgba(99, 102, 241, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(107, 114, 128, 0.7)',
          ],
          borderColor: [
            'rgb(99, 102, 241)',
            'rgb(245, 158, 11)',
            'rgb(16, 185, 129)',
            'rgb(239, 68, 68)',
            'rgb(107, 114, 128)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
    cutout: '70%',
  };

  // Determine resume setup status
  const getResumeStatus = () => {
    if (!hasResume) {
      return {
        status: 'not-uploaded',
        message: 'Resume not uploaded. Upload your resume to enable AI-powered job application assistance.',
        icon: ExclamationCircleIcon,
        color: 'text-warning-500',
        bgColor: 'bg-warning-100',
      };
    } else if (isProcessing) {
      return {
        status: 'processing',
        message: 'Resume is being processed. This may take a few minutes.',
        icon: ClockIcon,
        color: 'text-warning-500',
        bgColor: 'bg-warning-100',
      };
    } else {
      return {
        status: 'ready',
        message: 'Resume is ready. AI assistance is fully operational.',
        icon: CheckCircleIcon,
        color: 'text-success-500',
        bgColor: 'bg-success-100',
      };
    }
  };

  const resumeStatus = getResumeStatus();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser?.name || 'User'}!</h1>
          <p className="text-sm text-gray-600 mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/dashboard/applications"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
          >
            <BriefcaseIcon className="w-4 h-4 mr-2" />
            My Applications
          </Link>
        </div>
      </div>

      {/* Resume Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 ${resumeStatus.bgColor} rounded-lg shadow-sm`}
      >
        <div className="flex items-start space-x-4">
          <div className={`${resumeStatus.color} p-2 rounded-full`}>
            <resumeStatus.icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Resume Status</h3>
            <p className="text-gray-700">{resumeStatus.message}</p>
            {resumeInfo && (
              <p className="text-sm text-gray-600 mt-1">
                Last updated: {new Date(resumeInfo.uploadDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <div>
            <Link
              to="/dashboard/resume"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 focus:outline-none"
            >
              {hasResume ? 'Update Resume' : 'Upload Resume'}
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <h3 className="text-3xl font-semibold text-gray-900 mt-1">
                {loading ? (
                  <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
                ) : (
                  dashboardStats?.totalApplications || 0
                )}
              </h3>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <BriefcaseIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </motion.div>

        {/* Active Interviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Interviews</p>
              <h3 className="text-3xl font-semibold text-gray-900 mt-1">
                {loading ? (
                  <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
                ) : (
                  dashboardStats?.statusCounts?.interviewing || 0
                )}
              </h3>
            </div>
            <div className="p-3 bg-warning-100 rounded-full">
              <ClockIcon className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </motion.div>

        {/* Job Offers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Job Offers</p>
              <h3 className="text-3xl font-semibold text-gray-900 mt-1">
                {loading ? (
                  <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
                ) : (
                  dashboardStats?.statusCounts?.offer || 0
                )}
              </h3>
            </div>
            <div className="p-3 bg-success-100 rounded-full">
              <CheckCircleIcon className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900">Applications Over Time</h3>
          <p className="text-sm text-gray-600 mb-4">Last 30 days</p>
          
          <div className="h-64">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <Line data={prepareApplicationsChartData()} options={lineChartOptions} />
            )}
          </div>
        </motion.div>

        {/* Application Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900">Application Status</h3>
          <p className="text-sm text-gray-600 mb-4">Distribution by current status</p>
          
          <div className="h-64">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <Doughnut data={prepareStatusChartData()} options={doughnutChartOptions} />
            )}
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Resume Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-6 rounded-lg shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-primary-100 rounded-full">
              <SparklesIcon className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Resume Insights</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Get AI-powered insights to optimize your resume and increase your chances of landing interviews.
          </p>
          <Link
            to="/dashboard/resume/insights"
            className={`text-sm font-medium ${
              hasResume && !isProcessing
                ? 'text-primary-600 hover:text-primary-700'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            {hasResume && !isProcessing ? 'View Insights →' : 'Upload Resume First →'}
          </Link>
        </motion.div>

        {/* Application Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white p-6 rounded-lg shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-warning-100 rounded-full">
              <ArrowTrendingUpIcon className="w-5 h-5 text-warning-600" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">Application Tracker</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Track your job applications, interviews, and offers all in one place with our intuitive dashboard.
          </p>
          <Link
            to="/dashboard/applications"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Track Applications →
          </Link>
        </motion.div>

        {/* Chrome Extension */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white p-6 rounded-lg shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-success-100 rounded-full">
              <ShieldCheckIcon className="w-5 h-5 text-success-600" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-900">AI Assistant</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Use our Chrome extension to automatically fill out job applications with AI-powered suggestions.
          </p>
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Get Chrome Extension →
          </a>
        </motion.div>
      </div>

      {/* Recent Applications */}
      {dashboardStats?.recentApplications && dashboardStats.recentApplications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white p-6 rounded-lg shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardStats.recentApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{app.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{app.jobTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {format(new Date(app.applicationDate), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          app.status === 'applied'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'interviewing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : app.status === 'offer'
                            ? 'bg-green-100 text-green-800'
                            : app.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : app.status === 'withdrawn'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Link
              to="/dashboard/applications"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View All Applications →
            </Link>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <p>{error}</p>
          <button
            className="mt-2 text-sm font-medium underline"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;