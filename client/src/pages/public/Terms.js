import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const Terms = () => {
  // Scroll to top on component mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const lastUpdated = "March 15, 2025";

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
        </div>
        
        {/* Header */}
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="mt-2 text-sm text-gray-500">Last updated: {lastUpdated}</p>
          </div>
          
          {/* Content */}
          <div className="px-6 py-6 prose prose-primary max-w-none">
            <p className="text-gray-700">
              Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the JobsAI website and Chrome extension (together, the "Service") operated by JobsAI, Inc. ("us", "we", "our").
            </p>
            
            <p className="text-gray-700">
              Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
            </p>
            
            <p className="text-gray-700 font-bold">
              By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">1. Accounts</h2>
            <p className="text-gray-700">
              When you create an account with us, you must provide accurate, complete, and up-to-date information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
            
            <p className="text-gray-700">
              You are responsible for safeguarding the password you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
            </p>
            
            <p className="text-gray-700">
              You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">2. Intellectual Property</h2>
            <p className="text-gray-700">
              The Service and its original content, features, and functionality are and will remain the exclusive property of JobsAI, Inc. and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of JobsAI, Inc.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">3. User Data</h2>
            <p className="text-gray-700">
              When you upload your resume and other personal information to our Service, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, modify, and display this content solely for the purpose of providing and improving our services, and developing new ones.
            </p>
            
            <p className="text-gray-700">
              We take your privacy seriously. Please review our <Link to="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link> for details on how we collect, use, and disclose your personal information.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">4. AI-Generated Content</h2>
            <p className="text-gray-700">
              Our Service uses artificial intelligence to generate content based on your inputs. You understand and acknowledge that:
            </p>
            
            <ul className="list-disc pl-5 mt-2 text-gray-700">
              <li>AI-generated content may not always be accurate, appropriate, or complete</li>
              <li>You are responsible for reviewing and verifying any AI-generated content before submitting it in job applications</li>
              <li>We are not responsible for any consequences resulting from your use of AI-generated content</li>
              <li>You maintain ownership of the information you submit to our Service, but we may use this data to improve our AI models</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">5. Chrome Extension</h2>
            <p className="text-gray-700">
              Our Chrome extension interacts with third-party websites to provide form-filling functionality. By using our extension, you agree that:
            </p>
            
            <ul className="list-disc pl-5 mt-2 text-gray-700">
              <li>You are solely responsible for your interactions with third-party websites</li>
              <li>We do not endorse or control third-party websites or their content</li>
              <li>Our extension may not function correctly on all websites or may be affected by changes to third-party websites</li>
              <li>You will use the extension in compliance with the terms of service of any third-party websites</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">6. Links To Other Web Sites</h2>
            <p className="text-gray-700">
              Our Service may contain links to third-party web sites or services that are not owned or controlled by JobsAI, Inc.
            </p>
            
            <p className="text-gray-700">
              JobsAI, Inc. has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party web sites or services. You further acknowledge and agree that JobsAI, Inc. shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">7. Limitation Of Liability</h2>
            <p className="text-gray-700">
              In no event shall JobsAI, Inc., nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            
            <ul className="list-disc pl-5 mt-2 text-gray-700">
              <li>Your access to or use of or inability to access or use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use or alteration of your transmissions or content</li>
              <li>The accuracy, appropriateness, or completeness of AI-generated content</li>
              <li>The outcomes of job applications you submit using our Service</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">8. Termination</h2>
            <p className="text-gray-700">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
            
            <p className="text-gray-700">
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or delete your account through the account settings.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">9. Governing Law</h2>
            <p className="text-gray-700">
              These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
            
            <p className="text-gray-700">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">10. Changes</h2>
            <p className="text-gray-700">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            
            <p className="text-gray-700">
              By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">11. Subscription and Payments</h2>
            <p className="text-gray-700">
              Some parts of the Service may be available only with a paid subscription. Payment terms will be specified during the purchase process.
            </p>
            
            <p className="text-gray-700">
              Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period. You can manage your subscription and turn off auto-renewal through your account settings.
            </p>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8">12. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms, please contact us at:
            </p>
            
            <p className="text-gray-700 font-medium mt-2">
              support@jobsai.com<br />
              JobsAI, Inc.<br />
              123 AI Street, Suite 456<br />
              San Francisco, CA 94105<br />
              United States
            </p>
          </div>
        </div>
        
        {/* Footer navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            to="/"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Back to Home
          </Link>
          <Link
            to="/privacy"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;