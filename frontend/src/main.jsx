import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
          <h2 style={{ color: "red" }}>Application Error Detected!</h2>
          <p style={{ background: "#eee", padding: "10px" }}>{this.state.error?.message || "Unknown error"}</p>
          <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} style={{ padding: "10px", background: "#007bff", color: "white", cursor: "pointer", border: "none", borderRadius: "4px" }}>Fix & Reset Application</button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
