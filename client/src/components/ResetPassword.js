import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router";

const ResetPassword = () => {
  const restPassword = {
    oldPassword: "",
    newPassword: "",
  };
  const [password, setPassword] = useState(restPassword);
  const handleOnChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };
  const history = useHistory();
  const token = localStorage.getItem("token");
  if (!token) {
    history.push("/login");
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password.newPassword || !password.oldPassword) {
      alert("plz fill the all fields");
    } else {
      await axios
        .put(
          "http://localhost:3000/api/user/resetPassword",
          {
            oldPassword: password.oldPassword,
            newPassword: password.newPassword,
          },
          { headers: { authorization: `Bearer ${token}` } }
        )
        .then((res) => {
          if (res) {
            alert(res.data.message);
            history.push("/");
            console.log(res);
          }
        })
        .catch((error) => {
          const message1 = error?.response?.data?.validation?.body?.message;
          const message2 = error?.response?.data?.message;
          if (message1) {
            alert(message1);
          } else {
            alert(message2);
          }
        });
    }
  };
  return (
    <div>
      <h1>Reset password</h1>
      <form>
        <label htmlFor="old password"> Old Password</label> &nbsp;
        <input
          type="text"
          placeholder="old password"
          value={password.oldPassword}
          name="oldPassword"
          onChange={(e) => {
            handleOnChange(e);
          }}
        />
        <br />
        <label htmlFor="old password"> New Password</label> &nbsp;
        <input
          type="text"
          placeholder="new password"
          value={password.newPassword}
          name="newPassword"
          onChange={(e) => {
            handleOnChange(e);
          }}
        />
        <br />
        <button onClick={(e) => handleResetPassword(e)}>Reset password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
