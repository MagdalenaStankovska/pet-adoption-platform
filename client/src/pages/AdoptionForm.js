import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AdoptionForm() {
    const { petId } = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        care_description: "",
        living_conditions: "",
        photo_urls: []
    });

    const [photoInput, setPhotoInput] = useState("");
    const [previewPhotos, setPreviewPhotos] = useState([]);

    // Fetch pet details
    useEffect(() => {
        if (!petId) {
            setLoading(false);
            return;
        }

        fetch("http://localhost:5000/api/pets")
            .then((res) => res.json())
            .then((data) => {
                const foundPet = data.find((p) => p.id === Number(petId));
                setPet(foundPet);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, [petId]);

    // Handle text input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Add photo URL
    const addPhotoUrl = () => {
        if (photoInput.trim() && photoInput.startsWith("http")) {
            setPreviewPhotos((prev) => [...prev, photoInput]);
            setFormData((prev) => ({
                ...prev,
                photo_urls: [...prev.photo_urls, photoInput]
            }));
            setPhotoInput("");
        } else {
            alert("Please enter a valid HTTPS image URL");
        }
    };

    // Remove photo URL
    const removePhotoUrl = (index) => {
        setPreviewPhotos((prev) => prev.filter((_, i) => i !== index));
        setFormData((prev) => ({
            ...prev,
            photo_urls: prev.photo_urls.filter((_, i) => i !== index)
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.care_description.trim()) {
            alert("Please describe how you will care for this pet");
            return;
        }

        if (!formData.living_conditions.trim()) {
            alert("Please describe your living conditions");
            return;
        }

        if (formData.photo_urls.length === 0) {
            alert("Please add at least one photo of your living space");
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch("http://localhost:5000/api/adoption-requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: user.id,
                    pet_id: Number(petId),
                    care_description: formData.care_description,
                    living_conditions: formData.living_conditions,
                    photo_urls: formData.photo_urls
                })
            });

            if (response.status === 409) {
                alert("You already have a pending or approved request for this pet");
                setSubmitting(false);
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to submit application");
            }

            alert("✅ Adoption application submitted successfully!\n\nThe admin will review your application and contact you within 3-5 business days.");
            navigate("/profile");
        } catch (error) {
            console.error(error);
            alert("Error submitting application. Please try again.");
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <h2>Please log in to submit an adoption application</h2>
                <button onClick={() => navigate("/login")}>Go to Login</button>
            </div>
        );
    }

    if (loading) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <h2>Loading pet details...</h2>
            </div>
        );
    }

    if (!pet) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <h2>Pet not found</h2>
                <button onClick={() => navigate("/pets")}>Back to Pets</button>
            </div>
        );
    }

    return (
        <div style={{
            padding: "40px",
            maxWidth: "900px",
            margin: "0 auto"
        }}>
            <button
                onClick={() => navigate(`/pet/${petId}`)}
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
                ← Back to Pet Profile
            </button>

            <div style={{
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                padding: "50px",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.08)",
                border: "2px solid #f0f4ff"
            }}>
                {/* Pet Info Header */}
                <div style={{
                    display: "flex",
                    gap: "30px",
                    alignItems: "center",
                    marginBottom: "50px",
                    paddingBottom: "30px",
                    borderBottom: "2px solid #f0f4ff"
                }}>
                    <img
                        src={pet.image_url}
                        alt={pet.name}
                        style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "16px",
                            objectFit: "cover"
                        }}
                    />
                    <div>
                        <h1 style={{ fontSize: "36px", marginBottom: "10px", color: "#1a202c" }}>
                            Adopt {pet.name}
                        </h1>
                        <p style={{ fontSize: "18px", color: "#666", marginBottom: "8px" }}>
                            <strong>{pet.breed}</strong> • {pet.age} years old • {pet.gender}
                        </p>
                        <p style={{ fontSize: "14px", color: "#999" }}>
                            Complete this application to express your interest in adopting {pet.name}
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Care Description Section */}
                    <div style={{ marginBottom: "40px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#1a202c",
                            marginBottom: "12px"
                        }}>
                            💕 How Will You Care for {pet.name}?
                        </label>
                        <p style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
                            Please describe in detail how you plan to care for this pet, including:
                            <br />
                            • Daily routine and exercise plan
                            <br />
                            • Veterinary care commitment
                            <br />
                            • Training and socialization plans
                            <br />
                            • Time and resources available
                        </p>
                        <textarea
                            name="care_description"
                            value={formData.care_description}
                            onChange={handleInputChange}
                            placeholder="Describe your care plan for this pet..."
                            style={{
                                width: "100%",
                                maxWidth: "none",
                                minHeight: "150px",
                                padding: "16px",
                                borderRadius: "12px",
                                border: "2px solid #e8f0ff",
                                fontSize: "15px",
                                fontFamily: "inherit",
                                resize: "vertical",
                                boxShadow: "0 4px 12px rgba(91, 140, 255, 0.08)"
                            }}
                        />
                    </div>

                    {/* Living Conditions Section */}
                    <div style={{ marginBottom: "40px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#1a202c",
                            marginBottom: "12px"
                        }}>
                            🏠 Your Living Conditions
                        </label>
                        <p style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
                            Please describe your living environment:
                            <br />
                            • Type of housing (apartment, house, etc.)
                            <br />
                            • Yard access and size
                            <br />
                            • Pet policy (if renting)
                            <br />
                            • Other pets or family members
                            <br />
                            • Travel/work schedule
                        </p>
                        <textarea
                            name="living_conditions"
                            value={formData.living_conditions}
                            onChange={handleInputChange}
                            placeholder="Describe your home and living situation..."
                            style={{
                                width: "100%",
                                maxWidth: "none",
                                minHeight: "150px",
                                padding: "16px",
                                borderRadius: "12px",
                                border: "2px solid #e8f0ff",
                                fontSize: "15px",
                                fontFamily: "inherit",
                                resize: "vertical",
                                boxShadow: "0 4px 12px rgba(91, 140, 255, 0.08)"
                            }}
                        />
                    </div>

                    {/* Photo Upload Section */}
                    <div style={{ marginBottom: "40px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#1a202c",
                            marginBottom: "12px"
                        }}>
                            📸 Photos of Your Living Space
                        </label>
                        <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
                            Add at least <strong>1-3 photos</strong> showing:
                            <br />
                            • Indoor living areas
                            <br />
                            • Yard (if applicable)
                            <br />
                            • Pet sleeping/play areas
                            <br />
                            <strong style={{ color: "#5b8cff" }}>Note:</strong> Please use direct HTTPS image URLs (e.g., from Unsplash, Imgur, Google Drive sharing)
                        </p>

                        {/* Photo URL Input */}
                        <div style={{
                            display: "flex",
                            gap: "12px",
                            marginBottom: "20px"
                        }}>
                            <input
                                type="text"
                                value={photoInput}
                                onChange={(e) => setPhotoInput(e.target.value)}
                                placeholder="Paste image URL here (must be HTTPS)..."
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addPhotoUrl();
                                    }
                                }}
                                style={{
                                    flex: 1,
                                    maxWidth: "none",
                                    padding: "14px 16px",
                                    borderRadius: "12px",
                                    border: "2px solid #e8f0ff",
                                    fontSize: "15px"
                                }}
                            />
                            <button
                                type="button"
                                onClick={addPhotoUrl}
                                style={{
                                    padding: "14px 24px",
                                    background: "linear-gradient(135deg, #5b8cff, #7aa7ff)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    transition: "all 0.3s ease"
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = "translateY(-2px)";
                                    e.target.style.boxShadow = "0 8px 20px rgba(91, 140, 255, 0.3)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "none";
                                }}
                            >
                                + Add Photo
                            </button>
                        </div>

                        {/* Photo Preview */}
                        {previewPhotos.length > 0 && (
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                                gap: "16px",
                                marginBottom: "20px"
                            }}>
                                {previewPhotos.map((url, index) => (
                                    <div key={index} style={{
                                        position: "relative",
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                        background: "#f0f4ff"
                                    }}>
                                        <img
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            style={{
                                                width: "100%",
                                                height: "150px",
                                                objectFit: "cover"
                                            }}
                                            onError={(e) => {
                                                e.target.src = "https://via.placeholder.com/150?text=Invalid+URL";
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePhotoUrl(index)}
                                            style={{
                                                position: "absolute",
                                                top: "8px",
                                                right: "8px",
                                                background: "rgba(255, 107, 157, 0.9)",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "50%",
                                                width: "32px",
                                                height: "32px",
                                                fontSize: "18px",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = "rgba(255, 107, 157, 1)";
                                                e.target.style.transform = "scale(1.1)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = "rgba(255, 107, 157, 0.9)";
                                                e.target.style.transform = "scale(1)";
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p style={{
                            fontSize: "13px",
                            color: "#999",
                            background: "#f9f9f9",
                            padding: "12px",
                            borderRadius: "8px",
                            borderLeft: "4px solid #5b8cff"
                        }}>
                            💡 <strong>Pro Tip:</strong> To get free image URLs, upload photos to Unsplash, Imgur, or use Google Drive with "Share Link" enabled.
                        </p>
                    </div>

                    {/* Form Status */}
                    <div style={{
                        background: "#e8f4ff",
                        padding: "20px",
                        borderRadius: "12px",
                        marginBottom: "30px",
                        border: "2px solid #c8e9ff"
                    }}>
                        <p style={{ fontSize: "14px", color: "#0066cc", fontWeight: "600", margin: 0 }}>
                            ✅ <strong>Application Status:</strong> Complete
                        </p>
                        <p style={{ fontSize: "13px", color: "#0066cc", marginTop: "8px" }}>
                            Care Plan: {"✓"} | Living Conditions: {"✓"} | Photos: {previewPhotos.length > 0 ? "✓" : "○"}
                        </p>
                    </div>

                    {/* Submit Button */}
                    <div style={{ display: "flex", gap: "16px" }}>
                        <button
                            type="button"
                            onClick={() => navigate(`/pet/${petId}`)}
                            style={{
                                flex: 1,
                                padding: "16px 24px",
                                background: "transparent",
                                color: "#5b8cff",
                                border: "2px solid #5b8cff",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: "700",
                                cursor: "pointer",
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
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || previewPhotos.length === 0}
                            style={{
                                flex: 2,
                                padding: "16px 24px",
                                background: previewPhotos.length === 0 ? "#ccc" : "linear-gradient(135deg, #5b8cff, #7aa7ff)",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: "700",
                                cursor: previewPhotos.length === 0 ? "not-allowed" : "pointer",
                                transition: "all 0.3s ease",
                                opacity: submitting ? 0.7 : 1
                            }}
                            onMouseEnter={(e) => {
                                if (!submitting && previewPhotos.length > 0) {
                                    e.target.style.transform = "translateY(-3px)";
                                    e.target.style.boxShadow = "0 12px 28px rgba(91, 140, 255, 0.35)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "none";
                            }}
                        >
                            {submitting ? "Submitting..." : "🚀 Submit Adoption Application"}
                        </button>
                    </div>
                </form>

                {/* Information Box */}
                <div style={{
                    marginTop: "50px",
                    paddingTop: "30px",
                    borderTop: "2px solid #f0f4ff"
                }}>
                    <h3 style={{ color: "#1a202c", marginBottom: "16px" }}>📋 What Happens Next?</h3>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "16px"
                    }}>
                        <div style={{
                            background: "#f9f9f9",
                            padding: "16px",
                            borderRadius: "12px",
                            border: "1px solid #eee"
                        }}>
                            <p style={{ fontSize: "20px", margin: "0 0 8px 0" }}>📬</p>
                            <p style={{ fontWeight: "700", color: "#1a202c", marginBottom: "4px" }}>1. Application Submitted</p>
                            <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>Your application is received and queued for admin review</p>
                        </div>
                        <div style={{
                            background: "#f9f9f9",
                            padding: "16px",
                            borderRadius: "12px",
                            border: "1px solid #eee"
                        }}>
                            <p style={{ fontSize: "20px", margin: "0 0 8px 0" }}>👀</p>
                            <p style={{ fontWeight: "700", color: "#1a202c", marginBottom: "4px" }}>2. Admin Review</p>
                            <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>Admin reviews your care plan, living conditions, and photos</p>
                        </div>
                        <div style={{
                            background: "#f9f9f9",
                            padding: "16px",
                            borderRadius: "12px",
                            border: "1px solid #eee"
                        }}>
                            <p style={{ fontSize: "20px", margin: "0 0 8px 0" }}>📞</p>
                            <p style={{ fontWeight: "700", color: "#1a202c", marginBottom: "4px" }}>3. Contact</p>
                            <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>We'll contact you at the email or phone provided</p>
                        </div>
                        <div style={{
                            background: "#f9f9f9",
                            padding: "16px",
                            borderRadius: "12px",
                            border: "1px solid #eee"
                        }}>
                            <p style={{ fontSize: "20px", margin: "0 0 8px 0" }}>✨</p>
                            <p style={{ fontWeight: "700", color: "#1a202c", marginBottom: "4px" }}>4. Meet Pet</p>
                            <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>If approved, schedule a time to meet your new friend!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdoptionForm;
