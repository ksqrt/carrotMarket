import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Categories.css";
import {
  BsHouseDoorFill,
  BsFillHouseFill,
  BsFillPuzzleFill,
} from "react-icons/bs";
import { AiFillCar } from "react-icons/ai";
import { GiFlowerPot, GiClothes } from "react-icons/gi";
import { TiSortAlphabetically } from "react-icons/ti";
import { MdPhoneAndroid } from "react-icons/md";

function CategoriesNav() {
  return (
    <div className="container" id="categories">
      <h1>카테고리</h1>
      <Link to="/categories/all">
        <Button variant="dark" id="all">
          {/* <TiSortAlphabetically /> 는 아이콘임 */}
          <TiSortAlphabetically />
          All
        </Button>{" "}
      </Link>
      <Link to="/categories/properties">
        <Button variant="dark" id="properties">
          <BsHouseDoorFill />
          Properties
        </Button>{" "}
      </Link>
      <Link to="/categories/auto">
        <Button variant="dark" id="auto">
          <AiFillCar />
          자동차
        </Button>{" "}
      </Link>
      <Link to="/categories/home">
        <Button variant="dark" id="home">
          <BsFillHouseFill />집
        </Button>{" "}
      </Link>
      <Link to="/categories/electronics">
        <Button variant="dark" id="electronics">
          <MdPhoneAndroid />
          디지털 기기
        </Button>{" "}
      </Link>
      <Link to="/categories/clothes">
        <Button variant="dark" id="clothes">
          <GiClothes />
          의류
        </Button>{" "}
      </Link>
      <Link to="/categories/toys">
        <Button variant="dark" id="toys">
          <BsFillPuzzleFill />
          장난감
        </Button>{" "}
      </Link>
      <Link to="/categories/garden">
        <Button variant="dark" id="garden">
          <GiFlowerPot />
          식물
        </Button>{" "}
      </Link>
    </div>
  );
}

export default CategoriesNav;
