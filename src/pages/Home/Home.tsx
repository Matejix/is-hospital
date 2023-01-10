import { Link } from "react-router-dom";

import Card from "@/components/Card";
import useCardItems from "@/hooks/useCardItems";
import useAdministratorCardItems from "@/hooks/useAdministratorCardItems";
import useTokenData from "@/hooks/useTokenData";
import { useMemo, useState } from "react";

function Home() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const cardItems = useCardItems();
  const adminCardItems = useAdministratorCardItems();
  const loggedData = useTokenData();

  const cardItemsForCurrentUser = useMemo(
    () => (loggedData.role === "Administrator" ? adminCardItems : cardItems),
    []
  );

  return (
    <div>
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="grid grid-cols-3 gap-8 w-full max-w-3xl">
          {cardItemsForCurrentUser.map(({ text, icon, link }) => (
            <Link className="" to={link} key={link}>
              <Card
                text={text}
                icon={icon}
                hoverClass={
                  hoveredItem === null
                    ? "scale-100"
                    : link === hoveredItem
                    ? "scale-110"
                    : "scale-90"
                }
                onHover={() => {
                  setHoveredItem(link);
                }}
                onHoverEnd={() => {
                  setHoveredItem(null);
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
