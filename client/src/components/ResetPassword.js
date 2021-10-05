import axios from "axios";
import React, { useEffect, useState } from "react";

const ResetPassword = () => {
  const restPassword = {
    oldPassword: "",
    newPassword: "",
  };
  const [password, setPassword] = useState(restPassword);
  const [id, setId] = useState("");
  const handleOnChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const userId = parseInt(localStorage.getItem("user_id"));
    setId(userId);
    // console.log(userId);
  }, []);
  const handleResetPassword = async (e) => {
    e.preventDefault();
    await axios
      .put("http://localhost:3000/api/user/resetPassword", {
        id: id,
        oldPassword: password.oldPassword,
        newPassword: password.newPassword,
      })
      .then((res) => {
        // console.log(res);
        if (!res.data.data) {
          alert(res.data.message);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <h1>Reset password</h1>
      {id ? (
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
          <button onClick={(e) => handleResetPassword(e)}>
            Reset password
          </button>
        </form>
      ) : (
        <p>Please login first</p>
      )}
    </div>
  );
};

export default ResetPassword;
