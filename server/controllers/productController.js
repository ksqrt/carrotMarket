const { Router } = require("express");
const router = Router();
const { cloudinary } = require("../config/cloudinary");
const isAuth = require("../middlewares/isAuth");
const Product = require("../models/Product");
const User = require("../models/User");
const moment = require("moment");

const productService = require("../services/productService");

// 제품목록을 가지고오는 GET 핸들러
router.get("/", async (req, res) => {
  // page와 search 파라미터를 비구조 할당
  const { page, search } = req.query;

  try {
    let products;
    
    // search가 존재하고 빈 문자열이 아닐 경우
    if (search !== "" && search !== undefined) {
      
      // products는 mongoose.Schema 인스턴스인 Product 모델을 참조하여 데이터를 가져옵니다 .find()는 Mongoose의 쿼리 메서드로, 지정된 모델에서 문서를 검색하는 데 사용됩니다
      products = await Product.find();

      // 활성화된 제품만 필터링합니다 active 가 true 면 안팔린거 active 가 false 면 팔린거 따라서 팔린거를 걸러주는 필터링 .
      products = products.filter((x) => x.active == true);

      // 제목이나 도시에 검색어가 포함된 제품만 필터링합니다.
      products = products.filter(
        (x) =>
          x.title.toLowerCase().includes(search.toLowerCase()) ||
          x.city.toLowerCase().includes(search.toLowerCase())
      );

      // 검 색된 제품과 페이지 수를응답합니다.
      res.status(200).json({ products: products, pages: products.pages });
    } else {
      // 검색어가 없는 경우, 제품을 페이지네이션을 적용하여 가져옵니다.
      products = await Product.paginate({}, { page: parseInt(page) || 1, limit: 5 });

      // 활성화된 제품만 필터링합니다.
      products.docs = products.docs.filter((x) => x.active == true);

      // 페이지네이션된 제품과 페이지 수를 응답합니다.
      res.status(200).json({ products: products.docs, pages: products.pages });
    }
  } catch (error) {
    // 에러가 발생한 경우, 에러 메시지를 응답합니다.
    res.status(500).json({ message: error.message });
  }
});

