import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../utils/context/AuthProvider";
import "./LoginPage.scss";

const LoginPage = () => {
  // @ts-ignore
  const { auth, setAuth } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState();

  const navigate = useNavigate();

  const onChangeText = (event) => {
    const { name, value } = event?.target;
    if (name === "userName");
    {
      setUserName(value);
    }
    setPassword(value);
  };

  const submit = (event) => {
    event.preventDefault();
    if (userName === "admin" && password === "admin") {
      setAuth({ roles: ["admin"] });
      navigate("/");
    }
  };

  return (
    <div className="login-page">
      <h1> Login </h1>
      <form onSubmit={submit} className="login-form">
        <div className="input-field">
          <label>Name</label>
          <input type="text" onChange={onChangeText} name={"userName"} />
        </div>
        <div className="contact-field">
          <label>Password</label>
          <input type="password" onChange={onChangeText} name={"password"} />
        </div>
        <button type="submit"> submit</button>
      </form>
    </div>
  );
};

export default LoginPage;
