import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import JobsDashboard from "./pages/jobs/JobsDashboard";
import JobDetails from "./pages/jobs/JobDetails";
import FleetManagement from "./pages/fleet/FleetManagement";
import VehiclesInTransitDashboard from "./pages/transport/VehiclesInTransit";
import InventoryManagement from "./pages/inventory/InventoryManagement";
import InspectionsDashboard from "./pages/inspections/InspectionsDashboard";
import InspectionDetails from "./pages/inspections/InspectionDetails";
import InvoicesDashboard from "./pages/invoices/InvoicesDashboard";
import SettingsDashboard from "./pages/settings/SettingsDashboard";
import VehicleSearch from "./pages/inventory/VehicleSearch";
import VehicleDetails from "./pages/inventory/VehicleDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/jobs",
    element: <JobsDashboard />,
  },
  {
    path: "/jobs/:jobId",
    element: <JobDetails />,
  },
  {
    path: "/fleet",
    element: <FleetManagement />,
  },
  {
    path: "/transport",
    element: <VehiclesInTransitDashboard />,
  },
  {
    path: "/inventory",
    element: <InventoryManagement />,
  },
  {
    path: "/inspections",
    element: <InspectionsDashboard />,
  },
  {
    path: "/inspections/:inspectionId",
    element: <InspectionDetails />,
  },
  {
    path: "/invoices",
    element: <InvoicesDashboard />,
  },
  {
    path: "/settings",
    element: <SettingsDashboard />,
  },
  {
    path: "/inventory/vehicles",
    element: <VehicleSearch />,
  },
  {
    path: "/inventory/vehicles/:id",
    element: <VehicleDetails />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
