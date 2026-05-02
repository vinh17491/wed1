import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-500/10 border border-red-500/20 rounded-3xl animate-in fade-in zoom-in duration-300">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Đã xảy ra lỗi</h3>
      <p className="text-slate-400 text-center mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-xl font-bold transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Thử lại
        </button>
      )}
    </div>
  );
};
