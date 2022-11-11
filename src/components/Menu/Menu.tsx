import { NavLink } from "react-router-dom";

function Menu() {
  return (
    <>
      <ul>
        <li>
          <StyledNavLink text="Späť" link="/app" />
        </li>

        <li>
          <StyledNavLink text="Lekarsky predpis" link="recipe" />
        </li>
        <li>
          <StyledNavLink text="Správa pacientov" link="patientService" />
        </li>
        <li>
          <StyledNavLink text="Rozpis služieb" link="schedule" />
        </li>
        <li>
          <StyledNavLink text="Hospitalizacia" link="hospitalization" />
        </li>
        <li>
          <StyledNavLink text="Žiadanka" link="requester" />
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
  if (link.includes("app")) {
    return (
      <NavLink className="" to={link}>
        {text}
      </NavLink>
    );
  }
  return (
    <NavLink className="[&.active]:text-red-500" to={link}>
      {text}
    </NavLink>
  );
}
