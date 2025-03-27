import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const Privacy = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <ShieldCheckIcon className="mx-auto h-16 w-16 text-white mb-4" />
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-primary-100">
              Last updated: March 15, 2025
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="prose prose-indigo prose-lg max-w-none">
          <h2>Introduction</h2>
          <p>
            At JobsAI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services, including our Chrome extension.
          </p>
          <p>
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
          </p>
          
          <h2>Information We Collect</h2>
          <p>We collect information in the following ways:</p>
          
          <h3>Information You Provide to Us</h3>
          <p>We collect information you provide directly to us, including:</p>
          <ul>
            <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password.</li>
            <li><strong>Profile Information:</strong> This includes your resume data, work history, education, skills, and other information you choose to provide in your profile.</li>
            <li><strong>Job Application Data:</strong> Information related to job applications you track or complete through our platform.</li>
            <li><strong>Communications:</strong> Information you provide when you contact us for support or communicate with us in any way.</li>
          </ul>
          
          <h3>Information We Collect Automatically</h3>
          <p>When you use our services, we may automatically collect certain information, including:</p>
          <ul>
            <li><strong>Usage Data:</strong> Information about how you use our website and services, including pages visited, features used, and actions taken.</li>
            <li><strong>Device Information:</strong> Information about the device you use to access our services, including device type, operating system, and browser type.</li>
            <li><strong>Log Data:</strong> Information that your browser sends whenever you visit our website or when you use our Chrome extension.</li>
            <li><strong>Cookies and Similar Technologies:</strong> We use cookies and similar technologies to collect information about your browsing activities and to distinguish you from other users of our website.</li>
          </ul>
          
          <h3>Chrome Extension Data Collection</h3>
          <p>
            Our Chrome extension collects the following information to provide its functionality:
          </p>
          <ul>
            <li>URLs of job application pages you visit</li>
            <li>Form field data on job application pages for auto-filling purposes</li>
            <li>User interactions with the extension, such as clicks and form field edits</li>
          </ul>
          <p>
            <strong>Important:</strong> Our Chrome extension does not:
          </p>
          <ul>
            <li>Store your login credentials for any website</li>
            <li>Track your general browsing history</li>
            <li>Access your data on websites that are not job application forms</li>
            <li>Collect data when you are not actively using the extension</li>
          </ul>
          
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect for various purposes, including to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process and complete job applications</li>
            <li>Send you technical notices, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Develop new products and services</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
            <li>Personalize and improve your experience</li>
            <li>Provide customer support</li>
          </ul>
          
          <h2>How We Share Your Information</h2>
          <p>We may share the information we collect in the following circumstances:</p>
          <ul>
            <li><strong>With Service Providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</li>
            <li><strong>For Legal Reasons:</strong> We may disclose your information if we believe it is necessary to comply with any applicable law, regulation, legal process, or governmental request.</li>
            <li><strong>With Your Consent:</strong> We may share your information when you give us permission to do so.</li>
            <li><strong>Business Transfers:</strong> If JobsAI is involved in a merger, acquisition, or sale of all or a portion of its assets, your information may be transferred as part of that transaction.</li>
          </ul>
          <p>
            <strong>We do not sell your personal information to third parties.</strong>
          </p>
          
          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee the absolute security of your data.
          </p>
          <p>
            Your resume data and other personal information are encrypted both in transit and at rest. We regularly review and update our security practices to enhance protection of your information.
          </p>
          
          <h2>Your Rights and Choices</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul>
            <li><strong>Access:</strong> You can request access to the personal information we hold about you.</li>
            <li><strong>Correction:</strong> You can request that we correct inaccurate or incomplete information about you.</li>
            <li><strong>Deletion:</strong> You can request that we delete your personal information in certain circumstances.</li>
            <li><strong>Data Portability:</strong> You can request a copy of the personal information you provided to us in a structured, commonly used, and machine-readable format.</li>
            <li><strong>Objection:</strong> You can object to our processing of your personal information in certain circumstances.</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at privacy@jobsai.com.
          </p>
          
          <h2>Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </p>
          <p>
            If you delete your account, we will delete or anonymize your personal information within 30 days, unless we are legally required to retain it.
          </p>
          
          <h2>Children's Privacy</h2>
          <p>
            Our services are not intended for children under the age of 16, and we do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us.
          </p>
          
          <h2>International Data Transfers</h2>
          <p>
            We are based in the United States, and the information we collect is governed by U.S. law. If you are accessing our services from outside the United States, please be aware that information collected through our services may be transferred to, processed, stored, and used in the United States and other jurisdictions.
          </p>
          <p>
            If you are located in the European Economic Area (EEA), we comply with applicable data protection laws when transferring your personal information outside the EEA.
          </p>
          
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. If we make material changes, we will notify you by email or through a notice on our website prior to the change becoming effective.
          </p>
          <p>
            We encourage you to review our privacy policy whenever you access our services to stay informed about our information practices and your options.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <p>
            Email: privacy@jobsai.com<br />
            Address: 123 AI Street, Suite 456, San Francisco, CA 94105
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h3 className="text-lg font-medium text-gray-900">Have more questions?</h3>
            <p className="mt-2 text-gray-600">
              If you have any questions or concerns about our privacy practices, please don't hesitate to contact us.
            </p>
            <div className="mt-4">
              <Link
                to="/help"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Visit Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;