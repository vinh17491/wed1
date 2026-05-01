import { Product } from '../types/shop';

export const mockProducts: Product[] = [
  {
    id: 'prod_1',
    name: 'CapCut Pro - 1 Year',
    description: 'Unlock advanced editing tools, premium effects, and remove watermarks with a 1-Year CapCut Pro license. Perfect for content creators and professionals.',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=800&auto=format&fit=crop', // Instagram style/video editing vibe
    gallery: [
      'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
    ],
    price: 49.99,
    category: 'Video Editing',
    rating: 4.8,
    createdAt: new Date('2023-01-01').toISOString(),
  },
  {
    id: 'prod_2',
    name: 'Canva Pro - Lifetime',
    description: 'Get lifetime access to Canva Pro. Includes premium templates, stock photos, magic resize, and background remover.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop', // Design vibe
    gallery: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542744094-24638ea0b3b5?q=80&w=800&auto=format&fit=crop',
    ],
    price: 89.99,
    category: 'Design',
    rating: 4.9,
    createdAt: new Date('2023-02-15').toISOString(),
  },
  {
    id: 'prod_3',
    name: 'Spotify Premium - 6 Months',
    description: 'Ad-free music listening, offline playback, and unlimited skips with a 6-Month Spotify Premium subscription.',
    image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=800&auto=format&fit=crop', // Spotify/Music vibe
    gallery: [
      'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    ],
    price: 29.99,
    category: 'Music',
    rating: 4.7,
    createdAt: new Date('2023-03-10').toISOString(),
  },
  {
    id: 'prod_4',
    name: 'Netflix Premium - 4K UHD',
    description: 'Enjoy unlimited movies and TV shows in 4K Ultra HD on up to 4 screens simultaneously. 1-Month Premium Account.',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop', // Entertainment vibe
    gallery: [
      'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=800&auto=format&fit=crop',
    ],
    price: 19.99,
    category: 'Entertainment',
    rating: 4.6,
    createdAt: new Date('2023-04-05').toISOString(),
  },
  {
    id: 'prod_5',
    name: 'Adobe Creative Cloud',
    description: '1-Year subscription to Adobe Creative Cloud. Access to Photoshop, Illustrator, Premiere Pro, and more.',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop',
    ],
    price: 299.99,
    category: 'Design',
    rating: 5.0,
    createdAt: new Date('2023-05-20').toISOString(),
  },
  {
    id: 'prod_6',
    name: 'Figma Professional - 1 Year',
    description: 'Unlock unlimited projects, version history, and team libraries with Figma Professional.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop',
    ],
    price: 144.00,
    category: 'Design',
    rating: 4.8,
    createdAt: new Date('2023-06-12').toISOString(),
  },
  {
    id: 'prod_7',
    name: 'ChatGPT Plus - 1 Month',
    description: 'Get priority access, faster response times, and access to new features like GPT-4 with ChatGPT Plus.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
    ],
    price: 20.00,
    category: 'Productivity',
    rating: 4.9,
    createdAt: new Date('2023-07-01').toISOString(),
  },
  {
    id: 'prod_8',
    name: 'YouTube Premium - 1 Year',
    description: 'Ad-free videos, background play, and YouTube Music access.',
    image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=800&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=800&auto=format&fit=crop',
    ],
    price: 119.99,
    category: 'Entertainment',
    rating: 4.7,
    createdAt: new Date('2023-08-15').toISOString(),
  }
];
