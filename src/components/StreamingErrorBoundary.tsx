import React, { Component } from 'react';

/**
 * Streaming-optimized Error Boundary (mirrors OpenUI's ElementErrorBoundary).
 * 
 * Instead of showing an error page when a partial render fails,
 * this boundary shows the LAST SUCCESSFULLY RENDERED children.
 * 
 * This is critical for streaming: partial JSON often produces specs
 * that crash mid-render. By showing the last good state, the UI
 * appears to smoothly build up rather than flashing error/blank states.
 * 
 * When new valid children arrive (next chunk), it auto-recovers.
 */
interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class StreamingErrorBoundary extends Component<Props, State> {
  private lastValidChildren: React.ReactNode = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidMount(): void {
    if (!this.state.hasError) {
      this.lastValidChildren = this.props.children;
    }
  }

  componentDidUpdate(prevProps: Props): void {
    // Cache the last valid children
    if (!this.state.hasError) {
      this.lastValidChildren = this.props.children;
    }
    // Auto-recover when new children arrive
    if (this.state.hasError && prevProps.children !== this.props.children) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error): void {
    // Silently swallow during streaming — transient errors are expected
    console.debug('[StreamingErrorBoundary] Partial render failed (showing last good state):', error.message);
  }

  render() {
    if (this.state.hasError) {
      // Show last successfully rendered output instead of error screen
      return this.lastValidChildren ?? null;
    }
    return this.props.children;
  }
}

export default StreamingErrorBoundary;
