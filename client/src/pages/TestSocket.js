import React from "react";
import socket from "services/socket";

function TestSocket(props) {
  const changeRound = () => {
    console.log("change-current-round");
    socket.emit("change-current-round", {
      // roundId: "6274c0a6e0313d4f9efed809",
      roundId: "62795278222bb418543eb5b4",
    });
  };

  return (
    <div>
      <button onClick={changeRound}>change-current-round</button>
    </div>
  );
}

export default TestSocket;
