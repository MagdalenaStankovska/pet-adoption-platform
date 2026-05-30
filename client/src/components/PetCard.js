import React from "react";
import { useNavigate } from "react-router-dom";

function PetCard({ pet }) {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const handleAdoptionRequest = () => {
        if (!user) {
            alert("Please login first.");
            navigate("/login");
            return;
        }

        // Navigate to adoption form with full application details
        navigate(`/adoption-form/${pet.id}`);
    };

    const handleFavorite = async () => {
        if (!user) {
            alert("Please login first.");
            return;
        }

        await fetch("http://localhost:5000/api/favorites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: user.id,
                pet_id: pet.id
            })
        });

        alert("Added to favorites ❤️");
    };

    return (
        <div
            onClick={() => navigate(`/pet/${pet.id}`)}
            style={{
                backgroundColor: "#ffffff",
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 10px 35px rgba(0, 0, 0, 0.08)",
                border: "1px solid #f0f4ff",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                transform: "translateY(0)",
                backdropFilter: "blur(8px)"
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-12px)";
                e.currentTarget.style.boxShadow = "0 20px 50px rgba(0, 0, 0, 0.12)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 35px rgba(0, 0, 0, 0.08)";
            }}
        >
            <div style={{ position: "relative", overflow: "hidden" }}>
                <img
                    src={pet.image_url}
                    alt={pet.name}
                    style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.4s ease"
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.08)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                    }}
                />
                <div style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "linear-gradient(135deg, #5b8cff, #7aa7ff)",
                    color: "white",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    boxShadow: "0 4px 12px rgba(91, 140, 255, 0.3)"
                }}>
                    {pet.breed || "Pet"}
                </div>
            </div>

            <div style={{ padding: "22px", display: "flex", flexDirection: "column", flex: 1 }}>
                <h2 style={{ fontSize: "24px", marginBottom: "10px", color: "#1a202c" }}>
                    {pet.name}
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <p style={{ fontSize: "14px", margin: 0 }}>
                        <strong style={{ color: "#5b8cff" }}>Age:</strong> {pet.age} years
                    </p>
                    <p style={{ fontSize: "14px", margin: 0 }}>
                        <strong style={{ color: "#5b8cff" }}>Gender:</strong> {pet.gender}
                    </p>
                </div>

                <p style={{
                    fontSize: "14px",
                    marginBottom: "12px",
                    color: "#666",
                    lineHeight: "1.5",
                    flex: 1
                }}>
                    {pet.description?.substring(0, 80)}...
                </p>

                <p style={{ fontSize: "13px", marginBottom: "14px" }}>
                    <strong style={{ color: "#5b8cff" }}>Health:</strong>
                    <span style={{
                        marginLeft: "8px",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        background: "#e8f5ff",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#0066cc"
                    }}>
                        {pet.health_status}
                    </span>
                </p>

                <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAdoptionRequest();
                        }}
                        style={{
                            flex: 1,
                            padding: "11px 16px",
                            fontSize: "13px",
                            fontWeight: "700"
                        }}
                    >
                        📋 Apply
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFavorite();
                        }}
                        style={{
                            flex: 1,
                            padding: "11px 16px",
                            fontSize: "13px",
                            fontWeight: "700",
                            background: "linear-gradient(135deg, #ff6b9d, #ff9db5)"
                        }}
                    >
                        ❤️ Save
                    </button>
                </div>
            </div>
        </div>
    );

}

export default PetCard;