import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 phút dữ liệu được coi là mới
      retry: 1,                // Thử lại 1 lần nếu lỗi
      refetchOnWindowFocus: false, // Không tự động fetch lại khi quay lại tab
    },
  },
});
