import { Box, Text } from "@chakra-ui/react";
import { motion } from "motion/react";

const MotionText = motion.create(Text);
const MotionDiv = motion.create(
  "div" as unknown as React.ComponentType<React.HTMLAttributes<HTMLDivElement>>,
);

type Props = { problemId: string; output: unknown };

export function VisualOutput({ problemId, output }: Props) {
  const renderer = visualRenderers[problemId];
  if (!renderer) return null;
  return (
    <Box
      bg="gray.900"
      borderRadius="md"
      p={4}
      minH="100px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {renderer(output)}
    </Box>
  );
}

type Renderer = (output: unknown) => React.ReactNode;

function StarRenderer(output: unknown): React.ReactNode {
  const n = Math.max(0, Math.min(20, Math.round(Number(output) || 0)));
  return (
    <Box textAlign="center">
      <Text fontSize="xs" color="gray.400" mb={2}>
        ★ × {n}
      </Text>
      <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center" maxW="280px">
        {Array.from({ length: n }, (_, i) => (
          <MotionText
            key={`${n}-${i}`}
            fontSize="xl"
            lineHeight={1}
            color="yellow.300"
            initial={{ scale: 0, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 320, damping: 14 }}
          >
            ★
          </MotionText>
        ))}
      </Box>
    </Box>
  );
}

function GreetingRenderer(output: unknown): React.ReactNode {
  const text = String(output ?? "");
  return (
    <MotionDiv
      key={text}
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      style={{ textAlign: "center" }}
    >
      <Text fontSize="xl" fontWeight="bold" color="white" wordBreak="break-all">
        {text}
      </Text>
    </MotionDiv>
  );
}

function ProgressRenderer(output: unknown): React.ReactNode {
  const n = Math.max(0, Math.min(100, Number(output) || 0));
  const pct = Math.round(n);
  return (
    <Box w="full" maxW="260px" textAlign="center">
      <Text fontSize="2xl" fontWeight="bold" color="white" mb={2} fontFamily="mono">
        {pct}%
      </Text>
      <Box bg="gray.700" borderRadius="full" h="18px" overflow="hidden">
        <MotionDiv
          key={pct}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            height: "100%",
            background: pct >= 80 ? "#68d391" : pct >= 40 ? "#63b3ed" : "#fc8181",
            borderRadius: "inherit",
          }}
        />
      </Box>
    </Box>
  );
}

function ColorBoxRenderer(output: unknown): React.ReactNode {
  const color = String(output ?? "gray");
  return (
    <Box textAlign="center">
      <MotionDiv
        key={color}
        initial={{ scale: 0.6, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 14,
          background: color,
          margin: "0 auto",
          boxShadow: `0 4px 20px ${color}66`,
        }}
      />
      <Text color="gray.400" fontSize="xs" mt={2} fontFamily="mono">
        "{color}"
      </Text>
    </Box>
  );
}

function BoolLightRenderer(output: unknown): React.ReactNode {
  const on = output === true;
  return (
    <Box textAlign="center">
      <MotionDiv
        key={String(on)}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 12 }}
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: on ? "#48bb78" : "#fc8181",
          boxShadow: on ? "0 0 24px #48bb7899" : "0 0 24px #fc818199",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
        }}
      >
        {on ? "✓" : "✗"}
      </MotionDiv>
      <Text
        color={on ? "green.300" : "red.300"}
        fontSize="sm"
        mt={2}
        fontFamily="mono"
        fontWeight="bold"
      >
        {String(output)}
      </Text>
    </Box>
  );
}

const visualRenderers: Record<string, Renderer> = {
  "read-star-count": StarRenderer,
  "read-greeting": GreetingRenderer,
  "read-progress": ProgressRenderer,
  "read-color-box": ColorBoxRenderer,
  "read-bool-light": BoolLightRenderer,
};
