import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Tabs, Tab, Image, OverlayTrigger , Tooltip, Button} from 'react-bootstrap';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { wishProduct } from '../../../services/productData'
import { startChat, initializeSocket } from '../../../services/messagesData';
import { Context } from '../../../ContextStore';

function ProductInfo({ params }) {
    const [wish, setWish] = useState(false);
    const [socket, setSocket] = useState(null);
    const { userData } = useContext(Context);
    const history = useHistory();
    useEffect(() => {
        if (params.isWished === true) {
            setWish(true)
        } else {
            setWish(false)
        }
    }, [params.isWished, setWish])

    const onHearthClick = () => {
        if (wish === false) {
            wishProduct(params._id)
                .then(res => {
                    setWish(true);
                })
                .catch(err => console.log(err))
        } else {
            wishProduct(params._id)
                .then(res => {
                    setWish(false);
                })
                .catch(err => console.log(err))
        }
    }

    useEffect(() => {
        const initSocket = async () => {
            const socket = await initializeSocket();
            setSocket(socket);

            socket.on('startChat', ({ chatId }) => {
                history.push(`/messages/${chatId}`);
            });
        };

        initSocket();
    }, []);
      
      const onChatStart = async (e) => {
        e.preventDefault();
        if (!socket) return;
        startChat(socket, { buyerId: userData._id, sellerId: params.sellerId });
      };




    return (
        <>
        
            <Image className="col-lg-12" src={params.image} rounded />
            <Row>
                <h1 className="col-lg-10 col-sm-10 product-info-heading">{params.title}</h1>
                <span id="heartIconDetails" className="col-lg-1 col-sm-1" onClick={onHearthClick}>
                {params.isAuth && <>
                    {!wish ? (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Add to Wishlist</Tooltip>}>
                            <BsHeart />
                        </OverlayTrigger>
                    )
                        : (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Remove from Wishlist</Tooltip>}>
                                <BsHeartFill />
                            </OverlayTrigger>
                        )
                    }
                </>}

                </span>
            </Row>
            <Button variant="dark" onClick={onChatStart}>Chat Start</Button>;
            <div id="detailsCardText" className="col-lg-12">
                <Tabs defaultActiveKey="details" transition={false}>
                    <Tab eventKey="details" title="Details" id="tab-details">
                        {params.description}
                        <hr />
                        <p id="details-footer" className="text-muted">Product listed at {params.addedAt}</p>
                    </Tab>
                    {/* <Tab eventKey="aboutSeller" title="About seller">
                        <p>Name: {params.name || "Not specified"}</p>
                        <p>Email: {params.email}</p>
                        <p>Telephone: {params.phone}</p>
                        <p>City: {params.city}</p>
                    </Tab> */}
                </Tabs>
            </div>
        </>
    )
}

export default ProductInfo;