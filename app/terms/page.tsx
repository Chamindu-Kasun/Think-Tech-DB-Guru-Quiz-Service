'use client';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Terms of Service</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using Think Tech DB Guru, you accept and agree to be bound by the 
              terms and provision of this agreement.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Use License</h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily access Think Tech DB Guru for personal, 
              non-commercial educational use only. This includes:
            </p>
            <ul className="text-gray-600 mb-4 list-disc pl-6">
              <li>Taking database knowledge quizzes</li>
              <li>Accessing educational content and explanations</li>
              <li>Tracking personal learning progress</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Prohibited Uses</h2>
            <p className="text-gray-600 mb-4">You may not:</p>
            <ul className="text-gray-600 mb-4 list-disc pl-6">
              <li>Modify or copy the materials</li>
              <li>Use the materials for commercial purposes</li>
              <li>Attempt to reverse engineer any software</li>
              <li>Remove any copyright or proprietary notations</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Educational Content</h2>
            <p className="text-gray-600 mb-4">
              All quiz questions and educational materials are provided for learning purposes. 
              We strive for accuracy but cannot guarantee that all content is error-free.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              Think Tech DB Guru shall not be liable for any damages arising from the use 
              or inability to use the educational materials.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Contact Information</h2>
            <p className="text-gray-600 mb-4">
              Questions about the Terms of Service should be sent to terms@thinktech-dbguru.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}