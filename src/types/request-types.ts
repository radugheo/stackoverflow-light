import { Request } from 'express';
import { RequestContext } from 'express-openid-connect';
import { User } from '../models/user-entity';

export interface Auth0UserProfile {
  sub: string;
  email: string;
  name?: string;
  nickname?: string;
}

export interface AuthRequest extends Request {
  oidc: RequestContext;
  user?: User;
}
