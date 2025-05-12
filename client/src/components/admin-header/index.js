import React from "react";
import "./style.scss";
import socket from "services/socket";
import RoundsDropDown from "components/dropdown-rounds";

function AdminHeader(props) {
  const [rounds, setRounds] = React.useState([
    {
      _id: "-",
      name: "Connection",
    },
  ]);
  const [currentRound, setCurrentRound] = React.useState("");

  const handleDropdownRoundsOnChange = _id => {
    setCurrentRound(_id);
    socket.emit("change-current-round", { roundId: _id });
  };

  React.useEffect(() => {
    socket.emit("get-list-rounds");
    socket.on("list-rounds", payload => {
      const listRounds = payload;
      // listRounds = [{_id: "", name: ""}]
      if (listRounds) {
        setRounds(listRounds);
        socket.emit("get-current-roundId");
      }
    });

    socket.on("current-roundId", payload => {
      const { roundId } = payload;
      setCurrentRound(roundId);
    });

    return () => {
      socket.off("list-rounds");
      socket.off("current-roundId");
    };
  }, []);
  return (
    <div className="admin-header">
      <div className="left-header">
        <div className="homepage">
          <div className="logo">
            <div className="logo-image"></div>
          </div>
          <p>Trang chủ</p>
        </div>
      </div>
      <div className="right-header">
        <RoundsDropDown
          items={rounds}
          defaultValue={currentRound}
          onChange={handleDropdownRoundsOnChange}
        />
        <div className="bang-tong-sap">
          <p onClick={() => window.open("/leader-board", "_blank")}>
            Bản tổng sắp
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
