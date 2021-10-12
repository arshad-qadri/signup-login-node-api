import React, { useState } from "react";
import axios from "axios";
// import { useHistory } from "react-router";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const history = useHistory();
  const createAcctount = {
    first_name: "",
    last_name: "",
    username: "",
    password: "",
  };
  const [data, setData] = useState(createAcctount);
  const handleOnChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const reg = /^[0-9a-zA-Z@$#?!&]$/;
    // if (data.password === reg.toString()) {
    //   alert(
    //     "Password at least one uppercase character,  one number and one special character '@ $ # ? ! &' minimum length 6 character "
    //   );
    // }
    await axios
      .post("http://localhost:3000/api/user/create", data)
      .then((res) => {
        console.log(res);
        alert(res.data.message);
        if (res) {
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <h1>Signup</h1>
      <form>
        <input
          type="text"
          placeholder="first name"
          value={data.first_name}
          name="first_name"
          onChange={(e) => handleOnChange(e)}
        />
        <br />
        <input
          type="text"
          placeholder="last name"
          value={data.last_name}
          name="last_name"
          onChange={(e) => handleOnChange(e)}
        />
        <br />
        <input
          type="text"
          placeholder="username"
          value={data.username}
          name="username"
          onChange={(e) => handleOnChange(e)}
        />
        <br />
        <input
          type="text"
          placeholder="password"
          value={data.password}
          name="password"
          onChange={(e) => handleOnChange(e)}
        />
        <br />
        <button onClick={(e) => handleSubmit(e)}>Signup</button>
      </form>
    </div>
  );
};

export default Signup;
