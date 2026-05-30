import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PetDetails() {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetch("http://localhost:5000/api/pets")
            .then((response) => response.json())
            .then((data) => {
                const foundPet = data.find((p) => p.id === Number(id));
                setPet(foundPet);
            })
            .catch((error) => console.error(error));
    }, [id]);

    const handleAdoptionRequest = () => {
        if (!user) {
            alert("Please login first.");
            navigate("/login");
            return;
        }

        // Navigate to adoption form with pet ID
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

    if (!pet) {
        return (
            <div style={{
                padding: "60px 40px",
                textAlign: "center",
                minHeight: "80vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>🐾 Loading pet profile...</h2>
                <p>Please wait a moment</p>
            </div>
        );
    }

    const statusColor = pet.adoption_status === "Available" ? "#10b981" : "#ef4444";

    return (
        <div
            style={{
                padding: "40px 30px",
                maxWidth: "1200px",
                margin: "0 auto"
            }}
        >
            <button
                onClick={() => navigate("/pets")}
                style={{
                    marginBottom: "30px",
                    padding: "10px 20px",
                    fontSize: "14px",
                    background: "transparent",
                    color: "#5b8cff",
                    border: "2px solid #5b8cff",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "700",
                    transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = "#5b8cff";
                    e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#5b8cff";
                }}
            >
                ← Back to Pets
            </button>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "50px",
                    backgroundColor: "#ffffff",
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1)",
                    border: "2px solid #f0f4ff"
                }}
            >
                <div style={{ position: "relative" }}>
                    <img
                        src={pet.image_url}
                        alt={pet.name}
                        style={{
                            width: "100%",
                            height: "100%",
                            minHeight: "600px",
                            objectFit: "cover",
                            display: "block"
                        }}
                    />
                    <div style={{
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        background: "linear-gradient(135deg, #5b8cff, #7aa7ff)",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "20px",
                        fontWeight: "700",
                        fontSize: "14px",
                        boxShadow: "0 8px 20px rgba(91, 140, 255, 0.3)"
                    }}>
                        {pet.breed || "Special Pet"}
                    </div>
                </div>

                <div
                    style={{
                        padding: "50px 40px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                    }}
                >
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" }}>
                            <h1
                                style={{
                                    fontSize: "48px",
                                    marginBottom: 0,
                                    color: "#1a202c"
                                }}
                            >
                                {pet.name}
                            </h1>
                            <span style={{
                                padding: "8px 16px",
                                borderRadius: "20px",
                                background: statusColor,
                                color: "white",
                                fontWeight: "700",
                                fontSize: "13px"
                            }}>
                                {pet.adoption_status}
                            </span>
                        </div>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "24px",
                            marginBottom: "40px",
                            paddingBottom: "30px",
                            borderBottom: "2px solid #f0f4ff"
                        }}>
                            <div>
                                <p style={{ fontSize: "13px", fontWeight: "700", color: "#5b8cff", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.5px" }}>
                                    Age
                                </p>
                                <p style={{ fontSize: "20px", fontWeight: "700", color: "#1a202c" }}>
                                    {pet.age} year{pet.age !== 1 ? 's' : ''} old
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: "13px", fontWeight: "700", color: "#5b8cff", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "0.5px" }}>
                                    Gender
                                </p>
                                <p style={{ fontSize: "20px", fontWeight: "700", color: "#1a202c" }}>
                                    {pet.gender === "Male" ? "🧑" : "👩"} {pet.gender}
                                </p>
                            </div>
                        </div>

                        <div style={{ marginBottom: "30px" }}>
                            <p style={{ fontSize: "13px", fontWeight: "700", color: "#5b8cff", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.5px" }}>
                                About {pet.name}
                            </p>
                            <p style={{
                                fontSize: "16px",
                                lineHeight: "1.8",
                                color: "#555",
                                fontWeight: "500"
                            }}>
                                {pet.description}
                            </p>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                            <div style={{
                                background: "#f0f4ff",
                                padding: "20px",
                                borderRadius: "14px",
                                border: "2px solid #e8f0ff"
                            }}>
                                <p style={{ fontSize: "13px", fontWeight: "700", color: "#5b8cff", textTransform: "uppercase", marginBottom: "8px" }}>
                                    🏥 Health Status
                                </p>
                                <p style={{ fontSize: "18px", fontWeight: "700", color: "#1a202c" }}>
                                    {pet.health_status}
                                </p>
                            </div>
                            <div style={{
                                background: "#f0f4ff",
                                padding: "20px",
                                borderRadius: "14px",
                                border: "2px solid #e8f0ff"
                            }}>
                                <p style={{ fontSize: "13px", fontWeight: "700", color: "#5b8cff", textTransform: "uppercase", marginBottom: "8px" }}>
                                    🏠 Shelter ID
                                </p>
                                <p style={{ fontSize: "18px", fontWeight: "700", color: "#1a202c" }}>
                                    #{pet.shelter_id}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "16px", marginTop: "40px" }}>
                        <button
                            onClick={handleAdoptionRequest}
                            style={{
                                flex: 1,
                                padding: "18px 24px",
                                fontSize: "16px",
                                fontWeight: "800",
                                borderRadius: "14px"
                            }}
                        >
                            📋 Start Application
                        </button>
                        <button
                            onClick={handleFavorite}
                            style={{
                                flex: 1,
                                padding: "18px 24px",
                                fontSize: "16px",
                                fontWeight: "800",
                                borderRadius: "14px",
                                background: "linear-gradient(135deg, #ff6b9d, #ff9db5)"
                            }}
                        >
                            ❤️ Add to Favorites
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PetDetails;