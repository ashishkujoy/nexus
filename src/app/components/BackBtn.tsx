import { MoveLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const BackBtn = () => {
    const router = useRouter();
    const path = usePathname();

    const goBack = () => {
        if (path.includes("/intern/")) {
            const batchId = path.split("/")[2];
            router.push(`/batch/${batchId}`);
            return;
        }

        router.push("/");
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