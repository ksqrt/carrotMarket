import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../ContextStore';
import { Navbar, NavDropdown, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { BsFillPersonFill, BsFillEnvelopeFill, BsFillPlusCircleFill, BsPeopleFill } from 'react-icons/bs';
import { useHistory } from "react-router-dom";
import { IoLogOut } from 'react-icons/io5'
import SearchBar from "../../components/SearchBar/SearchBar";
import './Header.css';
import LoginModal from '../Modal/LoginModal';
import RegisterModal from '../Modal/RegisterModal';
import Register from '../../Pages/Register';

function Header() {
    const [isSticky, setIsSticky] = useState(false);
    const { userData, setUserData } = useContext(Context);
    const { query, setQuery } = useContext(Context);
    const history = useHistory();

    const [isOpen, setIsOpen] = useState(false);
    const [isOpenRegister, setIsOpenRegister] = useState(false);

    const onOpen = () => {
        setIsOpen(true);
    }
    const onClose = () => {
        setIsOpen(false);
    }

    const onOpenRegister = () => {
        setIsOpenRegister(true);
    }
    const onCloseRegister = () => {
        setIsOpenRegister(false);
    }

    const handleSearch = (e) => {
        setQuery(e.target.value);
    };

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

    const onKeyPress = (e) => {
        if (e.key === "Enter") {
            setQuery(e.target.value);
            console.log("타겟" + e.target.value)
            console.log("쿼리값" + query)
            history.push("/");
        }
    }

    const handleRecordButtonClick = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                const audioChunks = [];

                mediaRecorder.addEventListener("dataavailable", (event) => {
                    audioChunks.push(event.data);
                });

                mediaRecorder.addEventListener("stop", () => {
                    const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
                    const audioUrl = URL.createObjectURL(audioBlob);

                    // .mp3 파일을 저장한 후에 STT API를 호출하여 텍스트로 변환
                    const language = "Kor"; // 언어 코드 (Kor, Jpn, Eng, Chn)

                    // STT API 호출
                    convertAudioToText(audioBlob, language);
                });

                const recordingTime = 5000;

                mediaRecorder.start();
                setTimeout(() => {
                    mediaRecorder.stop();
                }, recordingTime);
            })
            .catch((error) => {
                console.error("Error accessing microphone:", error);
            });
    };

    const convertAudioToText = (audioBlob, language) => {
        const url = `https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=${language}`;
        const requestConfig = {
            url: url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'X-NCP-APIGW-API-KEY-ID': "v7x02wmg2r",
                'X-NCP-APIGW-API-KEY': "TvLwgRyRGXnkS03SqfouYgkLoKN1PaUH128zrn41"
            },
            body: audioBlob
        };

        fetch(url, requestConfig)
            .then(response => {
                if (!response.ok) {
                    throw new Error('STT API Error');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setQuery(data.text);
                history.push("/");
            })
            .catch(error => {
                console.error("Error converting audio to text:", error);
            });
    };

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
                    <SearchBar value={query} onChange={handleSearch} onKeyPress={onKeyPress} />
                    <img
                        src='https://kr.object.ncloudstorage.com/ncp3/ncp3/pngwing.com.png'
                        width='25'
                        height='25'
                        style={{ margin: '10px' }}
                        alt="음성 검색"
                        className="voice-search-icon"
                        onClick={() => {
                            console.log("음성클릭")
                            handleRecordButtonClick()
                        }}
                    />
                    {userData ?
                        (<Nav>
                            <NavLink className="nav-item" id="addButton" to="/add-product">
                                <OverlayTrigger key="bottom" placement="bottom"
                                    overlay={
                                        <Tooltip id={`tooltip-bottom`}>
                                            <strong>상품등록</strong>
                                        </Tooltip>
                                    }
                                >
                                    <BsFillPlusCircleFill />
                                </OverlayTrigger>
                            </NavLink>


                            <NavDropdown title={<img id="navImg" src={userData.avatar} alt="user-avatar" />} drop="left" id="collasible-nav-dropdown">
                                <NavLink className="dropdown-item" to={`/profile/${userData._id}`}>
                                    <BsFillPersonFill />Profile
                                </NavLink>

                                <NavLink className="dropdown-item" to="/messages">
                                    <BsFillEnvelopeFill />Messages
                                </NavLink>

                            {userData.role === "admin" &&
                                <NavLink className="dropdown-item" to="/admin">
                                        <BsPeopleFill />Admin
                                </NavLink>
                            }

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
                                <button className='nav-item' id="nav-sign-in" onClick={onOpen}>로그인</button>&nbsp;/&nbsp;
                                {
                                    isOpen && <LoginModal onClose={onClose} />
                                }
                            </div>
                            <div>
                            <button className='nav-item' id="nav-sign-in" onClick={onOpenRegister}>회원가입</button>
                                {
                                    isOpenRegister && <RegisterModal onCloseRegister={onCloseRegister}/>
                                }
                            </div>
                            {/* 추후 삭제 */}
                            {/* &nbsp;&nbsp;
                            <NavLink style={{ backgroundColor: '#FF7E36' }} className="nav-item" id="nav-sign-in" to="/auth/login">
                                로그인
                            </NavLink>
                            <NavLink className="nav-item " id="nav-sign-up" to="/auth/register">
                                회원가입
                            </NavLink>*/} 
                        </Nav>)
                    }
                </Navbar.Collapse>
            </div>
        </Navbar>
    )
}

export default Header;
