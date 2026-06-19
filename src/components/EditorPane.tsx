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

export const EditorPane = forwardRef<EditorHandle, Props>(function EditorPane(
  { value, onChange, height = "400px" },
  ref,
) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  useImperativeHandle(ref, () => ({
    async getTranspiledJs(): Promise<string> {
      const editor = editorRef.current;
      if (!editor) return value;

      const model = editor.getModel();
      if (!model) return value;

      try {
        const getWorker = await monacoTs.getTypeScriptWorker();
        const client = await getWorker(model.uri);
        const output = await client.getEmitOutput(model.uri.toString());
        return output.outputFiles[0]?.text ?? value;
      } catch {
        return value;
      }
    },
  }));

  return (
    <Box borderWidth="1px" borderStyle="solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
      <MonacoEditor
        height={height}
        language="typescript"
        value={value}
        theme="vs-dark"
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
          scrollBeyondLastLine: false,
          wordWrap: "on",
          tabSize: 2,
          insertSpaces: true,
          automaticLayout: true,
        }}
      />
    </Box>
  );
});
