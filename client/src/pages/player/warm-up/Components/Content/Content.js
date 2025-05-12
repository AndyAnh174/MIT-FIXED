import style from "./Content.module.scss";
import Card from "./Card";

function Content() {
  return (
    <div className={style.container}>
      <div className={style.title}>VÒNG KHỞI ĐỘNG</div>
      <div className={style.score}>+ 10</div>
      <div className={style.question}>CÂU 01/10</div>
      <div className={style.content}>
        <div className={style.logo}></div>
        <div className={style.keychains}>
          <div className={style.keychains_left}>
            <div className={style.keychain}></div>
            <div className={style.keychain}></div>
            <div className={style.keychain}></div>
          </div>
          <div className={style.keychains_right}>
            <div className={style.keychain}></div>
            <div className={style.keychain}></div>
            <div className={style.keychain}></div>
          </div>
        </div>
        <div className={style.card}>
          <Card status={"success"} />
          {/* <Card /> */}
        </div>
      </div>
    </div>
  );
}

export default Content;
