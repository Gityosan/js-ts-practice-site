import { useEffect, useMemo, useState } from "react";
import { Box, Text, VStack, HStack, Button } from "@chakra-ui/react";
import { AnimatePresence, motion } from "motion/react";
import {
  tokenize,
  matchBrackets,
  explainToken,
  type Token,
  type TokenType,
} from "../lib/tokenize";
import type { Decode } from "../core/schemas";

const MotionDiv = motion.create(
  "div" as unknown as React.ComponentType<React.HTMLAttributes<HTMLDivElement>>,
);

// VS Code Dark+ 風。紫=予約語(構造)、水色=自分の名前 の対比を最優先で見せる。
const COLOR: Record<TokenType, string> = {
  keyword: "#c586c0",
  type: "#4ec9b0",
  identifier: "#9cdcfe",
  string: "#ce9178",
  number: "#b5cea8",
  comment: "#6a9955",
  operator: "#d4d4d4",
  punct: "#d4d4d4",
  bracket: "#ffd700",
  whitespace: "inherit",
};

const LEGEND: { label: string; color: string; note: string }[] = [
  { label: "予約語", color: COLOR.keyword, note: "有限・構造を作る言葉" },
  { label: "自分の名前", color: COLOR.identifier, note: "無限・意味を運ぶ" },
  { label: "括弧", color: COLOR.bracket, note: "クリックで相方が光る" },
  { label: "型注釈", color: COLOR.type, note: "飾り・読み飛ばしてOK" },
  { label: "文字列/数値", color: COLOR.string, note: "そのままのデータ" },
];

export function DecodePane({
  decode,
  onComplete,
}: {
  decode: Decode;
  onComplete?: () => void;
}) {
  const tokens = useMemo(() => tokenize(decode.code), [decode.code]);
  const pairs = useMemo(() => matchBrackets(tokens), [tokens]);
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  // クイズ全問正解で「解読クリア」とみなす（一度正解したらラッチ）
  const [solvedQuiz, setSolvedQuiz] = useState<boolean[]>(() => decode.quiz.map(() => false));
  const allCleared = decode.quiz.length > 0 && solvedQuiz.every(Boolean);

  useEffect(() => {
    if (allCleared) onComplete?.();
  }, [allCleared, onComplete]);

  const partnerOf = (idx: number | null) =>
    idx != null && pairs.has(idx) ? pairs.get(idx)! : null;
  const activePair = new Set<number>(
    [selected, partnerOf(selected), hovered, partnerOf(hovered)].filter(
      (x): x is number => x != null,
    ),
  );

  const explain = selected != null ? explainToken(tokens, selected) : null;
  const selectedTok = selected != null ? tokens[selected] : null;

  return (
    <VStack align="stretch" gap={4}>
      {/* 凡例 */}
      <HStack wrap="wrap" gap={3}>
        {LEGEND.map((l) => (
          <HStack key={l.label} gap={1.5}>
            <Box w="12px" h="12px" borderRadius="3px" bg={l.color} flexShrink={0} />
            <Text fontSize="xs" color="gray.600">
              <Box as="span" fontWeight="bold">
                {l.label}
              </Box>
              <Box as="span" color="gray.400">
                {" "}
                {l.note}
              </Box>
            </Text>
          </HStack>
        ))}
      </HStack>

      {/* コード本体（クリックで分解） */}
      <Box
        bg="#1e1e1e"
        borderRadius="md"
        p={4}
        overflowX="auto"
        fontFamily="mono"
        fontSize="md"
        lineHeight="2"
      >
        <Box as="pre" m={0} whiteSpace="pre">
          {tokens.map((t) => (
            <TokenSpan
              key={t.index}
              token={t}
              selected={selected === t.index}
              inPair={activePair.has(t.index)}
              onSelect={() => setSelected(t.index === selected ? null : t.index)}
              onHover={(on) => setHovered(on ? t.index : null)}
            />
          ))}
        </Box>
      </Box>

      <Text fontSize="xs" color="gray.500">
        コードの言葉をクリックすると、その役割が下に出る。括弧をクリックすると相方の括弧が光る。
      </Text>

      {/* 説明パネル */}
      <Box minH="84px">
        <AnimatePresence mode="wait">
          {explain && selectedTok ? (
            <MotionDiv
              key={selected}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <Box
                bg="white"
                borderWidth="1px"
                borderStyle="solid"
                borderColor="gray.200"
                borderRadius="md"
                p={4}
              >
                <HStack gap={2} mb={1}>
                  <Box
                    as="code"
                    px={2}
                    py={0.5}
                    borderRadius="sm"
                    bg="#1e1e1e"
                    color={COLOR[selectedTok.type]}
                    fontFamily="mono"
                    fontWeight="bold"
                  >
                    {selectedTok.value.trim() || selectedTok.value}
                  </Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.700">
                    {explain.category}
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600" lineHeight="1.7">
                  {explain.detail}
                </Text>
              </Box>
            </MotionDiv>
          ) : (
            <MotionDiv
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box
                borderWidth="1px"
                borderStyle="dashed"
                borderColor="gray.200"
                borderRadius="md"
                p={4}
                textAlign="center"
              >
                <Text fontSize="sm" color="gray.400">
                  ↑ コードの言葉をクリックしてみよう
                </Text>
              </Box>
            </MotionDiv>
          )}
        </AnimatePresence>
      </Box>

      {/* クイズ */}
      {decode.quiz.length > 0 && (
        <VStack align="stretch" gap={3} pt={2}>
          <Text fontSize="sm" fontWeight="bold" color="gray.600">
            読めたか確認しよう
          </Text>
          {decode.quiz.map((q, i) => (
            <QuizCard
              key={i}
              index={i}
              quiz={q}
              onCorrect={() =>
                setSolvedQuiz((prev) => (prev[i] ? prev : prev.map((v, j) => (j === i ? true : v))))
              }
            />
          ))}
          {allCleared && (
            <Box
              bg="green.50"
              borderWidth="1px"
              borderStyle="solid"
              borderColor="green.300"
              borderRadius="md"
              p={3}
              textAlign="center"
            >
              <Text fontSize="sm" fontWeight="bold" color="green.700">
                ✓ 解読クリア！全問正解
              </Text>
            </Box>
          )}
        </VStack>
      )}
    </VStack>
  );
}

