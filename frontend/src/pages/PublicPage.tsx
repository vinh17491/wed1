import { useTranslation } from 'react-i18next';
import { usePortfolioData, usePageTracking } from '../hooks/usePortfolio';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import ExperienceSection from '../components/Experience';
import Contact from '../components/Contact';
import Chatbot from '../components/Chatbot';
import Footer from '../components/Footer';

export default function PublicPage() {
  const { i18n } = useTranslation();
  
  // Logic Layer (Hooks handle side effects and data fetching)
  const { data, isLoading } = usePortfolioData();
  usePageTracking(window.location.pathname);

  // Default values
  const { profile = null, skills = [], projects = [], experiences = [] } = data || {};

  return (
    <>
      <Navbar />
      <main>
        <Hero profile={profile} loading={isLoading} />
        <About profile={profile} />
        <Skills skills={skills} loading={isLoading} />
        <Projects projects={projects} loading={isLoading} />
        <ExperienceSection experiences={experiences} loading={isLoading} />
        <Contact profile={profile} />
      </main>
      <Footer name={profile?.fullName} />
      <Chatbot />
    </>
  );
}
