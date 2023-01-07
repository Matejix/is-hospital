import { Card, createStyles, Avatar, Text, Group } from "@mantine/core";
import { IconPhoneCall, IconAt } from "@tabler/icons";
import { ReactNode } from "react";

interface UserInfoIconsProps {
  avatar: Buffer | null;
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
    <Card shadow="xl" p="xl" component="a" target="_blank">
      <Card.Section>
        <div className="text-slate-700">
          <Avatar
            className="w-full"
            src={`data:image/jpeg;base64,${avatar}`}
            size={500}
            radius="md"
          />
          <div className="p-8">
            <div className="text-center">
              <Text
                size="xl"
                sx={{ textTransform: "uppercase" }}
                weight={700}
                color="dimmed"
              >
                {title}
              </Text>

              <Text mt={5} size="xl" weight={500} className={classes.name}>
                {name}
              </Text>
            </div>
            <div className="flex justify-between mt-5">
              <Group noWrap spacing={10} mt={3}>
                <IconAt stroke={1.5} size={16} className={classes.icon} />
                <Text size="md" color="dimmed">
                  {email}
                </Text>
              </Group>

              <Group noWrap spacing={10} mt={5}>
                <IconPhoneCall
                  stroke={1.5}
                  size={16}
                  className={classes.icon}
                />
                <Text size="md" color="dimmed">
                  {phone}
                </Text>
              </Group>
            </div>
          </div>
          <Text
            size="xl"
            className="text-center text-cyan-600 font-bold tracking-wide pb-10"
          >
            {occupation}
          </Text>
        </div>
      </Card.Section>
    </Card>
  );
}
export default EmployeeCard;
