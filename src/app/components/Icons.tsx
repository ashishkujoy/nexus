export const InternIcon = () => {
    return (
        <svg width="20" height="20" fill="#1976d2" viewBox="0 0 20 20">
            <path
                d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
    )
}

export const ObservationIcon = () => {
    return (
        <svg width="20" height="20" fill="#1976d2" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
}

export const FeedbackIcon = () => {
    return (
        <svg width="20" height="20" fill="#2e7d32" viewBox="0 0 20 20">
            <path
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
    )
}

export const PlusIcon = () => {
    return (
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L12 22M2 12L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}

export const NoticeIcon = (props: { width?: number; heigth?: number; }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const size: any = {};
    if (props.width) (size.width = props.width);
    if (props.heigth) (size.height = props.heigth);

    return (
        <svg className="notice-icon" viewBox="0 0 24 24" {...size} fill="red">
            <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" />
        </svg>
    )
}

export const TerminateIcon = () => {
    return (
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    )
}