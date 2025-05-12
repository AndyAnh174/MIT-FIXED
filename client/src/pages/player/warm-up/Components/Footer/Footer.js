import style from './Footer.module.scss'
import Button from './Button'

function Footer() {
    return (
        <div className={style.container}>
            <Button color = "blue" title = "A"/>
            <Button color = "green" title = "B"/>
            <Button color = "red" title = "C"/>
            <Button color = "orange" title = "D"/>
        </div>
    );
}

export default Footer;