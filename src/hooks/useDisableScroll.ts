import { useEffect } from 'react';

// Custom hook to disable scrolling
const useDisableScroll = () => {
  useEffect(() => {
    const body = document.body;
    body.style.overflow = 'hidden'; // Disable scrolling when the component mounts
    return () => {
      body.style.overflow = ''; // Re-enable scrolling when the component unmounts
    };
  }, []);
};

export default useDisableScroll;
