import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { profileApi, skillsApi, projectsApi, experienceApi, analyticsApi } from '../api';
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
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
    analyticsApi.track(window.location.pathname, deviceType).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p, s, pr, ex] = await Promise.all([
          profileApi.get(),
          skillsApi.getAll(),
          projectsApi.getAll(),
          experienceApi.getAll(),
        ]);
        setProfile(p.data.data);
        setSkills(s.data.data);
        setProjects(pr.data.data);
        setExperiences(ex.data.data);
      } catch (err) {
        console.error('Failed to fetch portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [i18n.language]);

  useEffect(() => {
    if (profile) {
      document.title = `${profile.fullName} - ${profile.title}`;
    }
  }, [profile]);

  return (
    <>
      <Navbar />
      <main>
        <Hero profile={profile} loading={loading} />
        <About profile={profile} />
        <Skills skills={skills} loading={loading} />
        <Projects projects={projects} loading={loading} />
        <ExperienceSection experiences={experiences} loading={loading} />
        <Contact profile={profile} />
      </main>
      <Footer name={profile?.fullName} />
      <Chatbot />
    </>
  );
}
