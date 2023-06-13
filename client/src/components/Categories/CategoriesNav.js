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
      
      <Link to="/categories/all">
        <Button variant="dark" id="all">
          {/* <TiSortAlphabetically /> 는 아이콘임 */}
          <TiSortAlphabetically />
          All
        </Button>{" "}
      </Link>
      
      <Link to="/categories/electronics">
        <Button variant="dark" id="electronics">
          <GiClothes />
          의류
        </Button>{" "}
      </Link>

      <Link to="/categories/properties">
        <Button variant="dark" id="properties">
          <MdPhoneAndroid />
          가전제품
        </Button>{" "}
      </Link>

      <Link to="/categories/properties">
        <Button variant="dark" id="properties">
          <BsHouseDoorFill />
          가구/인테리어
        </Button>{" "}
      </Link>
      <Link to="/categories/properties">
        <Button variant="dark" id="properties">
          <BsHouseDoorFill />
          자동차 및 오토바이
        </Button>{" "}
      </Link>
      <Link to="/categories/properties">
        <Button variant="dark" id="properties">
          <BsHouseDoorFill />
          스포츠 및 레저용품
        </Button>{" "}
      </Link>

      <Link to="/categories/properties">
        <Button variant="dark" id="properties">
          <BsHouseDoorFill />
          아동용품
        </Button>{" "}
      </Link>
      <Link to="/categories/properties">
        <Button variant="dark" id="properties">
          <BsHouseDoorFill />
          도서 및 문구용품
        </Button>{" "}
      </Link>
      <Link to="/categories/properties">
        <Button variant="dark" id="properties">
          <BsHouseDoorFill />
          신발

        </Button>{" "}
      </Link>

      <Link to="/categories/auto">
        <Button variant="dark" id="auto">
          <AiFillCar />
          악세서리 및 장신구
        </Button>{" "}
      </Link>

      <Link to="/categories/home">
        <Button variant="dark" id="home">
          <BsFillHouseFill />뷰티 및 화장품
        </Button>{" "}
      </Link>
      
      {/* <Link to="/categories/clothes">
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
      </Link> */}
    </div>
  );
}

export default CategoriesNav;
