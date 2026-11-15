import { KhiladiLogo } from "./KhiladiLogo";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in KHILADI UI:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFFDF8] text-[#22263C] flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-8">
            <KhiladiLogo />
          </div>
          <div className="w-16 h-16 rounded-full bg-[#FFEAF2] border border-[#F5B1CE] flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-[#F22E83]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#22263C] mb-2">
            Something went wrong
          </h1>
          <p className="text-[#68738A] max-w-md mb-6 font-mono text-sm">
            {this.state.error?.message ||
              "An unexpected rendering error occurred."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-3 bg-[#F22E83] hover:bg-[#BA1656] text-white font-medium rounded-full transition-all shadow-[0_4px_16px_rgba(242,46,131,0.3)] cursor-pointer"
          >
            Reload KHILADI
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
