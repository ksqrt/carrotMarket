import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Categories.css";
import {
  BsHouseDoorFill,
  BsFillHouseFill,
  BsFillPuzzleFill,
  BsBook,
  
} from "react-icons/bs";
import { AiFillCar } from "react-icons/ai";
import { GiFlowerPot, GiClothes,GiPearlNecklace,GiLipstick } from "react-icons/gi";
import { TiSortAlphabetically } from "react-icons/ti";
import { MdPhoneAndroid } from "react-icons/md";
import { BiBasketball } from "react-icons/bi"
import { TbMoodKid } from "react-icons/tb"
import { SiNike } from "react-icons/si"



function CategoriesNav() {
  return (
    <div className="container" id="categories">
      
      <Link to="/categories/all">
        <Button  style={{ backgroundColor: '#FF7E36', borderColor:'#FF7E36' }} id="all">
          {/* <TiSortAlphabetically /> 는 아이콘임 */}
          <TiSortAlphabetically />
          All
        </Button>{" "}
      </Link>
      
      <Link to="/categories/clothing">
        <Button variant="dark" id="clothing">
          <GiClothes />
          의류
        </Button>{" "}
      </Link>

      <Link to="/categories/electronics">
        <Button variant="dark" id="electronics">
          <MdPhoneAndroid />
          가전제품
        </Button>{" "}
      </Link>

      <Link to="/categories/furnitureAndInterior">
        <Button variant="dark" id="furnitureAndInterior">
          <BsHouseDoorFill />
          가구/인테리어
        </Button>{" "}
      </Link>
      <Link to="/categories/automotive">
        <Button variant="dark" id="automotive">
          <AiFillCar />
          자동차 및 오토바이
        </Button>{" "}
      </Link>
      <Link to="/categories/sportsAndLeisure">
        <Button variant="dark" id="sportsAndLeisure">
          <BiBasketball />
          스포츠 및 레저용품
        </Button>{" "}
      </Link>

      <Link to="/categories/kidsItems">
        <Button variant="dark" id="kidsItems">
          <TbMoodKid />
          아동용품
        </Button>{" "}
      </Link>
      <Link to="/categories/booksAndStationery">
        <Button variant="dark" id="booksAndStationery">
          <BsBook />
          도서 및 문구용품
        </Button>{" "}
      </Link>
      <Link to="/categories/shoes">
        <Button variant="dark" id="shoes">
          <SiNike />
          신발

        </Button>{" "}
      </Link>

      <Link to="/categories/accessoriesAndJewelry">
        <Button variant="dark" id="accessoriesAndJewelry">
          <GiPearlNecklace />
          악세서리 및 장신구
        </Button>{" "}
      </Link>

      <Link to="/categories/beautyAndCosmetics">
        <Button variant="dark" id="beautyAndCosmetics">
          <GiLipstick />뷰티 및 화장품
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
