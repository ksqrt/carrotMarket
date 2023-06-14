import { useEffect, useState } from 'react';
import ProfileSection from '../components/Profile/ProfileSection';
import Wishlist from '../components/Profile/Wishlist/Wishlist';
import ActiveSells from '../components/Profile/Sells/ActiveSells';
import ArchivedSells from '../components/Profile/Sells/ArchivedSells';
import Soldout from '../components/Profile/Sells/Soldout';
import Review from '../components/Profile/Sells/Review'; // Import the Review component
import SellerProfile from '../components/Profile/SellerProfile';
import { getUserById } from '../services/userData';

import '../components/Profile/Profile.css';

function Profile({ match, history }) {
  const [active, setActive] = useState(true);
  const [archived, setArchived] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [soldout, setSoldout] = useState(false);
  const [review, setReview] = useState(false); // Add the state for "review" section
  const [user, setUser] = useState([]);

  const handleActive = () => {
    setActive(true);
    setArchived(false);
    setWishlist(false);
    setSoldout(false);
    setReview(false); // Reset "review" state
  };

  const handleArchived = () => {
    setActive(false);
    setArchived(true);
    setWishlist(false);
    setSoldout(false);
    setReview(false); // Reset "review" state
  };

  const handleWish = () => {
    setActive(false);
    setArchived(false);
    setWishlist(true);
    setSoldout(false);
    setReview(false); // Reset "review" state
  };

  const handleSoldout = () => {
    setActive(false);
    setArchived(false);
    setWishlist(false);
    setSoldout(true);
    setReview(false); // Reset "review" state
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
      .then(res => setUser(res.user))
      .catch(err => console.log(err));
  }, [match.params.id]);

  return (
    <>
      {user.isMe ? (
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
              {review && <Review />} {/* Display the Review component when "review" state is true */}
            </div>
          </div>
        </>
      ) : (
        <SellerProfile params={user} history={history} />
      )}
    </>
  );
}

export default Profile;
