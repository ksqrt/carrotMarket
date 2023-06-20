import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../ContextStore'; // Context 모듈의 경로를 확인하세요.
import { Navbar, NavDropdown, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { BsFillPersonFill, BsFillEnvelopeFill, BsFillPlusCircleFill } from 'react-icons/bs';
import { useHistory } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { IoLogOut } from 'react-icons/io5'
import SearchBar from "../../components/SearchBar/SearchBar";
// import { SearchContext } from '../../ContextAPI/SearchContext';

import './Header.css';
import LoginModal from '../Modal/LoginModal';
import RegisterModal from '../Modal/RegisterModal';


function Header() {
    const [isSticky, setIsSticky] = useState(false);
    const { userData, setUserData } = useContext(Context);
    const { query, setQuery } = useContext(Context);
    const history = useHistory();
    
    //모달
    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => {
        setIsOpen(true);
    }
    const onClose = () => {
        setIsOpen(false);
    }

    const handleSearch = (e) => {
        setQuery(e.target.value);
    };

    // 검색창에서 enter 를 누르면 
    const onKeyPress = (e) =>{
        if (e.key === "Enter") {
            setQuery(e.target.value);
            console.log("타겟" + e.target.value)
            console.log("쿼리값" + query)
            history.push("/categories/all");
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setIsSticky(scrollTop > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Navbar collapseOnSelect bg="light" variant="light" className={isSticky ? 'sticky' : ''}>
            <div className="container">
                <Navbar.Brand>
                    <NavLink className="navbar-brand" to="/"><img src="https://kr.object.ncloudstorage.com/ncp3/ncp3/logo_main_row.webp" alt="Logo" /></NavLink>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        {/* <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link> */}
                    </Nav>
                    <SearchBar value={query} onChange={handleSearch} onKeyPress = {onKeyPress} />
                    {userData ? 
                        (<Nav>
                            <NavLink className="nav-item" id="addButton" to="/add-product">
                                <OverlayTrigger key="bottom" placement="bottom"
                                    overlay={
                                        <Tooltip id={`tooltip-bottom`}>
                                            <strong>Add</strong> a sell.
                                        </Tooltip>
                                    }
                                >
                                    <BsFillPlusCircleFill/>
                                </OverlayTrigger>
                            </NavLink>


                            <NavDropdown title={<img id="navImg" src={userData.avatar} alt="user-avatar"/>} drop="left" id="collasible-nav-dropdown">
                                <NavLink className="dropdown-item" to={`/profile/${userData._id}`}>
                                    <BsFillPersonFill />Profile
                                </NavLink>

                                {/* <NavDropdown.Divider /> */}

                                {/* <NavLink className="dropdown-item" to="/your-sells">
                                    <BsFillGridFill />Sells
                            </NavLink> */}
                            <NavLink className="dropdown-item" to="/messages">
                                    <BsFillEnvelopeFill />Messages
                            </NavLink>
                                {/* <NavLink className="dropdown-item" to="/wishlist">
                                    <BsFillHeartFill />Wishlist
                            </NavLink> */}

                            <NavDropdown.Divider />
                                <NavLink className="dropdown-item" to="/auth/logout" onClick={() => {
                                    setUserData(null)
                                }}> 
                                    <IoLogOut />Log out
                                </NavLink>
                            </NavDropdown>
                        </Nav>)
                        :
                        (<Nav>
                            <div>
                                <button className='nav-item' id="nav-sign-in" onClick={onOpen}>로그인</button>
                                {
                                    isOpen && <LoginModal onClose={onClose}/>
                                }
                            </div>
                            {/* <div>
                                <button className='nav-item' id="nav-sign-in" onClick={onOpen}>회원가입</button>
                                {
                                    isOpen && <RegisterModal onClose={onClose}/>
                                }
                            </div> */}
                            {/* 추후 삭제 */}
                            &nbsp;&nbsp;
                            {/* <NavLink style={{ backgroundColor: '#FF7E36' }} className="nav-item" id="nav-sign-in" to="/auth/login">
                                로그인
                            </NavLink> */}
                            <NavLink className="nav-item " id="nav-sign-up" to="/auth/register">
                                회원가입
                            </NavLink>
                        </Nav>)
                    }
                </Navbar.Collapse>
            </div>
        </Navbar>
    )
}

export default Header;
