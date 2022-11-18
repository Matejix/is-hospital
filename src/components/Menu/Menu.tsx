import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Center, Tooltip, UnstyledButton, Stack } from "@mantine/core";
import {
  TablerIcon,
  IconHome2,
  IconLogout,
  IconArrowLeft,
} from "@tabler/icons";

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
      className="bg-slate-600"
    >
      <UnstyledButton
        onClick={onClick}
        className={`bg-teal-400 text-slate-100 p-2 m-2 rounded-lg transition duration-500 hover:scale-110 hover:shadow-lg hover:shadow-teal-700 hover:bg-teal-400`}
      >
        <Icon stroke={2} className="w-12 h-12" />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [{ icon: IconHome2, label: "Domov", linkTo: "/app" }];

export function Menu() {
  const { pathname } = useLocation();

  const links = mockdata.map((link, index) => (
    <Link to={link.linkTo}>
      <NavbarLink
        {...link}
        key={link.label}
        active={pathname === link.linkTo}
      />
    </Link>
  ));

  return (
    <Navbar className="fixed w-24 h-screen bg-teal-500 items-center">
      <Center>LOGO</Center>
      <Navbar.Section grow mt={50}>
        <Stack justify="center" spacing={0}>
          <BackButton actualPath={pathname} />
          {links}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack mb={10} justify="center" spacing={0}>
          <Link to="/">
            <NavbarLink icon={IconLogout} label="Logout" />
          </Link>
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}

export default Menu;
