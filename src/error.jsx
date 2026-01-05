import React from "react";
import "./error.css";

const WeatherError = () => {
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
                    <div className="error-icon" />

                    <h1 className="error-title">Something went wrong</h1>

                    <p className="error-text">
                        We couldn’t connect to the server (API error). Please try again in a
                        few moments.
                    </p>

                    <button className="retry-btn">
                        <span className="retry-icon" />
                        <span>Retry</span>
                    </button>
                </section>
            </main>
        </div>
    );
};

export default WeatherError;
