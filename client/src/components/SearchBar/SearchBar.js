import React from "react";

function SearchBar({ value, onChange }) {
  return (
    <div id="sider">
      <input
        className="col-lg-15"
        type="text"
        placeholder="물품을 검색해보세요"
        name="search"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default SearchBar;
