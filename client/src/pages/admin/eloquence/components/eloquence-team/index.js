import React from "react";
import socket from "services/socket";
import "./style.scss";

EloquenceTeam.defaultProps = {
  player: {
    _id: "-",
    displayName: "Nguyen Trung Tin",
    answer: {
      _id: "",
      result: "0",
      point: 0,
    },
  },
};

function EloquenceTeam(props) {
  const { player } = props;
  const [points, setPoints] = React.useState([30, 30, 40]);
  const [avg, setAvg] = React.useState(0);

  const handleRemove = () => {
    var newPoints = points;
    newPoints.pop();
    setPoints([...newPoints]);
  };
  const handleAdd = () => {
    var newPoints = points;
    newPoints.push(0);
    setPoints([...newPoints]);
  };
  const onChange = (event, index) => {
    var newPoints = points;
    newPoints[index] = event.target.value;
    setPoints([...newPoints]);
  };
  const handleSave = () => {
    var result = "";
    var point = 0;
    points.forEach(p => {
      if (result !== "") {
        result = result + "-";
      }
      result = result + p.toString();
      point += p * 1;
    });
    point =
      points.length > 0 ? (point / points.length).toFixed(2) : 0;
    socket.emit("eloquence-update-point-answer", {
      ...player.answer,
      result: result,
      point: point,
    });
  };

  React.useEffect(() => {
    var sum = 0;
    points.forEach(p => {
      sum += p * 1;
    });
    setAvg(points.length > 0 ? (sum / points.length).toFixed(2) : 0);
  }, [points]);

  React.useEffect(() => {
    const listPoints = player.answer.result.split("-");
    setPoints(listPoints);
  }, [player]);

  return (
    <div className="eloquence-team">
      <div className="information">
        <p className="name">
          {player.displayName.toLocaleUpperCase()}
        </p>
      </div>
      <div className="point-container">
        <div className="points">
          {points.map((item, index) => {
            return (
              <div className="point">
                <p>GK0{index + 1} | 200</p>
                <input
                  type={"number"}
                  value={item}
                  onChange={e => {
                    onChange(e, index);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="controller">
        <button className="btn-remove btn-3D" onClick={handleRemove}>
          -
        </button>
        <button className="btn-add btn-3D" onClick={handleAdd}>
          +
        </button>

        <div className="avg">
          <p>TỔNG ĐIỂM</p>
          <input type={"number"} value={avg} disabled />
        </div>
        <button className="btn-save btn-3D" onClick={handleSave}>
          LƯU
        </button>
      </div>
    </div>
  );
}

export default EloquenceTeam;
