import React from "react";

function SearchBar({ value, onChange }) {
  return (
    <div id="sider">
      <input
        className="col-lg-5"
        type="text"
        placeholder="검색..."
        name="search"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default SearchBar;
