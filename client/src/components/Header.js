import React from "react";

function Header() {
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <header
            style={{
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(16px)",
                borderBottom: "2px solid rgba(91, 140, 255, 0.1)",
                padding: "18px 50px",
                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.08)",
                position: "sticky",
                top: 0,
                zIndex: 1000,
                transition: "all 0.3s ease"
            }}
        >
            <div
                style={{
                    maxWidth: "1400px",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <a
                    href="/"
                    style={{
                        fontSize: "28px",
                        fontWeight: "800",
                        background: "linear-gradient(135deg, #5b8cff, #7aa7ff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                    }}
                >
                    <span style={{ fontSize: "32px" }}>🐾</span>
                    PawfectMatch
                </a>

                <nav
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "28px"
                    }}
                >
                    <a href="/" style={{ fontWeight: "600", fontSize: "15px" }}>
                        🏠 Home
                    </a>
                    <a href="/pets" style={{ fontWeight: "600", fontSize: "15px" }}>
                        🐕 Pets
                    </a>

                    {user && (
                        <>
                            <a href="/favorites" style={{ fontWeight: "600", fontSize: "15px" }}>
                                ❤️ Favorites
                            </a>
                            <a href="/profile" style={{ fontWeight: "600", fontSize: "15px" }}>
                                👤 Profile
                            </a>
                        </>
                    )}

                    {!user && (
                        <>
                            <a href="/register" style={{ fontWeight: "600", fontSize: "15px" }}>
                                ✍️ Register
                            </a>
                            <a href="/login" style={{ fontWeight: "600", fontSize: "15px" }}>
                                🔓 Login
                            </a>
                        </>
                    )}

                    {user && user.role === "admin" && (
                        <>
                            <a href="/add-pet" style={{ fontWeight: "600", fontSize: "15px" }}>
                                ➕ Add Pet
                            </a>
                            <a href="/admin-dashboard" style={{ fontWeight: "600", fontSize: "15px" }}>
                                📊 Dashboard
                            </a>
                        </>
                    )}

                    {user && (
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <span
                                style={{
                                    fontWeight: "700",
                                    color: "#5b8cff",
                                    fontSize: "15px"
                                }}
                            >
                                👋 {user.full_name?.split(" ")[0]}
                            </span>

                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: "11px 20px",
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    background: "linear-gradient(135deg, #ff6b9d, #ff9db5)",
                                    borderRadius: "12px"
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;