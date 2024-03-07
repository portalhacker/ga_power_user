import { Credentials, OAuth2Client } from 'google-auth-library';


import keys from './secrets/oauth2.keys.json';


const oAuth2Client = new OAuth2Client(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0]
);


/**
* Create a new OAuth2Client, and go through the OAuth2 content
* workflow.  Return the full client to the callback.
*/
export function getAuthenticatedClient(): string {
    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/analytics',
        'https://www.googleapis.com/auth/analytics.readonly',
      ],
    });
    return authorizeUrl;
}


export async function getCredentials(code: string): Promise<Credentials> {
  const token = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(token.tokens);
  return oAuth2Client.credentials;
}
