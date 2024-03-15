import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../auth.scss";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ setSnakeBarContent }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/");
    } catch (err) {
      switch (err.code) {
        case "auth/invalid-email":
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setSnakeBarContent("Invalid Email or Password");
          break;
        default:
          setSnakeBarContent("Authentication Failed!");
      }
      setTimeout(() => {
        setSnakeBarContent("");
      }, 1500);

      console.log("err : ", err);
    } finally {
      setLoading(false);
    }
  };

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-page-container">
      <div className="login-wrapper">
        <div className="logo-container">
          <p>X-CHAT</p>
        </div>
        <form className="login-form" onSubmit={onSubmitHandler}>
          <p className="auth-header">Login to X-CHAT</p>

          <div className="input-field-wrapper">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="font-14 w-100"
              onChange={onChangeHandler}
              value={formData?.email || ""}
            />
          </div>

          <div className="input-field-wrapper mt-3">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="font-14 w-100"
              onChange={onChangeHandler}
              value={formData?.password || ""}
            />
          </div>
          <button
            type="submit"
            className="w-100 mt-3 btn-orange"
            disabled={
              Object.entries(formData).length !== 2 ||
              Object.values(formData).includes("") ||
              loading
            }
          >
            LOGIN
          </button>
          <div className="d-flex justify-content-center w-100 mt-3">
            <p className={`text-dark ${loading ? "disabled" : ""}`}>
              New User? &nbsp;
              <Link
                to={"/register"}
                className={`text-orange font-14 ${loading ? "disabled" : ""}`}
              >
                Register Here!
              </Link>
            </p>
          </div>
          <div
            className="d-flex justify-content-center align-items-center mt-2"
            style={{ height: 30 }}
          >
            {loading && <div className="loader-small"></div>}
          </div>
        </form>
      </div>
    </div>
  );
}
