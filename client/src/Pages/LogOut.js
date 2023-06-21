import url from "../url.js";

function LogOut({ history }) {


    fetch(`${url}/auth/logout`)
        .then(res => res.json())
        .then(res => {
            localStorage.removeItem('user');
            window.location.href = '/';
        })
        .catch(err => console.log(err))
}

export default LogOut;