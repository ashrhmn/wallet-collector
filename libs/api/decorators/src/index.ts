import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaSelect } from '@paljs/plugins';
import { getUser } from '@wallet-collector/api/guards';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req: Request = {
      http: context.switchToHttp().getRequest(),
      graphql: GqlExecutionContext.create(context).getContext().req,
    }[context.getType() as string];
    if (!req)
      throw new HttpException(
        'Not implemented',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    return getUser(req);
  }
);

export const GqlSelect = createParamDecorator(
  (data, context: ExecutionContext) => {
    try {
      const info = GqlExecutionContext.create(context).getInfo();
      const select = new PrismaSelect(info).value;
      return select;
    } catch (error) {
      return {};
    }
  }
);
