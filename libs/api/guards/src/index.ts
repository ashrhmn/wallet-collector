import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLE, User } from '@prisma/client';
import { CONFIG } from '@wallet-collector/config';
import { verify } from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<ROLE[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    if (roles.length === 0) return true;
    const request: Request =
      GqlExecutionContext.create(context).getContext().req;

    const user = getUser(request);

    if (!user) return false;

    return roles
      .map((r) => r.toLowerCase())
      .some((rr) => user.roles.map((r) => r.toLowerCase()).includes(rr));
  }
}

export const Roles = (...roles: ROLE[]) => SetMetadata('roles', roles);

export const getUser = (request: Request) => {
  const accessToken = request.headers.authorization;
  console.log(request.headers);
  if (!accessToken || typeof accessToken !== 'string') return null;
  try {
    return verify(
      accessToken.split(' ')[1] || '',
      CONFIG.JWT.SECRET.ACCESS
    ) as Omit<User, 'password'>;
  } catch (error) {
    return null;
  }
};
