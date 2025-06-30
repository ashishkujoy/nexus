export type Observation = {
    id: number;
    internName: string;
    mentorName: string;
    date: Date;
    content: string;
    watchout: boolean;
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

export type Permissions = {
    recordObservation: boolean;
    recordFeedback: boolean;
    programManager: boolean;
}
