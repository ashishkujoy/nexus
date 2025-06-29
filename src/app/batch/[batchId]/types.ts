export type Observation = {
    id: number;
    internName: string;
    mentorName: string;
    date: Date;
    content: string;
}

export type Feedback = {
    id: number;
    internName: string;
    mentorName: string;
    date: Date;
    content: string;
    notice: boolean;
    delivered: boolean;
    colorCode?: string;
}
