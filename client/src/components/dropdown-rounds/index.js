import React from "react";
import classNames from "classnames";
import { ReactComponent as DropdownIcon } from "../../assets/svg/dropdown-icon.svg";
import "./style.scss";

RoundsDropDown.propTypes = {};
RoundsDropDown.defaultProps = {
  defaultValue: "",
  items: [{ _id: "", name: "Waiting Room" }],
  onChange: () => {},
};

function RoundsDropDown(props) {
  const { defaultValue, items, onChange } = props;
  const [indexSelected, setIndexSelected] = React.useState(-1);

  const [active, setActive] = React.useState(false);
  const _containerRef = React.useRef();

  React.useEffect(() => {
    const index = items.findIndex(item => item._id === defaultValue);
    setIndexSelected(index);
  }, [defaultValue, items]);

  const handleClick = () => {
    setActive(!active);
  };
  const handleClickOutside = event => {
    if (
      _containerRef.current &&
      !_containerRef.current.contains(event.target)
    ) {
      setActive(false);
    }
  };
  const handleItemOnClick = _id => {
    const index = items.findIndex(item => item._id === _id);
    setIndexSelected(index);
    onChange(_id);
  };
  document.addEventListener("mousedown", handleClickOutside);
  return (
    <div
      ref={_containerRef}
      className={classNames({
        "dropdown-container": true,
        active: active,
      })}
      style={{ "--number-items": items.length }}
    >
      <div onClick={() => handleClick()} className="item selected">
        <p>
          {indexSelected > -1
            ? items[indexSelected].name
            : "Loading..."}
        </p>
        <DropdownIcon />
      </div>
      <div className="dropdown">
        <div className="list-item">
          {items.map((item, index) => {
            return (
              item._id !== defaultValue && (
                <div
                  className="item"
                  key={index}
                  onClick={() => handleItemOnClick(item._id)}
                >
                  <p>{item.name}</p>
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RoundsDropDown;
