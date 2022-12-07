import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate  } from 'react-router-dom';

import { login } from "../../actions/auth";
import loginImg from "../../assets/login-img.jpg";

const Login = (props) => {
  let navigate = useNavigate();
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useSelector(state => state.auth);
  const { message } = useSelector(state => state.message);


  const dispatch = useDispatch();
  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(login(username, password))
        .then(() => {
          navigate("/profile");
          window.location.reload();
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  const imgSyle = {
    'max-width': '540px'
   }

  return (
    <section>
      <div className="col-md-12">
        <div className="card card-container">
          <div class="row g-0">
          <div class="col-md-6">
            <img
              src={loginImg}
              alt="profile-img"
              className="profile-img-card"
              style={imgSyle}
            />
          </div>
          <div class="col-md-4">
          <h2 class="card-title">Login</h2>
            <div className="card-text">
              <form onSubmit={handleLogin} ref={form}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={username}
                    onChange={onChangeUsername}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={password}
                    onChange={onChangePassword}
                  />
                </div>

                <div className="form-group">
                  <button className="btn btn-primary btn-block" disabled={loading}>
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Login</span>
                  </button>
                </div>

                {message && (
                  <div className="form-group">
                    <div className="alert alert-danger" role="alert">
                      {message}
                    </div>
                  </div>
                )}
                {/*<CheckButton style={{ display: "none" }} ref={checkBtn} />*/}
              </form>
              <p class="card-text"><small>Not a member? <Link to={'/register'}>Click here to register.</Link></small></p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
    
  );
};

export default Login;
