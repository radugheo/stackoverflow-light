import { Request } from 'express';
import { RequestContext } from 'express-openid-connect';
import { User } from '../models/user-entity';

export interface AuthRequest extends Request {
  oidc: RequestContext;
  user?: User;
}
