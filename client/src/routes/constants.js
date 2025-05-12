import { Role } from "constants";
import About from "pages/About";
import AdminDisplay from "pages/admin/admin-display";
import LeaderBoard from "pages/admin/leader-board";
import Login from "pages/login/Login";
import GameDisplay from "pages/player/game-display";

export const PathRoute = Object.freeze({
  Admin: "admin",
  Game: "game",
  About: "about",
  Login: "login",
  LeaderBoard: "leader-board",
});

export const RouteComponent = Object.freeze({
  [PathRoute.Admin]: {
    path: "/admin/*",
    element: <AdminDisplay />,
    requiredRole: Role.Admin,
  },
  [PathRoute.Game]: {
    path: "/game/*",
    element: <GameDisplay />,
    requiredRole: Role.Player,
  },
  [PathRoute.About]: {
    path: "/about",
    element: <About />,
  },
  [PathRoute.Login]: {
    path: "/login",
    element: <Login />,
  },
  [PathRoute.LeaderBoard]: {
    path: "/leader-board",
    element: <LeaderBoard />,
  },
});
