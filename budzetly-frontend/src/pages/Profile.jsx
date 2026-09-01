import { useEffect, useState } from "react";
import api from "../api/Axios";
import Navbar from "../components/Navbar";

function Profile() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const getProfile = async () => {

            try {

                const response = await api.get("/api/users/me");

                setUser(response.data);

            } catch (error) {

                console.error("Failed to load profile:", error);

            } finally {

                setLoading(false);

            }
        };

        getProfile();

    }, []);

    if (loading) {
        return (
            <>
              
                <div className="profile-loading">
                    <div className="profile-spinner"></div>
                    <p>Loading your profile...</p>
                </div>
            </>
        );
    }

    return (
        <>
          

            <div className="profile-page">

                <div className="profile-container">

                    <div className="profile-header">
                        <p className="profile-small-title">
                            BUDZETLY ACCOUNT
                        </p>

                        <h1>My Profile</h1>

                        <p>
                            Manage and view your personal account information.
                        </p>
                    </div>

                    {user ? (
                        <div className="profile-card">

                            <div className="profile-avatar">
                                {user.name.charAt(0).toUpperCase()}
                            </div>

                            <div className="profile-welcome">
                                <h2>Welcome, {user.name} 👋</h2>
                                <p>Your Budzetly account details</p>
                            </div>

                            <div className="profile-details">

                                <div className="profile-detail">
                                    <span className="detail-label">
                                        Full Name
                                    </span>

                                    <span className="detail-value">
                                        {user.name}
                                    </span>
                                </div>

                                <div className="profile-detail">
                                    <span className="detail-label">
                                        Email
                                    </span>

                                    <span className="detail-value">
                                        {user.email}
                                    </span>
                                </div>

                                <div className="profile-detail">
                                    <span className="detail-label">
                                        Phone
                                    </span>

                                    <span className="detail-value">
                                        {user.phone}
                                    </span>
                                </div>

                            </div>

                        </div>
                    ) : (
                        <div className="profile-error">
                            <h2>Unable to load profile</h2>
                            <p>Please try again later.</p>
                        </div>
                    )}

                </div>

            </div>
        </>
    );
}

export default Profile;