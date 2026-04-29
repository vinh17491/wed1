import { useEffect, useState } from 'react';

export const useRevisit = () => {
  const [visitCount, setVisitCount] = useState(1);

  useEffect(() => {
    const visits = localStorage.getItem('loveJourneyVisited');
    const currentVisits = visits ? parseInt(visits, 10) : 0;
    const newVisits = currentVisits + 1;
    localStorage.setItem('loveJourneyVisited', newVisits.toString());
    setVisitCount(newVisits);
  }, []);

  return visitCount;
};
