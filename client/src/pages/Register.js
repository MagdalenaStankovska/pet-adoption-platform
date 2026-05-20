import React, { useState } from "react";

function Register() {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        phone: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.full_name ||
            !formData.email ||
            !formData.password
        ) {
            alert("Please fill all required fields.");
            return;
        }

        await fetch("http://localhost:5000/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        alert("Registration successful!");

        setFormData({
            full_name: "",
            email: "",
            password: "",
            phone: ""
        });
    };

    return (
        <div
            style={{
                maxWidth: "500px",
                margin: "50px auto",
                background: "#fff",
                padding: "40px",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
            }}
        >
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <input
                    name="full_name"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                />

                <input
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                />

                <button type="submit">
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;