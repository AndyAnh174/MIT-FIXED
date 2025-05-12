import style from "./Content.module.scss";
import { ReactComponent as DropdownIcon } from "../../../../../assets/svg/dropdown-icon-white.svg";
import Footer from "../Footer/Footer";
import GroupA_Q from "../GroupA_Q";
function Content() {
  return (
    <div className={style.container}>
      <div className={style.left}>
        <div className={style.title}>VÒNG THI KHỞI ĐỘNG</div>
        <div className={style.scoreLeft}>+ 10</div>
        <div className={style.scoreRight}>A</div>
        <div className={style.selectRoundBtn}>
            Câu 01/10
            <DropdownIcon />
          </div>
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
        </div>
        <Footer />
        
      </div>
      <div className={style.right}>
        <div className={style.textDA}>ĐÁP ÁN CỦA CÁC ĐỘI</div>
        <div className={style.answer}>
          <GroupA_Q txtName="JUST IN TIME" txtAnswer="A" state="true"/>
          <GroupA_Q txtName="JUST IN TIME" txtAnswer="A" state="true"/>
          <GroupA_Q txtName="JUJUSTU KAISEN" txtAnswer="B" state="false"/>
          <GroupA_Q txtName="JUJUSTU KAISEN" txtAnswer="?" state="not-given"/>
          <GroupA_Q txtName="JUJUSTU KAISEN" txtAnswer="?" state="not-given"/>
        </div>
      </div>
    </div>
  );
}

export default Content;
