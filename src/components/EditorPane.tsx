import { useRef, forwardRef, useImperativeHandle } from "react";
import MonacoEditor from "@monaco-editor/react";
import type * as Monaco from "monaco-editor";
// Monaco 0.55+ で languages.typescript は deprecated -> top-level typescript を使う
import { typescript as monacoTs } from "monaco-editor";
import { Box } from "@chakra-ui/react";

export type EditorHandle = {
  getTranspiledJs: () => Promise<string>;
};

type Props = {
  value: string;
  onChange: (v: string) => void;
  height?: string;
};

/**
 * Lightweight TS→JS stripper for the simple annotation patterns used in this project.
 * Used as a fallback when Monaco's emit output is unavailable.
 */
function fallbackStripTs(src: string): string {
  // Remove type alias / interface declarations (whole line)
  let out = src
    .split("\n")
    .map((line) => (/^\s*(type|interface)\s+\w+/.test(line) ? "" : line))
    .join("\n");
  // Remove "as TypeName" type assertions
  out = out.replace(/\s+as\s+[\w<>[\]]+/g, "");
  // Remove generic type args on calls: .method<Type>( or Constructor<Type>(
  out = out.replace(/([\w])<([\w<>[\] |,]+)>\s*\(/g, "$1(");
  // Remove return type annotation before { or ;
  out = out.replace(/\)\s*:\s*[\w<>[\] |,]+\s*(?=[{;])/g, ")");
  // Remove parameter type annotations: param: Type before , or )
  out = out.replace(/(\b\w+)\s*\??\s*:\s*[\w<>[\] |,]+(?=[,)])/g, "$1");
  return out;
}

export const EditorPane = forwardRef<EditorHandle, Props>(function EditorPane(
  { value, onChange, height = "400px" },
  ref,
) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  useImperativeHandle(ref, () => ({
    async getTranspiledJs(): Promise<string> {
      const editor = editorRef.current;
      const currentCode = editor?.getModel()?.getValue() ?? value;

      if (!editor) return fallbackStripTs(value);

      const model = editor.getModel();
      if (!model) return fallbackStripTs(value);

      try {
        const getWorker = await monacoTs.getTypeScriptWorker();
        const client = await getWorker(model.uri);
        const output = await client.getEmitOutput(model.uri.toString());
        const js = output.outputFiles[0]?.text;
        // If Monaco returned valid JS, use it; otherwise strip TS annotations as fallback
        return js && js.trim() ? js : fallbackStripTs(currentCode);
      } catch {
        return fallbackStripTs(currentCode);
      }
    },
  }));

  return (
    <Box
      borderWidth="1px"
      borderStyle="solid"
      borderColor="gray.200"
      borderRadius="md"
      overflow="hidden"
    >
      <MonacoEditor
        height={height}
        language="typescript"
        value={value}
        theme="vs-dark"
        // path="solve.ts" ensures Monaco registers the model with a .ts URI so the
        // TypeScript language service recognizes it and getEmitOutput produces JS output.
        path="solve.ts"
        onChange={(v) => onChange(v ?? "")}
        onMount={(editor) => {
          editorRef.current = editor;
          monacoTs.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false,
          });
          monacoTs.typescriptDefaults.setCompilerOptions({
            target: monacoTs.ScriptTarget.ES2020,
            allowNonTsExtensions: true,
            strict: false,
            noLib: true,
            lib: [],
          });
        }}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          lineNumbersMinChars: 3,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          tabSize: 2,
          insertSpaces: true,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
        }}
      />
    </Box>
  );
});
