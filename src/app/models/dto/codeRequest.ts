import { Languages } from "../enums/languages";

export class CodeRequest{
    code: String;
    language: String;
    timeout: Number;

    constructor(code: String, language: String, timeout: Number){
        this.code = code;
        this.language = language;
        this.timeout = timeout;
    }
}