import { useMemo, useState } from "react";
import {
  Box,
  Button,
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
import type { Language } from "../core/schemas";
import { ProblemCard } from "../components/ProblemCard";
import { getAllSolved } from "../lib/progress";

const MotionVStack = motion.create(VStack);
const MotionBox = motion.create(Box);

const stageConfig = [
  {
    key: "decode",
    label: "解読",
    color: "pink",
    desc: "1行を予約語・括弧に分解して読む",
    available: true,
  },
  {
    key: "read",
    label: "読む",
    color: "cyan",
    desc: "動くコードを触って変化を見る",
    available: true,
  },
  {
    key: "learn",
    label: "知る",
    color: "indigo",
    desc: "文法のキホンを読んで確認する",
    available: true,
  },
  {
    key: "write",
    label: "書く",
    color: "purple",
    desc: "骨格を埋める／白紙から書く",
    available: true,
  },
] as const;

// トップページの言語タブ。problem の language でコンテンツを出し分ける。
const languageConfig = [
  { key: "js", label: "JS / TS", color: "blue", heading: "「構造から読む」JS/TS 入門" },
  { key: "bash", label: "Bash（CLI）", color: "green", heading: "シェルで動かす CLI 入門" },
] as const satisfies ReadonlyArray<{
  key: Language;
  label: string;
  color: string;
  heading: string;
}>;

export function Home() {
  const solved = useMemo(() => getAllSolved(), []);
  const [lang, setLang] = useState<Language>("js");

  const problemsForLang = useMemo(() => allProblems.filter((p) => p.language === lang), [lang]);

  const byStage = useMemo(() => {
    const map: Record<string, typeof allProblems> = {};
    for (const p of problemsForLang) {
      (map[p.stage] ??= []).push(p);
    }
    return map;
  }, [problemsForLang]);

  const langMeta = languageConfig.find((l) => l.key === lang) ?? languageConfig[0];
  const totalCount = problemsForLang.length;
  const solvedCount = problemsForLang.filter((p) => solved.has(p.id)).length;

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
              {langMeta.heading}
            </Heading>

            {/* 言語タブ: JS / Bash でコンテンツを出し分ける */}
            <HStack gap={2}>
              {languageConfig.map((l) => (
                <Button
                  key={l.key}
                  size="sm"
                  variant={l.key === lang ? "solid" : "outline"}
                  colorPalette={l.color}
                  onClick={() => setLang(l.key)}
                >
                  {l.label}
                </Button>
              ))}
            </HStack>

            {solvedCount > 0 && (
              <Badge colorPalette="green" fontSize="sm" px={3} py={1}>
                {solvedCount} / {totalCount} 問クリア
              </Badge>
            )}
          </MotionVStack>

          {totalCount === 0 ? (
            /* この言語の問題はまだ無い（例: bash は準備中） */
            <Box
              py={12}
              textAlign="center"
              bg="white"
              borderRadius="lg"
              borderWidth="1px"
              borderStyle="dashed"
              borderColor="gray.300"
            >
              <Text fontSize="lg" fontWeight="bold" color="gray.600">
                {langMeta.label} の問題は準備中です
              </Text>
              <Text fontSize="sm" color="gray.400" mt={2}>
                busybox（ash）を WASM で動かす実行環境を用意中。もうしばらくお待ちください。
              </Text>
            </Box>
          ) : (
            <>
              {/* Stage funnel */}
              <Box>
                <Heading size="md" mb={4} color="gray.700">
                  ステージ構成
                </Heading>
                <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
                  {stageConfig.map((s, i) => {
                    const problems = byStage[s.key] ?? [];
                    const solvedInStage = problems.filter((p) => solved.has(p.id)).length;
                    return (
                      <MotionBox
                        key={s.key}
                        p={4}
                        minWidth="0"
                        bg="white"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderStyle="solid"
                        borderColor={s.available ? `${s.color}.200` : "gray.200"}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: s.available ? 1 : 0.5, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.35 }}
                      >
                        <HStack mb={1} justify="space-between">
                          <Badge colorPalette={s.available ? s.color : "gray"} fontSize="xs">
                            Stage {i + 1}
                          </Badge>
                          {s.available && problems.length > 0 && (
                            <Text fontSize="xs" color="gray.400">
                              {solvedInStage}/{problems.length}
                            </Text>
                          )}
                        </HStack>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          color="gray.800"
                          wordBreak="break-word"
                        >
                          {s.label}
                        </Text>
                        <Text fontSize="xs" color="gray.500" mt={0.5} wordBreak="break-word">
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

                  return (
                    <Box key={s.key}>
                      <HStack mb={4} gap={3}>
                        <Badge colorPalette={s.color} fontSize="sm" px={2} py={1}>
                          {s.label}
                        </Badge>
                        <Text fontSize="sm" color="gray.500">
                          {problems.filter((p) => solved.has(p.id)).length} / {problems.length}{" "}
                          問クリア
                        </Text>
                      </HStack>

                      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                        {problems.map((p) => (
                          <ProblemCard key={p.id} problem={p} solved={solved.has(p.id)} />
                        ))}
                      </SimpleGrid>
                    </Box>
                  );
                })}
            </>
          )}

          {/* Footer */}
          <Box
            pt={6}
            borderTopWidth="1px"
            borderTopStyle="solid"
            borderColor="gray.200"
            textAlign="center"
          >
            <Text fontSize="xs" color="gray.400">
              採点は振る舞いで判定。reduce でも for でも、動けば正解。
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
