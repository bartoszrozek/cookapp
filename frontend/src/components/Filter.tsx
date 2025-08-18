import React, { useState, useEffect } from "react";
import "../App.scss";

interface FilterProps {
    elements: any[];
    setFilteredElements: (filtered: any[]) => void;
    fields?: string[];
}

const Filter: React.FC<FilterProps> = ({ elements, setFilteredElements, fields = ["name"] }) => {
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const filteredElements = Array.isArray(elements)
            ? elements.filter(el =>
                fields.some(field =>
                    el[field] &&
                    el[field].toLowerCase().includes(filter.toLowerCase())
                )
            )
            : [];
        setFilteredElements(filteredElements);
    }, [elements, filter]);

    return (
        <div>
            <input
                type="text"
                placeholder={`Filter by ${fields.join(", ")}...`}
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{ padding: '0.5rem', fontSize: '1rem', minWidth: '200px' }}
            />
        </div>
    );
};

export default Filter;
