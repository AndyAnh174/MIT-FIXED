import React, { useState, useRef } from "react";
import "./style.scss";
import { VscClose, VscEye, VscEyeClosed } from "react-icons/vsc";
import userApi from "apis/userApi";
import { Role } from "constants";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState({
    status: "",
    message: "",
  });
  const [hiddenPassword, setHiddenPassword] = useState(true);

  const usernameRef = useRef();
  const passwordRef = useRef();

  const closeErrorModal = () => {
    setError({
      status: "",
      message: "",
    });
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const validate = (username, password) => {
    if (!username) {
      setError({
        status: 400,
        message: "Vui lòng nhập đầy đủ thông tin",
      });
      usernameRef.current.focus();
      return false;
    } else if (!password) {
      setError({
        status: 400,
        message: "Vui lòng nhập đầy đủ thông tin",
      });
      passwordRef.current.focus();
      return false;
    }
    return true;
  };

  const handleSubmit = event => {
    event.preventDefault();
    const { username, password } = user;
    if (validate(username, password)) {
      closeErrorModal();
      userApi
        .login(username, password)
        .then(({ data }) => {
          if (data.role === Role.Admin) navigate("/admin");
          else navigate("/game");
        })
        .catch(error => {
          const status = error.response.status;
          if (status === 405) {
            setError({
              status: error.response.status,
              message: "Tài khoản đã được đăng nhập!",
            });
          }
          if (status === 403) {
            setError({
              status: error.response.status,
              message: "Tài khoản hoặc mật khẩu không khớp",
            });
          }
        });
    }
  };

  return (
    <div className="login-container">
      <div className="sub-container">
        <div className="form-container">
          <div className="logo">
            <div className="logo-image"></div>
          </div>
          <div className="heading">
            <h1>ĐĂNG NHẬP</h1>
          </div>
          {error.status ? (
            <div className="error-container">
              <div className="error-status">
                <h2 className="error-title" style={{ margin: 0 }}>
                  Đăng nhập thất bại!
                </h2>
                <p
                  className="error-content"
                  style={{
                    fontSize: "20px",
                    marginBottom: 0,
                    marginTop: "11px",
                  }}
                >
                  {error.message}
                </p>
              </div>
              <div
                className="error-close-button"
                onClick={closeErrorModal}
              >
                <VscClose color="white" size={"25px"} />
              </div>
            </div>
          ) : null}
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              ref={usernameRef}
              id="inputTenDangNhap"
              name="username"
              placeholder="Tên đăng nhập"
              value={user.username}
              onChange={handleChange}
            />
            <div className="password-group">
              <input
                ref={passwordRef}
                type={hiddenPassword ? `password` : `text`}
                id="inputMatKhau"
                name="password"
                placeholder="Mật khẩu"
                value={user.password}
                onChange={handleChange}
              />
              <div
                className="hidden-password-icon"
                onClick={() => setHiddenPassword(!hiddenPassword)}
              >
                {hiddenPassword ? (
                  <VscEye color="#FFFFFF" size={25} />
                ) : (
                  <VscEyeClosed color="#FFFFFF" size={25} />
                )}
              </div>
            </div>

            <button type="submit" className="submit-btn btn-3D">
              ĐĂNG NHẬP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
