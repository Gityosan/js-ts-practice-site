import { useEffect, useMemo, useState } from "react";
import { Box, Text, VStack, HStack, Button } from "@chakra-ui/react";
import { AnimatePresence, motion } from "motion/react";
import type { Quiz } from "../core/schemas";

const MotionDiv = motion.create(
  "div" as unknown as React.ComponentType<React.HTMLAttributes<HTMLDivElement>>,
);

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 選択式クイズのリスト。全問正解で onComplete を呼び、クリア表示を出す。
 * decode（解読）と learn（知る）で共有。
 */
export function QuizList({
  quiz,
  heading,
  clearedLabel,
  onComplete,
}: {
  quiz: Quiz[];
  heading: string;
  clearedLabel: string;
  onComplete?: () => void;
}) {
  // 一度正解した設問はラッチ（その後選び直しても解除しない）
  const [solved, setSolved] = useState<boolean[]>(() => quiz.map(() => false));
  const allCleared = quiz.length > 0 && solved.every(Boolean);

  useEffect(() => {
    if (allCleared) onComplete?.();
  }, [allCleared, onComplete]);

  if (quiz.length === 0) return null;

  return (
    <VStack align="stretch" gap={3}>
      <Text fontSize="sm" fontWeight="bold" color="gray.600">
        {heading}
      </Text>
      {quiz.map((q, i) => (
        <QuizCard
          key={i}
          index={i}
          quiz={q}
          onCorrect={() =>
            setSolved((prev) => (prev[i] ? prev : prev.map((v, j) => (j === i ? true : v))))
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
            {clearedLabel}
          </Text>
        </Box>
      )}
    </VStack>
  );
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
    <Box borderWidth="1px" borderStyle="solid" borderColor="gray.200" borderRadius="md" p={4} bg="white">
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
          const palette = picked == null ? "gray" : isAnswer ? "green" : isPicked ? "red" : "gray";
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
