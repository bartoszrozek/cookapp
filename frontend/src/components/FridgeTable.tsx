import React from "react";

interface FridgeTableProps {
  items: any[];
}

const FridgeTable: React.FC<FridgeTableProps> = ({ items }) => (
  <table className="full-width-table">
    <thead>
      <tr>
        <th>Ingredient</th>
        <th>Quantity</th>
        <th>Unit</th>
        <th>Expiration</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item) => (
        <tr key={item.id}>
          <td>{item.name}</td>
          <td>{item.quantity}</td>
          <td>{item.unit}</td>
          <td>{item.expiration_date}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default FridgeTable;
