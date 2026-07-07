// Monaco をバンドル同梱で読み込む（既定の CDN ローダーを使わない）。
// 理由: (1) オフライン/隔離環境でも動く (2) COEP: require-corp を有効化すると
// CDN からの読み込みがブロックされるため、セルフホストが必須になる。
import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

// Monaco が言語ごとの Web Worker を取りに来るためのフック。Vite の ?worker で
// ローカルバンドルのワーカーを渡す。
(self as unknown as { MonacoEnvironment: monaco.Environment }).MonacoEnvironment = {
  getWorker(_workerId: string, label: string) {
    switch (label) {
      case "json":
        return new jsonWorker();
      case "css":
      case "scss":
      case "less":
        return new cssWorker();
      case "html":
      case "handlebars":
      case "razor":
        return new htmlWorker();
      case "typescript":
      case "javascript":
        return new tsWorker();
      default:
        return new editorWorker();
    }
  },
};

// @monaco-editor/react に「同梱の monaco を使え」と指示（CDN フェッチを止める）。
loader.config({ monaco });
