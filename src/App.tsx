
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import VehicleSearch from "./pages/inventory/VehicleSearch";
import VehicleDetails from "./pages/inventory/VehicleDetails";
import InventoryManagement from "./pages/inventory/InventoryManagement";
import FleetManagement from "./pages/fleet/FleetManagement";
import VehiclesInTransitDashboard from "./pages/transport/VehiclesInTransit";
import AuthPage from "./pages/auth/AuthPage";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/",
    element: <InventoryManagement />,
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
