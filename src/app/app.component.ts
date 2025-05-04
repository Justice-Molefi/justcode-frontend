import { Component, ElementRef, NgModule, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { MonacoService } from './services/editor/monaco.service';
import { Languages } from './models/enums/languages';
import { LanguageService } from './services/language/language.service';

// @ts-ignore
import { conf as javaConf, language as javaLanguage } from 'monaco-editor/esm/vs/basic-languages/java/java';
import { EditorApiService } from './services/editor/editorApi.service';
import { CodeRequest } from './models/dto/codeRequest';
import { EditorWsService } from './services/editor/editorWs.service';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Just Code';
  languages : string[] = [];
  selectedLanguage: string = Object.values(Languages)[0]; //select the first value as default
  boilerPlateCode: string = '';
  monacoEditorInstance: any;
  codeResults: string = "";
  isCodeExecuting: boolean = false;

  constructor(private monacoService: MonacoService, private el: ElementRef, private languageService: LanguageService, private editorApiService: EditorApiService, private editorWsService: EditorWsService) {
    this.languages = Object.values(Languages);
    this.setBoilerPlateCode();
  }

  async ngOnInit(){
    if (typeof window !== 'undefined') {

      const monaco = await import('monaco-editor');
      monaco.languages.register({ id: 'java' });
      monaco.languages.setLanguageConfiguration('java', javaConf);
      monaco.languages.setMonarchTokensProvider('java', javaLanguage);

      this.monacoEditorInstance = monaco.editor.create(this.el.nativeElement.querySelector("#editorContainer"), {
        language: this.selectedLanguage.toLowerCase(),
        theme: 'vs-dark',
        fontSize: 20
      });

      this.setBoilerPlateCode();
    }
    this.editorWsService.content$.subscribe(result => {
      if(result && this.isCodeExecuting) this.isCodeExecuting = false;
      this.codeResults += result + '\n';
    });
  }

  onLanguageChange(event: Event){
    this.selectedLanguage = (event.target as HTMLSelectElement).value;
    this.setBoilerPlateCode();
  }

  private setBoilerPlateCode(){
    this.boilerPlateCode = this.languageService.getBoilerPlate(this.selectedLanguage);
    this.monacoEditorInstance?.setValue(this.boilerPlateCode);
  }

  runCode(){
    
    if(!this.monacoEditorInstance){
      console.error('Editor Instance is Null');
      return;
    }
    const code: string = this.monacoEditorInstance?.getValue();
    const storedId = localStorage.getItem('id');
    const codeRequest = new CodeRequest(code, this.selectedLanguage, 3, storedId);

    this.codeResults = "";
    this.isCodeExecuting = true;

    this.editorApiService.execute(codeRequest).subscribe({
      next: (val) => {
        this.storeId(val.toString());
        this.editorWsService.connectionStatus$.pipe(
          filter(connected => connected),
          take(1)
        ).subscribe(() => {
          this.editorWsService.subscribe(val.toString());
        });
        
        this.editorWsService.connect();
      },
      error: () => {
        this.isCodeExecuting  = false;
        this.codeResults += "Something went wrong, please come back later!";
        console.error("ERROR ON: Editor API");
      }
    });
  }


  ngOnDestroy(){
    this.editorWsService.disconnect();
  }

  storeId(id: string){
    const storedId = localStorage.getItem('id');
    if(!storedId)
      localStorage.setItem('id', id);
  }
}
