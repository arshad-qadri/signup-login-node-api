import React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const Home = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    history.push("/login");
  };
  if (!token) {
    history.push("/login");
  }
  return (
    <div>
      <h1>Home page</h1>
      <button onClick={handleLogout}>Logout</button> <br />
      <Link to="resetpassword">Reset password</Link>
    </div>
  );
};

export default Home;
