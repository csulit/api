"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    {
        id: 'a467a093-7d39-460e-96cb-1fff56ddcafd',
        question: 'Have you experienced any of the following symptoms in the past 10 days?',
        surveyOrder: 1,
        response: ['Yes', 'No'],
    },
    {
        id: '35d6a913-eb57-4415-a080-85c116165bee',
        question: 'Have you had face-to-face contact with a probable or confirmed COVID-19 for the past 14 days?',
        surveyOrder: 2,
        response: ['Yes', 'No'],
    },
    {
        id: '98e08c82-4c0f-4db9-ae65-7dfceb5c8700',
        question: 'Have you provided direct care for a patient with a probable or confirmed COVID-19 case for the past 14 days?',
        surveyOrder: 3,
        response: ['Yes', 'No'],
    },
    {
        id: 'e61000d7-9313-49d7-8023-82c982ab78e4',
        question: 'May we know your vaccination status?',
        surveyOrder: 4,
        response: {
            fullyVaccinated: {
                options: [
                    'Sinovac',
                    'Astrazeneca',
                    'Moderna',
                    'Pfizer',
                    'BioNTech',
                    'Janssen',
                    'Sputnik',
                    'Novavax',
                    'Others',
                ],
            },
            firstDoseDone: {
                options: [
                    'Sinovac',
                    'Astrazeneca',
                    'Moderna',
                    'Pfizer',
                    'BioNTech',
                    'Janssen',
                    'Sputnik',
                    'Novavax',
                    'Others',
                ],
            },
        },
    },
];
//# sourceMappingURL=survey.js.map