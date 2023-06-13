import { useState, useEffect, useContext } from 'react';
import {startChat, sendMessage, disconnect, getMessage, getUserConversations, initializeSocket} from '../services/messagesData';
import { Container, Row, Form, InputGroup, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Context } from '../ContextStore';
import { ScrollToBottom } from 'react-scroll-to-bottom'; // 스크롤이 자동으로 맨 밑으로 이동하는 라이브러리, 메세지가 추가될 때마다 자동으로 맨 밑으로 이동.
import '../components/Messages/Aside.css'
import '../components/Messages/Article.css'

function Messages({ match }) { // match = Router 제공 객체, url을 매개변수로 사용. ex) 경로 : /messages/123  => match.params.id = "123" // app.js 참고 : <Route path="/messages" exact component={Messages} />;
    
    let chatId = match.params.id; // 선택된 채팅방의 id

    const { userData } = useContext(Context); // 사용자 id 가져오기
    const [chatroomList, setChatroomList] = useState([]) // 사용자의 모든 채팅방 정보
    const [isSelected, setIsSelected] = useState(false); // 채팅방 선택
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
    const [alert, setAlert] = useState(null); // 메세지 전송 성공 메세지
    const [alertShow, setAlertShow] = useState(false); // 메세지 전송 성공 메세지 토글
    const [socket, setSocket] = useState(null); // initializeSocket 소켓 초기화
    const [lastMessage, setLastMessage] = useState(null);
    
    useEffect(() => {
        (async () => {
          setSocket(await initializeSocket());
        })();
      }, []);

      useEffect(() => {
        if (!userData || !socket) return;
        console.log("messages.js, getUserConversations ");
        getUserConversations(socket, userData._id) // 현재 사용자와 관련된 모든 채팅방 목록을 가져옴
          .then(res => {
            setChatroomList(res); // 가져온 채팅방 목록을 상태 변수에 저장.
            if (isSelected) { // 채팅방이 선택되었다면 현재 선택된 채팅방의 정보를 selected 상태 변수에 저장
              setSelected(res.find(x => x.chats._id === chatId))
            }
          })
          .catch(console.log)
      }, [isSelected, chatId, userData, socket, selected.chats.conversation]);
   
      useEffect(() => {
        return () => {
          if (socket) {
            disconnect(socket, console.log.bind(null, "Socket disconnected"));
          }
        };
      }, [socket]);
      
    useEffect(() => {
        if (!socket) return;
        console.log('4. messages.js, newMessage');
        socket.on('newMessage', (newMessage) => { // newMessage 인자와 함께 sendMessage 이벤트를 받았을 때 실행됨.
            if(selected.chats._id === newMessage.chatId) {
                setSelected((prevSelected) => ({
                    ...prevSelected,
                    chats: {
                        ...prevSelected.chats,
                        conversation: [...prevSelected.chats.conversation, newMessage],
                    },
                }));
                setLastMessage(newMessage);
            }
        console.log('selected.chats.conversation : ',selected.chats.conversation);
        console.log('selected : ',selected);
        });
    }, [selected.chats._id, selected.chats.conversation]); // 채팅방, 대화 내용 배열 변경 시마다 이벤트 발생.

    const handleMsgSubmit = event => {
        event.preventDefault();
        sendMessage(socket, { chatId: selected.chats._id, senderId: userData._id, message });
        setMessage("");
        setAlert("Message sent!");
        setAlertShow(true);
        console.log('1. messages.js, sendmessage');
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
                            {alertShow &&
                                <Alert variant="success" onClose={() => setAlertShow(false)} dismissible>
                                    <p>
                                        {alert}
                                    </p>
                                </Alert>
                            }
                            <ScrollToBottom>
                            <div className="chat-selected-body col-lg-12">
                                {selected.chats.conversation.map((x, index) =>
                                    x && x._id ?
                                    <div className={selected.myId === x.senderId ? 'me' : "not-me"} key={x._id}>
                                        <span className="message">{x.message}</span>
                                    </div>
                                    : null
                                )}
                            </div>
                            </ScrollToBottom>
                            <div className="chat-selected-footer col-lg-12">
                                <Form onSubmit={handleMsgSubmit}>
                                    <Form.Group>
                                        <InputGroup>
                                            <Form.Control
                                                as="textarea"
                                                required
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}>
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
