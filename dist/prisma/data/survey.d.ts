declare const _default: ({
    id: string;
    question: string;
    surveyOrder: number;
    response: string[];
} | {
    id: string;
    question: string;
    surveyOrder: number;
    response: {
        status: string[];
        vaccine: string[];
        secondDoseSchedule: string;
        awaitingSchedule: string;
        iOptNotToGetVaccinated: boolean;
    };
})[];
export default _default;
