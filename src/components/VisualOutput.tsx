import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import { motion } from "motion/react";
import type { VisualState } from "../grade/visual";

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

/* ===================== scenario の視覚出力（read 以外） ===================== */

export function ScenarioVisual({ state }: { state: VisualState }) {
  switch (state.kind) {
    case "emails":
      return <EmailsView sent={state.sent} />;
    case "form":
      return <FormView title={state.title} fields={state.fields} />;
    case "spreadsheet":
      return <SpreadsheetView headers={state.headers} grid={state.grid} />;
    case "table":
      return <TableView columns={state.columns} rows={state.rows} result={state.result} />;
    default:
      return null;
  }
}

function EmailsView({ sent }: { sent: { to: string; subject: string; body: string }[] }) {
  if (sent.length === 0) {
    return (
      <Text fontSize="sm" color="gray.400">
        まだ1通も送信されていません。
      </Text>
    );
  }
  return (
    <VStack align="stretch" gap={2}>
      <Text fontSize="xs" color="gray.500" fontWeight="bold">
        📤 送信済み（{sent.length} 通）
      </Text>
      {sent.map((m, i) => (
        <MotionDiv
          key={i}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 24 }}
        >
          <Box
            bg="white"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="gray.200"
            borderRadius="md"
            p={3}
            textAlign="left"
          >
            <HStack gap={2} mb={1} fontSize="xs">
              <Text color="gray.400">To:</Text>
              <Text color="gray.700" fontFamily="mono">
                {m.to}
              </Text>
            </HStack>
            <Text fontSize="sm" fontWeight="bold" color="gray.800" mb={1}>
              {m.subject || "（件名なし）"}
            </Text>
            <Text fontSize="xs" color="gray.600" whiteSpace="pre-wrap">
              {m.body || "（本文なし）"}
            </Text>
          </Box>
        </MotionDiv>
      ))}
    </VStack>
  );
}

function FormView({
  title,
  fields,
}: {
  title?: string;
  fields: { label: string; value: string; filled: boolean }[];
}) {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderStyle="solid"
      borderColor="gray.200"
      borderRadius="lg"
      p={4}
      w="full"
      maxW="320px"
      textAlign="left"
    >
      <Text fontSize="xs" color="gray.400" mb={3}>
        🧩 {title ?? "サンドボックスのフォーム"}
      </Text>
      <VStack align="stretch" gap={3}>
        {fields.map((f) => (
          <Box key={f.label}>
            <Text fontSize="xs" color="gray.500" mb={1}>
              {f.label}
            </Text>
            <MotionDiv
              key={f.value}
              initial={f.filled ? { backgroundColor: "#fefcbf" } : {}}
              animate={{ backgroundColor: "#ffffff" }}
              transition={{ duration: 0.8 }}
              style={{
                border: "1px solid #cbd5e0",
                borderRadius: 6,
                padding: "6px 10px",
                minHeight: 32,
                fontFamily: "monospace",
                fontSize: 14,
                color: f.filled ? "#1a202c" : "#a0aec0",
              }}
            >
              {f.value || "（未入力）"}
            </MotionDiv>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

function colLabel(i: number): string {
  return String.fromCharCode(65 + i);
}

function SpreadsheetView({
  headers,
  grid,
}: {
  headers?: string[];
  grid: { value: string | number; highlight?: boolean }[][];
}) {
  const cols = grid[0]?.length ?? headers?.length ?? 0;
  return (
    <Box overflowX="auto" w="full">
      <Box as="table" style={{ borderCollapse: "collapse", fontSize: 13, margin: "0 auto" }}>
        <thead>
          <tr>
            <th style={cornerCell} />
            {Array.from({ length: cols }, (_, c) => (
              <th key={c} style={headerCell}>
                {headers?.[c] ?? colLabel(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((row, r) => (
            <tr key={r}>
              <td style={rowHeaderCell}>{r + 1}</td>
              {row.map((cell, c) => (
                <MotionCell key={c} highlight={cell.highlight}>
                  {cell.value === "" ? "" : cell.value}
                </MotionCell>
              ))}
            </tr>
          ))}
        </tbody>
      </Box>
    </Box>
  );
}

const MotionTd = motion.create(
  "td" as unknown as React.ComponentType<React.TdHTMLAttributes<HTMLTableCellElement>>,
);

function MotionCell({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <MotionTd
      initial={highlight ? { backgroundColor: "#9ae6b4" } : { backgroundColor: "#ffffff" }}
      animate={{ backgroundColor: highlight ? "#c6f6d5" : "#ffffff" }}
      transition={{ duration: 0.7 }}
      style={{
        border: "1px solid #cbd5e0",
        padding: "4px 12px",
        minWidth: 48,
        textAlign: "right",
        fontFamily: "monospace",
        color: "#1a202c",
        fontWeight: highlight ? 700 : 400,
      }}
    >
      {children}
    </MotionTd>
  );
}

const headerCell: React.CSSProperties = {
  border: "1px solid #cbd5e0",
  background: "#edf2f7",
  color: "#4a5568",
  padding: "3px 12px",
  fontWeight: 600,
};
const cornerCell: React.CSSProperties = { ...headerCell, minWidth: 24 };
const rowHeaderCell: React.CSSProperties = {
  border: "1px solid #cbd5e0",
  background: "#edf2f7",
  color: "#4a5568",
  padding: "3px 8px",
  textAlign: "center",
  fontWeight: 600,
};

function TableView({
  columns,
  rows,
  result,
}: {
  columns: string[];
  rows: (string | number)[][];
  result?: { label: string; value: string };
}) {
  return (
    <VStack align="stretch" gap={3} w="full">
      <Box overflowX="auto">
        <Box as="table" style={{ borderCollapse: "collapse", fontSize: 13, width: "100%" }}>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c} style={headerCell}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td
                    key={c}
                    style={{
                      border: "1px solid #cbd5e0",
                      padding: "4px 12px",
                      textAlign: typeof cell === "number" ? "right" : "left",
                      fontFamily: "monospace",
                      color: "#1a202c",
                    }}
                  >
                    {typeof cell === "number" ? cell.toLocaleString("ja-JP") : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
      {result && (
        <MotionDiv
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
        >
          <HStack
            justify="space-between"
            bg="blue.50"
            borderWidth="1px"
            borderStyle="solid"
            borderColor="blue.200"
            borderRadius="md"
            px={4}
            py={2}
          >
            <Text fontSize="sm" color="blue.700" fontWeight="bold">
              {result.label}
            </Text>
            <Text fontSize="lg" color="blue.800" fontWeight="bold" fontFamily="mono">
              {result.value}
            </Text>
          </HStack>
        </MotionDiv>
      )}
    </VStack>
  );
}
