import { Component, ReactNode } from "react";

type SceneBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type SceneBoundaryState = {
  failed: boolean;
};

class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  state: SceneBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneBoundaryState {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default SceneBoundary;
