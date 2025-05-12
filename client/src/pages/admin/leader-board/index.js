import React, { useState } from "react";
import PropTypes from "prop-types";
import "./style.scss";
import socket from "services/socket";

LeaderBoard.propTypes = {};

function LeaderBoard(props) {
  const [teams, setTeams] = React.useState([
    // {
    //   _id: "as",
    //   displayName: "Nguyễn Trung Tín",
    //   point: 100,
    //   rank: 0,
    // },
  ]);
  const handleRandom = () => {
    setTeams([
      {
        _id: "as",
        displayName: "Nguyễn Trung Tín",
        point: 100,
        rank: 3,
      },
      {
        _id: "dvds",
        displayName: "Huỳnh Thị Thúy Vy",
        point: 170,
        rank: 2,
      },
      { _id: "fgd", displayName: "Cô Linda", point: 200, rank: 0 },
      { _id: "sd", displayName: "Scarlet Witch", point: 90, rank: 4 },
      { _id: "sda", displayName: "Dr Strange", point: 190, rank: 1 },
    ]);
  };

  React.useEffect(() => {
    socket.emit("get-leader-board");
    socket.on("leader-board", payload => {
      setTeams(payload);
    });

    return () => {
      socket.off("leader-board");
    };
  }, []);
  return (
    <div className="leader-board">
      <p className="title" onClick={handleRandom}>
        BẢNG TỔNG SẮP
      </p>
      <div className="header">
        <p className="top">TOP</p>
        <p className="name">TEAM</p>
      </div>
      <div className="list-teams">
        {teams?.map((item, index) => {
          return (
            <div
              key={item._id}
              className={"team top-" + item.rank + " "}
              style={{ "--index": item.rank - 1 }}
            >
              <div className="rank">
                <p>{"0" + item.rank}</p>
              </div>
              <div className="information">
                <p className="name">{item.displayName}</p>
                <div className="score">
                  <p>{item.point}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LeaderBoard;
