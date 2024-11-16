import React from 'react';

const EmployeeCard = ({ employee }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center">
        <img
          src={employee.avatar || '/default-avatar.png'}
          alt={employee.name}
          className="h-12 w-12 rounded-full"
        />
        <div className="ml-4">
          <h3 className="text-sm font-medium">{employee.name}</h3>
          <p className="text-sm text-gray-500">{employee.position}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard; 