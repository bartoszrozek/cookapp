import React from "react";

interface MenuTableProps {
  menu: any[];
}

const MenuTable: React.FC<MenuTableProps> = ({ menu }) => (
  <table className="full-width-table">
    <thead>
      <tr>
        <th>Recipe</th>
        <th>Date</th>
        <th>Servings</th>
      </tr>
    </thead>
    <tbody>
      {menu.map((item) => (
        <tr key={item.id}>
          <td>{item.recipe_name}</td>
          <td>{item.date}</td>
          <td>{item.servings}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default MenuTable;
