import {
  createRouter,
  createRoute,
  createRootRoute,
  createHashHistory,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { ProblemPage } from "./pages/ProblemPage";

const MotionDiv = motion.create(
  "div" as unknown as React.ComponentType<React.HTMLAttributes<HTMLDivElement>>,
);

function AnimatedOutlet() {
  const { pathname } = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <MotionDiv
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <Outlet />
      </MotionDiv>
    </AnimatePresence>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Navbar />
      <AnimatedOutlet />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

export const problemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/problem/$id",
  component: ProblemPage,
});

const routeTree = rootRoute.addChildren([indexRoute, problemRoute]);

export const router = createRouter({
  routeTree,
  history: createHashHistory(),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
