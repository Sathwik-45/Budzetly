import {
    FaPhone,
    FaEnvelope,
    FaGlobe,
    FaLinkedin
} from "react-icons/fa";

function Contact() {
    return (
        <div>
            <h1>Contact Page</h1>
            <div className="contact">
                <div className="contact-info">
                    <p><FaPhone /> Phone: +1 123-456-7890</p>
                    <p><FaEnvelope /> Email: <a href="mailto:Sathwikpentakoti@gmail.com">Sathwikpentakoti@gmail.com</a></p>
                    <p><FaGlobe /> Website: <a href="https://sathwik-dev.vercel.app" target="_blank" rel="noopener noreferrer">My Portfolio</a></p>
                    <p><FaLinkedin /> LinkedIn: <a href="https://www.linkedin.com/in/sathwik-pentakoti-56868a292/" target="_blank" rel="noopener noreferrer">LinkedIn Profile</a></p>
                </div>
            </div>
        </div>
    );
}

export default Contact;