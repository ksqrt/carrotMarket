function LogOut({ history }) {
    fetch('http://localhost:5000/auth/logout')
        .then(res => res.json())
        .then(res => {
            window.location.href = '/';
        })
        .catch(err => console.log(err))
}

export default LogOut;