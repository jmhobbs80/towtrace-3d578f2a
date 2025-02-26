
import { NotFound } from "@/pages/error/NotFound";
import { ServerError } from "@/pages/error/ServerError";
import { Maintenance } from "@/pages/error/Maintenance";
import { RouteConfig } from "./types";

export const errorRoutes: RouteConfig[] = [
  {
    path: "/404",
    element: <NotFound />,
  },
  {
    path: "/500",
    element: <ServerError />,
  },
  {
    path: "/maintenance",
    element: <Maintenance />,
  },
];
