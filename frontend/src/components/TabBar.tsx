import React from "react";
import "./TabBar.css";

interface TabBarProps {
  tabs: string[];
  icons?: React.ReactNode[];
  current: string;
  onTabChange: (tab: string) => void;
  orientation?: "horizontal" | "vertical";
}

const TabBar: React.FC<TabBarProps> = ({ tabs, icons, current, onTabChange, orientation = "horizontal" }) => (
  <nav className={`tab-bar ${orientation}`}> 
    {tabs.map((tab, i) => (
      <button
        key={tab}
        className={tab === current ? "tab active" : "tab"}
        onClick={() => onTabChange(tab)}
      >
        {icons && icons[i] && <span className="tab-icon">{icons[i]}</span>}
        <span>{tab}</span>
      </button>
    ))}
  </nav>
);

export default TabBar;
