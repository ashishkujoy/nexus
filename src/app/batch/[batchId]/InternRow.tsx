"use client";
import { NoticeIcon } from "@/app/components/Icons";

const NoticeBadge = () => {
    return (
        <div className="notice-container">
            <NoticeIcon />
        </div>
    )
}

const Status = (props: { colorCode?: string; notice: boolean }) => {
    return (
        <td className="table-cell">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className={`color-badge color-${props.colorCode || "none"}`}></span>
                {props.notice && <NoticeBadge />}

            </div>
        </td>
    )
}

type InternRowProps = {
    id: number;
    name: string;
    colorCode?: string;
    notice: boolean;
}


const InternRow = (props: InternRowProps) => {
    const gotoInternPage = () => window.location.assign(window.location.pathname + `/intern/${props.id}`);
    return (
        <tr className="intern-row" onClick={gotoInternPage}>
            <td>
                <div className="intern-name">
                    <div>
                        <div style={{ fontWeight: "500" }}>{props.name}</div>
                    </div>
                </div>
            </td>
            <Status colorCode={props.colorCode} notice={props.notice} />
            <td>
                <button className="btn btn-secondary"
                    style={{ padding: "4px 8px", fontSize: "12px" }}>View</button>
            </td>
        </tr>
    )
}

export default InternRow;