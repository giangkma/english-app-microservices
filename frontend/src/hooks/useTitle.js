import { useEffect, useState } from 'react';

// set title for component
function useTitle(title = 'Amonino', isOverride = false) {
  useEffect(() => {
    if (isOverride) {
      document.title = title;
    } else {
      document.title = title !== 'Amonino' ? `${title} - Amonino` : title;
    }
  }, []);

  return null;
}

export default useTitle;
