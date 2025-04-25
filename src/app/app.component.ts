import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as monaco from 'monaco-editor';
import { MonacoService } from './services/monaco.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Just Code';

  constructor(private monacoService: MonacoService, private el: ElementRef) {}

  async ngOnInit(){
    if (typeof window !== 'undefined') {
      const monaco = await import('monaco-editor');
      monaco.editor.create(this.el.nativeElement.querySelector("#editorContainer"), {
        value: '// Code here',
        language: 'javascript',
        theme: 'vs-dark',
        fontSize: 20
      });
    }
  }

}
