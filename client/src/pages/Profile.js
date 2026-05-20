import React, { useEffect, useState } from "react";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) return;

        fetch(`http://localhost:5000/api/users/profile/${user.id}`)
            .then((response) => response.json())
            .then((data) => setProfile(data))
            .catch((error) => console.error(error));

        fetch(`http://localhost:5000/api/users/${user.id}/notifications`)
            .then((response) => response.json())
            .then((data) => setNotifications(data))
            .catch((error) => console.error(error));
    }, [user]);

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${user.id}/notifications/${notificationId}/read`, {
                method: "PATCH"
            });

            if (!response.ok) return;

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.id === notificationId
                        ? { ...notification, is_read: true }
                        : notification
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    if (!user) {
        return (
            <div style={{ padding: "30px" }}>
                <h1>Please login first</h1>
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={{ padding: "30px" }}>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <div
            style={{
                maxWidth: "1100px",
                margin: "40px auto",
                padding: "20px"
            }}
        >
            <div
                className="glass-card"
                style={{
                    display: "flex",
                    gap: "40px",
                    alignItems: "flex-start"
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <img
                        src={
                            profileImage ||
                            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt="Profile"
                        style={{
                            width: "180px",
                            height: "180px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginBottom: "20px"
                        }}
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>

                <div style={{ flex: 1 }}>
                    <h1>My Profile 👤</h1>

                    <div className="soft-box">
                        <h2>{profile.user.full_name}</h2>
                        <p><strong>Email:</strong> {profile.user.email}</p>
                        <p><strong>Phone:</strong> {profile.user.phone}</p>
                        <p><strong>Role:</strong> {profile.user.role}</p>
                    </div>

                    <div style={{ marginTop: "30px" }}>
                        <h2>Notifications</h2>

                        {notifications.length === 0 ? (
                            <p>No notifications yet.</p>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="glass-card"
                                    style={{
                                        marginTop: "15px",
                                        borderLeft: notification.is_read ? "4px solid #ddd" : "4px solid #5b8cff",
                                        opacity: notification.is_read ? 0.75 : 1
                                    }}
                                >
                                    <p style={{ marginBottom: "8px" }}>{notification.message}</p>
                                    <p style={{ fontSize: "13px", color: "#666", marginBottom: "10px" }}>
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                    {!notification.is_read && (
                                        <button onClick={() => markAsRead(notification.id)}>
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{ marginTop: "30px" }}>
                        <h2>Adoption History</h2>

                        {profile.requests.length === 0 ? (
                            <p>No adoption requests yet.</p>
                        ) : (
                            profile.requests.map((request) => (
                                <div
                                    key={request.id}
                                    className="glass-card"
                                    style={{
                                        marginTop: "15px"
                                    }}
                                >
                                    <h3>{request.pet_name}</h3>
                                    <p>
                                        <strong>Status:</strong>{" "}
                                        {request.status}
                                    </p>
                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {request.request_date}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;