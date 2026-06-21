import { useState, useCallback, useRef, useEffect } from "react";
import { getHighlighter } from "../lib/highlighter";
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
import { AnimatePresence, motion } from "motion/react";
import { getProblemById, allProblems } from "../problems";
import { runGrader } from "../core/grader";
import { EditorPane, type EditorHandle } from "../components/EditorPane";
import { TweakPane } from "../components/TweakPane";
import { DecodePane } from "../components/DecodePane";
import { ResultPanel } from "../components/ResultPanel";
import { VisualOutput, ScenarioVisual } from "../components/VisualOutput";
import type { GradeResult } from "../grade/types";
import { problemRoute } from "../router";
import { markSolved } from "../lib/progress";

const MotionButton = motion.create(Button);
const MotionDiv = motion.create(
  "div" as unknown as React.ComponentType<React.HTMLAttributes<HTMLDivElement>>,
);

const stageLabel: Record<string, string> = {
  decode: "解読",
  read: "読む",
  tweak: "いじる",
  fill: "埋める",
  write: "書く",
};

const stageColor: Record<string, string> = {
  decode: "pink",
  read: "cyan",
  tweak: "indigo",
  fill: "teal",
  write: "purple",
};

export function ProblemPage() {
  const { id } = problemRoute.useParams();
  const navigate = useNavigate();
  const problem = getProblemById(id);

  const isTweak = problem?.stage === "tweak" && !!problem.tweak;
  const isDecode = problem?.stage === "decode" && !!problem.decode;

  const currentIndex = allProblems.findIndex((p) => p.id === id);
  const prevProblem = currentIndex > 0 ? allProblems[currentIndex - 1] : null;
  const nextProblem = currentIndex < allProblems.length - 1 ? allProblems[currentIndex + 1] : null;

  const [code, setCode] = useState(problem?.initialCode ?? "");
  const [tweakCode, setTweakCode] = useState("");
  const [tweakResetKey, setTweakResetKey] = useState(0);
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
      let jsCode: string;
      if (isTweak) {
        if (tweakCode.includes("___")) {
          setRunError("すべての空欄を埋めてから実行してね。");
          return;
        }
        jsCode = tweakCode;
      } else {
        jsCode = (await editorRef.current?.getTranspiledJs()) ?? code;
      }
      const r = await runGrader(problem.id, jsCode);
      setResult(r);
    } catch (e: unknown) {
      setRunError((e as Error).message);
    } finally {
      setRunning(false);
    }
  }, [problem, code, isTweak, tweakCode]);

  useEffect(() => {
    if (result && result.passed === result.total && result.total > 0) {
      markSolved(problem!.id);
    }
  }, [result, problem]);

  const handleDecodeComplete = useCallback(() => {
    if (problem) markSolved(problem.id);
  }, [problem]);

  const handleReset = useCallback(() => {
    if (!problem) return;
    setCode(problem.initialCode);
    setResult(null);
    setRunError(undefined);
    if (isTweak) setTweakResetKey((k) => k + 1);
  }, [problem, isTweak]);

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
            </HStack>
            <HStack gap={2}>
              <Button
                variant="outline"
                size="sm"
                disabled={!prevProblem}
                onClick={() => prevProblem && navigate({ to: "/problem/$id", params: { id: prevProblem.id } })}
              >
                ← 前へ
              </Button>
              <Text fontSize="xs" color="gray.400" minW="max-content">
                {currentIndex + 1} / {allProblems.length}
              </Text>
              <Button
                variant="outline"
                size="sm"
                disabled={!nextProblem}
                onClick={() => nextProblem && navigate({ to: "/problem/$id", params: { id: nextProblem.id } })}
              >
                次へ →
              </Button>
            </HStack>
          </HStack>

          {/* Main 2-column layout: 3:7 */}
          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", lg: "3fr 7fr" }}
            gap={5}
            alignItems="start"
          >
            {/* Left: Problem description */}
            <Box
              bg="white"
              borderRadius="lg"
              borderWidth="1px"
              borderStyle="solid"
              borderColor="gray.200"
              p={5}
              minWidth="0"
            >
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
                    "& strong": { fontWeight: "bold" },
                    "& code": {
                      background: "#eaf0f8",
                      borderRadius: "3px",
                      padding: "0 4px",
                      fontFamily: "monospace",
                      fontSize: "0.85em",
                    },
                    "& pre": {
                      background: "#1e1e1e",
                      color: "#d4d4d4",
                      borderRadius: "6px",
                      padding: "10px 12px",
                      overflow: "auto",
                      fontSize: "0.8rem",
                      lineHeight: "1.6",
                    },
                    "& pre code": {
                      background: "transparent",
                      padding: 0,
                      fontSize: "inherit",
                      color: "inherit",
                      borderRadius: 0,
                    },
                    "& .shiki": {
                      borderRadius: "6px",
                      padding: "10px 12px",
                      overflow: "auto",
                      fontSize: "0.8rem",
                      lineHeight: "1.6",
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

            {/* Right: Editor + Results stacked (decode は実行せず解読UIのみ) */}
            <VStack align="stretch" gap={3}>
              {isDecode ? (
                <Box
                  bg="white"
                  borderRadius="md"
                  borderWidth="1px"
                  borderStyle="solid"
                  borderColor="gray.200"
                  p={5}
                >
                  <DecodePane decode={problem.decode!} onComplete={handleDecodeComplete} />
                </Box>
              ) : (
                <>
              {isTweak ? (
                <Box
                  bg="white"
                  borderRadius="md"
                  borderWidth="1px"
                  borderStyle="solid"
                  borderColor="gray.200"
                  p={4}
                  minH="420px"
                >
                  <TweakPane
                    key={tweakResetKey}
                    tweak={problem.tweak!}
                    onChange={setTweakCode}
                  />
                </Box>
              ) : (
                <EditorPane ref={editorRef} value={code} onChange={setCode} height="420px" />
              )}

              <HStack gap={3}>
                <MotionButton
                  colorPalette="blue"
                  onClick={handleRun}
                  disabled={running}
                  flex={1}
                  fontFamily="mono"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                >
                  ▶ 実行
                </MotionButton>
                <Button variant="outline" onClick={handleReset} disabled={running}>
                  {isTweak ? "シャッフル" : "リセット"}
                </Button>
              </HStack>

              {problem.stage === "read" && result?.results[0]?.output !== undefined && (
                <Box
                  bg="white"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderStyle="solid"
                  borderColor="gray.200"
                  overflow="hidden"
                >
                  <Box p={3} borderBottomWidth="1px" borderBottomStyle="solid" borderColor="gray.100">
                    <Text fontSize="sm" fontWeight="bold" color="gray.600">
                      出力プレビュー
                    </Text>
                  </Box>
                  <Box p={3}>
                    <VisualOutput problemId={problem.id} output={result.results[0].output} />
                  </Box>
                </Box>
              )}

              {/* scenario の視覚出力（data/gas/email/chrome）。読み終わったら採点結果へ */}
              {result?.visual && (
                <Box
                  bg="gray.50"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderStyle="solid"
                  borderColor="gray.200"
                  overflow="hidden"
                >
                  <Box p={3} borderBottomWidth="1px" borderBottomStyle="solid" borderColor="gray.100">
                    <Text fontSize="sm" fontWeight="bold" color="gray.600">
                      実行結果
                    </Text>
                  </Box>
                  <Box p={4} display="flex" justifyContent="center">
                    <ScenarioVisual state={result.visual} />
                  </Box>
                </Box>
              )}

              <Box
                bg="white"
                borderRadius="lg"
                borderWidth="1px"
                borderStyle="solid"
                borderColor="gray.200"
                minH="120px"
              >
                <Box p={3} borderBottomWidth="1px" borderBottomStyle="solid" borderColor="gray.100">
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">
                    採点結果
                  </Text>
                </Box>
                <ResultPanel result={result} running={running} error={runError} />
              </Box>
                </>
              )}
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

function ShikiBlock({ code, lang }: { code: string; lang: string }) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    getHighlighter().then((h) => {
      const resolvedLang = h.getLoadedLanguages().includes(lang as never) ? lang : "text";
      setHtml(h.codeToHtml(code, { lang: resolvedLang, theme: "github-dark" }));
    });
  }, [code, lang]);

  if (!html) {
    return (
      <pre
        style={{
          background: "#24292e",
          color: "#e1e4e8",
          borderRadius: "6px",
          padding: "10px 12px",
          overflow: "auto",
          fontSize: "0.8rem",
          lineHeight: "1.6",
          margin: "4px 0",
        }}
      >
        <code>{code}</code>
      </pre>
    );
  }
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ margin: "4px 0" }}
    />
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
  let codeLang = "text";
  let key = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCode) {
        elements.push(<ShikiBlock key={key++} code={codeLines.join("\n")} lang={codeLang} />);
        codeLines = [];
        codeLang = "text";
        inCode = false;
      } else {
        codeLang = line.slice(3).trim() || "text";
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
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    return part;
  });
}

function HintBox({ hint, index }: { hint: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Box borderWidth="1px" borderStyle="solid" borderColor="blue.100" borderRadius="md" overflow="hidden" fontSize="xs">
      <Box
        p={2}
        bg="blue.50"
        cursor="pointer"
        onClick={() => setOpen((v) => !v)}
        _hover={{ bg: "blue.100" }}
        userSelect="none"
      >
        <HStack gap={2}>
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ display: "inline-block", color: "var(--chakra-colors-blue-500)" }}
          >
            ▶
          </motion.span>
          <Text color="blue.700">ヒント {index + 1}</Text>
        </HStack>
      </Box>
      <AnimatePresence initial={false}>
        {open && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <Box p={2} color="gray.700" borderTopWidth="1px" borderTopStyle="solid" borderColor="blue.50">
              {renderInline(hint)}
            </Box>
          </MotionDiv>
        )}
      </AnimatePresence>
    </Box>
  );
}
