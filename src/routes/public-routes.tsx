
import { HomePage } from "@/pages/public/HomePage";
import { AboutPage } from "@/pages/public/AboutPage";
import { PricingPage } from "@/pages/public/PricingPage";
import { ContactPage } from "@/pages/public/ContactPage";
import { HelpPage } from "@/pages/public/HelpPage";
import { RouteConfig } from "./types";

export const publicRoutes: RouteConfig[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/help",
    element: <HelpPage />,
  },
];
