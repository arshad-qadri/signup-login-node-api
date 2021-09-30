import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router";

const Login = () => {
  const loginData = {
    username: "",
    password: "",
  };
  const [login, setLogin] = useState(loginData);
  const history = useHistory();

  const handleOnChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:3000/api/user/login", login)
      .then((res) => {
        console.log("====", res);
        if (res) {
          localStorage.setItem("user_id", res.data.data.id);
          localStorage.setItem("token", res.data.token);
          alert(res.data.message);
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <h1>login</h1>
      <form>
        <input
          type="text"
          placeholder="username"
          value={login.username}
          name="username"
          onChange={(e) => handleOnChange(e)}
        />
        <br />
        <input
          type="text"
          placeholder="password"
          value={login.password}
          name="password"
          onChange={(e) => handleOnChange(e)}
        />
        <br />
        <button onClick={(e) => handleLogin(e)}>Login</button>
      </form>
    </div>
  );
};

export default Login;
