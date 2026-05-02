import api from '../services/api.service';

export const chatApi = {
  send: (message: string, language: string) => 
    api.post('/chat', { message, language }),
};
