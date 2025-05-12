import style from "../Modal1/style.module.scss"

function Modal1() {
  return (
  <>
  <div className={style.container}>
    <div className={style.bg}>
      <div className={style.text_btn}>
        <div className={style.text}>Đề bài</div>
        <button className = {`${style.btn} btn-3D`}>Trở về làm bài</button>
      </div>
      <div className={style.bg_white}>
        <div className={style.logo}></div>
      </div>
    </div>
  </div>
  </>
  )
}

export default Modal1;

