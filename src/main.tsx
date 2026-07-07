import "./lib/monaco-setup";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import { router } from "./router";
import { system } from "./theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </ChakraProvider>
  </StrictMode>,
);
