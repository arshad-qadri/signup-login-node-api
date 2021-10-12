import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

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

    if (!login.username || !login.password) {
      alert("plz fill the all fields");
    } else {
      await axios
        .post("http://localhost:3000/api/user/login", login)
        .then((res) => {
          console.log("====", res);
          if (res) {
            localStorage.setItem("token", res.data.data.token);
            alert(res.data.message);
            history.push("/");
          }
        })
        .catch((error) => {
          // console.log("err", error.response.data.message);
          if (error) {
            alert(error.response.data.message);
          }
        });
    }
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
        <button onClick={(e) => handleLogin(e)}>Login</button> <br />
        <Link to="/signup">Create your account</Link> <br />
        <Link to="/forgot-password">Forgot password</Link>
      </form>
    </div>
  );
};

export default Login;
