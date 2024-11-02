import { Response, NextFunction } from 'express';
import { auth } from 'express-openid-connect';
import { authConfig } from '../config/auth-config';
import { UserService } from '../services/user-service';
import { Auth0UserProfile, AuthRequest } from '../types/request-types';

export const configureAuth = auth(authConfig);

export const handleAuth = (userService: UserService) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.oidc.isAuthenticated()) {
      const auth0User = req.oidc.user as Auth0UserProfile;
      try {
        const user = await userService.findOrCreateUser({
          auth0Id: auth0User.sub,
          email: auth0User.email,
          displayName: auth0User.name || auth0User.nickname || auth0User.email,
        });
        req.user = user;
      } catch (error) {
        return res.status(500).json({ error: 'Authentication failed' });
      }
    }
    next();
  };
};
