import { useState, useEffect, useContext, useRef, React, Fragment } from 'react';
import {UserBlock, sendMessage, disconnect, getUserConversations, initializeSocket, setAppointment, deleteAppointment, appointmentCheck, ReportMessage, ExitRoom, TradeComplete, readMessages} from '../services/messagesData';
import { Container, Row, Form, InputGroup, Button, Alert, Modal } from 'react-bootstrap';
import { Link, useHistory, } from 'react-router-dom';
import { Context } from '../ContextStore';
import { animateScroll } from 'react-scroll';
import { AiOutlineAlert, AiOutlineUpload, AiOutlineSchedule } from 'react-icons/ai';
// import { ImBlocked } from 'react-icons/im';
import { IoIosArrowBack } from 'react-icons/io';
import { FaMapMarkedAlt, FaRegHandshake } from 'react-icons/fa'
import { MdOutlineRateReview } from 'react-icons/md'
import Linkify from 'react-linkify'; // url 주소 링크 처리하는 라이브러리
import { BsSend, BsDoorOpen, BsFillEnvelopeFill } from "react-icons/bs";
import { CiImageOff } from "react-icons/ci";
import UseAnimations from "react-useanimations";
import plusToX from "react-useanimations/lib/plusToX";
import settings from 'react-useanimations/lib/settings';
import '../components/Messages/Aside.css'
import '../components/Messages/Article.css'
import styles from '../components/Messages/flower.module.css'
import {KakaoMapAPI, MapMessage} from '../components/KakaoMapAPI/KakaoMapAPI';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
// import { faLastfmSquare } from '@fortawesome/free-brands-svg-icons';
import moment from "moment";
import 'moment-timezone';
import Confetti from 'react-dom-confetti';
import EmojiPicker from 'emoji-picker-react';
import { right } from '@popperjs/core';

