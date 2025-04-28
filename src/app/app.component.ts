import { Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { MonacoService } from './services/editor/monaco.service';
import { Languages } from './models/enums/languages';
import { LanguageService } from './services/language/language.service';

// @ts-ignore
import { conf as javaConf, language as javaLanguage } from 'monaco-editor/esm/vs/basic-languages/java/java';


@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Just Code';
  languages : string[] = [];
  selectedLanguage: string = Object.values(Languages)[0]; //select the first value as default
  boilerPlateCode: string = '';

  constructor(private monacoService: MonacoService, private el: ElementRef, private languageService: LanguageService) {
    this.languages = Object.values(Languages);
    this.setBoilerPlateCode();
  }

  async ngOnInit(){
    if (typeof window !== 'undefined') {
      const monaco = await import('monaco-editor');
      
      monaco.languages.register({ id: 'java' });
      monaco.languages.setLanguageConfiguration('java', javaConf);
      monaco.languages.setMonarchTokensProvider('java', javaLanguage);

      monaco.editor.create(this.el.nativeElement.querySelector("#editorContainer"), {
        value: this.boilerPlateCode,
        language: this.selectedLanguage.toLowerCase(),
        theme: 'vs-dark',
        fontSize: 20
      });
    }
  }

  onLanguageChange(event: Event){
    this.selectedLanguage = (event.target as HTMLSelectElement).value;
    this.setBoilerPlateCode();
  }

  private setBoilerPlateCode(){
    this.boilerPlateCode = this.languageService.getBoilerPlate(this.selectedLanguage);
  }

}
