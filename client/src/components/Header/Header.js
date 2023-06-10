import { useContext, useState } from 'react';
import { Context } from '../../ContextStore';
import { Modal, Navbar, NavDropdown, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { BsFillPersonFill, BsFillEnvelopeFill, BsFillPlusCircleFill } from 'react-icons/bs';
//import { IoLogOut } from 'react-icons/io5'

<<<<<<< Updated upstream
import './Header.css'
import LoginModal from '../../Pages/LoginModal';

=======
import './Header.css';
import LoginModal from '../Modal/LoginModal';
>>>>>>> Stashed changes
function Header() {
    const { userData, setUserData } = useContext(Context);
    //로그인 모달
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    //모달
    const [isOpen, setIsOpen] = useState(false)
    const onOpen = () => {
        setIsOpen(true)
    }
    const onClose = () => {
        setIsOpen(false)
    }

    return (
        <Navbar collapseOnSelect bg="light" variant="light">
            <div className="container">
                <Navbar.Brand>
                    <NavLink className="navbar-brand" to="/">당신 근처의 당근마켓</NavLink>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        {/* <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link> */}
                    </Nav>
                    {userData ?
                        (<Nav>
                            <NavLink className="nav-item" id="addButton" to="/add-product">
                                <OverlayTrigger key="bottom" placement="bottom"
                                    overlay={
                                        <Tooltip id={`tooltip-bottom`}>
                                            <strong>Add</strong>  a sell.
                                        </Tooltip>
                                    }
                                > 
                                    <BsFillPlusCircleFill />
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
                                    {/* <IoLogOut />Log out */}
                                    <a id='logout' href='/auth/logout' className='nav-item'>로그아웃</a>
                                </NavLink>
                            </NavDropdown>
                        </Nav>)
                        :
                        (<Nav>
<<<<<<< Updated upstream
                            <NavLink className="nav-item" id="nav-sign-in" onClick={handleShowModal}>
                                로그인/회원가입
=======
                            <div>
                                <button className='nav-item' id="nav-sign-in" onClick={onOpen}>로그인/회원가입</button>
                                {
                                    isOpen && <LoginModal onClose={onClose}/>
                                }
                            </div>
                            {/* <NavLink className="nav-item" id="nav-sign-in" to="/auth/login">
                                Sign In
                            </NavLink> */}
                            <NavLink className="nav-item" id="nav-sign-up" to="/auth/register">
                                Sign Up
>>>>>>> Stashed changes
                            </NavLink>
                        </Nav>)
                    }
                </Navbar.Collapse>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LoginModal handleCloseModal={handleCloseModal} />
                </Modal.Body>
            </Modal>
        </Navbar>
    )
}
export default Header;