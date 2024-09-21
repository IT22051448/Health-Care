import CommonForm from "@/components/common/form";
import { Link } from "react-router-dom";
import { loginFormControls } from "@/config";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "@/redux/authSlice";

const initialState = {
  username: "",
  password: "",
};

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();
    console.log(formData);

    dispatch(loginUser(formData))
      .then((result) => {
        if (result.type === "auth/login/fulfilled") {
          console.log("Login successful", result.payload.user);
        } else {
          console.error("Login failed");
        }
      })
      .catch(() => {
        console.error("Login failed");
      });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome Back!
        </h1>
        <p className="mt-2">
          Do not have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/signup"
          >
            Sign Up
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AuthLogin;
