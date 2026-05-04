import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Call custom error handler if provided (for future Sentry integration)
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white p-6">
          <div className="max-w-md w-full glass p-8 rounded-2xl border border-red-500/30 text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-400">Oops! Đã có lỗi xảy ra.</h2>
            <p className="text-slate-400 mb-6">
              Ứng dụng gặp sự cố không mong muốn. Bạn có thể thử lại hoặc tải lại trang.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                className="btn btn--primary"
                style={{ padding: '12px 24px', borderRadius: 12 }}
              >
                🔄 Thử lại
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn btn--outline"
                style={{ padding: '12px 24px', borderRadius: 12 }}
              >
                Tải lại trang
              </button>
            </div>
            {import.meta.env.DEV && (
              <pre className="mt-6 p-4 bg-black/50 rounded-lg text-left text-xs text-red-300 overflow-auto max-h-40">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