function Messages({ match }) { // match = Router 제공 객체, url을 매개변수로 사용. ex) 경로 : /messages/123  => match.params.id = "123" // app.js 참고 : <Route path="/messages" exact component={Messages} />;
    //map modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [location, setLocation] = useState({
        lat: "",
        lng: "",
        address: ""
    });
    const detailLocation = (location) => {
        setLocation(location);
        setShowMessageKakaoMapAPI(true);
        const message = `${location.address}`;
        sendMessage(socket, { chatId: selected.chats._id, senderId: userData._id, message, location}); 
        console.log('location :', location);
    }
    const [showMessageKakaoMapAPI, setShowMessageKakaoMapAPI] = useState(false);

    //이모티콘
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) && showEmojiPicker) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [showEmojiPicker]);

    const handleEmojiPickerToggle = () => {
    setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiSelect = (emojiObject, event) => {
        console.log(emojiObject.emoji);
        setMessage((Message) => Message + emojiObject.emoji);
    };

    const github = settings;
    let chatId = match.params.id; // 선택된 채팅방의 id
    const { userData } = useContext(Context); // 사용자 id 가져오기
    const history = useHistory();
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
    const myName = selected.isBuyer ? selected.chats.buyer?.name : selected.chats.seller?.name;
    const myId = selected.isBuyer ? selected.chats.buyer?._id : selected.chats.seller?._id;
    const [notifications, setNotifications] = useState({});
    //차단하기
    const blockName1 = selected.isBuyer ? selected.chats.seller?._id : selected.chats.buyer?._id
    const blockName2 = selected.isBuyer ? selected.chats.buyer?._id : selected.chats.seller?._id;

    const blockHandle = () => {
        const blockId = blockName1
        const myId99 = blockName2
        console.log(blockId + 'blockId')
        console.log(myId99 + 'myId99')
        UserBlock(socket, {blockId, myId99})

    }


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
    // 사진 선택 시
    // const handleFileSelect = (e) => {
    //     const file = e.target.files[0];
    //     console.log(file);
    //     if (file) {
    //         // const reader = new FileReader();
    //         // reader.onload = (e) => {
    //         // const imageBase64 = e.target.result;
    //         // socket.send(JSON.stringify({ type: 'image', data: imageBase64 }));
    //         // };
    //         // reader.readAsDataURL(file);
    //         sendFile(socket, { chatId: selected.chats._id, senderId: null, file });

    //     };
        
    // };

    let currentDate = null; // 날짜 구분선

    // 약속 잡기 버튼
    const tempAppointment = () => {
        setModalState(prevState => ({ ...prevState, modalOpen: false, appointmentModalOpen: true }));
        // dayjs를 사용해서 날짜 객체를 만들어주기
        const date = dayjs(modalState.date);
        const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
        const message = `${myName}님이 ${date.format('YYYY년 MM월 DD일')} (${weekdays[date.day()]}) ${date.format('A h:mm')}에 \n 약속을 만들었어요. 약속은 꼭 지켜주세요!`;

        sendMessage(socket, { chatId: selected.chats._id, senderId: null, message});
        setAppointment(socket, { chatId: selected.chats._id, appointmentDate: date.toISOString(), appointmentCheck:false });
    };
    const [modalState, setModalState] = useState({
        date: null,
        modalOpen: false,
        appointmentModalOpen: false,
        datePickerOpen: false,
        content: ''
    });

    // 달력 창 열릴 때 실행
    const openDateTimePicker = (event) => {
        event.preventDefault()
        setModalState({ ...modalState, date: dayjs(), datePickerOpen: true, content: '', modalOpen: false, });
    };


    // 달력 창 ok 버튼 눌렀을 때 && 모달 창 열기
    const handleDateAccept = (selectedDate) => {
        setModalState(prevState => ({
            ...prevState,
            date: selectedDate,
            datePickerOpen: false,
            modalOpen: true,
            content: `설정한 날짜는 ${dayjs(selectedDate).format('YYYY.MM.DD A h:mm')}입니다. 이 날짜로 약속 시간을 잡을게요.`
        }));
        console.log('selectdate : ',selectedDate)
        setSelected(prevSelected => ({
            ...prevSelected,
            chats: {
                ...prevSelected.chats,
                appointmentDate: selectedDate,
            },
        }));
    };

    // 달력 창이 닫힐 때 실행
    const handleDatePickerClose = () => {
        setModalState(prevState => ({ ...prevState, datePickerOpen: false }));
    };

        // 모달 창 닫기
    const handleModalClose = () => {
        setModalState(prevState => ({ ...prevState, modalOpen: false }));
    };


    const [currentAppointment, setCurrentAppointment] = useState(null);
    
    useEffect(()=> { 
        if (selected.chats.appointmentDate && !selected.isBuyer && !selected.chats.appointmentCheck){
            setCurrentAppointment(selected.chats.appointmentDate);
        } else {
            setCurrentAppointment(null);
        }
    },[selected]);

    // 약속 설정 완료
    useEffect(() => {
        if (!socket) return;
        socket.on('appointmentUpdated', ({ chatId, appointmentDate }) => {
          if(chatId === selected.chats._id){
            setSelected(prevSelected => ({
              ...prevSelected,
              chats: {
                ...prevSelected.chats,
                appointmentDate: appointmentDate,
              },
            }));
          }
        });
      
        return () => {
          socket.off('appointmentUpdated');
        }
      }, [selected, socket]);

    //appointmentUpdated
    // console.log('약속 설정 완료');

    useEffect(() => { // 클라이언트에서 약속 삭제 유무 실시간 확인용
        if (!socket) return;
        // console.log('약속 삭제 감시용');
        const handleDeleteAppointment = ({chatId}) => {
            if (chatId === selected.chats._id) {
                setSelected(prevSelected => ({
                    ...prevSelected,
                    chats: {
                        ...prevSelected.chats,
                        appointmentDate: null,
                    },
                }));
            }
        };
        socket.on('deleteAppointmentUpdated', handleDeleteAppointment);
        
        return () => {
            socket.off('deleteAppointmentUpdated', handleDeleteAppointment);
        };
    }, [socket, selected]);

    useEffect(() => { // 
        if (!socket) return;
         // console.log('약속 확인 감시용');
        const handleAcceptAppointment = ({chatId, appointmentCheck}) => {
            if (chatId === selected.chats._id) {
                setSelected(prevSelected => ({
                    ...prevSelected,
                    chats: {
                        ...prevSelected.chats,
                        appointmentCheck,
                    },
                }));
            }
        };
        socket.on('appointmentChecked', handleAcceptAppointment);
        
        return () => {
            socket.off('appointmentChecked', handleAcceptAppointment);
        };
    }, [socket, selected]);

    const appointmentModalAccept = () => {
        // 약속 수락 시 system에 추가 메세지 보내기 -> 거래 팁을 알려드려요! , 0월0일에 거래 약속이 있나요? 따뜻한 거래를 위한 팁을 알려드릴게요!
        // 지도 위치 다시 보여주기
        appointmentCheck(socket, {chatId:selected.chats._id, appointmentCheck : true})
        const message = `${dayjs(selected.chats.appointmentDate).format('MM월 DD일')}에 거래 약속이 있어요~ 안전하고 따뜻한 거래 부탁드려요 ☺️`;
        sendMessage(socket, { chatId: selected.chats._id, senderId: null, message});
        setCurrentAppointment(null);
    }

    const appointmentModalReject = () => {
        deleteAppointment(socket, { chatId: selected.chats._id});
        const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
        const message = `${myName}님이 ${dayjs(selected.chats.appointmentDate).format('YYYY년 MM월 DD일')} (${weekdays[dayjs(selected.chats.appointmentDate).day()]}) ${dayjs(selected.chats.appointmentDate).format('A h:mm')}에 시간이 안된다고 하셨어요. 😣 \n 다른 시간으로 약속을 잡아볼까요?`;
        sendMessage(socket, { chatId: selected.chats._id, senderId: null, message});
        setCurrentAppointment(null);
    }

    // 후기 & 거래 완료
    const [reviewButtonOn, setReviewButtonOn] = useState(false);
    
    useEffect(() => { // 실제 시간-약속 시간 비교
        const currentTime = moment().tz("Asia/Seoul");
        const appointmentTime = moment(selected.chats.appointmentDate);
        if (selected.chats.appointmentDate && currentTime.isSameOrAfter(appointmentTime)) {
            setReviewButtonOn(true);
        } else {
            setReviewButtonOn(false);
        }

    },[selected.chats.appointmentDate]);

    const handleTradeComplete = () => {
        const message = `거래가 성공적으로 완료되었어요! 후기도 꼭 남겨주세요~ `;
        sendMessage(socket, { chatId: selected.chats._id, senderId: null, message}); 
        console.log('거래완료 테스트 : ',selected.chats._id)
        TradeComplete(socket, {chatId: selected.chats._id, productId: selected.chats.product._id })
        setTradeCompleteConfetti(true);
        setTimeout(() => setTradeCompleteConfetti(false), 5000);

        setSelected(prevSelected => ({
            ...prevSelected,
            chats: {
                ...prevSelected.chats,
                product: {
                    ...prevSelected.chats.product,
                    soldout: true
                }
            }
        }));


    }

    // 거래 완료 후 confetti 효과
    const [tradeCompleteConfetti, setTradeCompleteConfetti] = useState(false);
    const confettiConfig = {
        angle: 90,
        spread: 360,
        startVelocity: 50,
        elementCount: 200,
        dragFriction: 0.12,
        duration: 3000,
        stagger: 3,
        width: "10px",
        height: "10px",
        perspective: "500px",
        colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
      };


    // 신고하기 버튼
    const [reportModalShow, setReportModalShow] = useState();
    const reportedUserId = selected.isBuyer ? selected.chats.seller?._id : selected.chats.buyer?._id;
    const handleShowReportModal = () => {
        setReportModalShow(true);
      };
    const handleReport = (reason) => {
    // 서버에 신고 메시지 전송
    ReportMessage(socket, { reportedUserId, reason });
    setReportModalShow(false);
    };

    // 채팅방 나가기 모달
    const [exitRoomModalShow,setExitRoomModalShow] = useState(false);
    const ExitRoomModalopen = () => {
        setExitRoomModalShow(true);
    }
    const handleExitRoom = () => {
        const message = `${myName}님이 나가셨습니다.`;
        sendMessage(socket, { chatId: selected.chats._id, senderId: null, message}); 
        console.log('나가기 테스트 : ',selected.chats._id, myId)
        ExitRoom(socket, {chatId: selected.chats._id, userId: myId})
        setExitRoomModalShow(false);
        
        setTimeout(() => {
            history.push("/");
        }, 500);
    }

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
        const newNotifications = {};
        res.forEach(chatroom => {
            newNotifications[chatroom.chats._id] = chatroom.isBuyer 
            ? chatroom.chats.notificationMessages_buyer
            : chatroom.chats.notificationMessages_seller;
        });
        setNotifications(newNotifications);
        if (isSelected) { // 채팅방이 선택되었다면 현재 선택된 채팅방의 정보를 selected 상태 변수에 저장
            setSelected(res.find(x => x.chats?._id === chatId))
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
            if (newMessage.location) {
                setLocation(newMessage.location);
            }
            scrollToBottom();
        };
        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket, selected]);

    // 채팅방을 클릭했을 때
    const handleChatRoomClick = (chatId) => {
        if (!userData._id) {console.error('userData._id is not defined'); return;}
        socket.emit('enterChatRoom', { chatId, userId: userData._id });
        setIsSelected(true);
        setSelected(chatroomList.find(room => room.chats._id === chatId));
        setTimeout(() => {
            readMessages(socket, { chatId, userId: userData._id });
        }, 500);
    };

    // 알림 실시간 확인
    useEffect(() => {
        if (!userData || !socket) return;
        socket.on('notificationChat', ({ chatId, notificationMessages, senderId }) => {
            if (senderId !== userData._id) {
                setNotifications(prev => ({ ...prev, [chatId]: notificationMessages }));
            }
        });
        socket.on('readMessagesUpdate', ({ chatId }) => {
            setNotifications(prev => ({ ...prev, [chatId]: 0 }));
        });
        return () => {
            if (socket) {
                socket.off('notificationChat');
                socket.off('readMessagesUpdate');
            }
        };
    }, [socket, userData?._id]);


    useEffect(() => {
        console.log("채팅방 전체 로그 : ", selected);
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
        console.log({chatId: selected.chats._id, senderId: userData._id, message, file})
        // sendMessage(socket, { chatId: selected.chats._id, senderId: userData._id, message, location});
        sendMessage(socket, { chatId: selected.chats._id, senderId: userData._id, message, file});
        setMessage("");
        console.log('2. messages.js, sendmessage');
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
                                    <Link onClick={() => handleChatRoomClick(x.chats._id)} to={`/messages/${x.chats?._id}`}>
                                        {x.isBuyer ?
                                            <>
                                                {x.chats.seller?.avatar ? <img src={x.chats.seller?.avatar} alt="user-avatar" /> : <img src='https://kr.object.ncloudstorage.com/ncp3/ghuPttFw_400x400.jpg' alt='carrot_avatar' />}  
                                                <span> {x.chats.seller?.name  || '(알 수 없음)'}</span>
                                                {x.chats.product?.image ? <img src={x.chats.product?.image[0]} alt="product" style={{float: 'right', width: '35px', height: '35px', objectFit: 'cover', marginTop:'5px'}}/> : 
                                                <CiImageOff size={20} style={{float: 'right', width: '35px', height: '35px', objectFit: 'cover'}} />} &nbsp;&nbsp;
                                                {notifications[x.chats._id] > 0 && (<span ><BsFillEnvelopeFill className='bell'/>&nbsp;&nbsp;<span className='message_notiNumber'>{notifications[x.chats._id]}</span></span>)}

                                            </>
                                            :
                                            <>
                                                {x.chats.buyer?.avatar ? <img src={x.chats.buyer?.avatar} alt="user-avatar" /> : <img src='https://kr.object.ncloudstorage.com/ncp3/ghuPttFw_400x400.jpg' alt='carrot_avatar' />}
                                                <span> {x.chats.buyer?.name  || '(알 수 없음)'}</span>
                                                {x.chats.product?.image ? <img src={x.chats.product?.image[0]} alt="product" style={{float: 'right', width: '35px', height: '35px', objectFit: 'cover', marginTop:'5px'}}/> : 
                                                <CiImageOff size={20} style={{float: 'right', width: '35px', height: '35px', objectFit: 'cover'}} />} &nbsp;&nbsp;
                                                {notifications[x.chats._id] > 0 && (<span ><BsFillEnvelopeFill className='bell'/>&nbsp;&nbsp;<span className='message_notiNumber'>{notifications[x.chats._id]}</span></span>)}

                                            </>
                                        }
                                    </Link>
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
                                    <Link to={`/profile/${selected.chats.seller?._id}`}>
                                        {selected.chats.seller?.avatar ? <img className='messageAvatar' src={selected.chats.seller?.avatar} alt="user-avatar" /> : <img className='messageAvatar' src='https://kr.object.ncloudstorage.com/ncp3/ghuPttFw_400x400.jpg' alt='carrot_avatar' />}&nbsp;
                                        <span>{selected.chats.seller?.name || '(알 수 없음)'} </span>
                                        <span className='message_mannertmp'>{selected.chats.seller?.mannertmp}°C</span>

                                    </Link>
                                    :
                                    <Link to={`/profile/${selected.chats.buyer?._id}`}>
                                        {selected.chats.buyer?.avatar ? <img className='messageAvatar' src={selected.chats.buyer?.avatar} alt="user-avatar" /> : <img className='messageAvatar' src='https://kr.object.ncloudstorage.com/ncp3/ghuPttFw_400x400.jpg' alt='carrot_avatar'/>}&nbsp;
                                        <span>{selected.chats.buyer?.name || '(알 수 없음)'} </span> 
                                        <span className='message_mannertmp'>{selected.chats.buyer?.mannertmp}°C</span>
                                        
                                    </Link>
                                }

                                <div className="dropdown">
                                    <button className="dropdown-button">
                                        <UseAnimations animation={github} size={35}/>
                                    </button>
                                    <div className="dropdown-content">
                                        <button className="dropdown-content-out" onClick={ExitRoomModalopen}>
                                            <BsDoorOpen size={15} /> 채팅방 나가기
                                        </button>
                                        {/* <button className="dropdown-content-block" onClick={blockHandle}> 
                                            <ImBlocked size={20} /> 차단하기  
                                        </button> */}
                                        <button className="dropdown-content-declare" onClick={handleShowReportModal}>
                                            <AiOutlineAlert size={20} /> 신고하기 
                                        </button>
                                    </div>
                                </div>
                                
                            </div>
                            {alertShow &&
                                <Alert className="alert-glass" onClose={() => setAlertShow(false)}>
                                <div className="flex-container">
                                    {selected.chats.product?.image ? <img src={selected.chats.product?.image[0]} alt="product" className="img-style" /> :  <CiImageOff size={40}  /> }
                                    <div className="text-container">
                                        <div>
                                            <span className="text-bold">{selected.chats.product?.soldout ? '거래완료' : (selected.chats.appointmentCheck ? '예약중' : '거래중')}</span> &nbsp;&nbsp;
                                            <span>{selected.chats.product?.title}</span>
                                        </div>
                                        <div>
                                            <span className="text-bold">{Number(selected.chats.product?.price).toLocaleString()}원</span>
                                        </div>
                                    </div>
                                </div> 
                                    {!selected.chats.product?.soldout && <Button className='messageButton' onClick={openDateTimePicker}> <AiOutlineSchedule size={20}/> 약속 잡기 </Button>}&nbsp;
                                    <Button className='messageButton' onClick={ handleShow }> <FaMapMarkedAlt size={20}/> 장소 공유 </Button> &nbsp;
                                    {reviewButtonOn && <Button className='messageButton' onClick={handleTradeComplete} disabled={selected.chats.product?.soldout}> <FaRegHandshake size={20}/> 거래 완료 </Button>} &nbsp;
                                    {selected.chats.product?.soldout && <Button className='messageButton' onClick={() => history.push('/profile/chatId/review')}> <MdOutlineRateReview size={20} /> 후기 보내기 </Button>} &nbsp;
                                    <Confetti className="Confetti" active={ tradeCompleteConfetti } config={ confettiConfig } />
                                </Alert>
                            }
                            <div ref={chatContainerRef} id="chat-selected-body" className="chat-selected-body col-lg-12" style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${bgUrl})`}}>
                            {selected.chats.conversation.slice(Math.max(selected.chats.conversation.length - showMessagesCount, 0)).map((x, index) =>{
                                if (x) {
                                    const messageDate = new Date(x.sentAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric'});

                                    return (
                                        <Fragment key={index}>
                                            {messageDate !== currentDate && (currentDate = messageDate) && <div className="hr-sect" >{currentDate}</div>}
                                            {x.senderId === null ? (
                                                // 시스템 메세지 1
                                                <div className="system-message-div">
                                                    <span className="system-message" style={{ whiteSpace: 'pre-wrap' }} ><Linkify>{x.message}</Linkify></span>
                                                </div>
                                            ) : (
                                                <div className={selected.myId === x.senderId ? 'me' : "not-me"}>
                                                    <span className="timestamp">{x.sentAt ? new Date(x.sentAt).toLocaleTimeString('ko-KR', { hour: 'numeric', minute: 'numeric', hour12: true }) : ""}</span> &nbsp;
                                                    {x.location ? (
                                                        // map 전용 메세지 2
                                                        <div className="message with-map" style={{backgroundColor:'white', border: '1px solid gray', color:'black', padding: '0px', textAlign: 'center', minWidth:'300px'}}>
                                                                <MapMessage lat={x.location.lat} lng={x.location.lng}/>
                                                                <div style={{height:'110px'}}> </div>
                                                                <strong><Linkify>{x.message}</Linkify></strong>
                                                            <div>
                                                                <Button className='messageInButton' onClick={() => window.open(`http://map.kakao.com/link/map/${x.location.lat},${x.location.lng}`, "_blank")} >장소 보기</Button>
                                                            </div>
                                                        </div>
                                                    ) : ( // 그냥 메세지 3
                                                        <div className="message">
                                                        <Linkify>{x.message}</Linkify>
                                                        </div>
                                                    )}
                                                    {selected.myId !== x.senderId && (
                                                         selected.chats.seller?._id ? (
                                                            <Link to={`/profile/${selected.chats.seller?._id}`}>
                                                              <img
                                                                className="user-avatar"
                                                                src={
                                                                  (selected.isBuyer
                                                                    ? selected.chats.seller?.avatar
                                                                    : selected.chats.buyer?.avatar) ||
                                                                  'https://kr.object.ncloudstorage.com/ncp3/ghuPttFw_400x400.jpg'
                                                                }
                                                                alt="user-avatar"
                                                              />
                                                            </Link>
                                                          ) : (
                                                            <img
                                                              className="user-avatar"
                                                              src={
                                                                (selected.isBuyer
                                                                  ? selected.chats.seller?.avatar
                                                                  : selected.chats.buyer?.avatar) ||
                                                                'https://kr.object.ncloudstorage.com/ncp3/ghuPttFw_400x400.jpg'
                                                              }
                                                              alt="user-avatar"
                                                            />
                                                          )
                                                        )}
                                                    </div>
                                            )}
                                        </Fragment>
                                    )
                                } else {
                                    return null;
                                }
                            })}
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
                                            <button type="button" className={`${styles['menu-item']} ${styles.lightblue}`} onClick={ handleShow }> <FaMapMarkedAlt size={20} style={{marginBottom:'8px'}} /> {/*{console.log('modalstate 값 확인 : ',modalState)}*/} </button>
                                            {handleShow && (
                                                <Modal show={show} onHide={handleClose}>
                                                <div>
                                                    <KakaoMapAPI detailLocation={detailLocation} />
                                                </div>
                                                </Modal>
                                            )}
                                             
                                            <button className={`${styles['menu-item']} ${styles.green}`} onClick={openDateTimePicker}> <AiOutlineSchedule size={23} style={{marginBottom:'7px'}} /> </button>

                                            <button className={`${styles['menu-item']} ${styles.purple}`} style={{display: "none"}}> </button>
                                            <button className={`${styles['menu-item']} ${styles.orange}`} style={{display: "none"}}>  </button>

                                            <button type="button" className={`${styles['menu-item']} ${styles.blue}`} onClick={() => document.getElementById("uploadInput").click()}> 
                                                <input type="file" name='image' id="uploadInput" onChange={e => setFile(e.target.files[0])} style={{display: 'none'}} />
                                                <AiOutlineUpload className="upload-icon" size={25} style={{marginBottom:'7px'}} /> 
                                            </button>

                                            {/* 이모티콘 */}
                                            <button className={`${styles['menu-item']} ${styles.red}`}
                                                onClick={handleEmojiPickerToggle}> 
                                                <div style={{fontSize:'16px', marginBottom:'7px'}} >🤗</div> 
                                            </button>
                                            
                                            </nav>
                                            </InputGroup.Append>
                                            &nbsp;&nbsp;
                                            {file && file.type.startsWith('image/') ? (
                                                <div>
                                                    <img src={URL.createObjectURL(file)} alt="Selected Image" style={{ maxWidth: '100%', height: 'auto', borderRadius: '30px', verticalAlign: 'middle', marginTop:'5px', marginBottom:'5px', paddingRight:'10px' }} />
                                                    <button onClick={() => setFile(null)}>파일취소</button>
                                                </div>
                                                ) : (
                                            <Form.Control
                                                as="textarea"
                                                required
                                                value= {message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                style={{ borderRadius: '30px', verticalAlign: 'middle', marginTop:'5px', marginBottom:'5px', fontSize:'16px', overflow:'hidden'}}
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
                                            )}
                                            <InputGroup.Append>
                                                <Button className='BeSend_chat_button' type="submit" variant="light"><BsSend/></Button>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </Form.Group>
                                </Form>
                                
                                {modalState.datePickerOpen && (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <MobileDateTimePicker open={modalState.datePickerOpen} onAccept={handleDateAccept} onClose={handleDatePickerClose} value={modalState.date ? modalState.date : new Date()} on/>
                                    </LocalizationProvider>
                                )}
                                {modalState.modalOpen && modalState.content !== '' &&  (
                                <Modal show={modalState.modalOpen} onHide={handleModalClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>약속 시간 설정</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {modalState.content}
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleModalClose}>취소</Button>
                                        <Button variant="primary" onClick={tempAppointment}>확인</Button>
                                    </Modal.Footer>
                                </Modal>
                                )}
                                <AppointmentModal show={modalState.appointmentModalOpen && currentAppointment !== null && selected.chats.appointmentCheck === false} selected={selected} appointmentModalAccept={appointmentModalAccept} appointmentModalReject={appointmentModalReject} myName={myName}  />
                                <ReportModal show={reportModalShow} onHide={() => setReportModalShow(false)} onReport={handleReport}/>
                                <ExitRoomModal show={exitRoomModalShow} onHide={() =>  setExitRoomModalShow(false)} handleExitRoom={handleExitRoom}   />
                            </div>
                        </>
                    }
                    <div ref={emojiPickerRef}>
                            {showEmojiPicker && 
                            <EmojiPicker 
                            onEmojiClick={handleEmojiSelect}
                            />}
                    </div>
                </article>
            </Row>  
        </Container>
        
    )
}

