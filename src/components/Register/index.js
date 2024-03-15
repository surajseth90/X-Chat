import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import "../../auth.scss";

export default function Login({ setSnakeBarContent }) {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const profileImgRef = useRef(null);
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const time = new Date().getTime();
      const storageRef = ref(storage, `${formData.userName + time}`);

      await uploadBytesResumable(storageRef, formData.img);
      const downloadURL = await getDownloadURL(storageRef);

      await Promise.all([
        updateProfile(res.user, {
          displayName: formData.userName,
          photoURL: downloadURL,
        }),
        setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          displayName: formData.userName,
          email: formData.email,
          photoURL: downloadURL,
        }),
        setDoc(doc(db, "userChats", res.user.uid), {}),
      ]);

      navigate("/");
    } catch (err) {
      console.log("Error : ", err);
      setSnakeBarContent("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const profileImageUploadHandler = (e) => {
    const img = e.target.files[0];
    const reader = new FileReader();

    if (img) {
      reader.readAsDataURL(img);
    }
    reader.onload = () => {
      setProfileImage(reader.result);
    };
    setFormData({ ...formData, img });
  };

  return (
    <div className="login-page-container">
      <div className="login-wrapper">
        <div className="logo-container">
          <p>X-CHAT</p>
        </div>
        <form className="login-form" onSubmit={onSubmitHandler}>
          <p className="auth-header">Register to X-CHAT</p>

          <div className="input-field-wrapper d-flex flex-column align-items-center">
            <div className="user-img">
              {profileImage && (
                <img src={profileImage} alt="profile" className="profile-img" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="d-none"
              ref={profileImgRef}
              onChange={profileImageUploadHandler}
            />
            <button
              className="text-btn-orange mt-3"
              onClick={() => profileImgRef.current.click()}
              type="button"
            >
              Add Profile Picture
            </button>
          </div>

          <div className="input-field-wrapper">
            <input
              type="text"
              name="userName"
              placeholder="User Name"
              className="font-14 w-100"
              onChange={onChangeHandler}
              value={formData?.userName || ""}
            />
          </div>

          <div className="input-field-wrapper">
            <input
              type="email"
              id="email"
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
              id="password"
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
              Object.entries(formData).length !== 4 ||
              Object.values(formData).includes("") ||
              loading
            }
          >
            REGISTER
          </button>
          <div className="d-flex justify-content-center w-100 mt-3">
            <p className={`text-dark ${loading ? "disabled" : ""}`}>
              Already Have An Account?&nbsp;
              <Link
                to={"/login"}
                className={`text-orange font-14 ${loading ? "disabled" : ""}`}
              >
                Login Here!
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
