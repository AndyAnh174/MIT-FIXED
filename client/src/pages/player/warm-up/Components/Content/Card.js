import style from './Card.module.scss'
import { Link } from 'react-router-dom';
import React from "react";

function Card(props) {
    var score = style.score
    var title = 'YEAH!! HAY QUÁ'
    var sub_title = 'Giữ vững phong độ nào <3'
    var bg = {
        background: "#0C9B75",
    }
    var icon1 = style.icon1
    var icon2 = style.icon2
    var left = {
        left: '53%',
    }

    if (props.status !== 'success'){
        score = style.score_none
        title = 'HUHU! TIẾC QUÁ :<'
        sub_title = 'Cố lên nào!!'
        bg = {
            background: "#FF7183",
        }
        icon1 = style.icon1_fail
        icon2 = style.icon2_fail
        left = {
            left: '45%',
        }
    }
    
    return (
        <>
        <div className={style.container}>
            <div className={style.sub_container} style={bg}>
                <div className={style.icon} style={left}>
                    <div className={icon1}></div>
                    <div className={icon2}></div>
                </div>
                <div className={style.text}>
                    <div className={score}>+ 10</div>
                    <div className={style.title}>{title}</div>
                    <div className={style.sub_title}>{sub_title}</div>
                </div>
            </div>
            <Link to={"#"} className={style.modal__close}>&times;</Link>
        </div>
        </>
    )
}

export default Card;