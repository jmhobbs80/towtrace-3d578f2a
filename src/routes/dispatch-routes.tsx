
import { DispatchBoard } from "@/pages/dispatch/DispatchBoard";
import { CreateJob } from "@/pages/dispatch/CreateJob";
import { AssignDriver } from "@/pages/dispatch/AssignDriver";
import { RouteOptimization } from "@/pages/dispatch/RouteOptimization";
import { JobStatus } from "@/pages/dispatch/JobStatus";
import { TruckTracking } from "@/pages/dispatch/TruckTracking";
import { ImpoundLots } from "@/pages/dispatch/ImpoundLots";
import { RouteConfig } from "./types";

export const dispatchRoutes: RouteConfig[] = [
  {
    path: "/dispatch",
    element: <DispatchBoard />,
  },
  {
    path: "/dispatch/create-job",
    element: <CreateJob />,
  },
  {
    path: "/dispatch/assign-driver",
    element: <AssignDriver />,
  },
  {
    path: "/dispatch/optimize-route",
    element: <RouteOptimization />,
  },
  {
    path: "/dispatch/jobs",
    element: <JobStatus />,
  },
  {
    path: "/dispatch/tracking",
    element: <TruckTracking />,
  },
  {
    path: "/dispatch/impound-lots",
    element: <ImpoundLots />,
  },
];
