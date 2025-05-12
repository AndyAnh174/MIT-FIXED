import WarmUp from "pages/admin/warm-up";
import WaitingRoom from "pages/admin/waiting-room";
import React from "react";
import "./style.scss";
import { useSocket } from "services/socket";
import SpeedUp from "../speed-up";
import Programming from "../programming";
import ArrangeRound from "../arrange-round";
import ConnectionAdmin from "../connection-admin";
import {
  CURRENT_ROUND,
  GET_CURRENT_ROUND,
} from "services/socket/constants";
import { useMemo } from "react";
import Eloquence from "../eloquence";

const RoundName = {
  WarmUp: "warm-up",
  Connection: "connection",
  SpeedUp: "speed-up",
  Programming: "programming",
  WaitingRoom: "wait",
  Eloquence: "eloquence",
  Sort: "sort",
};

const RoundComponent = {
  [RoundName.WaitingRoom]: <WaitingRoom />,
  [RoundName.WarmUp]: <WarmUp />,
  [RoundName.Connection]: <ConnectionAdmin />,
  [RoundName.Sort]: <ArrangeRound />,
  [RoundName.SpeedUp]: <SpeedUp />,
  [RoundName.Programming]: <Programming />,
  [RoundName.Eloquence]: <Eloquence />,
};

function AdminDisplay(props) {
  const [currentRound, socketEmit] = useSocket(CURRENT_ROUND);
  React.useEffect(() => {
    socketEmit(GET_CURRENT_ROUND);
  }, [socketEmit]);

  const Component = useMemo(
    () => RoundComponent[currentRound?.roundName],
    [currentRound?.roundName],
  );
  return (
    <div className="admin-display">{Component || "loading..."}</div>
  );
}

export default AdminDisplay;
