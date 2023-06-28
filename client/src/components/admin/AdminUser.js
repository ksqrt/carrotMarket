import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import './AdminUser.css';
import { deleteadminUser } from './../../services/adminData';

const AdminUser = (props) => {
  const [userCount, setUserCount] = useState(5); // 현재 보여지는 유저 수 상태

  const deleteHandler = (e) => {
    const id = e.target.value;
    console.log('delete', id);
    deleteadminUser(id);
    window.location.reload();
  };

  const users = props.params.filter(item => item.name=='이정규'); // report가 존재하는 유저 필터링
  console.log(users);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll); // 스크롤 이벤트 등록
    return () => {
      window.removeEventListener('scroll', handleScroll); // 컴포넌트 언마운트 시 스크롤 이벤트 제거
    };
  }, []);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
      // 스크롤이 화면 하단에 도달하면 추가 유저를 가져오기
      setUserCount((prevCount) => prevCount + 5);
    }
  };



  return (
    <div>
      <h1>신고 유저</h1>
      <hr/>


      <div>
        {users.slice(0, userCount).map((user) => (
          <div id="Username" key={user._id}>
            {/* 필요한 속성 출력 */}
          
            {user.report.map((report,index)=>(
              <div key={index}>
                {report.userName} :{report.content}
              <button className="useroutBtn" onClick={deleteHandler} value={report._id}>
              회원탈퇴
            </button>
            <hr/>
              </div>
            ))}
         
            <br />
           
            <hr />
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUser;