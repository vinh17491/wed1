import { useQuery } from '@tanstack/react-query';
import { portfolioService } from '../services/portfolio.service';
import { analyticsService } from '../services/analytics.service';
import { useEffect } from 'react';

export const usePortfolioData = () => {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const [profile, skills, projects, experiences] = await Promise.all([
        portfolioService.getProfile(),
        portfolioService.getSkills(),
        portfolioService.getProjects(),
        portfolioService.getExperiences(),
      ]);
      return { profile, skills, projects, experiences };
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const usePageTracking = (pageName: string) => {
  useEffect(() => {
    analyticsService.trackView(pageName);
  }, [pageName]);
};
