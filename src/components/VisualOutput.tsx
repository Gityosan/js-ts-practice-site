import { Box, Text } from "@chakra-ui/react";

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
          <Text key={i} fontSize="xl" lineHeight={1}>
            ★
          </Text>
        ))}
      </Box>
    </Box>
  );
}

const visualRenderers: Record<string, Renderer> = {
  "read-star-count": StarRenderer,
};
