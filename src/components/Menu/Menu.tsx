import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Center, Tooltip, UnstyledButton, Stack } from "@mantine/core";
import {
  TablerIcon,
  IconHome2,
  IconLogout,
  IconArrowLeft,
  IconUser,
} from "@tabler/icons";
import logo from "../../assets/logo-white.png";
interface NavbarLinkProps {
  icon: TablerIcon;
  label: string;
  active?: boolean;
  onClick?(): void;
}

interface BackButton {
  actualPath: string;
}

function BackButton({ actualPath }: BackButton) {
  const navigate = useNavigate();
  if (actualPath !== "/app") {
    return (
      <NavbarLink
        onClick={() => navigate(-1)}
        icon={IconArrowLeft}
        label="Back"
      />
    );
  }
  return null;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  // const buttonClass = active
  //   ? "bg-teal-300 text-slate-100 m-2"
  //   : "text-slate-100 m-2";
  const hoverEffects = "";

  return (
    <Tooltip
      label={label}
      position="right-end"
      transitionDuration={500}
      transition="scale"
      openDelay={500}
      className="bg-slate-600 z-20"
    >
      <UnstyledButton
        onClick={onClick}
        className={`bg-blue-500 text-slate-100 p-2 m-2 rounded-lg transition duration-500 hover:scale-110 hover:shadow-lg hover:shadow-blue-700 hover:bg-blue-400`}
      >
        <Icon stroke={2} className="w-8 h-8" />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Domov", linkTo: "/app" },
  { icon: IconUser, label: "Profil", linkTo: "/app/profile" },
];

export function Menu() {
  const { pathname } = useLocation();
  const logout = () => {
    localStorage.removeItem("token");
  };
  const links = mockdata.map((link, index) => (
    <Link to={link.linkTo} key={link.linkTo}>
      <NavbarLink
        {...link}
        key={link.label}
        active={pathname === link.linkTo}
      />
    </Link>
  ));

  return (
    <Navbar className="fixed w-24 h-screen bg-gradient-to-b from-blue-500 to-blue-400 items-center">
      <Center>
        <img className="w-32 p-2 mt-2" src={logo} alt="E-Hospital logo" />
      </Center>
      <Navbar.Section grow mt={50}>
        <Stack justify="center" spacing={0}>
          <BackButton actualPath={pathname} />
          {links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack mb={10} justify="center" spacing={0}>
          <Link to="/" onClick={logout}>
            <NavbarLink icon={IconLogout} label="Logout" />
          </Link>
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}

export default Menu;
