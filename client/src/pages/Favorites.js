import React, { useEffect, useState } from "react";
import PetCard from "../components/PetCard";

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchFavorites = () => {
        if (!user) return;

        fetch(`http://localhost:5000/api/favorites/${user.id}`)
            .then((response) => response.json())
            .then((data) => setFavorites(data))
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const removeFavorite = async (petId) => {
        await fetch("http://localhost:5000/api/favorites", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: user.id,
                pet_id: petId
            })
        });

        fetchFavorites();
    };

    if (!user) {
        return (
            <div style={{ padding: "30px" }}>
                <h1>Please login first</h1>
            </div>
        );
    }

    return (
        <div
            style={{
                maxWidth: "1300px",
                margin: "40px auto",
                padding: "20px"
            }}
        >
            <h1>My Favorites ❤️</h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(350px, 1fr))",
                    gap: "30px",
                    alignItems: "start"
                }}
            >
                {favorites.map((pet) => (
                    <div key={pet.id}>
                        <PetCard pet={pet} />

                        <button
                            onClick={() => removeFavorite(pet.id)}
                            style={{
                                marginTop: "15px",
                                width: "100%"
                            }}
                        >
                            Remove from Favorites
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Favorites;