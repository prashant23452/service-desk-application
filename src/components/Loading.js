import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-blue-900 text-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
    </div>
  );
};

export default Loading;