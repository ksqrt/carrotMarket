import { useState, useEffect, useContext } from 'react';
// import { getUserConversations, sendMessage } from '../services/messagesData';
import {startChat, sendMessage, disconnect, getMessage, socket, getUserConversations, initializeSocket} from '../services/messagesData';
import { Container, Row, Form, InputGroup, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Context } from '../ContextStore';
import '../components/Messages/Aside.css'
import '../components/Messages/Article.css'

function Messages({ match }) { // match = Router 제공 객체, url을 매개변수로 사용. ex) 경로 : /messages/123  => match.params.id = "123" // app.js 참고 : <Route path="/messages" exact component={Messages} />;
    let chatId = match.params.id; // 선택된 채팅방의 id

    const { userData } = useContext(Context);
    const [conversations, setConversations] = useState([]) // 모든 채팅방의 정보를 저장하는 상태 변수
    const [isSelected, setIsSelected] = useState(false); // 채팅방 선택 유무를 확인하는 상태 변수, 선택된 채팅방
    const [selected, setSelected] = useState({ // 선택된 채팅방의 상세 정보(참가user, conversation(나눈 대화 내역))를 저장하는 상태 변수  
        chats: { // 초기값 설정
            _id: 0,
            seller: {
                _id: "",
                avatar: "",
                name: ""
            },
            buyer: {
                _id: "",
                avatar: "",
                name: ""
            },
            conversation: []
        },
        isBuyer: null,
        myId: 0
    });
    const [message, setMessage] = useState("");
    const [alert, setAlert] = useState(null);
    const [alertShow, setAlertShow] = useState(false);
    

    console.log(userData._id);

    useEffect(() => {
        initializeSocket();
            getUserConversations(userData._id) // 현재 사용자와 관련된 모든 채팅방 목록을 가져옴
                .then(res => {
                    setConversations(res); // 가져온 채팅방 목록을 상태 변수에 저장.
                    if (isSelected) { // 채팅방이 선택되었다면 현재 선택된 채팅방의 정보를 selected 상태 변수에 저장
                        setSelected(res.find(x => x.chats._id === chatId))
                    }
                })
                .catch(err => console.log(err))
  
        return () => {
             // unmount되면 timeout 제거
            disconnect(() => {
                console.log("Socket disconnected");
            });
        };
    }, [isSelected, chatId, userData._id]);
   

    
    useEffect(() => {
        getMessage((newMessage) => {
            console.log("Received Message", newMessage);
            if (isSelected && (selected.chats._id === chatId)) { // isselected가 true 상태(채팅방이 선택된 상태)이고, chatId와 selected.chats._id가 같은 경우
                setSelected(pastChat => ({
                    ...pastChat,
                    chats: {
                        ...pastChat.chats,
                        conversation: [...pastChat.chats.conversation, newMessage]
                    }
                }));
                console.log("chatId : ",chatId);
            }
        });
        return () => {
            socket.off('newMessage'); // 컴포넌트 unmount시에 리스너 제거
        }
    }, [isSelected, chatId, selected, message]);


    async function handleMsgSubmit(e) {
        e.preventDefault();
        console.log('My ID:', selected.myId);
        console.log('chatId:', chatId);
        console.log('userData._id:', userData._id);
        console.log('message:', message);
        try {
          await sendMessage({ chatId, senderId: userData._id, message });
          setSelected(pastChat => ({
            ...pastChat,
            chats: {
                ...pastChat.chats,
                conversation: [...pastChat.chats.conversation, { senderId: userData._id, message }]
            }
          }));
          setMessage("");
        } catch (err) {
          console.log(err);
        }
    }


    return (
        <Container>
            <Row>
                <aside className="col-lg-4 col-md-4">
                    <h3>Conversations</h3>
                    {conversations.length >= 1 ?
                        <>
                            {conversations.map(x =>
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
                            <div className="chat-selected-body col-lg-12">
                                {selected.chats.conversation.map(x =>
                                    <div className={selected.myId === x.senderId ? 'me' : "not-me"} key={x._id}>
                                        <span className="message">{x.message}</span>
                                    </div>
                                )}
                            </div>
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
