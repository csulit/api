declare class HttpResponse {
    readonly statusCode: number;
    readonly message: string | null;
    readonly error: string;
}
export declare const httpResponse: (data: HttpResponse) => HttpResponse;
export {};
