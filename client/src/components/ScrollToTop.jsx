import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef({});
  const currentPath = useRef(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      // Save current scroll position
      scrollPositions.current[currentPath.current] = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navigationType === 'POP') {
      // Back/Forward button - restore saved position
      const savedPosition = scrollPositions.current[location.pathname];
      if (savedPosition !== undefined) {
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
          window.scrollTo(0, savedPosition);
        }, 0);
      } else {
        window.scrollTo(0, 0);
      }
    } else {
      // Regular navigation - scroll to top
      window.scrollTo(0, 0);
    }
    
    currentPath.current = location.pathname;
  }, [location.pathname, navigationType]);

  return null;
}
