import "./loaderOverlay.css";

type Props = {
    title: string;
    message: string;
}

const LoaderOverlay = (props: Props) => {
    return (
        <div className="modal active">
            <div className="loading-overlay" id="loadingOverlay">
                <div className="loading-content">
                    <div className="spinner"></div>
                    <div className="loading-title">{props.title}</div>
                    <div className="loading-message">{props.message}</div>
                    <div className="progress-bar">
                        <div className="progress-fill"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoaderOverlay;