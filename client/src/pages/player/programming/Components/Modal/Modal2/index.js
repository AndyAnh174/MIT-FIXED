import style from "../Modal2/style.module.scss"

function Modal2() {
  return (
  <>
  <div className={style.container}>
    <div className={style.content}>
      <div className={style.title}>Lượt của bạn đã hết</div>
      <div className={style.sub_title}>Mời thành viên tiếp theo</div>
      <button className = {`${style.btn} btn-3D`}>Bắt đầu lượt mới</button>
    </div>
  </div>
  </>
  )
}

export default Modal2;

