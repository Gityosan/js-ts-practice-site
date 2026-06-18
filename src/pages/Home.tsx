import { Box, Container, Heading, Text, VStack, SimpleGrid, Badge, HStack } from "@chakra-ui/react";
import { allProblems } from "../problems";
import { ProblemCard } from "../components/ProblemCard";

const stages = [
  { key: "read", label: "読む", desc: "動くコードを触って変化を見る" },
  { key: "tweak", label: "いじる", desc: "骨格を選んでピースをはめる" },
  { key: "fill", label: "埋める", desc: "骨格を見て中身を書く" },
  { key: "write", label: "書く", desc: "白紙から書く" },
] as const;

export function Home() {
  const fillProblems = allProblems.filter((p) => p.stage === "fill");

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="container.lg" py={10}>
        <VStack align="stretch" gap={10}>
          {/* Hero */}
          <VStack align="center" gap={4} py={8}>
            <Heading size="2xl" textAlign="center" color="gray.800">
              コードはこわくない
            </Heading>
            <Text color="gray.600" fontSize="lg" textAlign="center" maxW="480px">
              「構造を読む力」から始める JS/TS 入門。
              <br />
              型注釈は最初からついている。気づいたら TS が書けてた、を目指す。
            </Text>
          </VStack>

          {/* Stage funnel */}
          <Box>
            <Heading size="md" mb={4} color="gray.700">
              ステージ構成
            </Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
              {stages.map((s, i) => (
                <Box
                  key={s.key}
                  p={4}
                  bg="white"
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="gray.200"
                  opacity={s.key === "fill" ? 1 : 0.55}
                >
                  <HStack mb={1}>
                    <Badge colorPalette="blue" fontSize="xs">
                      Stage {i}
                    </Badge>
                    {s.key !== "fill" && (
                      <Badge colorPalette="gray" fontSize="xs">
                        近日公開
                      </Badge>
                    )}
                  </HStack>
                  <Text fontWeight="bold" fontSize="sm" color="gray.800">
                    {s.label}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={0.5}>
                    {s.desc}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Problem list */}
          <Box>
            <Heading size="md" mb={4} color="gray.700">
              問題一覧（埋める）
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              {fillProblems.map((p) => (
                <ProblemCard key={p.id} problem={p} />
              ))}
            </SimpleGrid>
          </Box>

          {/* Footer */}
          <Box pt={6} borderTop="1px solid" borderColor="gray.200" textAlign="center">
            <Text fontSize="xs" color="gray.400">
              採点は振る舞いで判定。reduce でも for でも、動けば正解。
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
