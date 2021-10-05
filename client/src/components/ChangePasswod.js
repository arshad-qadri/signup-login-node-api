import axios from "axios";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router";

const ChangePasswod = () => {
  const history = useHistory();
  const pass = {
    newPass: "",
    reEntPass: "",
  };
  const [password, setPassword] = useState(pass);
  const { id, token } = useParams();
  console.log("id", id);
  console.log("token", token);
  const handleChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    if (password.newPass !== password.reEntPass) {
      alert("password not match");
    }
    axios
      .post(
        `http://localhost:3000/api/user/change-password/${id}`,
        {
          newPassword: password.newPass,
          reEnterPassword: password.reEntPass,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      .then((res) => {
        console.log(res);
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
      <h1>Change password</h1>
      <input
        type="text"
        placeholder="New password"
        name="newPass"
        value={password.newPass}
        onChange={(e) => handleChange(e)}
      />
      <br />
      <input
        type="text"
        placeholder=" Re-enter password"
        name="reEntPass"
        value={password.reEntPass}
        onChange={(e) => handleChange(e)}
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ChangePasswod;
