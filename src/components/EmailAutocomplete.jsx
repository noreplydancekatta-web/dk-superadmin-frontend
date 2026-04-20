import React, { useState, useEffect, useRef } from "react";
import "../styles/EmailAutocomplete.css";

function EmailAutocomplete({ items, value, onChange, placeholder, displayField = "email", required = false }) {
  const [inputValue, setInputValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setSelectedItem(null);
    onChange(null);
    
    if (val.trim()) {
      const filtered = items.filter((item) =>
        item[displayField]?.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredItems(filtered);
      setShowDropdown(true);
    } else {
      setFilteredItems([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (item) => {
    setInputValue(item[displayField]);
    setSelectedItem(item);
    onChange(item);
    setShowDropdown(false);
  };

  const isValid = !required || selectedItem !== null;

  return (
    <div className="email-autocomplete" ref={wrapperRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        onFocus={() => inputValue && setShowDropdown(true)}
        required={required}
        style={{ borderColor: !isValid && inputValue ? '#ff4444' : '#ddd' }}
      />
      {showDropdown && filteredItems.length > 0 && (
        <ul className="autocomplete-dropdown">
          {filteredItems.map((item) => (
            <li key={item._id} onClick={() => handleSelect(item)}>
              {item[displayField]}
              {item.firstName && ` - ${item.firstName} ${item.lastName}`}
              {item.studioName && ` - ${item.studioName}`}
            </li>
          ))}
        </ul>
      )}
      {inputValue && !selectedItem && filteredItems.length === 0 && (
        <div className="autocomplete-no-match">No matching email found</div>
      )}
    </div>
  );
}

export default EmailAutocomplete;
