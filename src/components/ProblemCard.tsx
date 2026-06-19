import { Box, Text, Badge, VStack, HStack } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import type { ProblemMeta } from "../core/schemas";

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

const scenarioLabel: Record<string, string> = {
  data: "データ集計",
  gas: "GAS",
  email: "メール自動化",
  chrome: "Chrome拡張",
};

type Props = { problem: ProblemMeta; solved?: boolean };

export function ProblemCard({ problem, solved = false }: Props) {
  const navigate = useNavigate();

  return (
    <Box
      p={5}
      border="1px solid"
      borderColor={solved ? "green.300" : "gray.200"}
      borderRadius="lg"
      bg={solved ? "green.50" : "white"}
      cursor="pointer"
      _hover={{ borderColor: solved ? "green.400" : "blue.400", shadow: "sm" }}
      transition="all 0.15s"
      onClick={() => navigate({ to: "/problem/$id", params: { id: problem.id } })}
    >
      <VStack align="start" gap={2}>
        <HStack justify="space-between" width="100%">
          <HStack>
            <Badge colorPalette={stageColor[problem.stage]} fontSize="xs">
              {stageLabel[problem.stage]}
            </Badge>
            <Badge colorPalette="gray" fontSize="xs">
              {scenarioLabel[problem.scenario]}
            </Badge>
          </HStack>
          {solved && (
            <Badge colorPalette="green" fontSize="xs">
              ✓ クリア
            </Badge>
          )}
        </HStack>
        <Text fontWeight="bold" fontSize="md" color="gray.800">
          {problem.copy.title}
        </Text>
        <Text fontSize="xs" color="gray.500" fontFamily="mono">
          {problem.id}
        </Text>
      </VStack>
    </Box>
  );
}
