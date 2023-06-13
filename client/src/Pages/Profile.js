import { useEffect, useState } from 'react';
import ProfileSection from '../components/Profile/ProfileSection';
import Wishlist from '../components/Profile/Wishlist/Wishlist';
import ActiveSells from '../components/Profile/Sells/ActiveSells';
import ArchivedSells from '../components/Profile/Sells/ArchivedSells';
import SellerProfile from '../components/Profile/SellerProfile';
import { getUserById } from '../services/userData';

import '../components/Profile/Profile.css';

function Profile({ match, history }) {
  const [active, setActive] = useState(true);
  const [archived, setArchived] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [user, setUser] = useState([]);

  const handleActive = () => {
    setActive(true);
    setArchived(false);
    setWishlist(false);
  };

  const handleArchived = () => {
    setActive(false);
    setArchived(true);
    setWishlist(false);
  };

  const handleWish = () => {
    setActive(false);
    setArchived(false);
    setWishlist(true);
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
                판매중인 상품
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
            </div>
            <div className="profile-main-contents">
              {active && <ActiveSells params={user} />}
              {archived && <ArchivedSells history={history} />}
              {wishlist && <Wishlist />}
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
