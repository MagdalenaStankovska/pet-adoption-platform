import React, { useState } from "react";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            alert("Please enter email and password.");
            return;
        }

        const response = await fetch("http://localhost:5000/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("user", JSON.stringify(data.user));
            alert(`Welcome ${data.user.full_name}`);
            window.location.href = "/";
        } else {
            alert(data.message);
        }
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
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
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

                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;