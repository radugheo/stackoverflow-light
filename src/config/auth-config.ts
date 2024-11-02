import * as dotenv from 'dotenv';
import { auth } from 'express-openid-connect';

dotenv.config();

export const authConfig = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
  secret: process.env.AUTH0_SECRET,
};

export const configureAuth = auth(authConfig);
