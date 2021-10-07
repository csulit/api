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
        fullyVaccinated: {
            options: string[];
        };
        firstDoseDone: {
            options: string[];
        };
    };
})[];
export default _default;
