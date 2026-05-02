import { useQuery } from '@tanstack/react-query';
import { portfolioService } from '../../../services/portfolio.service';

export const usePortfolio = () => {
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
    staleTime: 1000 * 60 * 30, // 30 minutes cache for public data
  });
};

export const useAnalytics = () => {
  const trackView = (page: string) => {
    const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
    portfolioService.trackView(page, deviceType).catch(() => {});
  };
  return { trackView };
};
