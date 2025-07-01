"use client";
import dynamic from "next/dynamic";
import { Intern } from "./page";
import { Observation, Feedback } from "./types";
const BatchPageTab = dynamic(() => import("./BatchPageTab"), {
    ssr: false,
});

const BatchClientSection = (props: { interns: Intern[]; observations: Observation[]; feedbacks: Feedback[] }) => {
    return <BatchPageTab {...props} />
}

export default BatchClientSection;