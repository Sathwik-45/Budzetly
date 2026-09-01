import "./Toast.css";

function Toast({ message, type = "success" }) {

    return (
        <div className={`budzetly-toast ${type}`}>

            <div className="toast-icon">

                {type === "success" && "✓"}

                {type === "error" && "!"}

                {type === "loading" && (
                    <span className="toast-spinner"></span>
                )}

            </div>

            <span className="toast-message">
                {message}
            </span>

        </div>
    );
}

export default Toast;