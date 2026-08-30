import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
function Navbar() {
    return (
        <nav className="navbar">

           <Link to="/" className="brand">
                <div className="logo-icon">
                    <img src={logo} alt="Budzetly logo" />
                </div>

                <span>BUDZET<h3>LY</h3></span>
            </Link>

            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/explore">Explore</Link>
                <Link to="/how-it-works">How It Works</Link>
            </div>

            <div className="nav-buttons">
                <Link className="login-btn" to="/login">Login</Link>
                <Link className="signup-btn" to="/register">Sign Up</Link>
            </div>

        </nav>
    );
}

export default Navbar;