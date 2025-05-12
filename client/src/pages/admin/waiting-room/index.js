import AdminHeader from "components/admin-header";
import React from "react";
import socket from "services/socket";
import "./style.scss";

function WaitingRoom(props) {
  const [players, setPlayers] = React.useState([]);

  React.useEffect(() => {
    socket.emit("get-players-online");
  }, []);

  React.useEffect(() => {
    socket.on("players-online", payload => {
      setPlayers(payload);
    });

    return () => {
      socket.off("players-online");
    };
  }, []);
  return (
    <div className="admin__waiting-room">
      <AdminHeader />
      <div className="content">
        <div className="players">
          {players.map((item, index) => (
            <p className="player" key={item._id}>
              {item.displayName}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WaitingRoom;
