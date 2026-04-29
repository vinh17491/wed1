import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './MemePage.css';

const memes = [
  {
    id: 1,
    title: "Centering a DIV",
    url: "https://media.giphy.com/media/3o7TKVUn7iM8FMEU24/giphy.gif",
    description: "My daily struggle since 2018."
  },
  {
    id: 2,
    title: "AI taking my job?",
    url: "https://media.giphy.com/media/26gR2VpP96u97ZJ4A/giphy.gif",
    description: "Me training the AI that will eventually replace me."
  },
  {
    id: 3,
    title: "Feature or Bug?",
    url: "https://media.giphy.com/media/3o7TKMGpxVf4F4N9oc/giphy.gif",
    description: "It's an undocumented feature, I promise."
  },
  {
    id: 4,
    title: "Deployment on Friday",
    url: "https://media.giphy.com/media/l0HlHFRbEzRCwBF72/giphy.gif",
    description: "What could possibly go wrong?"
  }
];

export default function MemePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="meme-page noise-bg">
      <Navbar />
      <main className="container section">
        <motion.div 
          className="section__header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="section__tag glass">Entertainment</span>
          <h1 className="section__title gradient-text text-glow">The Meme Side of Me</h1>
          <p className="section__subtitle">Because coding isn't always serious.</p>
        </motion.div>

        <div className="meme-grid">
          {memes.map((meme, index) => (
            <motion.div 
              key={meme.id}
              className="meme-card glass"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <div className="meme-card__image-wrapper">
                <img src={meme.url} alt={meme.title} className="meme-card__image" />
              </div>
              <div className="meme-card__content">
                <h3 className="meme-card__title">{meme.title}</h3>
                <p className="meme-card__desc">{meme.description}</p>
              </div>
            </motion.div>
          ))}

          {/* Special Card #5 for Love Journey */}
          <motion.div
            className="meme-card glass border-pink-300/50 hover:border-pink-400 cursor-pointer relative group overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -10, transition: { duration: 0.2 } }}
            onClick={() => navigate('/love-journey')}
          >
            <div className="meme-card__image-wrapper bg-pink-100/20 flex items-center justify-center h-48">
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300 select-none">🎁</span>
            </div>
            <div className="meme-card__content">
              <h3 className="meme-card__title text-pink-400 font-semibold">Dành riêng cho Nhi mipmap ✨</h3>
              <p className="meme-card__desc text-gray-300">Một điều bất ngờ nhỏ nhắn...</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.div>
        </div>


        <motion.div 
          className="meme-intro glass"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2>Brief Intro (The Fun Version)</h2>
          <p>
            When I'm not debugging production issues or training the latest LLMs, 
            I'm likely looking for the perfect meme to describe my current state of mind. 
            I believe that a good developer is one who can laugh at their own code.
          </p>
        </motion.div>
      </main>
      <Footer name="Quách Gia Vinh" />
    </div>
  );
}
