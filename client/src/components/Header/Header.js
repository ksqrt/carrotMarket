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
import { initializeSocket } from '../../services/messagesData';
import url from "../../url.js";

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
    const [stream, setStream] = useState();
    const [media, setMedia] = useState();
    const [onRec, setOnRec] = useState(true);
    const [source, setSource] = useState();
    const [analyser, setAnalyser] = useState();
    const [audioUrl, setAudioUrl] = useState();
    const [disabled, setDisabled] = useState(true); // 😀😀😀

    const onRecAudio = () => {

        setDisabled(true) // 😀😀😀

        // 음원정보를 담은 노드를 생성하거나 음원을 실행또는 디코딩 시키는 일을 한다
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // 자바스크립트를 통해 음원의 진행상태에 직접접근에 사용된다.
        const analyser = audioCtx.createScriptProcessor(0, 1, 1);
        setAnalyser(analyser);

        function makeSound(stream) {
            // 내 컴퓨터의 마이크나 다른 소스를 통해 발생한 오디오 스트림의 정보를 보여준다.
            const source = audioCtx.createMediaStreamSource(stream);
            setSource(source);
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
        }
        // 마이크 사용 권한 획득
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            setStream(stream);
            setMedia(mediaRecorder);
            makeSound(stream);

            analyser.onaudioprocess = function (e) {
                // 3분(180초) 지나면 자동으로 음성 저장 및 녹음 중지
                if (e.playbackTime > 180) {
                    stream.getAudioTracks().forEach(function (track) {
                        track.stop();
                    });
                    mediaRecorder.stop();
                    // 메서드가 호출 된 노드 연결 해제
                    analyser.disconnect();
                    audioCtx.createMediaStreamSource(stream).disconnect();

                    mediaRecorder.ondataavailable = async function (e) {
                        const reader = new FileReader();
                        reader.onload = function (event) {
                            const audioData = event.target.result.split(",")[1]; // Base64 데이터 추출
                            fetchAudioData(audioData); // Base64 데이터를 서버로 전송
                        };
                        reader.readAsDataURL(e.data);
                        setOnRec(true);
                    };
                } else {
                    setOnRec(false);
                }
            };
        });
    };


    const offRecAudio = () => {
        media.ondataavailable = async (e) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                const audioData = event.target.result.split(",")[1]; // Base64 데이터 추출
                fetchAudioData(audioData); // Base64 데이터를 서버로 전송
            };
            reader.readAsDataURL(e.data);
            setOnRec(true);
        };

        // 모든 트랙에서 stop()을 호출해 오디오 스트림을 정지
        stream.getAudioTracks().forEach(function (track) {
            track.stop();
        });

        // 미디어 캡처 중지
        media.stop();

        // 메서드가 호출 된 노드 연결 해제
        analyser.disconnect();
        source.disconnect();

        if (audioUrl) {
            URL.createObjectURL(audioUrl); // 출력된 링크에서 녹음된 오디오 확인 가능
        }

        // File 생성자를 사용해 파일로 변환
        const sound = new File([audioUrl], "soundBlob", {
            lastModified: new Date().getTime(),
            type: "audio",
        });

        // 😀😀😀
        setDisabled(false);
        console.log(sound); // File 정보 출력
    };

    const fetchAudioData = async (audioData) => {
        try {
            const response = await fetch(`${url}/sttapi`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ audioData }),
            });
            const data = await response.json();
            console.log(data);
            const messageObj = JSON.parse(data.message);
            const text = messageObj.text;

            console.log(text); // "테스트"
            setQuery(text)
            // 처리된 데이터 사용 또는 다른 작업 수행
        } catch (error) {
            console.log(error);
        }
    };

    const play = () => {
        const audio = new Audio(URL.createObjectURL(audioUrl)); // 😀😀😀
        audio.loop = false;
        audio.volume = 1;
        audio.play();
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


    // chat 알림 polling
    const [notifications, setNotifications] = useState({});
    const [socket, setSocket] = useState(null);
    const totalNotifications = Object.values(notifications).reduce((a, b) => a + b, 0);

    useEffect(() => {
        let socket;
    
        const initSocket = async () => {
            socket = await initializeSocket();
            setSocket(socket);
            
            socket.emit("getUserConversations", {userId:userData._id});
    
            socket.on ('userConversations',(userChats) => {
                // console.log('userConversations',userChats);
                const initialNotifications = userChats.reduce((acc, cur) => {
                    if(cur.isBuyer){
                        acc[cur.chats._id] = cur.chats.notificationMessages_buyer;
                    } else {
                        acc[cur.chats._id] = cur.chats.notificationMessages_seller;
                    }
                    return acc;
                },{});
                setNotifications(initialNotifications);
            });
    
            socket.on('notificationChat', ({ chatId, notificationMessages, senderId }) => {
                if (senderId !== userData._id) {
                    setNotifications(prev => ({ ...prev, [chatId]: notificationMessages }));
                }
                // console.log("Chat ID: ", chatId);
                // console.log("Notification Messages: ", notificationMessages);
            });
        };
    
        if (userData) {
            initSocket();
        }
    
        return () => {
            if (socket) {
                socket.off('notificationChat');
                socket.disconnect();
                // console.log("socket disconnected");
            }
        };
    }, [userData]);


    useEffect(() => {
        if (!socket) return;
        socket.on('readMessagesUpdate', ({ chatId }) => {
            setNotifications(prev => ({ ...prev, [chatId]: 0 }));
        });
    },[socket])



    useEffect(() => {
        let socket;
    
        const initSocket = async () => {
            socket = await initializeSocket();
            setSocket(socket);
            
            socket.emit("getUserConversations", {userId:userData._id});
    
            socket.on ('userConversations',(userChats) => {
                console.log('userConversations',userChats);
                const initialNotifications = userChats.reduce((acc, cur) => {
                    if(cur.isBuyer){
                        acc[cur.chats._id] = cur.chats.notificationMessages_buyer;
                    } else {
                        acc[cur.chats._id] = cur.chats.notificationMessages_seller;
                    }
                    return acc;
                },{});
                setNotifications(initialNotifications);
            });
    
            socket.on('notificationChat', ({ chatId, notificationMessages, senderId }) => {
                if (senderId !== userData._id) {
                    setNotifications(prev => ({ ...prev, [chatId]: notificationMessages }));
                }
                console.log("Chat ID: ", chatId);
                console.log("Notification Messages: ", notificationMessages);
            });
        };
    
        if (userData) {
            initSocket();
        }
    
        return () => {
            if (socket) {
                socket.off('notificationChat');
                socket.disconnect();
                // console.log("socket disconnected");
            }
        };
    }, [userData]);


    useEffect(() => {
        if (!socket) return;
        socket.on('readMessagesUpdate', ({ chatId }) => {
            setNotifications(prev => ({ ...prev, [chatId]: 0 }));
        });
    },[socket])



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
                        onClick={
                            
                            onRec ? onRecAudio : offRecAudio
                            
                        }
                    />

                    {/* <button onClick={onRec ? onRecAudio : offRecAudio}>녹음</button> */}
                    {/* <button onClick={play} disabled={disabled}>재생</button> */}

                    {userData ?
                        (<Nav className="nav-wrapper">
                            <div className='notificationIcon'>
                                {totalNotifications > 0 &&<div className='notiNumber'>{totalNotifications}</div>}
                            </div>
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
                                {(totalNotifications > 0 ? <BsFillEnvelopeFill className='bell' /> : <BsFillEnvelopeFill/>)}Messages
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
                                    isOpenRegister && <RegisterModal onCloseRegister={onCloseRegister} />
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
