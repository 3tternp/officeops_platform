import React from "react";
import Routes from "./Routes";
import { UserProvider } from "./contexts/UserContext";
import { BrandingProvider } from "./contexts/BrandingContext";

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    console.error('🚨 ErrorBoundary caught error:', error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    console.error('🚨 App Error Caught by ErrorBoundary:', error);
    console.error('🚨 Error Info:', errorInfo);
    console.error('🚨 Error Stack:', error.stack);
    console.error('🚨 Component Stack:', errorInfo?.componentStack);
    // Expose last error globally for debugging if needed
    window.__LAST_APP_ERROR__ = { error, errorInfo };
  }

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.DEV;
      const { error, errorInfo } = this.state;
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h2>
              <p className="text-sm text-gray-600 mb-4">Please refresh the page to try again</p>

              {/* Always show concise details to aid debugging */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-left">
                  <div className="text-xs text-red-800 font-mono">
                    <div className="mb-1"><strong>Error:</strong> {error?.message}</div>
                    <div className="mb-1"><strong>Type:</strong> {error?.name}</div>
                    {errorInfo?.componentStack && (
                      <div className="mb-1">
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 whitespace-pre-wrap text-[10px] leading-relaxed">{errorInfo.componentStack}</pre>
                      </div>
                    )}
                    {isDevelopment && error?.stack && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="mt-1 whitespace-pre-wrap text-[10px] leading-relaxed">{error.stack}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors mt-4"
              >
                Reload Application
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <BrandingProvider>
          <Routes />
        </BrandingProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