function TokenSpan({
  token,
  selected,
  inPair,
  onSelect,
  onHover,
}: {
  token: Token;
  selected: boolean;
  inPair: boolean;
  onSelect: () => void;
  onHover: (on: boolean) => void;
}) {
  if (token.type === "whitespace") {
    return <span>{token.value}</span>;
  }
  const clickable = true;
  return (
    <Box
      as="span"
      color={COLOR[token.type]}
      cursor={clickable ? "pointer" : "default"}
      borderRadius="3px"
      px={inPair || selected ? "2px" : 0}
      mx={inPair || selected ? "-2px" : 0}
      bg={selected ? "rgba(255,215,0,0.28)" : inPair ? "rgba(255,215,0,0.16)" : "transparent"}
      outline={selected ? "1px solid rgba(255,215,0,0.6)" : "none"}
      transition="background 0.12s"
      _hover={{ bg: "rgba(255,255,255,0.10)" }}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {token.value}
    </Box>
  );
}

type Quiz = Decode["quiz"][number];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function QuizCard({
  quiz,
  index,
  onCorrect,
}: {
  quiz: Quiz;
  index: number;
  onCorrect?: () => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const correct = picked === quiz.answer;
  // 正解が常に先頭だと答えが透けるので、表示順をシャッフル（採点は値で判定）
  const choices = useMemo(() => shuffleArray(quiz.choices), [quiz]);

  useEffect(() => {
    if (correct) onCorrect?.();
  }, [correct, onCorrect]);

  return (
    <Box
      borderWidth="1px"
      borderStyle="solid"
      borderColor="gray.200"
      borderRadius="md"
      p={4}
      bg="white"
    >
      <Text fontSize="sm" color="gray.700" mb={quiz.snippet ? 2 : 3} fontWeight="medium">
        Q{index + 1}. {quiz.prompt}
      </Text>
      {quiz.snippet && (
        <Box
          as="pre"
          bg="#1e1e1e"
          color="#d4d4d4"
          borderRadius="md"
          px={3}
          py={2}
          mb={3}
          fontFamily="mono"
          fontSize="sm"
          overflowX="auto"
        >
          {quiz.snippet}
        </Box>
      )}
      <HStack wrap="wrap" gap={2}>
        {choices.map((choice) => {
          const isPicked = picked === choice;
          const isAnswer = choice === quiz.answer;
          const palette =
            picked == null ? "gray" : isAnswer ? "green" : isPicked ? "red" : "gray";
          return (
            <Button
              key={choice}
              size="sm"
              variant={isPicked ? "solid" : "outline"}
              colorPalette={palette}
              onClick={() => setPicked(choice)}
            >
              {choice}
            </Button>
          );
        })}
      </HStack>
      <AnimatePresence>
        {picked != null && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <Box
              mt={3}
              p={3}
              borderRadius="md"
              bg={correct ? "green.50" : "orange.50"}
              borderWidth="1px"
              borderStyle="solid"
              borderColor={correct ? "green.200" : "orange.200"}
            >
              <Text fontSize="sm" fontWeight="bold" color={correct ? "green.700" : "orange.700"} mb={1}>
                {correct ? "○ 正解！" : "もう一度考えてみよう"}
              </Text>
              <Text fontSize="sm" color="gray.700" lineHeight="1.7">
                {quiz.explain}
              </Text>
            </Box>
          </MotionDiv>
        )}
      </AnimatePresence>
    </Box>
  );
}
