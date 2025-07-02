import { MoveLeft } from "lucide-react";


const BackBtn = () => {
    const path = window.location.pathname;

    const goBack = () => {
        if (path.includes("/intern/")) {
            const batchId = path.split("/")[2];
            window.location.href = `/batch/${batchId}`;
            return;
        }

        window.location.href = "/";
    }

    if (path === "/" || path === "/") {
        return <></>
    }

    return (
        <button className="btn btn-seconday" style={{ display: "flex", alignItems: "center", gap: "5px" }} onClick={goBack}>
            <MoveLeft size={20} />
            <span className="btn-text">Back</span>
        </button>
    )
}

export default BackBtn;