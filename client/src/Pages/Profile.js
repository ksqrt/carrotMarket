import React, { useEffect, useState, useContext  } from 'react';
import ProfileSection from '../components/Profile/ProfileSection';
import Wishlist from '../components/Profile/Wishlist/Wishlist';
import ActiveSells from '../components/Profile/Sells/ActiveSells';
import ArchivedSells from '../components/Profile/Sells/ArchivedSells';
import Soldout from '../components/Profile/Sells/Soldout';
import Review from '../components/Profile/Sells/Review';
import SellerProfile from '../components/Profile/SellerProfile';
import { getUserById } from '../services/userData';
import { useParams } from 'react-router-dom';
import { Context } from '../ContextStore';

import '../components/Profile/Profile.css';

function Profile({ match, history }) {
  const { userData } = useContext(Context);
  const { id } = useParams();
  const [active, setActive] = useState(true);
  const [archived, setArchived] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [soldout, setSoldout] = useState(false);
  const [review, setReview] = useState(false);
  const [user, setUser] = useState([]);

  const isCurrentUserSeller = userData && id === userData._id;

  const handleActive = () => {
    setActive(true);
    setArchived(false);
    setWishlist(false);
    setSoldout(false);
    setReview(false);
  };

  const handleArchived = () => {
    setActive(false);
    setArchived(true);
    setWishlist(false);
    setSoldout(false);
    setReview(false);
  };

  const handleWish = () => {
    setActive(false);
    setArchived(false);
    setWishlist(true);
    setSoldout(false);
    setReview(false);
  };

  const handleSoldout = () => {
    setActive(false);
    setArchived(false);
    setWishlist(false);
    setSoldout(true);
    setReview(false);
  };

  const handleReview = () => {
    setActive(false);
    setArchived(false);
    setWishlist(false);
    setSoldout(false);
    setReview(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getUserById(match.params.id)
      .then((res) => setUser(res.user))
      .catch((err) => console.log(err));
  }, [match.params.id]);

  return (
    <>
      { userData && isCurrentUserSeller ? (
        <>
          <ProfileSection params={user} />
          <div className="container">
            <div className="sidebar">
              <button
                className={`sidebar-button ${active ? 'active' : ''}`}
                onClick={handleActive}
              >
                판매 물품
              </button>
              <button
                className={`sidebar-button ${archived ? 'active' : ''}`}
                onClick={handleArchived}
              >
                보관함
              </button>
              <button
                className={`sidebar-button ${wishlist ? 'active' : ''}`}
                onClick={handleWish}
              >
                관심 목록
              </button>
              <button
                className={`sidebar-button ${soldout ? 'active' : ''}`}
                onClick={handleSoldout}
              >
                판매 완료
              </button>
              <button
                className={`sidebar-button ${review ? 'active' : ''}`}
                onClick={handleReview}
              >
                거래 후기
              </button>
            </div>
            <div className="profile-main-contents">
              {active && <ActiveSells params={user} />}
              {archived && <ArchivedSells history={history} />}
              {wishlist && <Wishlist />}
              {soldout && <Soldout />}
              {review && <Review />}
            </div>
          </div>
        </>
      ) : ((
          <>
            <SellerProfile params={user} history={history} />
            <div className="container">
              <div className="sidebar">
                <button
                  className={`sidebar-button ${active ? 'active' : ''}`}
                  onClick={handleActive}
                >
                  판매 물품
                </button>
                <button
                  className={`sidebar-button ${soldout ? 'active' : ''}`}
                  onClick={handleSoldout}
                >
                  판매 완료
                </button>
                <button
                  className={`sidebar-button ${review ? 'active' : ''}`}
                  onClick={handleReview}
                >
                  거래 후기
                </button>
              </div>
              <div className="profile-main-contents">
                {review && <Review />}
                {active && <ActiveSells params={user} />}
                {soldout && <Soldout />}
              </div>
            </div>
          </>
        )
      )}
    </>
  );
}  

export default Profile;
