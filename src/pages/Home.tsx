import { useMemo } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Badge,
  HStack,
  Separator,
} from "@chakra-ui/react";
import { motion } from "motion/react";
import { allProblems } from "../problems";
import { ProblemCard } from "../components/ProblemCard";
import { getAllSolved } from "../lib/progress";

const MotionVStack = motion.create(VStack);
const MotionBox = motion.create(Box);

const stageConfig = [
  { key: "read", label: "読む", color: "blue", desc: "動くコードを触って変化を見る", available: true },
  { key: "tweak", label: "いじる", color: "purple", desc: "並べ替え・選んで組み立てる", available: true },
  { key: "fill", label: "埋める", color: "orange", desc: "骨格を見て中身を書く", available: true },
  { key: "write", label: "書く", color: "red", desc: "白紙から書く", available: true },
] as const;

const scenarioLabel: Record<string, string> = {
  data: "データ集計",
  gas: "GAS",
  email: "メール自動化",
  chrome: "Chrome 拡張",
};

export function Home() {
  const solved = useMemo(() => getAllSolved(), []);

  const byStage = useMemo(() => {
    const map: Record<string, typeof allProblems> = {};
    for (const p of allProblems) {
      (map[p.stage] ??= []).push(p);
    }
    return map;
  }, []);

  const totalCount = allProblems.length;
  const solvedCount = allProblems.filter((p) => solved.has(p.id)).length;

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="container.lg" py={10}>
        <VStack align="stretch" gap={10}>
          {/* Hero */}
          <MotionVStack
            align="center"
            gap={4}
            py={8}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Heading size="2xl" textAlign="center" color="gray.800">
              コードはこわくない
            </Heading>
            <Text color="gray.600" fontSize="lg" textAlign="center" maxW="480px">
              「構造を読む力」から始める JS/TS 入門。
              <br />
              型注釈は最初からついている。気づいたら TS が書けてた、を目指す。
            </Text>
            {solvedCount > 0 && (
              <Badge colorPalette="green" fontSize="sm" px={3} py={1}>
                {solvedCount} / {totalCount} 問クリア
              </Badge>
            )}
          </MotionVStack>

          {/* Stage funnel */}
          <Box>
            <Heading size="md" mb={4} color="gray.700">
              ステージ構成（funnel）
            </Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
              {stageConfig.map((s, i) => {
                const problems = byStage[s.key] ?? [];
                const solvedInStage = problems.filter((p) => solved.has(p.id)).length;
                return (
                  <MotionBox
                    key={s.key}
                    p={4}
                    bg="white"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={s.available ? `${s.color}.200` : "gray.200"}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: s.available ? 1 : 0.5, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.35 }}
                  >
                    <HStack mb={1} justify="space-between">
                      <Badge colorPalette={s.available ? s.color : "gray"} fontSize="xs">
                        Stage {i}
                      </Badge>
                      {s.available && problems.length > 0 && (
                        <Text fontSize="xs" color="gray.400">
                          {solvedInStage}/{problems.length}
                        </Text>
                      )}
                    </HStack>
                    <Text fontWeight="bold" fontSize="sm" color="gray.800">
                      {s.label}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={0.5}>
                      {s.desc}
                    </Text>
                  </MotionBox>
                );
              })}
            </SimpleGrid>
          </Box>

          <Separator />

          {/* Problems by stage */}
          {stageConfig
            .filter((s) => s.available && (byStage[s.key]?.length ?? 0) > 0)
            .map((s) => {
              const problems = byStage[s.key] ?? [];
              const byScenario = problems.reduce<Record<string, typeof problems>>((acc, p) => {
                (acc[p.scenario] ??= []).push(p);
                return acc;
              }, {});

              return (
                <Box key={s.key}>
                  <HStack mb={4} gap={3}>
                    <Badge colorPalette={s.color} fontSize="sm" px={2} py={1}>
                      {s.label}
                    </Badge>
                    <Text fontSize="sm" color="gray.500">
                      {problems.filter((p) => solved.has(p.id)).length} / {problems.length} 問クリア
                    </Text>
                  </HStack>

                  <VStack align="stretch" gap={5}>
                    {Object.entries(byScenario).map(([scenario, ps]) => (
                      <Box key={scenario}>
                        <Text
                          fontSize="xs"
                          fontWeight="bold"
                          color="gray.400"
                          mb={2}
                          textTransform="uppercase"
                          letterSpacing="wider"
                        >
                          {scenarioLabel[scenario] ?? scenario}
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                          {ps.map((p) => (
                            <ProblemCard key={p.id} problem={p} solved={solved.has(p.id)} />
                          ))}
                        </SimpleGrid>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              );
            })}

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
