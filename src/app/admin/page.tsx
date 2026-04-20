import AppHeader from "@/app/components/AppHeader";
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { fetchBatchesWithAssignments, fetchMentors } from "./action";
import AdminPage from "./AdminPage";
import "./page.css";

export default async function AdminRoute() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isRoot) {
        redirect("/");
    }

    const [mentors, batches] = await Promise.all([
        fetchMentors(),
        fetchBatchesWithAssignments(),
    ]);

    return (
        <div className="main-container">
            <div className="page-container">
                <div className="main-content">
                    <AppHeader />
                    <main className="content">
                        <div style={{ marginBottom: "24px" }}>
                            <h2 style={{ fontSize: "22px", fontWeight: 600, color: "#333" }}>Admin</h2>
                            <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
                                Manage mentors and batch assignments
                            </p>
                        </div>
                        <AdminPage initialMentors={mentors} initialBatches={batches} />
                    </main>
                </div>
            </div>
        </div>
    );
}
