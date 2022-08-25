import React, {useEffect, useState} from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {useNavigate} from "react-router-dom";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    getUser();
  }, []);

  const refreshToken = async () => {
    try {
      const res = await axios.get("http://localhost:5000/token");
      setToken(res.data.accessToken);
      const decoded = jwtDecode(res.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        navigate("/", {replace: true});
      }
    }
  };

  const axiosJwt = axios.create();

  axiosJwt.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const res = await axios.get("http://localhost:5000/token");
        config.headers.Authorization = `Bearer ${res.data.accessToken}`;
        setToken(res.data.accessToken);
        const decoded = jwtDecode(res.data.accessToken);
        setName(decoded.name);
        setExpire(decoded.exp);
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const getUser = async () => {
    try {
      const res = await axiosJwt.get("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (error) {
      if (error.response.status === 403) {
        navigate("/");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="title">Welcome Back: {name}</h1>
      <button className="button is-info" onClick={getUser}>
        Get Users
      </button>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item) => (
            <tr key={item.id}>
              <th>{item.id}</th>
              <th>{item.name}</th>
              <th>{item.email}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
