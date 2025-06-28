import { ReactNode } from "react";
import "./skeleton.css";

type SkeletonProps = {
    width?: string;
    height?: string;
    className?: string;
    children?: ReactNode;
};

export const Skeleton = (props: SkeletonProps) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const style: any = {};
    if (props.width) style.width = props.width;
    if (props.height) style.height = props.height;

    return <div
        className={`skeleton ${props.className ? props.className : ""}`}
        style={style}>
        {props.children ? props.children : <></>}
    </div>;
};