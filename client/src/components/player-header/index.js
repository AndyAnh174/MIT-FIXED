import React from "react";
import socket from "services/socket";
import "./style.scss";

PlayerHeader.defaultProps = {
  timer: { minutes: 2, seconds: 30, total: 300, initial: 300 },
};

function PlayerHeader(props) {
  const { timer } = props;
  const [player, setPlayer] = React.useState({
    displayName: "",
    rank: 1,
    point: 0,
    _id: "",
  });
  React.useEffect(() => {
    socket.emit("get-player-info");
  }, []);
  React.useEffect(() => {
    socket.on("player-info", payload => {
      console.log({ payload });
      const { displayName, rank, point, _id } = payload;
      setPlayer({ ...player, displayName, rank, point, _id });
    });

    return () => {
      socket.off("player-info");
    };
  }, [player]);
  return (
    <div className="player-header">
      <div className="player-name">
        <p>{player.displayName}</p>
      </div>
      <div className="score">
        <p>Score: {player.point}</p>
      </div>
      <div className="rank">
        <p>Rank: {player.rank}</p>
      </div>
      <div className="timer" style={{ value: 1 }}>
        <p>
          {timer.minutes < 10 ? "0" + timer.minutes : timer.minutes}
          {":"}
          {timer.seconds < 10 ? "0" + timer.seconds : timer.seconds}
        </p>
        <div
          className="progress-bar"
          style={{
            backgroundSize: (timer.total / timer.initial) * 100 + "%",
            "--value": `${(timer.total / timer.initial) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
}

export default PlayerHeader;
