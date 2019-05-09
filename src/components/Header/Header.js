import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ 
    isLoggedIn = false
    , onLogout = () => { console.error("logout function not defined");} 
}) => {
    const loginButton = (
        <li>
            <Link to="/login">
                <i className="material-icons">vpn_key</i>
            </Link>
        </li>
    );

    const logoutButton = (
        <li>
            <a onClick={onLogout}>
                <i className="material-icons">lock_open</i>
            </a>
        </li>
    );

    return (
        <nav>
            <div className="nav-wrapper blue darken-1">
                <Link to="/" className="brand-logo center">MEMOPAD</Link>

                <ul>
                    <li><a><i className="material-icons">search</i></a></li>
                </ul>

                <div className="right">
                    <ul>
                        { isLoggedIn ? logoutButton : loginButton }
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;