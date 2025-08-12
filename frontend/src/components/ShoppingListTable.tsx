import React from "react";

import type { ShoppingListTableProps } from "../types/ShoppingListTable.types";

const ShoppingListTable: React.FC<ShoppingListTableProps> = ({ items }) => (
  <table className="full-width-table">
    <thead>
      <tr>
        <th>Item</th>
        <th>Quantity</th>
        <th>Unit</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item) => (
        <tr key={item.id}>
          <td>{item.name}</td>
          <td>{item.quantity}</td>
          <td>{item.unit}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ShoppingListTable;
