import { Box, VStack, HStack, Text, Badge, Spinner } from "@chakra-ui/react";
import type { GraderResult, CaseResult, AssertResult } from "../core/schemas";

type Props = {
  result: GraderResult | null;
  running: boolean;
  error?: string;
};

function isCaseResult(r: CaseResult | AssertResult): r is CaseResult {
  return "output" in r || !("label" in r);
}

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
      <Box p={4} bg="red.50" borderRadius="md" border="1px solid" borderColor="red.200">
        <Text color="red.700" fontFamily="mono" fontSize="sm" whiteSpace="pre-wrap">
          {error}
        </Text>
      </Box>
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
        {result.timedOut && (
          <Badge colorPalette="red" fontSize="sm">
            タイムアウト（無限ループ？）
          </Badge>
        )}
      </HStack>

      {result.schemaError && (
        <Box bg="orange.50" borderRadius="md" p={3} border="1px solid" borderColor="orange.200">
          <Text fontSize="xs" color="orange.700" fontWeight="bold">
            出力の形が違います
          </Text>
          <Text fontSize="xs" color="orange.600" fontFamily="mono">
            {result.schemaError}
          </Text>
        </Box>
      )}

      <VStack align="stretch" gap={2}>
        {result.results.map((r, i) => {
          const isCase = isCaseResult(r);
          return (
            <Box
              key={i}
              p={3}
              borderRadius="md"
              bg={r.passed ? "green.50" : "red.50"}
              border="1px solid"
              borderColor={r.passed ? "green.200" : "red.200"}
            >
              <HStack>
                <Text fontSize="lg">{r.passed ? "○" : "×"}</Text>
                <Text fontSize="sm" color={r.passed ? "green.700" : "red.700"}>
                  {isCase
                    ? `ケース ${r.index + 1}`
                    : (r as AssertResult).label}
                </Text>
              </HStack>
              {!r.passed && r.error && (
                <Text fontSize="xs" fontFamily="mono" color="red.600" mt={1} ml={7}>
                  {r.error}
                </Text>
              )}
              {!r.passed && isCase && (r as CaseResult).output !== undefined && (
                <Text fontSize="xs" fontFamily="mono" color="red.600" mt={1} ml={7}>
                  実行結果: {JSON.stringify((r as CaseResult).output)}
                </Text>
              )}
            </Box>
          );
        })}
      </VStack>

      {allPassed && (
        <Box bg="green.100" borderRadius="md" p={4} textAlign="center">
          <Text fontSize="lg">🎉 全問正解！</Text>
          <Text fontSize="sm" color="green.700" mt={1}>
            どんな解き方でも正解。自分のやり方を信じよう。
          </Text>
        </Box>
      )}
    </VStack>
  );
}
