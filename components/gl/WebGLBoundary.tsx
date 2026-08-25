"use client";

import {
  Component,
  createContext,
  useContext,
  type ErrorInfo,
  type ReactNode,
} from "react";

type WebGLFailureReason = "render-error" | "context-lost";
type FailureReporter = (reason: WebGLFailureReason) => void;

const WebGLFailureContext = createContext<FailureReporter>(() => {});

export function useWebGLFailureBoundary() {
  return useContext(WebGLFailureContext);
}

function WebGLFallback() {
  return (
    <div
      data-webgl-fallback
      aria-hidden="true"
      role="presentation"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#09090a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(80%_55%_at_68%_38%,rgba(172,91,45,0.18),transparent_66%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_45%_at_22%_78%,rgba(69,83,111,0.14),transparent_68%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,10,0.08),rgba(9,9,10,0.72))]" />
    </div>
  );
}

export class WebGLBoundary extends Component<
  {
    children: ReactNode;
    onFailure?: FailureReporter;
  },
  { failed: boolean }
> {
  state = { failed: false };
  private reported = false;

  static getDerivedStateFromError() {
    return { failed: true };
  }

  private notify = (reason: WebGLFailureReason) => {
    if (this.reported) return;
    this.reported = true;
    this.props.onFailure?.(reason);
  };

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.notify("render-error");
  }

  private fail: FailureReporter = (reason) => {
    this.notify(reason);
    this.setState({ failed: true });
  };

  render() {
    if (this.state.failed) return <WebGLFallback />;
    return (
      <WebGLFailureContext.Provider value={this.fail}>
        {this.props.children}
      </WebGLFailureContext.Provider>
    );
  }
}

