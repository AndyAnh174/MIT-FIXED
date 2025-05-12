//import ConnectionRound from "pages/player/connection-round";
import WaitingRoom from "pages/player/waiting-room";
import React, { useMemo } from "react";
import WarmUp from "../warm-up";
import Programming from "../programming";
import "./style.scss";
import { useSocket } from "services/socket";
import SpeedUp from "../speed-up";
import {
  CURRENT_ROUND,
  GET_CURRENT_ROUND,
} from "services/socket/constants";
import ArrangeRound from "../arrange-round";

const RoundName = {
  WarmUp: "warm-up",
  //Connection: "connection",
  SpeedUp: "speed-up",
  Programming: "programming",
  WaitingRoom: "wait",
  Eloquence: "eloquence",
  Sort: "sort",
};

const RoundComponent = {
  [RoundName.WaitingRoom]: <WaitingRoom />,
  [RoundName.WarmUp]: <WarmUp />,
  //[RoundName.Connection]: <ConnectionRound />,
  [RoundName.Sort]: <ArrangeRound />,
  [RoundName.SpeedUp]: <SpeedUp />,
  [RoundName.Programming]: <Programming />,
  [RoundName.Eloquence]: <div>eloquence</div>,
};

const GameDisplay = () => {
  const [currentRound, socketEmit] = useSocket(CURRENT_ROUND);
  React.useEffect(() => {
    socketEmit(GET_CURRENT_ROUND);
  }, [socketEmit]);

  const Component = useMemo(
    () => RoundComponent[currentRound?.roundName],
    [currentRound?.roundName],
  );

  return (
    <div className="game-display">{Component || "loading..."}</div>
  );
};

export default GameDisplay;
