import React from "react";
import "./style.scss";
import { ReactComponent as TrueIcon } from "../../../../../assets/svg/true-icon.svg";
import { ReactComponent as FalseIcon } from "../../../../../assets/svg/false-icon.svg";

const NotiPopup = props => {
  const { point, solution, answer } = props;
  const modal = {
    true: {
      title: "CHÍNH XÁC",
      subTitle: "YEAH! HAY QUÁ",
      content: "Đội bạn nhận thêm " + point + " điểm",
    },
    false: {
      title: "SAI",
      subTitle: "ĐÁP ÁN ĐÚNG LÀ " + solution,
      content: "Cố lên nào!!",
    },
  };

  return (
    <div className="container">
      <div className={answer.toString() + " modal"}>
        <div className="title">
          {answer ? modal.true.title : modal.false.title}
        </div>
        <div className="sub-title">
          {answer ? modal.true.subTitle : modal.false.subTitle}
        </div>
        <div className="content">
          {answer ? modal.true.content : modal.false.content}
        </div>
      </div>
    </div>
  );
};

export default NotiPopup;
