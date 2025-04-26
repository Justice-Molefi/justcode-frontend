import { Injectable } from "@angular/core";
import { Languages } from "../../models/enums/languages";


@Injectable({
    providedIn: 'root'
  })
  export class LanguageService {
  
    private boilerplateMap: Record<string, string> = {
      [Languages.Java]: 'public class Main {\n  public static void main(String[] args) {\n    // Your code here\n  }\n}',
    }
    constructor() { }
  
    getBoilerPlate(language: string): string{
      return this.boilerplateMap[language] || '';
    }
  }