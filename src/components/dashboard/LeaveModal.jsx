import React from 'react';

const LeaveModal = ({ show, onClose, onSubmit, leaveBalance }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Request Leave</h2>
        {/* Add leave request form */}
      </div>
    </div>
  );
};

export default LeaveModal; 