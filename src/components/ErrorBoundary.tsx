import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  errorType?: string | number;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Hide error logs from public view
    if (typeof window !== 'undefined' && window.SHOW_PRIVATE_LOGS) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      // Try to extract error code/type from error message if available
      let errorType = this.props.errorType || (this.state.error?.message?.match(/\b(4\d\d|5\d\d)\b/)?.[0] ?? 'Error');
      return this.props.fallback || (
        <div
          className="min-h-screen w-full flex items-center justify-center relative"
          style={{
            backgroundImage: "url('/images/bg-landing.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
          <div className="relative z-10 max-w-md w-full mx-auto glass-panel rounded-2xl shadow-2xl p-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-yellow-400 mb-2 drop-shadow">Oops! Something went wrong</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-5xl font-extrabold text-red-500 drop-shadow">{errorType}</span>
              <span className="text-lg text-white/80 font-semibold">{this.state.error?.message || 'An unexpected error occurred.'}</span>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow"
              >
                Back to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors shadow"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 