import AdminHeader from "components/admin-header";
import React from "react";
import socket from "services/socket";
import EloquenceTeam from "./components/eloquence-team";
import { useSnackbar } from "notistack";
import "./style.scss";

function Eloquence(props) {
  const [players, setPlayers] = React.useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  React.useEffect(() => {
    socket.on("eloquence-answers", payload => {
      setPlayers(payload);
    });

    socket.on("eloquence-update-point-answer-success", payload => {
      enqueueSnackbar("Cập nhật điểm thành công!", {
        variant: "success",
      });
    });

    socket.on("eloquence-update-point-answer-fail", payload => {
      enqueueSnackbar("Cập nhật điểm thất bại!", {
        variant: "error",
      });
    });

    return () => {
      socket.off("eloquence-answers");
      socket.off("eloquence-update-point-answer-success");
      socket.off("eloquence-update-point-answer-fail");
    };
  }, [enqueueSnackbar]);

  React.useEffect(() => {
    socket.emit("eloquence-get-answers");
  }, []);

  return (
    <div className="admin__eloquence">
      <AdminHeader />
      <div className="content">
        <div className="game-space">
          <div className="title">VÒNG THI HÙNG BIỆN</div>
          <div className="teams">
            {players.map((item, index) => {
              console.log(item);
              return <EloquenceTeam key={item._id} player={item} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Eloquence;
