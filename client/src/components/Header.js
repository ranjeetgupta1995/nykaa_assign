import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

function Header() {
    const {setUserInfo, userInfo} = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    function logout() {
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: "POST"
        })
        setUserInfo(null);
    };

    const username = userInfo?.username;

    return (
        <header>
            <Link to={'/'} className="logo" >
                <h1 style={{fontStyle:'italic'}}>Masai<span style={{background:'black', color:'#fff', borderRadius:'5px', paddingRight: '5px', paddingLeft: '5px'}}>Forum</span></h1>
            </Link>
            <nav>
                {username && (
                    <>
                        {/* <span>Hello, {username}</span> */}
                        <Link to="/create">Create new post</Link>
                        <a onClick={logout}>Logout</a>
                    </>
                )}
                {!username && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
                
            </nav>
        </header>
    );
  }
  
export default Header;
  