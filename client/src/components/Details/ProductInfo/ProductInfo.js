import { useState, useEffect } from 'react';
import { Row, Tabs, Tab, Image, OverlayTrigger , Tooltip} from 'react-bootstrap';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { wishProduct } from '../../../services/productData'

function ProductInfo({ params }) {
    const [wish, setWish] = useState(false);

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

    return (
        <>
            <div className="d-flex flex-column align-items-center">
                <Image className="col-lg-12" src={params.image} rounded />
                <hr />
                <Row>
                    <section id='profile'>
                        <a id='profile_link'>
                            <div className='space-beteen'>
                                <div style={{ flex: 1 }}>
                                    <div id='profile_image'>
                                        {params.name}
                                    </div>
                                    <div id='profile_left'>
                                        {params._id}
                                    <div id='profile_address'>주소가 들어갈 자리</div>
                                    </div>
                                </div>
                                <div className='profile_right'>
                                    <dl className='manner_temper'>
                                        <dt>매너온도</dt>
                                    </dl>
                                </div>
                            </div>
                        </a>
                    </section> 
                </Row>

                <Row>
                    <h5 className="-sm-12 product-info-heading">{params.title}</h5>
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
            </div>
        </>
    )
}

export default ProductInfo;