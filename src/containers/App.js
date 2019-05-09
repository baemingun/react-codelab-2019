import React, { useEffect } from 'react';
import { Header } from '../components';
import { connect } from 'react-redux';
import { getStatusRequest, logoutRequest } from '../actions/authentication';

const $ = window.$;
const Materialize = window.Materialize;

function App(props) {
  useEffect(() => {
    function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }

    // get loginData from cookie
    let loginData = getCookie('key');

    // if loginData is undefined, do nothing
    if(typeof loginData === "undefined") return;

    // decode base64 & parse json
    loginData = JSON.parse(atob(loginData));

    // if not logged in, do nothing
    if(!loginData.isLoggedIn) return;

    // page refreshed & has a session in cookie,
    // check whether this cookie is valid or not
    props.getStatusRequest().then(
        () => {
            console.log(props.status);
            // if session is not valid
            if(!props.status.valid) {
                // logout the session
                loginData = {
                    isLoggedIn: false,
                    username: ''
                };

                document.cookie='key=' + btoa(JSON.stringify(loginData));

                // and notify
                let $toastContent = $('<span style="color: #FFB4BA">Your session is expired, please log in again</span>');
                Materialize.toast($toastContent, 4000);

            }
        }
    );
  },[]);

  const handleLogout = () => {
    props.logoutRequest().then(
        () => {
            Materialize.toast('Good Bye!', 2000);

            // EMPTIES THE SESSION
            let loginData = {
                isLoggedIn: false,
                username: ''
            };

            document.cookie = 'key=' + btoa(JSON.stringify(loginData));
        }
    );
  }

  let re = /(login|register)/;
  let isAuth = re.test(props.location.pathname);
  return (
    <div>
      {isAuth ? undefined : <Header isLoggedIn={props.status.isLoggedIn}
                                                onLogout={handleLogout}/>}
      { props.children }
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
      status: state.authentication.status
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
      getStatusRequest: () => {
        return dispatch(getStatusRequest());
      },
      logoutRequest: () => {
        return dispatch(logoutRequest());
      }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
