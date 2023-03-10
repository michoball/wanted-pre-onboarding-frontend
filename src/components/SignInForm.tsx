import {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import AppButton from "@styles/button/AppButton";
import FormInput from "@styles/FormInput";
import styled from "styled-components";
import AuthContext from "context/authContext";
import { useNavigate } from "react-router-dom";

export interface State {
  value: string;
  isValid: boolean | null;
}

export interface ActionType {
  type: string;
  val?: string;
}

export const emailReducer = (state: State, action: ActionType): State => {
  if (action.type === "USER_INPUT") {
    if (action.val)
      return {
        value: action.val,
        isValid: action.val.includes("@"),
      };
  }
  return { value: "", isValid: null };
};

export const passwordReducer = (state: State, action: ActionType): State => {
  if (action.type === "USER_INPUT") {
    if (action.val)
      return { value: action.val, isValid: action.val.trim().length >= 8 };
  }
  return { value: "", isValid: null };
};

const SignInForm = () => {
  const { onLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formIsValid, setFormIsValid] = useState(false);
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });
  const { value: email, isValid: emailIsValid } = emailState;
  const { value: password, isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(!!emailIsValid && !!passwordIsValid);
    }, 300);

    return () => {
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formIsValid) {
      onLogin(email, password);
      navigate("/todo");
    }
    dispatchEmail({ type: "RESET" });
    dispatchPassword({ type: "RESET" });
  };

  const emailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
  };

  const passwordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
  };

  return (
    <>
      <AuthForm onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="email"
          data-testid="email-input"
          value={email}
          required
          isValid={emailIsValid}
          onChange={emailChangeHandler}
        />
        <FormInput
          label="Password"
          type="password"
          data-testid="password-input"
          value={password}
          required
          isValid={passwordIsValid}
          onChange={passwordChangeHandler}
        />
        <AppButton
          type="submit"
          data-testid="signin-button"
          isNotValid={!formIsValid}
        >
          {formIsValid ? "Sign In" : <span>&#10005;</span>}
        </AppButton>
      </AuthForm>
    </>
  );
};

export const AuthForm = styled.form`
  min-width: 500px;

  button {
    margin: 30px auto;
  }
`;

export default SignInForm;
