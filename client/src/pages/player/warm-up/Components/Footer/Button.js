import style from "./style.module.scss";

function Button(props) {
  return (
    <div className={`${style.container} btn-3D ${props.color}`}>
      {props.title}
    </div>
  );
}

export default Button;
