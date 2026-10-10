import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, stack: '' };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ stack: info?.componentStack || String(error?.stack || '') });
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, background: '#0a0f1d', color: '#fca5a5', minHeight: '100vh', fontFamily: 'monospace', fontSize: 13 }}>
          <h2 style={{ color: '#ef4444' }}>Error en la app:</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error?.message || this.state.error)}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#64748b' }}>{this.state.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
