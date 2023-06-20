import React from 'react';
import "./adminMain.css";
import { Link } from "react-router-dom";



const adminMain = () => {
    return (
        <div>
  <header>
    <h1>당근마켓 어드민 페이지</h1>
  </header>

  <nav>
    <ul>
    <Link to="/admin/all">
      <li><a href="#">대시보드</a></li>
    </Link>

    <Link to="/admin/user">
      <li><a href="#">사용자 관리</a></li>
    </Link>

    <Link to = "/admin/product">
      <li><a href="#">상품 관리</a></li>
    </Link>

    <Link to = "/admin/declare">
      <li><a href="#">신고 관리</a></li>
    </Link> 
    </ul>
  </nav>

  <section>
    <h2>대시보드</h2>
    <p>대시보드 내용이 여기에 들어갑니다.</p>
  </section>

 </div>
    );
};

export default adminMain;