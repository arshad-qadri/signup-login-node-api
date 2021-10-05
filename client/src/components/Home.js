import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const Home = () => {
  const history = useHistory();
  const id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const [data, setData] = useState();

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    history.push("/login");
  };
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, token]);

  if (!token) {
    history.push("/login");
  }
  return (
    <div>
      <h1>Home page</h1>
      <h2> {data?.data?.first_name} </h2>
      <button onClick={handleLogout}>Logout</button> <br />
      <Link to="resetpassword">Reset password</Link>
    </div>
  );
};

export default Home;
