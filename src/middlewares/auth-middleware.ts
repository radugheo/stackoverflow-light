import { Response, NextFunction } from 'express';
import { UserService } from '../services/user-service';
import { AuthRequest } from '../types/request-types';

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

export const handleAuth = (userService: UserService) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.oidc.isAuthenticated()) {
      const auth0User = req.oidc.user!;
      console.log('Auth0 User:', auth0User);
      try {
        const user = await userService.findOrCreateUser({
          auth0Id: auth0User.sub,
          email: auth0User.email,
          displayName: auth0User.name || auth0User.email,
        });
        req.user = user;
      } catch (error) {
        return res.status(500).json({ error: 'Authentication failed' });
      }
    }
    next();
  };
};
