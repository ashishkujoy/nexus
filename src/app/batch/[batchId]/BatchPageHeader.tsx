"use client";
import { useState } from "react";
import AddInternsModal from "./AddInternsModal";

type PageHeaderProps = {
    title: string;
    startDate: Date;
    batchId: number;
    root: boolean;
}

const formatedDate = (date: Date) => {
    return date.toLocaleDateString("en-us", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

const BatchPageHeader = (props: PageHeaderProps) => {
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(!showModal);

    return (
        <div>
            <div className="header">
                <div className="header-left" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <h1 className="page-title">{props.title}</h1>
                    <span>Started: {formatedDate(props.startDate)}</span>

                </div>
                {
                    props.root && <div className="header-actions">
                        <button className="btn btn-primary" onClick={toggleModal}>+ Add Intern</button>
                    </div>
                }
            </div>
            {showModal && <AddInternsModal
                batchId={props.batchId}
                onClose={toggleModal}
                onInternsAdded={() => {
                    toggleModal();
                    window.location.reload();
                }}
            />}
        </div>
    )
}

export default BatchPageHeader;