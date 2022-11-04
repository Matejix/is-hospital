import { NavLink } from "react-router-dom";

function Menu() {
  return (
    <>
      <ul>
        <li>
          <StyledNavLink text="Home" link="/" />
        </li>

        <li>
          <StyledNavLink text="Medicaments" link="/medicaments" />
        </li>
      </ul>
    </>
  );
}

export default Menu;

type Props = {
  text: string;
  link: string;
};

function StyledNavLink({ text, link }: Props) {
  return (
    <NavLink className="[&.active]:text-red-500" to={link}>
      {text}
    </NavLink>
  );
}