// 약속을 db가 존재할 때 처음 한번만 떠야 함. 그러면 결국 약속 상태 db를 만들어야 함.
function AppointmentModal({ show, selected, appointmentModalAccept, appointmentModalReject, myName }) {
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const AppointmentDate = selected.chats.appointmentDate ? `${dayjs(selected.chats.appointmentDate).format('YYYY년 MM월 DD일')} (${weekdays[dayjs(selected.chats.appointmentDate).day()]}) ${dayjs(selected.chats.appointmentDate).format('A h:mm')}` : null;

    return (
        <Modal className='appointmentModal'  show={show}>
            <Modal.Header><img src='https://kr.object.ncloudstorage.com/ncp3/ncp3/logo_main_row.webp' alt='logo'/></Modal.Header>
            <Modal.Body className="appointmentModalBody" >
                <p><strong>{myName}님이 약속을 만들었어요. 약속을 수락하시겠어요?</strong></p>
                <p>약속 일자 : {AppointmentDate}</p>
                {/* <p>수락 시 게시글이 예약중으로 변경됩니다.</p> */}
            </Modal.Body>
            <Modal.Footer className="appointmentModalFooter">
                <Button variant="secondary" onClick={appointmentModalReject}>
                    거절
                </Button>
                &emsp;&emsp;
                <Button className="appointmentModalButton" onClick={appointmentModalAccept}>
                    수락
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function ReportModal({show, onHide, onReport}) {
    
    const [reason, setReason] = useState("");
    
    const handleReport = () => {
        onReport(reason);
        onHide();
    };

    return (
        <Modal className='ReportModal'  show={show}> 
            <Modal.Header className='ReportModalHeader' ><img src='https://kr.object.ncloudstorage.com/ncp3/ncp3/logo_main_row.webp' alt='logo'/>&emsp;&emsp;&emsp;&emsp;   <AiOutlineAlert size={20} color='red' />&nbsp;신고하기</Modal.Header>
            <Modal.Body className="ReportModalBody" >
                <textarea onChange={(e) => setReason(e.target.value)} />
            </Modal.Body>
            <Modal.Footer className="ReportModalFooter">
                <Button variant="secondary" onClick={onHide}>
                    취소
                </Button>
                &emsp;&emsp;
                <Button className="ReportModalButton" onClick={handleReport}>
                    신고
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function ExitRoomModal({show, onHide, handleExitRoom}) {

    return (
        <Modal className='ExitRoomModal'  show={show}>
            <Modal.Header><img src='https://kr.object.ncloudstorage.com/ncp3/ncp3/logo_main_row.webp' alt='logo'/></Modal.Header>
            <Modal.Body className="ExitRoomModalBody" >
                <p><strong>정말 채팅방을 나가시겠어요?</strong></p>
            </Modal.Body>
            <Modal.Footer className="ExitRoomModalFooter">
                <Button variant="secondary" onClick={onHide}>
                    취소
                </Button>
                &emsp;&emsp;
                <Button className="ExitRoomModalButton" onClick={handleExitRoom}>
                    확인
                </Button>
            </Modal.Footer>
        </Modal>
    );
}







export default Messages;