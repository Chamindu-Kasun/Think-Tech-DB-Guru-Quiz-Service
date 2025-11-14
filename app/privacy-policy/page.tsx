'use client';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Privacy Policy</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              take quizzes, or contact us for support.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">How We Use Your Information</h2>
            <ul className="text-gray-600 mb-4 list-disc pl-6">
              <li>To provide and improve our quiz services</li>
              <li>To track learning progress and performance</li>
              <li>To generate personalized study recommendations</li>
              <li>To communicate with you about our services</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Data Storage</h2>
            <p className="text-gray-600 mb-4">
              Your quiz data is stored securely using Firebase, Google's cloud platform. 
              We implement appropriate security measures to protect your information.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Cookies and Analytics</h2>
            <p className="text-gray-600 mb-4">
              We may use cookies and analytics tools to improve user experience and understand 
              how our service is used. This helps us provide better educational content.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Third-Party Services</h2>
            <p className="text-gray-600 mb-4">
              Our site may contain advertisements from Google AdSense. Please review Google's 
              privacy policy for information about how they collect and use data.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us at 
              privacy@thinktech-dbguru.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}