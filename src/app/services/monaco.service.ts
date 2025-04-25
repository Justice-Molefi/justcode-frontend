import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MonacoService {
  constructor() {
    if (typeof window !== "undefined") {
        this.setupMonacoWorkers();
     }
  }

  private setupMonacoWorkers() {
    const win = window as any;
    
    //Worker configuration
    win.MonacoEnvironment = {
      getWorker: (workerId: string, label: string) => {
        const workerMap = {
          json: 'language/json/json.worker.js',
          css: 'language/css/css.worker.js',
          scss: 'language/css/css.worker.js',
          less: 'language/css/css.worker.js',
          html: 'language/html/html.worker.js',
          handlebars: 'language/html/html.worker.js',
          razor: 'language/html/html.worker.js',
          typescript: 'language/typescript/ts.worker.js',
          javascript: 'language/typescript/ts.worker.js',
          default: 'editor/editor.worker.js',
        };

        const workerName = workerMap[label as keyof typeof workerMap] || workerMap.default;
        const workerUrl = new URL(
          `/assets/monaco/vs/${workerName}`,
          window.location.href
        );

        return new Worker(workerUrl, { type: 'module' });
      }
    };
  }
}