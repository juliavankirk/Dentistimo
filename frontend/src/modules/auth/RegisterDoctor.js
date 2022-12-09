import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { registerDoctor } from "../../actions/auth";

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
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector(state => state.message);
  const dispatch = useDispatch();

  const onChangeName = (e) => {
    const name = e.target.value;
    setName(name);
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

      dispatch(registerDoctor(name, email, password))
        .then(() => {
          setSuccessful(true);
        })
        .catch(() => {
          setSuccessful(false);
    });

  };


 const cardStyle = {
  'max-width': '1040px'
 }

  return (
    <section>
        <div class="card mb-3" style={cardStyle}>
          <div class="row g-0">
            <div class="col-md-6">
              <div class="card-body">
                <h2 class="card-title">Register a doctor</h2>
                
                <div class="card-text">

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
                        <button style={{ display: "none" }} />
                      </form>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </section>
    
);
};

export default Register;
