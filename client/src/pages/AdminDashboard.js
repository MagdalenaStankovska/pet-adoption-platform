import React, { useEffect, useState } from "react";

function AdminDashboard() {
    const [requests, setRequests] = useState([]);
    const [pets, setPets] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [adminNotes, setAdminNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchRequests = () => {
        fetch("http://localhost:5000/api/adoption-requests")
            .then((response) => response.json())
            .then((data) => setRequests(data));
    };

    const fetchPets = () => {
        fetch("http://localhost:5000/api/pets")
            .then((response) => response.json())
            .then((data) => setPets(data));
    };

    useEffect(() => {
        fetchRequests();
        fetchPets();
    }, []);

    const handleDeletePet = async (petId, petName) => {
        if (!window.confirm(`Delete ${petName}? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/pets/${petId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ admin_id: user.id })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                alert(errorData.message || "Failed to delete pet");
                return;
            }

            alert("Pet deleted successfully");
            fetchPets();
        } catch (error) {
            console.error(error);
            alert("Error deleting pet");
        }
    };

    const handleReviewApplication = async (requestId, newStatus) => {
        if (submitting) return;
        
        setSubmitting(true);

        try {
            const response = await fetch(`http://localhost:5000/api/adoption-requests/${requestId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: newStatus,
                    admin_notes: adminNotes,
                    admin_id: user.id
                })
            });

            if (response.ok) {
                alert(`✅ Application ${newStatus}!`);
                setAdminNotes("");
                setSelectedRequest(null);
                fetchRequests();
            }
        } catch (error) {
            console.error(error);
            alert("Error updating application");
        }
        
        setSubmitting(false);
    };

    const filteredRequests = requests.filter((req) => {
        return statusFilter === "all" || req.status === statusFilter;
    });

    const getStatusColor = (status) => {
        if (status === "approved") return "#10b981";
        if (status === "rejected") return "#ef4444";
        return "#f59e0b";
    };

    const getStatusBg = (status) => {
        if (status === "approved") return "#d1fae5";
        if (status === "rejected") return "#fee2e2";
        return "#fef3c7";
    };

    if (!user || user.role !== "admin") {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <h1>🔒 Access Denied</h1>
                <p>Only administrators can access this page.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "40px", marginBottom: "30px", color: "#1a202c" }}>
                📊 Adoption Applications Dashboard
            </h1>

            <div style={{
                background: "white",
                border: "1px solid #eee",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "30px"
            }}>
                <h2 style={{ marginBottom: "12px", color: "#1a202c" }}>🐾 Pet Management</h2>
                <p style={{ color: "#666", marginBottom: "16px" }}>
                    Add pets from the Add Pet page and delete pets directly here.
                </p>
                <div style={{ display: "grid", gap: "10px" }}>
                    {pets.length === 0 ? (
                        <p style={{ color: "#888" }}>No pets available.</p>
                    ) : (
                        pets.map((pet) => (
                            <div
                                key={pet.id}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    border: "1px solid #f0f0f0",
                                    borderRadius: "10px",
                                    padding: "12px 14px"
                                }}
                            >
                                <div>
                                    <strong>{pet.name}</strong>
                                    <span style={{ marginLeft: "8px", color: "#777", fontSize: "14px" }}>
                                        {pet.breed || "No breed"}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDeletePet(pet.id, pet.name)}
                                    style={{
                                        background: "#ef4444",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        padding: "8px 12px",
                                        cursor: "pointer",
                                        fontWeight: "700"
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{
                display: "flex",
                gap: "12px",
                marginBottom: "30px",
                flexWrap: "wrap"
            }}>
                {["all", "pending", "approved", "rejected"].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setStatusFilter(filter)}
                        style={{
                            padding: "12px 20px",
                            background: statusFilter === filter
                                ? "linear-gradient(135deg, #5b8cff, #7aa7ff)"
                                : "transparent",
                            color: statusFilter === filter ? "white" : "#5b8cff",
                            border: statusFilter === filter ? "none" : "2px solid #5b8cff",
                            borderRadius: "12px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            textTransform: "capitalize"
                        }}
                    >
                        {filter === "all" ? "📋 All Applications" : `${filter === "pending" ? "⏳" : filter === "approved" ? "✅" : "❌"} ${filter}`}
                    </button>
                ))}
            </div>

            {/* Application Count */}
            <div style={{
                background: "linear-gradient(135deg, #5b8cff, #7aa7ff)",
                color: "white",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "30px",
                fontWeight: "700"
            }}>
                📬 Total Applications: <span style={{ fontSize: "24px" }}>{filteredRequests.length}</span>
            </div>

            {/* Two-Column Layout for Review */}
            <div style={{ display: "grid", gridTemplateColumns: selectedRequest ? "1fr 1fr" : "1fr", gap: "30px" }}>
                {/* Applications List */}
                <div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {filteredRequests.length === 0 ? (
                            <div style={{
                                background: "#f9f9f9",
                                padding: "40px",
                                borderRadius: "12px",
                                textAlign: "center",
                                color: "#999"
                            }}>
                                <p style={{ fontSize: "18px", marginBottom: "10px" }}>📭 No applications found</p>
                                <p style={{ fontSize: "14px" }}>Check back later for new adoption applications</p>
                            </div>
                        ) : (
                            filteredRequests.map((request) => (
                                <div
                                    key={request.id}
                                    onClick={() => setSelectedRequest(request)}
                                    style={{
                                        background: selectedRequest?.id === request.id ? "#e8f4ff" : "white",
                                        border: selectedRequest?.id === request.id ? "2px solid #5b8cff" : "1px solid #eee",
                                        padding: "20px",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        boxShadow: selectedRequest?.id === request.id ? "0 8px 20px rgba(91, 140, 255, 0.2)" : "0 2px 8px rgba(0,0,0,0.05)"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedRequest?.id !== request.id) {
                                            e.currentTarget.style.transform = "translateX(4px)";
                                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedRequest?.id !== request.id) {
                                            e.currentTarget.style.transform = "translateX(0)";
                                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                                        }
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                                        <div>
                                            <h3 style={{ color: "#1a202c", marginBottom: "4px" }}>
                                                {request.user?.full_name}
                                            </h3>
                                            <p style={{ color: "#666", fontSize: "14px", margin: "0" }}>
                                                Wants to adopt: <strong>{request.pet?.name}</strong>
                                            </p>
                                        </div>
                                        <span style={{
                                            background: getStatusBg(request.status),
                                            color: getStatusColor(request.status),
                                            padding: "6px 12px",
                                            borderRadius: "20px",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            whiteSpace: "nowrap"
                                        }}>
                                            {request.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p style={{ color: "#999", fontSize: "13px", margin: "0" }}>
                                        📅 {new Date(request.request_date).toLocaleDateString()}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Application Details Review Panel */}
                {selectedRequest && (
                    <div style={{
                        background: "white",
                        border: "2px solid #f0f4ff",
                        borderRadius: "16px",
                        padding: "30px",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                        maxHeight: "80vh",
                        overflowY: "auto"
                    }}>
                        <h2 style={{ color: "#1a202c", marginBottom: "30px", fontSize: "28px" }}>
                            📋 Application Review
                        </h2>

                        {/* Applicant Info */}
                        <div style={{ marginBottom: "30px", paddingBottom: "20px", borderBottom: "2px solid #f0f4ff" }}>
                            <h4 style={{ color: "#5b8cff", marginBottom: "12px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                👤 Applicant Information
                            </h4>
                            <p style={{ marginBottom: "8px" }}>
                                <strong>Name:</strong> {selectedRequest.user?.full_name}
                            </p>
                            <p style={{ marginBottom: "8px" }}>
                                <strong>Email:</strong> {selectedRequest.user?.email}
                            </p>
                            <p style={{ marginBottom: "0" }}>
                                <strong>Phone:</strong> {selectedRequest.user?.phone || "Not provided"}
                            </p>
                        </div>

                        {/* Pet Info */}
                        <div style={{ marginBottom: "30px", paddingBottom: "20px", borderBottom: "2px solid #f0f4ff" }}>
                            <h4 style={{ color: "#5b8cff", marginBottom: "12px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                🐾 Pet Information
                            </h4>
                            <p style={{ marginBottom: "8px" }}>
                                <strong>Pet Name:</strong> {selectedRequest.pet?.name}
                            </p>
                            <p style={{ marginBottom: "0" }}>
                                <strong>Breed:</strong> {selectedRequest.pet?.breed}
                            </p>
                        </div>

                        {/* Care Plan */}
                        <div style={{ marginBottom: "30px", paddingBottom: "20px", borderBottom: "2px solid #f0f4ff" }}>
                            <h4 style={{ color: "#5b8cff", marginBottom: "12px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                💕 Care Plan
                            </h4>
                            <div style={{
                                background: "#f9f9f9",
                                padding: "16px",
                                borderRadius: "8px",
                                borderLeft: "4px solid #5b8cff"
                            }}>
                                <p style={{ margin: "0", lineHeight: "1.6", fontSize: "14px", color: "#555" }}>
                                    {selectedRequest.care_description}
                                </p>
                            </div>
                        </div>

                        {/* Living Conditions */}
                        <div style={{ marginBottom: "30px", paddingBottom: "20px", borderBottom: "2px solid #f0f4ff" }}>
                            <h4 style={{ color: "#5b8cff", marginBottom: "12px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                🏠 Living Conditions
                            </h4>
                            <div style={{
                                background: "#f9f9f9",
                                padding: "16px",
                                borderRadius: "8px",
                                borderLeft: "4px solid #5b8cff"
                            }}>
                                <p style={{ margin: "0", lineHeight: "1.6", fontSize: "14px", color: "#555" }}>
                                    {selectedRequest.living_conditions}
                                </p>
                            </div>
                        </div>

                        {/* Photos */}
                        {selectedRequest.photo_urls && selectedRequest.photo_urls.length > 0 && (
                            <div style={{ marginBottom: "30px", paddingBottom: "20px", borderBottom: "2px solid #f0f4ff" }}>
                                <h4 style={{ color: "#5b8cff", marginBottom: "12px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    📸 Living Space Photos ({selectedRequest.photo_urls.length})
                                </h4>
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                                    gap: "12px"
                                }}>
                                    {selectedRequest.photo_urls.map((url, index) => (
                                        <a
                                            key={index}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: "block",
                                                borderRadius: "8px",
                                                overflow: "hidden",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "scale(1.05)";
                                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(91, 140, 255, 0.3)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "scale(1)";
                                                e.currentTarget.style.boxShadow = "none";
                                            }}
                                        >
                                            <img
                                                src={url}
                                                alt={`Application photo ${index + 1}`}
                                                style={{
                                                    width: "100%",
                                                    height: "120px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px"
                                                }}
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/120?text=Failed+to+load";
                                                }}
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Admin Notes */}
                        <div style={{ marginBottom: "30px" }}>
                            <h4 style={{ color: "#5b8cff", marginBottom: "12px", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                📝 Admin Notes (Optional)
                            </h4>
                            <textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Add notes about this application (will be saved if approved/rejected)..."
                                style={{
                                    width: "100%",
                                    maxWidth: "none",
                                    minHeight: "100px",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "2px solid #e8f0ff",
                                    fontFamily: "inherit",
                                    fontSize: "14px"
                                }}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button
                                onClick={() => handleReviewApplication(selectedRequest.id, "rejected")}
                                disabled={submitting}
                                style={{
                                    flex: 1,
                                    padding: "14px",
                                    background: "linear-gradient(135deg, #ef4444, #f87171)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    fontWeight: "700",
                                    cursor: submitting ? "not-allowed" : "pointer",
                                    opacity: submitting ? 0.7 : 1,
                                    transition: "all 0.3s ease"
                                }}
                                onMouseEnter={(e) => {
                                    if (!submitting) {
                                        e.target.style.transform = "translateY(-2px)";
                                        e.target.style.boxShadow = "0 8px 20px rgba(239, 68, 68, 0.3)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "none";
                                }}
                            >
                                {submitting ? "Processing..." : "❌ Reject"}
                            </button>
                            <button
                                onClick={() => handleReviewApplication(selectedRequest.id, "approved")}
                                disabled={submitting}
                                style={{
                                    flex: 1,
                                    padding: "14px",
                                    background: "linear-gradient(135deg, #10b981, #34d399)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "12px",
                                    fontWeight: "700",
                                    cursor: submitting ? "not-allowed" : "pointer",
                                    opacity: submitting ? 0.7 : 1,
                                    transition: "all 0.3s ease"
                                }}
                                onMouseEnter={(e) => {
                                    if (!submitting) {
                                        e.target.style.transform = "translateY(-2px)";
                                        e.target.style.boxShadow = "0 8px 20px rgba(16, 185, 129, 0.3)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "none";
                                }}
                            >
                                {submitting ? "Processing..." : "✅ Approve"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;