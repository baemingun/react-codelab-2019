import React, { useState } from 'react';
import './Authentication.css';
import { Link } from 'react-router-dom';

const Authentication = ({ 
    mode = true
    , onLogin = (id, pw) => { console.error("login function not defined"); }
    , onRegister = (id, pw) => { console.error("register function not defined"); } 
}) => {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const handleLogin = () => {
        let id = username;
        let pw = password;
        
        onLogin(id, pw).then(
            (success) => {
                if(!success) {
                    setPassword('');
                }
            }
        );
    }

    const handleRegister = () => {
        let id = username;
        let pw = password;
        
        onRegister(id, pw).then(
            (result) => {
                if(!result) {
                    setUsername('');
                    setPassword('');
                }
            }
        );
    }

    const handleKeyPress = (e) => {
        if(e.charCod === 13) {
            if(mode) {
                handleLogin();
            } else {
                handleRegister();
            }
        }
    }

    const inputBoxes = (
        <div>
            <div className="input-field col s12 username">
                <label>Username</label>
                <input
                name="username"
                type="text"
                className="validate"
                onChange={e => setUsername(e.target.value)}
                value={username}
                />
            </div>
            <div className="input-field col s12">
                <label>Password</label>
                <input
                name="password"
                type="password"
                className="validate"
                onChange={e => setPassword(e.target.value)}
                value={password}
                onKeyPress={handleKeyPress}
            />
            </div>
        </div>
    );
    
    const loginView = (
        <div>
            <div className="card-content">
                <div className="row">
                    {inputBoxes}
                    <a className="waves-effect waves-light btn"
                        onClick={handleLogin}>SUBMIT</a>
                </div>
            </div>


            <div className="footer">
                <div className="card-content">
                    <div className="right" >
                    New Here? <Link to="/register">Create an account</Link>
                    </div>
                </div>
            </div>

        </div>
    );

    const registerView = (
        <div className="card-content">
            <div className="row">
                {inputBoxes}
                <a className="waves-effect waves-light btn"
                    onClick={handleRegister}>CREATE</a>
            </div>
        </div>
    );

    return (
        <div className="container auth">
            <Link className="logo" to="/">MEMOPAD</Link>
            <div className="card">
                <div className="header blue white-text center">
                    <div className="card-content">{mode ? "LOGIN" : "REGISTER"}</div>
                </div>
                { mode ? loginView : registerView }
            </div>
        </div>
    );
};

export default Authentication;