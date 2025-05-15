import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "services/socket";
import Router from "./routes";
import { SnackbarProvider } from "notistack";
import Slide from "@mui/material/Slide";
import { blockedKey } from "constants";
import { Role } from "constants";
import { useAppState } from "context";

function App() {
  const [, setUser] = useAppState("user");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOnConnected = data => {
      setUser(data.user);
      if (!["/leader-board", "/login", "/"].includes(location.pathname))
        switch (data.user.role) {
          case Role.Admin:
            navigate("/admin");
            break;
          case Role.Player:
            navigate("/game");
            break;
          default:
            navigate("/");
            break;
        }
      localStorage.setItem("user", JSON.stringify(data.user));
    };

    socket.on("connected", handleOnConnected);
    window.addEventListener("keydown", e => {
      if (blockedKey.includes(e.key)) e.preventDefault();
    });

    return () => {
      socket.off("connected", handleOnConnected);
    };
  }, [location.pathname, navigate, setUser]);

  return (
    <SnackbarProvider
      maxSnack={2}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      TransitionComponent={Slide}
    >
      <div className="app">
        <Router />
      </div>
    </SnackbarProvider>
  );
}

export default App;
