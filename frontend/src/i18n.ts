import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const en = {
  nav: {
    home: 'Home', about: 'About', skills: 'Skills',
    projects: 'Projects', experience: 'Experience', contact: 'Contact', memes: 'Memes'
  },
  hero: {
    greeting: "Hi, I'm Quách Gia Vinh", role: 'Senior Developer & AI Engineer',
    cta_work: 'View My Work', cta_contact: 'Get In Touch',
    scroll: 'Scroll to explore',
    status: 'Available for work',
    exp_label: 'Years Experience',
    projects_label: 'Projects Done',
    tech_label: 'Technologies',
    badge_1: '⚡ AI Engineer',
    badge_2: '🚀 Open to Work'
  },
  about: {
    title: 'About Me', subtitle: 'Who I am & what I do',
    download_cv: 'Download CV',
    exp_label: 'Years of Experience',
    email: 'Email',
    phone: 'Phone',
    location: 'Location',
    status: 'Status',
    available: 'Available'
  },
  skills: { title: 'Skills', subtitle: 'Technologies I work with' },
  projects: { title: 'Projects', subtitle: 'Things I have built', view_code: 'Code', view_live: 'Live', all: 'All', featured: 'Featured' },
  experience: { title: 'Experience', subtitle: 'My professional journey', present: 'Present' },
  contact: { title: 'Contact', subtitle: 'Get in touch', name: 'Name', email: 'Email', message: 'Message', send: 'Send Message', success: 'Message sent!' },
  chat: { title: 'Chat with AI', placeholder: 'Ask me anything...', send: 'Send', typing: 'Typing...' },
  footer: { rights: 'All rights reserved.' },
  theme: { dark: 'Dark', light: 'Light' },
  lang: { en: 'EN', vi: 'VI' }
};

const vi = {
  nav: {
    home: 'Trang chủ', about: 'Giới thiệu', skills: 'Kỹ năng',
    projects: 'Dự án', experience: 'Kinh nghiệm', contact: 'Liên hệ', memes: 'Giải trí'
  },
  hero: {
    greeting: 'Xin chào, tôi là Quách Gia Vinh', role: 'Kỹ sư AI & Lập trình viên cấp cao',
    cta_work: 'Xem công việc', cta_contact: 'Liên hệ ngay',
    scroll: 'Cuộn để khám phá',
    status: 'Sẵn sàng làm việc',
    exp_label: 'Năm kinh nghiệm',
    projects_label: 'Dự án hoàn thành',
    tech_label: 'Công nghệ sử dụng',
    badge_1: '⚡ Kỹ sư AI',
    badge_2: '🚀 Sẵn sàng cộng tác'
  },
  about: {
    title: 'Về tôi', subtitle: 'Tôi là ai & tôi làm gì',
    download_cv: 'Tải CV',
    exp_label: 'Năm kinh nghiệm',
    email: 'Email',
    phone: 'Số điện thoại',
    location: 'Địa chỉ',
    status: 'Trạng thái',
    available: 'Sẵn sàng'
  },
  skills: { title: 'Kỹ năng', subtitle: 'Công nghệ tôi sử dụng' },
  projects: { title: 'Dự án', subtitle: 'Những gì tôi đã xây dựng', view_code: 'Code', view_live: 'Demo', all: 'Tất cả', featured: 'Nổi bật' },
  experience: { title: 'Kinh nghiệm', subtitle: 'Hành trình nghề nghiệp', present: 'Hiện tại' },
  contact: { title: 'Liên hệ', subtitle: 'Kết nối với tôi', name: 'Tên', email: 'Email', message: 'Tin nhắn', send: 'Gửi tin', success: 'Đã gửi!' },
  chat: { title: 'Chat với AI', placeholder: 'Hỏi tôi bất cứ điều gì...', send: 'Gửi', typing: 'Đang nhập...' },
  footer: { rights: 'Bảo lưu mọi quyền.' },
  theme: { dark: 'Tối', light: 'Sáng' },
  lang: { en: 'EN', vi: 'VI' }
};

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, vi: { translation: vi } },
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