// 특정 카테고리의 제품 목록을 가져오는 GET 요청을 처리하는 핸들러.
router.get("/:category", async (req, res) => {
  const { page } = req.query;
  try {   
// mongoose-paginate-v2를 통해 제공되는 기능 자동으로 페이징 해줌
//     Product.paginate() 메서드를 호출하여 제품을 조회합니다.
// 첫 번째 인자로는 조회할 제품의 조건을 전달합니다. 여기서는 category 필드가 req.params.category 값과 일치하는 제품들을 조회하고자 합니다. req.params.category는 URL의 경로 매개변수에서 추출한 카테고리 값입니다.
// 두 번째 인자로는 페이지네이션 옵션을 전달합니다. page는 조회할 페이지 번호를 나타내며, limit는 한 페이지에 표시할 제품의 수를 나타냅니다. parseInt(page) || 1은 URL의 쿼리 매개변수에서 추출한 페이지 번호 값이 없을 경우 기본값으로 1을 사용하도록 설정한 것입니다.
// 조회된 페이지네이션 결과는 products 변수에 할당됩니다. 이 변수에는 현재 페이지에 해당하는 제품 목록과 관련된 페이징 정보가 포함됩니다.
    let products = await Product.paginate(
      { category: req.params.category },
      { page: parseInt(page) || 1, limit: 10 }
    );
    res.status(200).json({ products: products.docs, pages: products.pages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 특정 제품의 상세 정보를 가져오는 GET 요청을 처리하는 핸들러를 정의합니다.
router.get("/specific/:id", async (req, res) => {
  try {
    // 먼저 product 를 가지고온다음 그 producut 를 올린 seller 를 물건 id 로 조회 해서 둘을 join 해서 json 만들기 
    let product = await (await Product.findById(req.params.id)).toJSON();
    let seller = await (await User.findById(product.seller)).toJSON();
    product.addedAt = moment(product.addedAt).format("d MMM YYYY (dddd) HH:mm");
    let jsonRes = {
      ...product,
      name: seller.name,
      phoneNumber: seller.phoneNumber,
      email: seller.email,
      createdSells: seller.createdSells.length,
      avatar: seller.avatar,
      sellerId: seller._id,
      isAuth: false,
    };
    if (req.user) {
      let user = await User.findById(req.user._id);
      jsonRes.isSeller = Boolean(req.user._id == product.seller);
      jsonRes.isWished = user.wishedProducts.includes(req.params.id);
      jsonRes.isAuth = true;
    }
    res.status(200).json(jsonRes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 제품을 생성하는 POST 요청을 처리하는 핸들러를 정의합니다.
router.post("/create", async (req, res) => {
  let { title, price, description, city, category, image } = req.body;
  try {
    let errors = [];
    if (title.length < 3 || title.length > 50)
      errors.push(
        "Title should be at least 3 characters long and max 50 characters long; "
      );
    if (isNaN(Number(price))) errors.push("Price should be a number; ");
    if (description.length < 10 || description.length > 1000)
      errors.push(
        "Description should be at least 10 characters long and max 1000 characters long; "
      );
    if (/^[A-Za-z]+$/.test(city) == false)
      errors.push("City should contains only english letters; ");
    if (!image.includes("image"))
      errors.push("The uploaded file should be an image; ");
    if (!category) errors.push("Category is required; ");

    if (errors.length >= 1) throw { message: [errors] };

    let compressedImg = await productService.uploadImage(image);
    let product = new Product({
      title,
      price,
      description,
      city,
      category,
      image: compressedImg,
      addedAt: new Date(),
      seller: req.user._id,
    });

    await product.save();
    await productService.userCollectionUpdate(req.user._id, product);

    res.status(201).json({ productId: product._id });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
});

router.patch("/edit/:id", isAuth, async (req, res) => {
  //TODO: Rewrite this
  let { title, price, description, city, category, image } = req.body;
  try {
    let user = await productService.findUserById(req.user._id);
    let product = await productService.findById(req.params.id);
    let errors = [];
    if (user._id.toString() !== product.seller.toString()) {
      errors.push("You have no permission to perform this action! ");
    }

    if (title.length < 3 || title.length > 50)
      errors.push(
        "Title should be at least 3 characters long and max 50 characters long; "
      );
    if (isNaN(Number(price))) errors.push("Price should be a number; ");
    if (description.length < 10 || description.length > 1000)
      errors.push(
        "Description should be at least 10 characters long and max 1000 characters long; "
      );
    if (/^[A-Za-z]+$/.test(city) == false)
      errors.push("City should contains only english letters; ");
    if (req.body.image) {
      if (!req.body.image.includes("image"))
        errors.push("The uploaded file should be an image; ");
    }
    if (!category || category == "Choose...")
      errors.push("Category is required; ");

    if (errors.length >= 1) throw { message: [errors] };

    if (req.body.image) {
      let compressedImg = await productService.uploadImage(req.body.image);
      await productService.edit(req.params.id, {
        title,
        price,
        description,
        city,
        category,
        image: compressedImg,
      });
    } else {
      await productService.edit(req.params.id, {
        title,
        price,
        description,
        city,
        category,
      });
    }
    res.status(201).json({ message: "Updated!" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.get("/sells/active/:id", async (req, res) => {
  try {
    let userId = "";
    if (req.params.id) {
      userId = req.params.id;
    } else {
      userId = req.user_id;
    }
    let user = await (
      await User.findById(userId).populate("createdSells")
    ).toJSON();
    res
      .status(200)
      .json({ sells: user.createdSells.filter((x) => x.active), user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/sells/archived", async (req, res) => {
  try {
    let user = await (
      await User.findById(req.user._id).populate("createdSells")
    ).toJSON();
    res.status(200).json({
      sells: user.createdSells.filter((x) => x.active == false),
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/enable/:id", async (req, res) => {
  try {
    await Product.updateOne({ _id: req.params.id }, { active: true });
    res.status(200).json({ msg: "Activated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/archive/:id", async (req, res) => {
  try {
    await Product.updateOne({ _id: req.params.id }, { active: false });
    res.status(200).json({ msg: "Archived" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/wish/:id", async (req, res) => {
  try {
    let user = await User.findById(req.user._id);

    if (!user.wishedProducts.includes(req.params.id)) {
      await User.updateOne(
        { _id: req.user._id },
        { $push: { wishedProducts: req.params.id } }
      );
      await Product.updateOne(
        { _id: req.params.id },
        { $push: { likes: user } }
      );

      res.status(200).json({ msg: "wished" });
    } else {
      await User.updateOne(
        { _id: req.user._id },
        { $pull: { wishedProducts: req.params.id } }
      );
      await Product.updateOne(
        { _id: req.params.id },
        { $pull: { likes: req.user._id } }
      );

      res.status(200).json({ msg: "unwished" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/wishlist/:id", async (req, res) => {
  try {
    let user = await (
      await User.findById(req.user._id).populate("wishedProducts")
    ).toJSON();

    res.status(200).json({ wishlist: user.wishedProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
