import type { RouteObject } from "react-router-dom";

import ChatPage from "../pages/protected/chat";
import HomePage from "../pages/protected/home";
import ProtectedLayout from "../pages/protected/layout";
import JoinWithCodePage from "../pages/public/join-with-code";
import LoginPage from "../pages/public/login";
import NotFoundPage from "../pages/public/not-found";
// import RegisterPage from "../pages/public/register";
import { ProtectedRoute } from "./ProtectedRoute";

// Public routes - accessible without authentication
const publicRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  // {
  //   path: "/register",
  //   element: <RegisterPage />,
  // },
  {
    path: "/join",
    element: <JoinWithCodePage />,
  },
];

// Protected routes - require authentication
const protectedRoutes: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <ProtectedLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "server/:serverId/channel/:channelId",
        element: <ChatPage />,
      },
    ],
  },
];

// Catch-all route for 404
const notFoundRoute: RouteObject[] = [
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

// Combine all routes
export const routes: RouteObject[] = [...publicRoutes, ...protectedRoutes, ...notFoundRoute];
