import {
  createRouter,
  createRoute,
  createRootRoute,
  createHashHistory,
  Outlet,
} from "@tanstack/react-router";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { ProblemPage } from "./pages/ProblemPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Navbar />
      <Outlet />
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
