import style from './Footer.module.scss'
import React, { useEffect, useState } from "react";

function Footer() {
    const [progress, setProgress] = useState(50);
    return (
        <div className={style.footer}>
            <div className={style.timer}>
              <p>00:36</p>
              <div
                className={style.progressBar}
                style={{
                  backgroundSize: progress + "%",
                  "--value": `${progress}%`,
                }}
              ></div>
            </div>
            <div className={style.groupBtn}>
              <button className={`${style.prevBtn} btn-3D`}>PHÍA TRƯỚC</button>
              <button className={`${style.startBtn} btn-3D`}>BẮT ĐẦU</button>
              <button className={`${style.nextBtn} btn-3D`}>PHÍA SAU</button>
            </div>
          </div>
    );
}

export default Footer;