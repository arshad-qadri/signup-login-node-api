import axios from "axios";
import React, { useState } from "react";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const handleSubmit = () => {
    axios
      .post("http://localhost:3000/api/user/forgotPassword", {
        username: username,
      })
      .then((res) => {
        console.log("res", res);
        if (res) {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <h1>Change password</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <button onClick={handleSubmit}>submit</button>
    </div>
  );
};

export default ForgotPassword;
