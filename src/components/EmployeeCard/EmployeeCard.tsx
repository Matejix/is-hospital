import { Card, createStyles, Avatar, Text, Group } from "@mantine/core";
import { IconPhoneCall, IconAt } from "@tabler/icons";
import { ReactNode } from "react";

interface UserInfoIconsProps {
  avatar: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  occupation: string;
}
const useStyles = createStyles((theme) => ({
  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
  },

  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

function EmployeeCard({
  avatar,
  name,
  title,
  phone,
  email,
  occupation,
}: UserInfoIconsProps) {
  const { classes } = useStyles();
  return (
    <Card shadow="sm" p="xl" component="a" target="_blank">
      <Card.Section>
        <div className="text-slate-700">
          <Group noWrap>
            <Avatar src={avatar} size={94} radius="md" />
            <div>
              <Text
                size="xs"
                sx={{ textTransform: "uppercase" }}
                weight={700}
                color="dimmed"
              >
                {title}
              </Text>

              <Text size="lg" weight={500} className={classes.name}>
                {name}
              </Text>

              <Group noWrap spacing={10} mt={3}>
                <IconAt stroke={1.5} size={16} className={classes.icon} />
                <Text size="xs" color="dimmed">
                  {email}
                </Text>
              </Group>

              <Group noWrap spacing={10} mt={5}>
                <IconPhoneCall
                  stroke={1.5}
                  size={16}
                  className={classes.icon}
                />
                <Text size="xs" color="dimmed">
                  {phone}
                </Text>
              </Group>
            </div>
            <Text className="w-56 ml-10 mr-2 text-cyan-600 font-bold tracking-wide p-3">
              {occupation}
            </Text>
          </Group>
        </div>
      </Card.Section>
    </Card>
  );
}
export default EmployeeCard;
