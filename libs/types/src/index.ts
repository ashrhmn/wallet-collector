import { ObjectType, OmitType } from '@nestjs/graphql';
import { User } from '@wallet-collector/generated/prisma-dto';
import { Request } from 'express';

export interface IContext {
  req: Request;
}

export type ICurrentUse = Omit<
  User,
  'password' | 'addedWalletAddresses' | '_count' | 'createdProjects'
> & { iat: number; exp: number };

@ObjectType()
export class ICurrentUser extends OmitType(User, [
  '_count',
  'addedWalletAddresses',
  'createdProjects',
  'password',
]) {
  iat: number;
  exp: number;
}
