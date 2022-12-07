import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import { register } from "../../actions/auth";
import dentistry from "../../assets/dentistry.png";
import { Link,useNavigate } from "react-router-dom";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const vname = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The name should have 3 to 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 20 characters.
      </div>
    );
  }
};

const Register = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [name, setName] = useState(""); 
  const [address, setAddress] = useState("");
  const [bday, setBday] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector(state => state.message);
  const dispatch = useDispatch();

  const onChangeName = (e) => {
    const name = e.target.value;
    setName(name);
  };

  const onChangeAddress = (e) => {
    const address = e.target.value;
    setAddress(address);
  };

  const onChangeBday = (e) => {
    const bday = e.target.value;
    setBday(bday);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setSuccessful(false);

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(register(name, email, password))
        .then(() => {
          setSuccessful(true);
        })
        .catch(() => {
          setSuccessful(false);
    });
    }
  };
  //
  const navigate = useNavigate();

  const registerUser = () => {
    navigate("/register");
  }

  const registerClinic = () => {
    navigate("/register-clinic");
  }

 const cardStyle = {
  'max-width': '1040px'
 }

 const imgSyle = {
  'max-width': '540px'
 }
  return (
    <section>
        <div class="card mb-3" style={cardStyle}>
          <div class="row g-0">
            <div class="col-md-6">
              <div class="card-body">
                <h2 class="card-title">Register</h2>
                
                <div class="card-text">
                    <div className="row">
                      <div className="col">
                        <button className="btn btn-primary btn-block" onClick={registerUser}>Patient</button>
                      </div>
                      <div className="col">
                        <button className="btn btn-primary btn-block" onClick={registerClinic}>Clinic</button>
                      </div>

                      <form onSubmit={handleRegister} ref={form}>
                        {!successful && (
                          <div>
                            <div className="form-group">
                              <label htmlFor="name">Name</label>
                              <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={name}
                                onChange={onChangeName}
                                validations={[required, vname]}
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor="address">Address</label>
                              <input
                                type="text"
                                className="form-control"
                                name="address"
                                value={address}
                                onChange={onChangeAddress}
                                // validations={[required, vaddress]}
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor="name">Date of birth</label>
                              <input
                                type="text"
                                className="form-control"
                                name="bday"
                                value={bday}
                                onChange={onChangeBday}
                                // validations={[required, vbday]}
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor="email">Email</label>
                              <input
                                type="text"
                                className="form-control"
                                name="email"
                                value={email}
                                onChange={onChangeEmail}
                                validations={[required]}
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
                                validations={[required, vpassword]}
                              />
                            </div>

                            <div className="form-group">
                              <button className="btn btn-primary btn-block">Sign Up</button>
                            </div>
                          </div>
                        )}

                        {message && (
                          <div className="form-group">
                            <div className={ successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                              {message}
                            </div>
                          </div>
                        )}
                        <button style={{ display: "none" }} ref={checkBtn} />
                      </form>
                  </div>
                </div>
                <p class="card-text"><small>Already a member? <Link to={'/login'}>Click here to log in.</Link></small></p>
              </div>
            </div>

            <div class="col-md-4">
              <img
                  src={dentistry}
                  alt="dentistry"
                  className="profile-img-card"
                  style={imgSyle}
                />
            </div>
          </div>
        </div>
    </section>
    
);
};

export default Register;
