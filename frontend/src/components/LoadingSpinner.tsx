import React from 'react';

export const LoadingSpinner: React.FC<{ fullPage?: boolean }> = ({ fullPage }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-slate-500 font-bold animate-pulse text-sm uppercase tracking-widest">Đang tải dữ liệu...</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="py-20 w-full flex justify-center">{content}</div>;
};
