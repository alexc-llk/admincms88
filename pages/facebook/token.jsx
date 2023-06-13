import React, { useEffect, useState } from 'react';

function FacebookLoginButton() {
    const onLoginClick = () => {
        // FB.login(function(response) {
        //     console.log(response)
        //   }, {scope: 'public_profile,email'});
    };

    // useEffect(() => {
    //     window.fbAsyncInit = function() {
    //         FB.init({
    //           appId      : '1543833216112742',
    //           cookie     : true,
    //           xfbml      : true,
    //           version    : 'v16.0'
    //         });
              
    //         FB.AppEvents.logPageView();   
              
    //       };
        
    //       (function(d, s, id){
    //          var js, fjs = d.getElementsByTagName(s)[0];
    //          if (d.getElementById(id)) {return;}
    //          js = d.createElement(s); js.id = id;
    //          js.src = "https://connect.facebook.net/en_US/sdk.js";
    //          fjs.parentNode.insertBefore(js, fjs);
    //        }(document, 'script', 'facebook-jssdk'));
    // }, []);

    return (
        <div><button onClick={onLoginClick}>Login with Facebook</button></div>
    );
}

export default FacebookLoginButton;
