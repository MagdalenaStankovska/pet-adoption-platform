import React, { useEffect, useState } from "react";
import PetCard from "../components/PetCard";

function Pets() {
    const [pets, setPets] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:5000/api/pets")
            .then((response) => response.json())
            .then((data) => {
                setPets(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    const filteredPets = pets.filter((pet) => {
        const matchesSearch =
            pet.name.toLowerCase().includes(search.toLowerCase()) ||
            (pet.breed && pet.breed.toLowerCase().includes(search.toLowerCase()));

        const matchesCategory =
            category === "All" ||
            (category === "Dog" && pet.category_id === 1) ||
            (category === "Cat" && pet.category_id === 2) ||
            (category === "Bird" && pet.category_id === 3);

        return matchesSearch && matchesCategory;
    });

    return (
        <div style={{ padding: "40px 30px", maxWidth: "1400px", margin: "0 auto" }}>
            <div style={{ marginBottom: "40px" }}>
                <h1 style={{ fontSize: "40px", marginBottom: "30px", color: "#1a202c" }}>
                    🐾 Available Pets
                </h1>

                <div style={{
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap",
                    alignItems: "center",
                    background: "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(12px)",
                    padding: "24px",
                    borderRadius: "16px",
                    border: "2px solid rgba(91, 140, 255, 0.15)",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.05)"
                }}>
                    <div style={{ flex: 1, minWidth: "250px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "12px",
                            fontWeight: "700",
                            color: "#5b8cff",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}>
                            Search Pets
                        </label>
                        <input
                            type="text"
                            placeholder="Search by name or breed..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                maxWidth: "none",
                                padding: "12px 16px",
                                fontSize: "14px",
                                borderRadius: "10px"
                            }}
                        />
                    </div>

                    <div style={{ minWidth: "180px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "12px",
                            fontWeight: "700",
                            color: "#5b8cff",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                        }}>
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{
                                maxWidth: "none",
                                padding: "12px 16px",
                                borderRadius: "10px",
                                fontSize: "14px",
                                fontWeight: "600"
                            }}
                        >
                            <option>All</option>
                            <option>Dog</option>
                            <option>Cat</option>
                            <option>Bird</option>
                        </select>
                    </div>
                </div>

                <p style={{
                    marginTop: "16px",
                    fontSize: "14px",
                    color: "#666",
                    fontWeight: "600"
                }}>
                    Showing <span style={{ color: "#5b8cff", fontWeight: "800" }}>{filteredPets.length}</span> pet{filteredPets.length !== 1 ? 's' : ''}
                </p>
            </div>

            {loading ? (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                    fontSize: "24px"
                }}>
                    🐕 Loading incredible pets...
                </div>
            ) : filteredPets.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    background: "rgba(255, 255, 255, 0.6)",
                    borderRadius: "16px",
                    border: "2px dashed rgba(91, 140, 255, 0.3)"
                }}>
                    <p style={{ fontSize: "24px", marginBottom: "12px" }}>🔍 No pets found</p>
                    <p style={{ color: "#999" }}>Try adjusting your search or filter criteria</p>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                        gap: "28px",
                        alignItems: "start"
                    }}
                >
                    {filteredPets.map((pet, index) => (
                        <div key={pet.id} style={{
                            animation: `slideUp 0.5s ease-out ${index * 0.08}s backwards`
                        }}>
                            <style>
                                {`
                                    @keyframes slideUp {
                                        from {
                                            opacity: 0;
                                            transform: translateY(30px);
                                        }
                                        to {
                                            opacity: 1;
                                            transform: translateY(0);
                                        }
                                    }
                                `}
                            </style>
                            <PetCard pet={pet} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Pets;