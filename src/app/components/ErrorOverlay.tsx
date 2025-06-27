import "./loaderOverlay.css";
import "./successOverlay.css";

type Props = {
    title: string;
    message: string;
    onClose: () => void;
}

const ErrorOverlay = (props: Props) => {
    return (
        <div className="loading-overlay" id="successOverlay">
            <div className="loading-content">
                <div className="success-message">
                    <div className="response-icon error">×</div>
                    <div className="loading-title">{props.title}</div>
                    <div className="loading-message">{props.message}</div>
                </div>
                <button className="btn btn-primary" onClick={props.onClose} style={{ marginTop: "20px" }}>Close</button>
            </div>
        </div>

    )
}

export default ErrorOverlay;