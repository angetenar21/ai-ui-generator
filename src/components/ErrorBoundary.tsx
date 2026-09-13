import React, { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught rendering error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[200px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-red-50/50 dark:bg-red-900/10 backdrop-blur-xl rounded-2xl p-6 border border-red-200/50 dark:border-red-800/30 text-center">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
              {this.props.fallbackTitle || 'Component Render Error'}
            </h3>
            <p className="text-sm text-stone-500 dark:text-gray-400 mb-1">
              This component encountered a rendering error.
            </p>
            <p className="text-xs text-red-500/80 dark:text-red-400/60 font-mono mb-4 break-all line-clamp-2">
              {this.state.error?.message}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/25 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Render
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
