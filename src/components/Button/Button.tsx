import { Component, JSX } from "solid-js";
import "./Button.scss";

type ButtonProps = {
  children: JSX.Element;
  type: "button" | "submit" | "reset";
  buttonStyle?: "primary-round" | "primary" | "secondary" | "link";
  onClick?: (x?: any) => any;
};

const Button: Component<ButtonProps> = (props) => {
  return (
    <button
      class={`button button--${props.buttonStyle || "primary-round"}`}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default Button;
