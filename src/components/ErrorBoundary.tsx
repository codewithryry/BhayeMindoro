import { Component, type ErrorInfo, type ReactNode } from 'react';

import { ErrorFallback } from './ErrorFallback';

type Props = { children: ReactNode };
type State = { hasError: boolean };

/** Shows a readable error screen instead of a blank page if rendering fails. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Technical details stay in the console only.
    console.error('[Bhaye Mindoro] Render error', error, info.componentStack);
  }

  render() {
    return this.state.hasError ? <ErrorFallback /> : this.props.children;
  }
}
