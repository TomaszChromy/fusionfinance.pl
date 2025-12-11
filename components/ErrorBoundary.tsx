"use client";

import { Component, ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 px-6"
        >
          {/* Error icon */}
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h3 className="font-serif text-xl text-[#f4f4f5] mb-2">
            Coś poszło nie tak
          </h3>
          <p className="text-[14px] text-[#a1a1aa] text-center max-w-md mb-6">
            Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę lub skontaktuj się z nami, jeśli problem będzie się powtarzał.
          </p>

          <div className="flex gap-3">
            <button
              onClick={this.handleRetry}
              className="px-5 py-2.5 bg-[#c9a962] hover:bg-[#b8994f] text-[#08090c] text-[13px] font-medium rounded-xl transition-colors duration-200"
            >
              Spróbuj ponownie
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 border border-white/10 hover:border-white/20 text-[#a1a1aa] hover:text-[#f4f4f5] text-[13px] font-medium rounded-xl transition-all duration-200"
            >
              Odśwież stronę
            </button>
          </div>

          {/* Error details (dev only) */}
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-8 w-full max-w-lg">
              <summary className="text-[12px] text-[#71717a] cursor-pointer hover:text-[#a1a1aa]">
                Szczegóły błędu (dev)
              </summary>
              <pre className="mt-2 p-4 bg-[#0c0d10] border border-white/10 rounded-xl text-[11px] text-red-400 overflow-auto">
                {this.state.error.message}
                {"\n\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </motion.div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for use with hooks
export function ErrorFallback({ 
  error, 
  resetErrorBoundary 
}: { 
  error: Error; 
  resetErrorBoundary: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-[14px] text-[#a1a1aa] mb-4">
        {error.message || "Wystąpił błąd podczas ładowania"}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 text-[12px] text-[#c9a962] border border-[#c9a962]/30 hover:bg-[#c9a962]/10 rounded-lg transition-colors"
      >
        Spróbuj ponownie
      </button>
    </motion.div>
  );
}

export default ErrorBoundary;

// Hook-based error handling for API calls
export function useErrorHandler() {
  const handleError = (error: unknown, context?: string) => {
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error(`[${context || "API"}] Error:`, errorMessage);

    // Return user-friendly message
    if (errorMessage.includes("fetch") || errorMessage.includes("Failed")) {
      return "Problem z połączeniem. Sprawdź internet.";
    }
    if (errorMessage.includes("timeout")) {
      return "Serwer nie odpowiada. Spróbuj później.";
    }
    if (errorMessage.includes("404")) {
      return "Nie znaleziono zasobu.";
    }

    return "Wystąpił nieoczekiwany błąd.";
  };

  return { handleError };
}
