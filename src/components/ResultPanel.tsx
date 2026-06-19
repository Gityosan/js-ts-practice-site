import { Box, VStack, HStack, Text, Badge, Spinner } from "@chakra-ui/react";
import { motion, AnimatePresence } from "motion/react";
import type { GradeResult } from "../grade/types";

const MotionBox = motion.create(Box);

type Props = {
  result: GradeResult | null;
  running: boolean;
  error?: string;
};

export function ResultPanel({ result, running, error }: Props) {
  if (running) {
    return (
      <Box p={6} display="flex" alignItems="center" gap={3}>
        <Spinner size="sm" color="blue.500" />
        <Text color="gray.600" fontSize="sm">
          実行中…
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <MotionBox
        p={4}
        bg="red.50"
        borderRadius="md"
        border="1px solid"
        borderColor="red.200"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
        transition={{ duration: 0.4 }}
      >
        <Text color="red.700" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
          {error}
        </Text>
      </MotionBox>
    );
  }

  if (!result) {
    return (
      <Box p={6}>
        <Text color="gray.400" fontSize="sm">
          コードを書いて ▶ 実行 を押してみよう
        </Text>
      </Box>
    );
  }

  const allPassed = result.passed === result.total;

  return (
    <VStack align="stretch" gap={3} p={4}>
      <HStack>
        <Badge
          colorPalette={allPassed ? "green" : result.passed > 0 ? "orange" : "red"}
          fontSize="sm"
          px={2}
          py={1}
        >
          {result.passed} / {result.total} 通過
        </Badge>
        {result.status === "timeout" && (
          <Badge colorPalette="red" fontSize="sm">
            タイムアウト（無限ループ？）
          </Badge>
        )}
      </HStack>

      {result.status === "error" && result.error && (
        <Box bg="red.50" borderRadius="md" p={3} border="1px solid" borderColor="red.200">
          <Text fontSize="xs" color="red.700" fontFamily="mono">
            {result.error}
          </Text>
        </Box>
      )}

      <VStack align="stretch" gap={2}>
        {result.results.map((r, i) => (
          <MotionBox
            key={i}
            p={3}
            borderRadius="md"
            bg={r.passed ? "green.50" : "red.50"}
            border="1px solid"
            borderColor={r.passed ? "green.200" : "red.200"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.25 }}
          >
            <HStack>
              <Text fontSize="lg">{r.passed ? "○" : "×"}</Text>
              <Text fontSize="sm" color={r.passed ? "green.700" : "red.700"}>
                {r.label}
              </Text>
            </HStack>
            {!r.passed && r.detail && (
              <Text fontSize="xs" fontFamily="mono" color="red.600" mt={1} ml={7}>
                {r.detail}
              </Text>
            )}
          </MotionBox>
        ))}
      </VStack>

      <AnimatePresence>
        {allPassed && (
          <MotionBox
            bg="green.100"
            borderRadius="md"
            p={4}
            textAlign="center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: result.total * 0.08 + 0.1, type: "spring", stiffness: 260, damping: 18 }}
          >
            <Text fontSize="lg">全問正解！🎉</Text>
            <Text fontSize="sm" color="green.700" mt={1}>
              どんな解き方でも正解。自分のやり方を信じよう。
            </Text>
          </MotionBox>
        )}
      </AnimatePresence>
    </VStack>
  );
}
