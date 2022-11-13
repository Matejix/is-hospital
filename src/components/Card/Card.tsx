import { MouseEvent, useState } from "react";
import { Card as MantineCard, Text, Group } from "@mantine/core";

type Props = {
  text: string;
  icon: React.ReactNode;
  onHover?: (e: MouseEvent<HTMLDivElement>) => void;
  onHoverEnd?: (e: MouseEvent<HTMLDivElement>) => void;
  hoverClass?: string;
};

const Card = ({
  text,
  icon,
  onHover = () => undefined,
  onHoverEnd = () => undefined,
  hoverClass = "",
}: Props) => {
  return (
    <MantineCard
      className={`flex w-full group aspect-square m-auto items-center justify-center border-teal-200 border-2 hover:bg-teal-500 hover:text-white transition duration-500 ${hoverClass}`}
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      onMouseEnter={onHover}
      onMouseLeave={onHoverEnd}
    >
      <div className="flex flex-col items-center">
        <Text size="xl" className="text-center">
          {text}
        </Text>
        <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>{icon}</Text>
        </Group>
      </div>
    </MantineCard>
  );
};

export default Card;
