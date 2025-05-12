import React from "react";
import { useSocket } from "services/socket";
import {
  GET_PLAYER_ONLINE,
  PLAYER_ONLINE,
} from "services/socket/constants";
import "./style.scss";

function WaitingRoom() {
  const [players, socketEmit] = useSocket(PLAYER_ONLINE);

  React.useEffect(() => {
    socketEmit(GET_PLAYER_ONLINE);
  }, [socketEmit]);

  return (
    <div className="player__waiting-room">
      <div className="players">
        {players?.map(item => (
          <p className="player" key={item.userId}>
            {item.displayName}
          </p>
        ))}
      </div>
    </div>
  );
}

export default WaitingRoom;
