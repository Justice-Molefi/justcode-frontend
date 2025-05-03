import { UUID } from "node:crypto";
import { Languages } from "../enums/languages";

export class CodeRequest{
    code: string;
    language: string;
    timeout: Number;
    uuid: string | null;

    constructor(code: string, language: string, timeout: Number, id: string | null){
        this.code = code;
        this.language = language;
        this.timeout = timeout;
        this.uuid = id;
    }
}