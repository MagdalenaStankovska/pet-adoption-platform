import React from "react";

function Home() {
    return (
        <div
            style={{
                minHeight: "90vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px 20px"
            }}
        >
            <div
                style={{
                    maxWidth: "950px",
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(18px)",
                    padding: "80px 60px",
                    borderRadius: "28px",
                    boxShadow: "0 20px 60px rgba(91, 132, 255, 0.15)",
                    border: "2px solid rgba(255, 255, 255, 0.9)",
                    animation: "slideUp 0.8s ease-out"
                }}
            >
                <style>
                    {`
                        @keyframes slideUp {
                            from {
                                opacity: 0;
                                transform: translateY(40px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                        
                        @keyframes fadeInScale {
                            from {
                                opacity: 0;
                                transform: scale(0.95);
                            }
                            to {
                                opacity: 1;
                                transform: scale(1);
                            }
                        }
                    `}
                </style>

                <div style={{ animation: "fadeInScale 1s ease-out" }}>
                    <div style={{
                        fontSize: "80px",
                        marginBottom: "20px",
                        animation: "float 4s ease-in-out infinite"
                    }}>
                        🐾
                    </div>

                    <h1
                        style={{
                            fontSize: "56px",
                            marginBottom: "18px",
                            background: "linear-gradient(135deg, #5b8cff, #7aa7ff, #4f8cff)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            fontWeight: "800",
                            letterSpacing: "-1px"
                        }}
                    >
                        Find Your Perfect Pet Companion
                    </h1>

                    <p
                        style={{
                            fontSize: "20px",
                            marginBottom: "40px",
                            color: "#555",
                            lineHeight: "1.8",
                            fontWeight: "500"
                        }}
                    >
                        Connect with adorable pets waiting for their forever homes.
                        <br />
                        Browse our collection, submit adoption requests, and save your favorites!
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "20px",
                        flexWrap: "wrap"
                    }}
                >
                    <a href="/pets">
                        <button
                            style={{
                                padding: "16px 40px",
                                fontSize: "16px",
                                fontWeight: "800",
                                borderRadius: "14px"
                            }}
                        >
                            🐕 View Pets
                        </button>
                    </a>

                    <a href="/register">
                        <button
                            style={{
                                padding: "16px 40px",
                                fontSize: "16px",
                                fontWeight: "800",
                                borderRadius: "14px",
                                background: "linear-gradient(135deg, #ff6b9d, #ff9db5)"
                            }}
                        >
                            ✨ Get Started
                        </button>
                    </a>
                </div>

                <div style={{
                    marginTop: "50px",
                    paddingTop: "40px",
                    borderTop: "2px solid rgba(91, 140, 255, 0.2)",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: "30px"
                }}>
                    <div style={{ animation: "fadeInScale 1.2s ease-out" }}>
                        <div style={{ fontSize: "32px", marginBottom: "10px" }}>🐕‍🦺</div>
                        <p style={{ fontWeight: "600", color: "#34495e" }}>Verified Pets</p>
                        <p style={{ fontSize: "13px", color: "#999" }}>All health checked</p>
                    </div>
                    <div style={{ animation: "fadeInScale 1.4s ease-out" }}>
                        <div style={{ fontSize: "32px", marginBottom: "10px" }}>❤️</div>
                        <p style={{ fontWeight: "600", color: "#34495e" }}>Save Favorites</p>
                        <p style={{ fontSize: "13px", color: "#999" }}>Bookmark your picks</p>
                    </div>
                    <div style={{ animation: "fadeInScale 1.6s ease-out" }}>
                        <div style={{ fontSize: "32px", marginBottom: "10px" }}>📋</div>
                        <p style={{ fontWeight: "600", color: "#34495e" }}>Easy Process</p>
                        <p style={{ fontSize: "13px", color: "#999" }}>Quick adoption</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;