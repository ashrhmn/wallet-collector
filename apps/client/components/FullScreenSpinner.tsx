import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const FullScreenSpinner = () => {
  return (
    <div className="h-[100vh] flex justify-center items-center">
      {/* <div className="h-20 w-20"> */}
      <LoadingSpinner />
      {/* </div> */}
    </div>
  );
};

export default FullScreenSpinner;
