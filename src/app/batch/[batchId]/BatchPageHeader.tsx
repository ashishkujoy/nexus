"use client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import AddInternsModal from "./AddInternsModal";
import { useModalStore } from "../../stores/modalStore";

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
    const queryClient = useQueryClient();
    const router = useRouter();
    const { addInternsModal, openAddInternsModal, closeAddInternsModal } = useModalStore();

    return (
        <div>
            <div className="header">
                <div className="header-left" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <h1 className="page-title">{props.title}</h1>
                    <span>Started: {formatedDate(props.startDate)}</span>

                </div>
                {
                    props.root && <div className="header-actions">
                        <button className="btn btn-primary" onClick={openAddInternsModal}>+ Add Intern</button>
                    </div>
                }
            </div>
            {addInternsModal && <AddInternsModal
                batchId={props.batchId}
                onClose={closeAddInternsModal}
                onInternsAdded={() => {
                    closeAddInternsModal();
                    queryClient.invalidateQueries({ queryKey: ['interns'] });
                    router.refresh(); // Refresh server-side data
                }}
            />}
        </div>
    )
}

export default BatchPageHeader;