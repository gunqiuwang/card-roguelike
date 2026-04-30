import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack?: string }) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="
          fixed inset-0
          bg-gray-900
          flex flex-col items-center justify-center
          p-8
        ">
          <div className="text-6xl mb-4">😵</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            出错了
          </h1>
          <p className="text-white/60 text-center mb-4">
            发生了错误，请尝试刷新页面
          </p>
          <button
            onClick={() => window.location.reload()}
            className="
              px-6 py-3 bg-primary text-white rounded-full
              font-bold hover:scale-105 active:scale-95
            "
          >
            刷新页面
          </button>
          {this.state.error && (
            <pre className="mt-4 text-xs text-red-400 overflow-auto max-w-full">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}