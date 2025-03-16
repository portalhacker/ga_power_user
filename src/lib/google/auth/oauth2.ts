import { OAuth2Client } from 'google-auth-library';
import keys from './secrets/oauth2.keys.json';

const oAuth2Client = new OAuth2Client(
  keys.web.client_id,
  keys.web.client_secret,
  keys.web.redirect_uris[0]
);

export default oAuth2Client;
