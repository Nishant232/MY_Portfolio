import { Component, ErrorInfo, PropsWithChildren } from "react";

interface State {
  failed: boolean;
}

class CharacterErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("3D character failed:", error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return <div className="character-fallback" aria-hidden="true" />;
    }

    return this.props.children;
  }
}

export default CharacterErrorBoundary;
