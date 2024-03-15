import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import { useState } from "react";

function App() {
  const [snakeBarContent, setSnakeBarContent] = useState("");
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home setSnakeBarContent={setSnakeBarContent}/>
                </ProtectedRoute>
              }
            />
            <Route
              path="login"
              element={<Login setSnakeBarContent={setSnakeBarContent} />}
            />
            <Route
              path="register"
              element={<Register setSnakeBarContent={setSnakeBarContent} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>

      <div
        className={`snack-bar-wrapper ${
          snakeBarContent !== "" ? "snack-bar-visible" : ""
        }`}
      >
        <p className="font-bold font-14 text-white">
          {snakeBarContent || "You are required to Login first"}
        </p>
        <button
          className="ms-4 me-2 position-relative"
          onClick={() => setSnakeBarContent("")}
        >
          <div className="snackbar-cross snackbar-cross-1"></div>
          <div className="snackbar-cross snackbar-cross-2"></div>
        </button>
      </div>
    </div>
  );
}

export default App;
