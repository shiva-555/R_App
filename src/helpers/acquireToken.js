// import { useMsal } from '@azure/msal-react';

export const acquireToken = async function (instance, accounts) {
  // const {instance, accounts} = useMsal();
  // let token = window.localStorage.getItem('token');

  // if (token !== null) {
  //   return token;
  // } else {
    const request = {
      scopes: [],
      account: accounts[0]
    };
  
    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    // const token =  await instance.acquireTokenSilent(request).then((response) => {
    //     return response.accessToken;
    // }).catch((e) => {
    //     instance.acquireTokenPopup(request).then((response) => {
    //       return  response.accessToken;
    //     });
    // });
    let response;
  
    try {
      response = await instance.acquireTokenSilent(request);
    } catch(e) {
      response = await instance.acquireTokenSilent(request);
    }
  
    window.localStorage.setItem('token', response.accessToken);
    return response.accessToken;
  // }
}