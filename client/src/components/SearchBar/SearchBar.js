import React from "react";

function SearchBar({ value, onChange,onKeyPress}) {

  return (
    <div id="sider">
      <input
        className="col-lg-15"
        type="text"
        placeholder="물품을 검색해보세요"
        name="search"
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress} // Enter 키 누를 때 이벤트 핸들러
      />

    </div>
  );
}

export default SearchBar;
