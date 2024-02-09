import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);
    async function login(ev){
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/users/login', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type':'application/json'},
            credentials: 'include'
        })
        if(response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            })
        } else {
            alert('wrong credentials')
        }
    }

    if(redirect){
        return <Navigate to={'/'} />
    }
    return (
        <div className="login">
            <div className="gif">
                <img  src="https://i.gifer.com/IGCF.gif" alt=""/>
            </div>
            <form className="login-form" onSubmit={login}>
                <h1>Login</h1>
                <input type="text"
                placeholder="username"
                value={username}
                onChange={(ev) => setUsername(ev.target.value)} />
                <input type="password"
                placeholder="password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)} />
                <button>Login</button>
            </form>
        </div>
    );
  }
  
export default LoginPage;
  