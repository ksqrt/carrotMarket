import React from "react";
import { useHistory } from "react-router-dom";

function SearchBar({ value, onChange }) {
  const history = useHistory();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      history.push("/");
    }
  };

  return (
    <div id="sider">
      <input
        className="col-lg-15"
        type="text"
        placeholder="물품을 검색해보세요"
        name="search"
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress} // Enter 키 누를 때 이벤트 핸들러
      />
    </div>
  );
}

export default SearchBar;
