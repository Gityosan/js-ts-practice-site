import { useState, useCallback, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Separator,
} from "@chakra-ui/react";
import { getProblemById } from "../problems";
import { runGrader } from "../core/grader";
import { EditorPane, type EditorHandle } from "../components/EditorPane";
import { ResultPanel } from "../components/ResultPanel";
import type { GradeResult } from "../grade/types";
import { problemRoute } from "../router";

const stageLabel: Record<string, string> = {
  read: "読む",
  tweak: "いじる",
  fill: "埋める",
  write: "書く",
};

const stageColor: Record<string, string> = {
  read: "blue",
  tweak: "purple",
  fill: "orange",
  write: "red",
};

export function ProblemPage() {
  const { id } = problemRoute.useParams();
  const navigate = useNavigate();
  const problem = getProblemById(id);

  const [code, setCode] = useState(problem?.initialCode ?? "");
  const [result, setResult] = useState<GradeResult | null>(null);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | undefined>();
  const editorRef = useRef<EditorHandle>(null);

  const handleRun = useCallback(async () => {
    if (!problem) return;
    setRunning(true);
    setResult(null);
    setRunError(undefined);
    try {
      const jsCode = (await editorRef.current?.getTranspiledJs()) ?? code;
      const r = await runGrader(problem.id, jsCode);
      setResult(r);
    } catch (e: unknown) {
      setRunError((e as Error).message);
    } finally {
      setRunning(false);
    }
  }, [problem, code]);

  const handleReset = useCallback(() => {
    if (!problem) return;
    setCode(problem.initialCode);
    setResult(null);
    setRunError(undefined);
  }, [problem]);

  if (!problem) {
    return (
      <Container maxW="container.md" py={20} textAlign="center">
        <Text color="gray.500">問題が見つかりません: {id}</Text>
        <Button mt={4} onClick={() => navigate({ to: "/" })}>
          一覧に戻る
        </Button>
      </Container>
    );
  }

  return (
    <Box bg="gray.50" minH="calc(100vh - 56px)">
      <Container maxW="container.xl" py={6}>
        <VStack align="stretch" gap={5}>
          {/* Header */}
          <HStack justify="space-between" wrap="wrap" gap={2}>
            <HStack gap={2}>
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/" })}>
                ← 一覧
              </Button>
              <Badge colorPalette={stageColor[problem.stage]}>{stageLabel[problem.stage]}</Badge>
              <Badge colorPalette="gray">{problem.scenario}</Badge>
            </HStack>
          </HStack>

          {/* Main 3-column layout */}
          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", lg: "340px 1fr 300px" }}
            gap={5}
            alignItems="start"
          >
            {/* Left: Problem description */}
            <Box bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" p={5} minWidth="0">
              <VStack align="stretch" gap={3}>
                <Heading size="md" color="gray.800" wordBreak="break-word">
                  {problem.copy.title}
                </Heading>
                <Separator />
                <Box
                  fontSize="sm"
                  color="gray.700"
                  lineHeight="1.8"
                  overflowWrap="break-word"
                  wordBreak="break-word"
                  css={{
                    "& h2": {
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      marginTop: "12px",
                      marginBottom: "4px",
                    },
                    "& code": {
                      background: "#f3f4f6",
                      borderRadius: "3px",
                      padding: "0 4px",
                      fontFamily: "monospace",
                      fontSize: "0.85em",
                    },
                    "& pre": {
                      background: "#1e1e1e",
                      color: "#d4d4d4",
                      borderRadius: "6px",
                      padding: "10px",
                      overflow: "auto",
                      fontSize: "0.8rem",
                    },
                    "& ul": { paddingLeft: "20px" },
                    "& p": { margin: "4px 0" },
                    "& table": {
                      borderCollapse: "collapse",
                      width: "100%",
                      marginTop: "8px",
                      marginBottom: "8px",
                      fontSize: "0.8rem",
                    },
                    "& th, & td": {
                      border: "1px solid #e2e8f0",
                      padding: "4px 8px",
                      textAlign: "left",
                    },
                    "& th": {
                      background: "#f8fafc",
                      fontWeight: "bold",
                    },
                  }}
                >
                  <MarkdownLite source={problem.copy.prompt} />
                </Box>
                {problem.copy.hints.length > 0 && (
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2}>
                      ヒント（クリックで開く）
                    </Text>
                    <VStack align="stretch" gap={2}>
                      {problem.copy.hints.map((h, i) => (
                        <HintBox key={i} hint={h} index={i} />
                      ))}
                    </VStack>
                  </Box>
                )}
              </VStack>
            </Box>

            {/* Center: Editor */}
            <Box>
              <VStack align="stretch" gap={3}>
                <EditorPane ref={editorRef} value={code} onChange={setCode} height="420px" />
                <HStack gap={3}>
                  <Button
                    colorPalette="blue"
                    onClick={handleRun}
                    disabled={running}
                    flex={1}
                    fontFamily="mono"
                  >
                    ▶ 実行
                  </Button>
                  <Button variant="outline" onClick={handleReset} disabled={running}>
                    リセット
                  </Button>
                </HStack>
              </VStack>
            </Box>

            {/* Right: Results */}
            <Box
              bg="white"
              borderRadius="lg"
              border="1px solid"
              borderColor="gray.200"
              minH="200px"
            >
              <Box p={3} borderBottom="1px solid" borderColor="gray.100">
                <Text fontSize="sm" fontWeight="bold" color="gray.600">
                  採点結果
                </Text>
              </Box>
              <ResultPanel result={result} running={running} error={runError} />
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

function parseTableRow(line: string): string[] {
  return line
    .split("|")
    .slice(1, -1)
    .map((c) => c.trim());
}

function isTableSeparator(line: string): boolean {
  return /^\|[\s|:-]+\|$/.test(line.trim());
}

function MarkdownLite({ source }: { source: string }) {
  const lines = source.split("\n");
  const elements: React.ReactNode[] = [];
  let inCode = false;
  let codeLines: string[] = [];
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCode) {
        elements.push(
          <pre key={key++}>
            <code>{codeLines.join("\n")}</code>
          </pre>,
        );
        codeLines = [];
        inCode = false;
      } else {
        inCode = true;
      }
      i++;
      continue;
    }
    if (inCode) {
      codeLines.push(line);
      i++;
      continue;
    }

    // Table: collect all consecutive | lines
    if (line.trimStart().startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      // find separator row index
      const sepIdx = tableLines.findIndex(isTableSeparator);
      const headerLines = sepIdx > 0 ? tableLines.slice(0, sepIdx) : tableLines.slice(0, 1);
      const bodyLines = sepIdx >= 0 ? tableLines.slice(sepIdx + 1) : tableLines.slice(1);
      elements.push(
        <table key={key++}>
          {headerLines.length > 0 && (
            <thead>
              {headerLines.map((hl, ri) => (
                <tr key={ri}>
                  {parseTableRow(hl).map((cell, ci) => (
                    <th key={ci}>{renderInline(cell)}</th>
                  ))}
                </tr>
              ))}
            </thead>
          )}
          {bodyLines.length > 0 && (
            <tbody>
              {bodyLines.map((bl, ri) => (
                <tr key={ri}>
                  {parseTableRow(bl).map((cell, ci) => (
                    <td key={ci}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>,
      );
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++}>{line.slice(3)}</h2>);
    } else if (line.startsWith("- ")) {
      elements.push(
        <ul key={key++}>
          <li>{renderInline(line.slice(2))}</li>
        </ul>,
      );
    } else if (line.trim() === "") {
      elements.push(<br key={key++} />);
    } else {
      elements.push(<p key={key++}>{renderInline(line)}</p>);
    }
    i++;
  }

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? <code key={i}>{part.slice(1, -1)}</code> : part,
  );
}

function HintBox({ hint, index }: { hint: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Box
      border="1px solid"
      borderColor="blue.100"
      borderRadius="md"
      overflow="hidden"
      fontSize="xs"
    >
      <Box
        p={2}
        bg="blue.50"
        cursor="pointer"
        onClick={() => setOpen((v) => !v)}
        _hover={{ bg: "blue.100" }}
      >
        <Text color="blue.700">
          {open ? "▼" : "▶"} ヒント {index + 1}
        </Text>
      </Box>
      {open && (
        <Box p={2} color="gray.700">
          {renderInline(hint)}
        </Box>
      )}
    </Box>
  );
}
