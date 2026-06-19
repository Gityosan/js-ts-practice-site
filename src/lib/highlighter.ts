import { createHighlighter, type Highlighter } from "shiki";

let _promise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!_promise) {
    _promise = createHighlighter({
      themes: ["github-dark"],
      langs: ["typescript", "javascript", "html", "css"],
    });
  }
  return _promise;
}
