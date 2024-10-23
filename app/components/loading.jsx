// components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <img
        src='/loading.gif'
        alt='Loading...'
        className='w-4/5 h-auto xl:w-2/5'
      />
    </div>
  );
};

export default LoadingSpinner;
