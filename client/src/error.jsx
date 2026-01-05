import React from "react";
import { CloudOff, RefreshCw } from "lucide-react";
import "./error.css";

const WeatherError = ({ onRetry, message }) => {
    return (
        <div className="app-root">
            <header className="top-bar">
                <div className="brand">
                    <div className="brand-logo" />
                    <span className="brand-text">Weather Now</span>
                </div>

                <button className="units-btn">
                    <span>Units</span>
                    <span className="chevron">▾</span>
                </button>
            </header>

            <main className="wrapper">
                <section className="error-card">
                    <div className="error-icon">
                        <CloudOff size={32} strokeWidth={2} />
                    </div>

                    <h1 className="error-title">Something went wrong</h1>

                    <p className="error-text">
                        {message || "We couldn’t connect to the server (API error). Please try again in a few moments."}
                    </p>

                    <button className="retry-btn" onClick={onRetry}>
                        <RefreshCw size={18} className="retry-icon-svg" />
                        <span>Retry</span>
                    </button>
                </section>
            </main>
        </div>
    );
};

export default WeatherError;
