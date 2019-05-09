import React from 'react';
import { Authentication } from '../../components';
import { connect } from 'react-redux';
import { loginRequest } from '../../actions/authentication';

const $ = window.$;
const Materialize = window.Materialize;

const Login = (props) => {
    const handleLogin = (id, pw) => {
        return props.loginRequest(id, pw).then(
            () => {
                if(props.status === "SUCCESS") {
                    // create session data
                    let loginData = {
                        isLoggedIn: true,
                        username: id
                    };
    
                    document.cookie = 'key=' + btoa(JSON.stringify(loginData));
    
                    Materialize.toast('Welcome, ' + id + '!', 2000);
                    props.history.push('/');
                    return true;
                } else {
                    let $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
                    Materialize.toast($toastContent, 2000);
                    return false;
                }
            }
        );
    }
    return (
        <div>
            <Authentication 
                mode={true}
                onLogin = { handleLogin }
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        status: state.authentication.login.status
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: (id, pw) => { 
            return dispatch(loginRequest(id,pw)); 
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);