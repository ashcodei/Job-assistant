import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  ClockIcon,
  ShieldCheckIcon,
  ComputerDesktopIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Help = () => {
  // State for FAQ accordions
  const [openQuestions, setOpenQuestions] = useState({});
  
  // FAQ data
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          id: "gs-1",
          question: "How do I get started with JobsAI?",
          answer: "Getting started is easy! First, create an account by clicking the 'Sign Up' button. Then, upload your resume and complete your profile. Once that's done, you can download our Chrome extension to start using AI-powered form filling when applying for jobs online."
        },
        {
          id: "gs-2",
          question: "Do I need to create an account to use JobsAI?",
          answer: "Yes, you need to create an account to use JobsAI's features. This allows us to securely store your resume data and provide personalized assistance for your job applications."
        },
        {
          id: "gs-3",
          question: "Is JobsAI free to use?",
          answer: "JobsAI offers a free tier with basic features. We also offer premium plans with advanced features like unlimited applications, priority AI processing, and enhanced tracking capabilities. Check our pricing page for more details."
        }
      ]
    },
    {
      category: "Resume Upload",
      questions: [
        {
          id: "ru-1",
          question: "What file formats do you support for resume upload?",
          answer: "We support PDF, DOCX, DOC, ODT, and TXT file formats for resume uploads. For best results, we recommend uploading a PDF or DOCX file to preserve formatting."
        },
        {
          id: "ru-2",
          question: "How does JobsAI process my resume?",
          answer: "Our AI analyzes your resume to extract key information like your contact details, work experience, education, and skills. This data is then structured and stored securely in our system to be used when filling out job applications."
        },
        {
          id: "ru-3",
          question: "Can I update my resume after uploading it?",
          answer: "Yes, you can update your resume at any time by navigating to the Resume section in your dashboard. Simply upload a new file, and our system will process and update your information accordingly."
        }
      ]
    },
    {
      category: "Chrome Extension",
      questions: [
        {
          id: "ce-1",
          question: "How do I install the JobsAI Chrome extension?",
          answer: "You can install our Chrome extension by visiting the Chrome Web Store and searching for 'JobsAI', or by clicking the 'Get Chrome Extension' button in your dashboard. Once installed, sign in with your JobsAI account to start using it."
        },
        {
          id: "ce-2",
          question: "How does the Chrome extension work?",
          answer: "The JobsAI Chrome extension automatically detects when you're on a job application page. It shows a floating icon that you can click to open a panel with AI-generated suggestions for each form field. You can review and apply these suggestions with a single click."
        },
        {
          id: "ce-3",
          question: "What websites does the Chrome extension work with?",
          answer: "Our extension works with most major job boards and career sites, including LinkedIn, Indeed, Glassdoor, ZipRecruiter, and company career pages. The AI is designed to recognize and adapt to different form formats across various platforms."
        }
      ]
    },
    {
      category: "Application Tracking",
      questions: [
        {
          id: "at-1",
          question: "How do I track my job applications?",
          answer: "All applications filled with JobsAI are automatically tracked in your dashboard. You can also manually add applications by clicking the 'Add Application' button in the Applications section. Track statuses, add notes, and record interview details all in one place."
        },
        {
          id: "at-2",
          question: "Can I export my application data?",
          answer: "Yes, you can export your application data as a CSV or PDF file. Go to the Applications section in your dashboard, click on the 'Export' button, and select your preferred format."
        },
        {
          id: "at-3",
          question: "How do I update the status of my application?",
          answer: "To update an application status, go to the Applications section in your dashboard, click on the application you want to update, and select the new status from the dropdown menu. You can mark applications as Applied, Interviewing, Offer, Rejected, or Withdrawn."
        }
      ]
    },
    {
      category: "Privacy & Security",
      questions: [
        {
          id: "ps-1",
          question: "How secure is my data with JobsAI?",
          answer: "We take data security seriously. All your personal information and resume data are encrypted both in transit and at rest. We use industry-standard security measures to protect your data, and we never share your information with third parties without your consent."
        },
        {
          id: "ps-2",
          question: "Can JobsAI access my accounts on job sites?",
          answer: "No, JobsAI does not have access to your accounts on job sites. Our Chrome extension only reads and fills form data on the pages you're actively using, and it never stores your login credentials for any website."
        },
        {
          id: "ps-3",
          question: "How can I delete my account and data?",
          answer: "You can delete your account and all associated data by going to your Profile settings and clicking on the 'Delete Account' tab. Follow the instructions to permanently remove your account and data from our systems."
        }
      ]
    }
  ];
  
  // Toggle question open/closed
  const toggleQuestion = (id) => {
    setOpenQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Contact options
  const contactOptions = [
    {
      icon: EnvelopeIcon,
      title: "Email Support",
      description: "Get help via email. We typically respond within 24 hours.",
      action: "Email Us",
      link: "mailto:support@jobsai.com"
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Live Chat",
      description: "Chat with our support team in real-time during business hours.",
      action: "Start Chat",
      link: "#chat"
    },
    {
      icon: ComputerDesktopIcon,
      title: "Knowledge Base",
      description: "Browse our detailed articles and tutorials for self-service support.",
      action: "Browse Articles",
      link: "/knowledge-base"
    }
  ];
  
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl"
            >
              How can we help?
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 max-w-xl mx-auto text-xl text-primary-100"
            >
              Find answers to common questions and learn how to get the most out of JobsAI.
            </motion.p>
          </div>
          
          {/* Search Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 max-w-xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-transparent rounded-md leading-5 bg-white placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
                placeholder="Search for answers..."
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Quick Help Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Quick Help Categories
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <SparklesIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Getting Started</h3>
              <p className="text-gray-500 mb-4">
                New to JobsAI? Learn how to set up your account and get started with AI-powered job applications.
              </p>
              <Link to="#getting-started" className="text-primary-600 hover:text-primary-500 font-medium">
                Learn more →
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <DocumentTextIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Resume Upload</h3>
              <p className="text-gray-500 mb-4">
                Find out how to upload and manage your resume for optimal AI-powered form filling.
              </p>
              <Link to="#resume-upload" className="text-primary-600 hover:text-primary-500 font-medium">
                Learn more →
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <ComputerDesktopIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Chrome Extension</h3>
              <p className="text-gray-500 mb-4">
                Get help with installing and using our Chrome extension for automatic form filling.
              </p>
              <Link to="#chrome-extension" className="text-primary-600 hover:text-primary-500 font-medium">
                Learn more →
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <BriefcaseIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Application Tracking</h3>
              <p className="text-gray-500 mb-4">
                Learn how to track and manage your job applications effectively.
              </p>
              <Link to="#application-tracking" className="text-primary-600 hover:text-primary-500 font-medium">
                Learn more →
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <ClockIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Troubleshooting</h3>
              <p className="text-gray-500 mb-4">
                Having issues? Find solutions to common problems and technical difficulties.
              </p>
              <Link to="#troubleshooting" className="text-primary-600 hover:text-primary-500 font-medium">
                Learn more →
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <ShieldCheckIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Privacy & Security</h3>
              <p className="text-gray-500 mb-4">
                Understand how we protect your data and keep your information secure.
              </p>
              <Link to="#privacy-security" className="text-primary-600 hover:text-primary-500 font-medium">
                Learn more →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Find answers to the most common questions about JobsAI.
            </p>
          </div>
          
          <div className="space-y-8">
            {faqs.map((category) => (
              <div key={category.category} className="bg-white p-4 rounded-lg shadow-sm" id={category.category.toLowerCase().replace(/\s+/g, '-')}>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{category.category}</h3>
                <div className="divide-y divide-gray-200">
                  {category.questions.map((item) => (
                    <div key={item.id} className="py-4">
                      <button
                        onClick={() => toggleQuestion(item.id)}
                        className="flex justify-between items-center w-full text-left focus:outline-none"
                      >
                        <span className="text-lg font-medium text-gray-900">{item.question}</span>
                        {openQuestions[item.id] ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {openQuestions[item.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 text-gray-600"
                        >
                          <p>{item.answer}</p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Still Need Help?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Our support team is here to assist you. Choose your preferred contact method below.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {contactOptions.map((option, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                  <option.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-500 mb-4">
                  {option.description}
                </p>
                <a 
                  href={option.link} 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  {option.action}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;