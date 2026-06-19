import { useState, useEffect, useMemo } from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { Reorder } from "motion/react";
import type { Tweak } from "../core/schemas";

type Props = {
  tweak: Tweak;
  onChange: (assembledCode: string) => void;
};

export function TweakPane({ tweak, onChange }: Props) {
  if (tweak.kind === "parsons") {
    return <ParsonsPane lines={tweak.lines} onChange={onChange} />;
  }
  return <ChoicePane template={tweak.template} blanks={tweak.blanks} onChange={onChange} />;
}

/* ---------------- Parsons: drag to reorder ---------------- */

type Line = { id: number; text: string };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ParsonsPane({ lines, onChange }: { lines: string[]; onChange: (c: string) => void }) {
  // 元の index を安定 id にして重複行（} が複数等）でも一意に保つ
  const initial = useMemo<Line[]>(() => {
    const withId = lines.map((text, id) => ({ id, text }));
    let s = shuffle(withId);
    // 偶然そのまま正解順になっていたら回転させてズラす
    if (withId.length > 1 && s.every((l, i) => l.id === i)) {
      s = [...s.slice(1), s[0]];
    }
    return s;
  }, [lines]);

  const [order, setOrder] = useState<Line[]>(initial);

  useEffect(() => {
    onChange(order.map((l) => l.text).join("\n"));
  }, [order, onChange]);

  return (
    <VStack align="stretch" gap={2}>
      <Text fontSize="xs" color="gray.500">
        行をドラッグして、上から正しい順に並べ替えよう
      </Text>
      <Reorder.Group
        axis="y"
        values={order}
        onReorder={setOrder}
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {order.map((line) => (
          <Reorder.Item
            key={line.id}
            value={line}
            style={{ marginBottom: 8, cursor: "grab" }}
            whileDrag={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
          >
            <Box
              bg="#1e1e1e"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.700"
              px={3}
              py={2}
              display="flex"
              alignItems="center"
              gap={2}
            >
              <Text color="gray.600" fontSize="sm" userSelect="none">
                ⠿
              </Text>
              <Text
                fontFamily="mono"
                fontSize="sm"
                color="#d4d4d4"
                whiteSpace="pre"
                userSelect="none"
              >
                {line.text === "" ? " " : line.text}
              </Text>
            </Box>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </VStack>
  );
}

/* ---------------- Choice: fill the blanks ---------------- */

type Blank = { choices: string[]; answer: string };

function ChoicePane({
  template,
  blanks,
  onChange,
}: {
  template: string;
  blanks: Blank[];
  onChange: (c: string) => void;
}) {
  const [picks, setPicks] = useState<(string | null)[]>(() => blanks.map(() => null));

  useEffect(() => {
    let code = template;
    picks.forEach((pick, i) => {
      code = code.replace(`{{${i}}}`, pick ?? "___");
    });
    onChange(code);
  }, [picks, template, onChange]);

  const parts = useMemo(() => template.split(/(\{\{\d+\}\})/g), [template]);

  return (
    <VStack align="stretch" gap={4}>
      {/* コードプレビュー（空欄をハイライト） */}
      <Box
        as="pre"
        bg="#1e1e1e"
        borderRadius="md"
        p={4}
        overflow="auto"
        fontFamily="mono"
        fontSize="sm"
        color="#d4d4d4"
        lineHeight="1.7"
      >
        {parts.map((part, i) => {
          const m = part.match(/\{\{(\d+)\}\}/);
          if (m) {
            const idx = Number(m[1]);
            const pick = picks[idx];
            return (
              <Box
                as="span"
                key={i}
                px={2}
                py={0.5}
                mx={0.5}
                borderRadius="sm"
                bg={pick ? "blue.600" : "yellow.700"}
                color="white"
                fontWeight="bold"
              >
                {pick ?? `空欄${idx + 1}`}
              </Box>
            );
          }
          return (
            <Box as="span" key={i}>
              {part}
            </Box>
          );
        })}
      </Box>

      {/* 選択肢 */}
      <VStack align="stretch" gap={3}>
        {blanks.map((blank, i) => (
          <Box key={i}>
            <Text fontSize="xs" color="gray.500" mb={1}>
              空欄{i + 1} を選ぶ
            </Text>
            <HStack gap={2} wrap="wrap">
              {blank.choices.map((choice) => {
                const selected = picks[i] === choice;
                return (
                  <Button
                    key={choice}
                    size="sm"
                    fontFamily="mono"
                    colorPalette={selected ? "blue" : "gray"}
                    variant={selected ? "solid" : "outline"}
                    onClick={() =>
                      setPicks((prev) => {
                        const next = [...prev];
                        next[i] = choice;
                        return next;
                      })
                    }
                  >
                    {choice}
                  </Button>
                );
              })}
            </HStack>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
}
