import React from "react";
import "../App.css";
import MenuTable from "../components/MenuTable";

const Menu: React.FC = () => {
  const menu: any[] = [];
  return (
    <>
      <h2>Menu for this week</h2>
      <div className="tab-content">
        {menu.length === 0 ? <div>No menu items.</div> : <MenuTable menu={menu} />}
      </div>
    </>
  );
};

export default Menu;
