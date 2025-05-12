import style from "./style.module.scss";

function GroupAQ(probs) {
  var bg = {
    background: "#0C9B75",
  };
  var icon1 = style.icon1;
  var icon2 = style.icon2;

  if (probs.state === "false") {
    bg = {
      background: "#FF7183",
    };
    icon1 = style.icon1_f;
    icon2 = style.icon2_f;
  } else if (probs.state === "not-given") {
    bg = {
      background: "#0088B2",
    };
    icon1 = style.hidden;
    icon2 = style.hidden;
  }

  return (
    <>
      <div className={style.container}>
        <div className={style.name}>
          <div className={style.txtName}>{probs.txtName}</div>
        </div>
        <div className={style.answer}>
          <div className={style.txtAnswer}>{probs.txtAnswer}</div>
          <div className={style.sub_container} style={bg}>
            <div className={style.icon}>
              <div className={icon1}></div>
              <div className={icon2}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GroupAQ;
