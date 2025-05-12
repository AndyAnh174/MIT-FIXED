import style from "../Modal3/style.module.scss"

function Modal3() {
  return (
  <>
  <div className={style.container}>
    <div className={style.content}>
      <div className={style.title}>XÁC NHẬN KHÔI PHỤC</div>
      <div className={style.sub_title}>Khôi phục sẽ xóa hết các code hiện tại</div>
      <div className={style.btn}>
        <button className = {`${style.btn_left} btn-3D`}>Suy nghĩ kỹ thêm
          </button>
        <button className = {`${style.btn_right} btn-3D`}>Khôi phục ngay</button>
      </div>
    </div>
  </div>
  </>
  )
}

export default Modal3;

