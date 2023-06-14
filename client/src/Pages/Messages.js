import { useState, useEffect, useContext } from 'react';
import {sendMessage, disconnect, getUserConversations, initializeSocket} from '../services/messagesData';
import { Container, Row, Form, InputGroup, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Context } from '../ContextStore';
import ScrollToBottom, { useScrollToBottom, useSticky } from 'react-scroll-to-bottom';
import InfiniteScroll from 'react-infinite-scroll-component';

import '../components/Messages/Aside.css'
import '../components/Messages/Article.css'



function Messages({ match }) { // match = Router 제공 객체, url을 매개변수로 사용. ex) 경로 : /messages/123  => match.params.id = "123" // app.js 참고 : <Route path="/messages" exact component={Messages} />;
    
    let chatId = match.params.id; // 선택된 채팅방의 id
    const scrollToBottom = useScrollToBottom();
    const { sticky } = useSticky();

    const { userData } = useContext(Context); // 사용자 id 가져오기
    const [chatroomList, setChatroomList] = useState([]) // 사용자의 모든 채팅방 정보
    const [isSelected, setIsSelected] = useState(true); // 채팅방 선택
    const [selected, setSelected] = useState({ // 선택된 채팅방의 상세 정보(참가user, conversation(나눈 대화 내역)) 저장 
        chats: {
            _id: 0,
            seller: { _id: "", avatar: "", name: "" },
            buyer: { _id: "", avatar: "", name: "" },
            conversation: []
        },
        isBuyer: null,
        myId: 0
    });
    const [message, setMessage] = useState(""); // 내가 입력한 메세지 
    //const [alert, setAlert] = useState(null); // 메세지 전송 성공 메세지
    //const [alertShow, setAlertShow] = useState(false); // 메세지 전송 성공 메세지 토글
    const [socket, setSocket] = useState(null); // initializeSocket 소켓 초기화
    
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
            setChatroomList(res); // 가져온 채팅방 목록을 상태 변수에 저장.
            if (isSelected) { // 채팅방이 선택되었다면 현재 선택된 채팅방의 정보를 selected 상태 변수에 저장
              setSelected(res.find(x => x.chats._id === chatId))
            }
          })
          .catch(console.log)
      }, [isSelected, chatId, socket, userData]);

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

            if(sticky) {
                scrollToBottom();
            }
        };
    
        socket.on('newMessage', handleNewMessage);
    
        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket, sticky]);
    
    useEffect(() => {
        return () => {
          if (socket) {
            disconnect(socket, console.log.bind(null, "Socket disconnected"));
          }
        };
      }, [socket]);


    const handleMsgSubmit = event => {
        event.preventDefault();
        sendMessage(socket, { chatId: selected.chats._id, senderId: userData._id, message });
        setMessage("");
        if(sticky) {
            scrollToBottom();
        }
        //setAlert("Message sent!");
        //setAlertShow(true);
        console.log('2. messages.js, sendmessage');
    };

    return (
        <Container>
            <Row>
                <aside className="col-lg-4 col-md-4">
                    <h3>Conversations</h3>
                    {chatroomList.length >= 1 ?
                        <>
                            {chatroomList.map(x =>
                                <div className="chat-connections" key={x.chats._id}>
                                    <Link onClick={() => setIsSelected(true)} to={`/messages/${x.chats._id}`}>
                                        {x.isBuyer ?
                                            <><img src={x.chats.seller.avatar} alt="user-avatar" /> <span>{x.chats.seller.name}</span></>
                                            :
                                            <><img src={x.chats.buyer.avatar} alt="user-avatar" /> <span>{x.chats.buyer.name}</span></>
                                        }
                                    </Link>
                                </div>)
                            }
                        </>
                        :
                        <h5>No messages yet</h5>
                    }
                </aside>
                <article className="col-lg-8 col-md-8">
                    {isSelected &&
                        <>
                            <div className="chat-selected-header col-lg-12">
                                {selected.isBuyer ?
                                    <Link to={`/profile/${selected.chats.seller._id}`}>
                                        <img src={selected.chats.seller.avatar} alt="user-avatar" />
                                        <span>{selected.chats.seller.name}</span>
                                    </Link>
                                    :
                                    <Link to={`/profile/${selected.chats.buyer._id}`}>
                                        <img src={selected.chats.buyer.avatar} alt="user-avatar" />
                                        <span>{selected.chats.buyer.name}</span>
                                    </Link>
                                }
                            </div>
                            {/* {alertShow &&
                                <Alert variant="success" onClose={() => setAlertShow(false)} dismissible>
                                    <p>
                                        {alert}
                                    </p>
                                </Alert>
                            } */}

                            <ScrollToBottom className="chat-selected-body col-lg-12" defaultScrollBehavior="bottom">
                                {selected.chats.conversation.map((x, index) =>
                                    x ?
                                    <div className={selected.myId === x.senderId ? 'me' : "not-me"} key={index}>
                                        <span className="message">{x.message}</span>
                                    </div>
                                    : null
                                )}
                            </ScrollToBottom>

                            <div className="chat-selected-footer col-lg-12">
                                <Form onSubmit={handleMsgSubmit}>
                                    <Form.Group>
                                        <InputGroup>
                                            <Form.Control
                                                as="textarea"
                                                required
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                onKeyDown={event => {
                                                    if (event.key === 'Enter' && (event.ctrlKey || event.shiftKey)) {
                                                        event.preventDefault();
                                                        setMessage(prevMessage => prevMessage + "\n");
                                                    } else if (event.key === 'Enter') {
                                                        event.preventDefault();
                                                        handleMsgSubmit(event);
                                                    }
                                                }}>
                                            </Form.Control>
                                            <InputGroup.Append>
                                                <Button type="submit" variant="secondary">Sent</Button>
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