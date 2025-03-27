import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  UserGroupIcon, 
  RocketLaunchIcon, 
  LightBulbIcon, 
  ClockIcon, 
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const About = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
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
              About JobsAI
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 max-w-xl mx-auto text-xl text-primary-100"
            >
              AI-powered job application assistance that saves you time and helps you land your dream job.
            </motion.p>
          </div>
        </div>
      </div>
      
      {/* Our Mission */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-base font-semibold text-primary-600 uppercase tracking-wide">Our Mission</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Revolutionizing the Job Application Process
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              We're on a mission to make job applications less tedious and more successful for everyone.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="prose prose-lg max-w-4xl mx-auto text-gray-500">
            <p>
              At JobsAI, we believe that the job application process shouldn't be a barrier to finding meaningful work. 
              Too many qualified candidates miss opportunities because they're overwhelmed by the repetitive and time-consuming nature of applications.
            </p>
            <p>
              That's why we built JobsAI — to remove the friction from job applications and help candidates focus on what matters: 
              showcasing their skills and finding the right opportunities.
            </p>
            <p>
              Our AI-powered platform automates the tedious parts of job applications, intelligently filling out forms with your information and 
              tracking your applications all in one place. This allows you to apply to more positions in less time, increasing your chances of landing interviews.
            </p>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Our Values */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-base font-semibold text-primary-600 uppercase tracking-wide">Our Values</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What We Stand For
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <ClockIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Time Efficiency</h3>
              <p className="text-gray-500">
                We believe your time is valuable. Our tools are designed to save you hours on repetitive tasks so you can focus on what matters.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <LightBulbIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-500">
                We harness the latest AI technology to solve real problems, constantly improving our platform to better serve job seekers.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-md bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <RocketLaunchIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Opportunity</h3>
              <p className="text-gray-500">
                We're committed to helping people access better career opportunities by removing barriers in the application process.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Our Team */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-base font-semibold text-primary-600 uppercase tracking-wide">Our Team</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Meet the People Behind JobsAI
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              A diverse team of engineers, designers, and career experts working together to transform the job search experience.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3">
            <motion.div variants={itemVariants} className="text-center">
              <div className="mx-auto h-40 w-40 rounded-full overflow-hidden">
                <img 
                  src="https://source.unsplash.com/mEZ3PoFGs_k/400x400" 
                  alt="Team member" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">Sarah Johnson</h3>
                <p className="text-primary-600">CEO & Co-Founder</p>
                <p className="mt-2 text-gray-500 text-sm">
                  Former HR tech executive with a passion for improving the hiring process.
                </p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center">
              <div className="mx-auto h-40 w-40 rounded-full overflow-hidden">
                <img 
                  src="https://source.unsplash.com/sibVwORYqs0/400x400" 
                  alt="Team member" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">Michael Chen</h3>
                <p className="text-primary-600">CTO & Co-Founder</p>
                <p className="mt-2 text-gray-500 text-sm">
                  AI researcher with expertise in natural language processing and machine learning.
                </p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center">
              <div className="mx-auto h-40 w-40 rounded-full overflow-hidden">
                <img 
                  src="https://source.unsplash.com/IF9TK5Uy-KI/400x400" 
                  alt="Team member" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">Jessica Taylor</h3>
                <p className="text-primary-600">Head of Product</p>
                <p className="mt-2 text-gray-500 text-sm">
                  UX specialist focused on creating intuitive and delightful user experiences.
                </p>
              </div>
            </motion.div>
          </div>
          
          <motion.div variants={itemVariants} className="mt-12 text-center">
            <Link
              to="/careers"
              className="inline-flex items-center text-primary-600 hover:text-primary-500"
            >
              <span>View all team members</span>
              <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Company Facts */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-base font-semibold text-primary-600 uppercase tracking-wide">Company Facts</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              JobsAI by the Numbers
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-4xl font-extrabold text-primary-600">2021</p>
              <p className="mt-2 text-lg font-medium text-gray-900">Founded</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-4xl font-extrabold text-primary-600">50k+</p>
              <p className="mt-2 text-lg font-medium text-gray-900">Users</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-4xl font-extrabold text-primary-600">35</p>
              <p className="mt-2 text-lg font-medium text-gray-900">Team Members</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-4xl font-extrabold text-primary-600">1M+</p>
              <p className="mt-2 text-lg font-medium text-gray-900">Applications Submitted</p>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Contact CTA */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-700"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 
            variants={itemVariants} 
            className="text-3xl font-extrabold text-white sm:text-4xl"
          >
            Ready to transform your job search?
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="mt-4 text-lg leading-6 text-primary-100"
          >
            Join thousands of job seekers who are saving time and getting more interviews with JobsAI.
          </motion.p>
          <motion.div 
            variants={itemVariants}
            className="mt-8 flex justify-center"
          >
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50"
              >
                Get Started Free
              </Link>
            </div>
            <div className="ml-3 inline-flex">
              <Link
                to="/help"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white hover:bg-primary-800"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;