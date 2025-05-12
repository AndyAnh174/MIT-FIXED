import React from "react";
import "./style.scss";

const throttle = f => {
  let token = null,
    lastArgs = null;
  const invoke = () => {
    f(...lastArgs);
    token = null;
  };
  const result = (...args) => {
    lastArgs = args;
    if (!token) {
      token = requestAnimationFrame(invoke);
    }
  };
  result.cancel = () => token && cancelAnimationFrame(token);
  return result;
};

function ElementDrawable(props) {
  const { parentRef, shape, width, height } = props;
  var position = { x: 0, y: 0 };
  var _mousePosition = { x: 0, y: 0 };
  const _ref = React.useRef();

  React.useEffect(() => {
    const padding = 100;
    // const widthMin = 0;
    const widthMax =
      parentRef.current.clientWidth -
      _ref.current.clientWidth -
      padding * 2;
    // const heightMin = 0;
    const heightMax =
      parentRef.current.clientHeight -
      _ref.current.clientHeight -
      padding * 2;
    const x = padding + Math.random() * widthMax;
    const y = padding + Math.random() * heightMax;
    position = { x, y };
    _update();
  }, []);

  const _update = throttle(() => {
    _ref.current.style.left = `${position.x}px`;
    _ref.current.style.top = `${position.y}px`;
  });

  const _onMouseDown = event => {
    if (event.button !== 0) {
      return;
    }
    _mousePosition = { x: event.pageX, y: event.pageY };
    _ref.current.style.cursor = "grabbing";
    document.addEventListener("mousemove", _onMouseMove);
    document.addEventListener("mouseup", _onMouseUp);
  };

  const _onMouseUp = event => {
    _ref.current.style.cursor = "grab";
    document.removeEventListener("mousemove", _onMouseMove);
    document.removeEventListener("mouseup", _onMouseUp);
  };

  const _onMouseMove = event => {
    const maxHeight =
      parentRef.current.clientHeight - _ref.current.clientHeight;
    const maxWidth =
      parentRef.current.clientWidth - _ref.current.clientWidth;
    var newX = event.pageX - _mousePosition.x + position.x;
    var newY = event.pageY - _mousePosition.y + position.y;
    if (newX < 0) {
      // if (newX < -10) _onMouseUp();
      newX = 0;
      _onMouseUp();
    } else {
      if (newX > maxWidth) {
        // if (newX - maxWidth > 10) _onMouseUp();
        newX = maxWidth;
        _onMouseUp();
      }
    }
    if (newY < 0) {
      // if (newY < -10) _onMouseUp();
      newY = 0;
      _onMouseUp();
    } else {
      if (newY > maxHeight) {
        // if (newY - maxHeight > 10) _onMouseUp();
        newY = maxHeight;
        _onMouseUp();
      }
    }

    position = {
      x: newX,
      y: newY,
    };
    _mousePosition = { x: event.pageX, y: event.pageY };
    _ref.current.style.cursor = "grabbing";
    _update();
  };

  React.useEffect(() => {
    _ref.current.addEventListener("mousedown", _onMouseDown);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      _ref.current?.removeEventListener("mousedown", _onMouseDown);
    };
  }, []);

  return (
    <div
      className={"element-drawable " + shape}
      ref={_ref}
      style={{
        "--height": `${height}px`,
        "--width": `${width}px`,
        "--scale": height / width,
      }}
    >
      {props.children}
    </div>
  );
}

export default ElementDrawable;
