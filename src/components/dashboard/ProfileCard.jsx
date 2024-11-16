import { UserCircleIcon, BriefcaseIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const ProfileCard = ({ employeeData }) => {
  if (!employeeData) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {employeeData.image ? (
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/${employeeData.image}`}
              alt={employeeData.name}
              className="h-20 w-20 rounded-full"
            />
          ) : (
            <UserCircleIcon className="h-20 w-20 text-gray-300" />
          )}
        </div>
        <div className="ml-4">
          <h2 className="text-xl font-bold text-gray-900">{employeeData.name}</h2>
          <div className="mt-1 flex items-center text-gray-500">
            <BriefcaseIcon className="h-5 w-5 mr-2" />
            <span>{employeeData.designation}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4">
        <div className="flex items-center text-gray-600">
          <EnvelopeIcon className="h-5 w-5 mr-2" />
          <span>{employeeData.email}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <PhoneIcon className="h-5 w-5 mr-2" />
          <span>{employeeData.mobile}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard; 