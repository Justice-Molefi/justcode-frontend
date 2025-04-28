import { monaco } from 'monaco-editor';

declare module 'monaco-editor/esm/vs/basic-languages/*' {
  export const conf: monaco.languages.LanguageConfiguration;
  export const language: monaco.languages.IMonarchLanguage;
}