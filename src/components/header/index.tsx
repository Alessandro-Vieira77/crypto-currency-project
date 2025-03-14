import { Link } from "react-router-dom";
import style from "./header.module.css";
import logoImg from "../../assets/logo.svg";

export function Header() {
  return (
    <header className={style.container}>
      <Link to="/">
        <img src={logoImg} alt="logo  cripto App" />
      </Link>
    </header>
  );
}
