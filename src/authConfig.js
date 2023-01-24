let redirectUri;

if (process.env.NODE_ENV === 'production') {
  redirectUri = 'https://hr-app-test.futransolutions.com';
} else {
  redirectUri = 'http://localhost:3000';
}

export const msalConfig = {
  auth: {
    clientId: "b54ab3c7-c917-46fc-8585-e957d83c228e",
    authority: "https://login.microsoftonline.com/7b2fb0a8-db8d-4d18-aa66-c455bbc1cf26", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
    redirectUri: redirectUri
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
  }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes:["api://55071dcb-87be-43f8-84f0-5555fa96a932/access_as_user"]
};
  
// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};
