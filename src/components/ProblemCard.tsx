import { Box, Text, Badge, VStack, HStack } from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { ProblemMeta } from "../core/schemas";

const MotionBox = motion.create(Box);

const stageLabel: Record<string, string> = {
  decode: "解読",
  read: "読む",
  learn: "知る",
  write: "書く",
};

const stageColor: Record<string, string> = {
  decode: "pink",
  read: "cyan",
  learn: "indigo",
  write: "purple",
};

type Props = { problem: ProblemMeta; solved?: boolean };

export function ProblemCard({ problem, solved = false }: Props) {
  const navigate = useNavigate();

  return (
    <MotionBox
      p={5}
      minWidth="0"
      borderWidth="1px"
      borderStyle="solid"
      borderColor={solved ? "green.300" : "gray.200"}
      borderRadius="lg"
      bg={solved ? "green.50" : "white"}
      cursor="pointer"
      _hover={{ borderColor: solved ? "green.400" : "blue.400" }}
      onClick={() => navigate({ to: "/problem/$id", params: { id: problem.id } })}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25 }}
    >
      <VStack align="start" gap={2}>
        <HStack justify="space-between" width="100%" flexWrap="wrap" gap={1}>
          <HStack flexWrap="wrap" gap={1}>
            <Badge colorPalette={stageColor[problem.stage]} fontSize="xs">
              {stageLabel[problem.stage]}
            </Badge>
          </HStack>
          {solved && (
            <Badge colorPalette="green" fontSize="xs">
              ✓ クリア
            </Badge>
          )}
        </HStack>
        <Text
          fontWeight="bold"
          fontSize="md"
          color="gray.800"
          wordBreak="break-word"
          overflowWrap="break-word"
        >
          {problem.copy.title}
        </Text>
      </VStack>
    </MotionBox>
  );
}
