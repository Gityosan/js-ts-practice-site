import { Box, Text, VStack } from "@chakra-ui/react";
import type { CaseResult } from "../grade/types";

/**
 * CLI（jq / シェル）の実行結果を、ケースごとにターミナル風に表示する。
 * 各ケースの実際の標準出力（output）を見せることで「自分のコマンドが何を出したか」を確認できる。
 */
export function CliOutput({ results }: { results: CaseResult[] }) {
  const withOutput = results.filter((r) => typeof r.output === "string");
  if (withOutput.length === 0) return null;

  return (
    <Box
      bg="#1e1e1e"
      borderRadius="lg"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="gray.700"
      overflow="hidden"
    >
      <Box px={4} py={2} borderBottomWidth="1px" borderBottomStyle="solid" borderColor="gray.700">
        <Text fontSize="xs" fontWeight="bold" color="gray.300" fontFamily="mono">
          標準出力（stdout）
        </Text>
      </Box>
      <VStack align="stretch" gap={3} p={4}>
        {withOutput.map((r, i) => {
          const out = r.output as string;
          return (
            <Box key={i}>
              <Text fontSize="xs" color="#6a9955" fontFamily="mono" mb={1}>
                {`# ${r.label}`}
              </Text>
              <Box
                as="pre"
                fontFamily="mono"
                fontSize="sm"
                color="#d4d4d4"
                whiteSpace="pre-wrap"
                wordBreak="break-all"
                overflowX="auto"
              >
                {out === "" ? (
                  <Text as="span" color="gray.500" fontStyle="italic">
                    （出力なし）
                  </Text>
                ) : (
                  out
                )}
              </Box>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
