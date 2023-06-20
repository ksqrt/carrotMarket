import { useState, useEffect, useContext, useRef, React } from 'react';
import {sendMessage, disconnect, getUserConversations, initializeSocket} from '../services/messagesData';
import { Navbar, NavDropdown, Nav, Container, Row, Form, InputGroup, Button, Alert } from 'react-bootstrap';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { Context } from '../ContextStore';
import { animateScroll } from 'react-scroll';
import { AiOutlineAlert, AiOutlineUpload, AiOutlineSchedule } from 'react-icons/ai';
import { ImBlocked } from 'react-icons/im';
import { IoIosArrowBack } from 'react-icons/io';
import {FaMapMarkedAlt} from 'react-icons/fa'
import Linkify from 'react-linkify'; // url 주소 링크 처리하는 라이브러리
import { BsSend } from "react-icons/bs";
import UseAnimations from "react-useanimations";
import plusToX from "react-useanimations/lib/plusToX";
import settings from 'react-useanimations/lib/settings';
import '../components/Messages/Aside.css'
import '../components/Messages/Article.css'
import styles from '../components/Messages/flower.module.css'
import KakaoMapAPI from '../components/KakaoMapAPI/KakaoMapAPI';


function Messages({ match }) { // match = Router 제공 객체, url을 매개변수로 사용. ex) 경로 : /messages/123  => match.params.id = "123" // app.js 참고 : <Route path="/messages" exact component={Messages} />;
    const [isOpen, setIsOpen] = useState(false)
    const onOpen = () => {
        setIsOpen(true)
    }

    const github = settings;
    let chatId = match.params.id; // 선택된 채팅방의 id
    const { userData } = useContext(Context); // 사용자 id 가져오기
    const [chatroomList, setChatroomList] = useState([]) // 사용자의 모든 채팅방 정보
    const [isSelected, setIsSelected] = useState(true); // 채팅방 선택
    const [selected, setSelected] = useState({ // 선택된 채팅방의 상세 정보(참가user, conversation(나눈 대화 내역)) 저장 
        chats: {
            _id: 0,
            seller: { _id: "", avatar: "", name: "" },
            buyer: { _id: "", avatar: "", name: "" },
            conversation: [],
            product: ""
        },
        isBuyer: null,
        myId: 0
    });
    const [message, setMessage] = useState(""); // 내가 입력한 메세지
    const [alertShow, setAlertShow] = useState(true); 
    const [socket, setSocket] = useState(null); // initializeSocket 소켓 초기화
    const scrollToBottom = () => {
        animateScroll.scrollToBottom({
            containerId: "chat-selected-body",
            duration: 0,
            smooth: false
        });
    }
    const [file, setFile] = useState(null); // 파일 업로드
    // const location = { lat: 37.497922, lng: 127.027606 };
    let currentDate = null;

    // 위로 스크롤 시 추가 로딩 구현
    const [showMessagesCount, setShowMessagesCount] = useState(15);
    const chatContainerRef = useRef(null);
    useEffect(() => {
        const element = chatContainerRef.current;
        if (!element) return;
    
        const handleScroll = () => {
            //console.log(element.scrollTop); // 스크롤 위치 확인용
            if (element.scrollTop === 0) {
                setShowMessagesCount(prevCount => {
                    // 모든 메시지를 불러왔으면 스크롤 위치를 조정하지 않음
                    if (selected.chats.conversation.length <= prevCount) return prevCount;
                    
                    setTimeout(() => {
                        element.scrollTop = 500;
                    }, 0);
    
                    return prevCount + 10;
                });
            }
        };
    
        element.addEventListener("scroll", handleScroll);
        return () => element.removeEventListener("scroll", handleScroll);
    }, [selected.chats.conversation.length]);



    // 5% 확률로 다른 이모티콘 나옴
    const [bgUrl, setBgUrl] = useState('');
    useEffect(() => {
        const firstUrl = "https://veiled-jay-0c2.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F9e0b0bbd-b7f7-4a2d-9ed8-dfe08f72c35f%2F1e917e59f980468a78f2bff7dcc25ac2f604e7b0e6900f9ac53a43965300eb9a.png?id=653f7765-1ec3-485c-8d54-2af4e2b0e6aa&table=block&spaceId=5989bf22-29e0-4423-b8aa-9d2d5f3b5c6b&width=420&userId=&cache=v2";
        const secondUrl = "https://veiled-jay-0c2.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F1d1e1eb4-d168-41ad-900e-ca97dd8e3663%2Fi16595761484.jpg?id=8b345997-b188-420a-9b2c-1df970806512&table=block&spaceId=5989bf22-29e0-4423-b8aa-9d2d5f3b5c6b&width=730&userId=&cache=v2";
        setBgUrl(Math.random() < 0.05 ? secondUrl : firstUrl);
    }, [selected]);



    // 페이지 이동 오류 해결용
    useEffect(() => {
        const isOnMessageListPage = window.location.pathname === '/messages';
      
        if (isOnMessageListPage) {
          setIsSelected(false);
        }
    }, []);


    useEffect(() => {
        (async () => {
          setSocket(await initializeSocket());
        })();
    }, []);


    useEffect(() => { // 대화방 가져오기, 선택시 내용 가져오기
    if (!userData || !socket) return;
    console.log("1. messages.js, getUserConversations ");
    getUserConversations(socket, userData._id) // 현재 사용자와 관련된 모든 채팅방 목록을 가져옴
        .then(res => {
        // console.log("채팅방 가져오기 : ",res);
        setChatroomList(res); // 가져온 채팅방 목록을 상태 변수에 저장.
        if (isSelected) { // 채팅방이 선택되었다면 현재 선택된 채팅방의 정보를 selected 상태 변수에 저장
            setSelected(res.find(x => x.chats._id === chatId))
            scrollToBottom();
        }
        })
        .catch(console.log)
    }, [isSelected, chatId, socket, userData]);

      //채팅 내용 불러오기
    useEffect(() => {
        if (!socket) return;
        console.log('5. messages.js, newmessage');
        const handleNewMessage = (newMessage) => {
            setSelected((prevSelected) => ({
                ...prevSelected,
                chats: {
                    ...prevSelected.chats,
                    conversation: [...prevSelected.chats.conversation, newMessage],
                },
            }));
            // if (newMessage.location) {
            //     setLocation(newMessage.location);
            // }
            scrollToBottom();
        };
        socket.on('newMessage', handleNewMessage);
    
        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket]);
    
    useEffect(() => {
        console.log("채팅방 전체 로그 : ", selected);
        // console.log("userdata : ", userData);
        
      }, [selected]);

    useEffect(() => {
        return () => {
          if (socket) {
            disconnect(socket, console.log.bind(null, "Socket disconnected"));
          }
        };
      }, [socket]);

    const handleMsgSubmit = async event => { // 채팅 보내기, 파일 업로드, 지도 업로드
        event.preventDefault();
        // sendMessage(socket, { chatId: selected.chats._id, senderId: userData._id, message, location});
        sendMessage(socket, { chatId: selected.chats._id, senderId: userData._id, message});
        setMessage("");
        console.log('2. messages.js, sendmessage');
    };

    //채팅방 삭제
    const history = useHistory();
    const handleLeaveChat = () => {


        history.push('/messages');
    };

    return (
        <Container>
            <Row>
                <aside className="col-lg-4 col-md-4">
                    <h3>채팅방 목록 </h3>
                    <div className="chatlist_scroll">
                    {chatroomList.length >= 1 ?
                        <>
                            {chatroomList.map(x =>
                                <div className="chat-connections" key={x.chats._id}>
                                    <Link onClick={() => setIsSelected(true)} to={`/messages/${x.chats._id}`}>
                                        {x.isBuyer ?
                                            <><img src={x.chats.seller.avatar} alt="user-avatar" /> <span>{x.chats.seller.name}</span>{x.chats.product?.image && <img src={x.chats.product?.image} alt="product" style={{float: 'right', width: '35px', height: '35px', objectFit: 'cover'}}/>}</>
                                            :
                                            <><img src={x.chats.buyer.avatar} alt="user-avatar" /> <span>{x.chats.buyer.name}</span>{x.chats.product?.image && <img src={x.chats.product?.image} alt="product" style={{float: 'right', width: '35px', height: '35px', objectFit: 'cover'}}/>}</>
                                        }
                                    </Link>
                                    {/* 내가 isbuyer라면 표시할 아바타는 seller.avatar*/}
                                </div>)
                            }
                        </>
                        :
                        <h5>No messages yet</h5>
                    }
                    </div>
                </aside>
                <article className="col-lg-8 col-md-8">
                    {isSelected &&
                        <>
                            <div className="chat-selected-header col-lg-12">
                                <button className='out'>
                                <a href="/messages"><IoIosArrowBack size={30}/></a>
                                </button>
                                {selected.isBuyer ?
                                    <Link to={`/profile/${selected.chats.seller._id}`}>
                                        <img src={selected.chats.seller.avatar} alt="user-avatar" />&nbsp;
                                        <span>{selected.chats.seller.name}</span>    
                                    </Link>
                                    :
                                    <Link to={`/profile/${selected.chats.buyer._id}`}>

                                        <img src={selected.chats.buyer.avatar} alt="user-avatar" />&nbsp;
                                        <span>{selected.chats.buyer.name}</span>
                                        
                                    </Link>
                                }

                                <div className="dropdown">
                                    <button className="dropdown-button">
                                        <UseAnimations animation={github} size={35}/>
                                    </button>
                                    <div className="dropdown-content">
                                        <button className="dropdown-content-out" onClick={handleLeaveChat}>
                                            채팅방 나가기
                                        </button>
                                        <button className="dropdown-content-block"> 
                                            <ImBlocked size={20} /> 차단하기  
                                        </button>
                                        <button className="dropdown-content-declare">
                                            <AiOutlineAlert size={20} /> 신고하기 
                                        </button>
                                    </div>
                                </div>
                                
                            </div>
                            {alertShow &&
                                <Alert className="alert-glass" onClose={() => setAlertShow(false)}>
                                <div className="flex-container">
                                    <img src={selected.chats.product?.image} alt="product" className="img-style" />
                                    <div className="text-container">
                                        <div>
                                            <span className="text-bold">{selected.chats.product?.soldout ? '거래완료' : '거래중'}</span> &nbsp;&nbsp;
                                            <span>{selected.chats.product?.title}</span>
                                        </div>
                                        <div>
                                            <span className="text-bold">{Number(selected.chats.product?.price).toLocaleString()}원</span>
                                        </div>
                                    </div>
                                </div>
                                    <button> 후기 보내기 버튼 </button> {/* 약속 잡기 성공 후 sold out 시 */}
                                    <button> 약속 잡기 버튼 </button> {/* (다른 사람과 약속 잡기가 되있지 않을 때) */}
                                </Alert>
                            }
                            <div ref={chatContainerRef} id="chat-selected-body" className="chat-selected-body col-lg-12" style={{backgroundImage: `url(${bgUrl})`}}>
                            {selected.chats.conversation.slice(Math.max(selected.chats.conversation.length - showMessagesCount, 0)).map((x, index) =>{
                                if (x) {
                                    const messageDate = new Date(x.sentAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric'});

                                    return (
                                        <>
                                            {messageDate !== currentDate && (currentDate = messageDate) && <p className="dateHeader"><div className="hr-sect" >{currentDate}</div></p>}
                                            <div className={selected.myId === x.senderId ? 'me' : "not-me"}>
                                                <span className="timestamp">{x.sentAt ? new Date(x.sentAt).toLocaleTimeString('ko-KR', { hour: 'numeric', minute: 'numeric', hour12: true }) : ""}</span> &nbsp;
                                                <span className="message"><Linkify>{x.message}</Linkify></span>
                                                {selected.myId !== x.senderId && <img className="user-avatar" src={selected.isBuyer ? selected.chats.seller.avatar : selected.chats.buyer.avatar} alt="user-avatar" />}
                                            </div>
                                        </>
                                    )
                                } else {
                                    return null;
                                }
                            })}
                                {/* {location && <KakaoMapAPI lat='35.92875093345304' lng='126.96316682140936' />} */}
                            </div>
                            <div className="chat-selected-footer col-lg-12" style={{backgroundColor: '#F2F3F7', padding:0, borderRadius:20}}>
                                <Form onSubmit={handleMsgSubmit}>
                                    <Form.Group>
                                        <InputGroup style={{ display: 'flex', alignItems: 'center' }}>
                                            <InputGroup.Append>
                                            <nav className={styles.menu}>
                                            <input type="checkbox" className={styles['menu-open']} name="menu-open" id="menu-open" />
                                            <label className={styles['menu-open-button']} htmlFor="menu-open">
                                                <UseAnimations className="plusToX" animation={plusToX} size={40} />
                                            </label>

                                            <button type="button" className={`${styles['menu-item']} ${styles.blue}`} onClick={() => document.getElementById("uploadInput").click()}> 
                                                <input type="file" name='image' id="uploadInput" onChange={e => setFile(e.target.files[0])} style={{display: 'none'}} />
                                                <AiOutlineUpload className="upload-icon" size={25} style={{marginBottom:'7px'}} /> 
                                            </button>
                                            <button className={`${styles['menu-item']} ${styles.green}`}> <AiOutlineSchedule className="upload-icon" size={23} style={{marginBottom:'7px'}} /> </button>
                                            <button className={`${styles['menu-item']} ${styles.red}`}> <div style={{fontSize:'16px', marginBottom:'7px'}} >🤗</div> </button>
                                            <button className={`${styles['menu-item']} ${styles.purple}`}> </button>
                                            <button className={`${styles['menu-item']} ${styles.orange}`}>  </button>
                                            <button className={`${styles['menu-item']} ${styles.lightblue}`} onClick={ onOpen }> <FaMapMarkedAlt className="upload-icon" size={20} style={{marginBottom:'8px'}} /> </button>
                                            {
                                                isOpen && <KakaoMapAPI />       
                                            }
                                            </nav>
                                                {/* <input type="file" id="file-upload" style={{ display: 'none' }}/> */}
                                                {/* <label className="label-no-margin" htmlFor="file-upload"><UseAnimations className="plusToX" animation={plusToX} size={40} /></label> */}
                                            </InputGroup.Append>
                                            &nbsp;&nbsp;
                                            <Form.Control
                                                as="textarea"
                                                required
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                style={{ borderRadius: '30px', verticalAlign: 'middle', marginTop:'5px', marginBottom:'5px', fontSize:'16px', overflow:'hidden' }}
                                                onKeyDown={event => {
                                                    if (event.key === 'Enter' && (event.ctrlKey || event.shiftKey)) {
                                                        event.preventDefault();
                                                        setMessage(prevMessage => prevMessage + "\n");
                                                    } else if (event.key === 'Enter') {
                                                        event.preventDefault();
                                                        handleMsgSubmit(event);
                                                    }
                                                }}
                                                // placeholder="메세지를 입력하세요."
                                                >
                                            </Form.Control>
                                            <InputGroup.Append>
                                                <Button className='BeSend_chat_button' type="submit" variant="light"><BsSend/></Button>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </Form.Group>
                                </Form>
                            </div>
                        </>
                    }
                </article>
            </Row>
        </Container>
    )
}

export default Messages;