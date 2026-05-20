import React, { useState } from "react";

function AddPet() {
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        description: "",
        health_status: ""
    });

    const user = JSON.parse(localStorage.getItem("user"));

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/api/pets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...formData,
                admin_id: user.id,
                image_url: "",
                adoption_status: "available",
                shelter_id: 1,
                category_id: 1
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            alert(errorData.message || "Failed to add pet");
            return;
        }

        alert("Pet added successfully!");
    };

    if (!user || user.role !== "admin") {
        return (
            <div style={{ padding: "30px" }}>
                <h1>Access Denied</h1>
                <p>Only admin can access this page.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "30px" }}>
            <h1>Add New Pet</h1>

            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Pet Name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <br /><br />

                <input
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                />
                <br /><br />

                <input
                    name="gender"
                    placeholder="Gender"
                    value={formData.gender}
                    onChange={handleChange}
                />
                <br /><br />

                <input
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                />
                <br /><br />

                <input
                    name="health_status"
                    placeholder="Health Status"
                    value={formData.health_status}
                    onChange={handleChange}
                />
                <br /><br />

                <button type="submit">
                    Add Pet
                </button>
            </form>
        </div>
    );
}

export default AddPet;