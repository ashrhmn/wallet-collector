import { BadRequestException, Injectable } from '@nestjs/common';
import { CONFIG } from '@wallet-collector/config';
import { PrismaService } from '@wallet-collector/prisma';
import {
  CreateOneUserArgs,
  User,
} from '@wallet-collector/generated/prisma-dto';

import { hash, verify } from 'argon2';
import { sign, verify as jwtverify } from 'jsonwebtoken';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

@Injectable()
export class ApiAuthService {
  constructor(private prisma: PrismaService) {}

  async generateTokens(user: User) {
    const { password: _, ...payload } = user;

    const accessToken = sign(payload, CONFIG.JWT.SECRET.ACCESS, {
      expiresIn: CONFIG.JWT.TIMEOUT.ACCESS,
    });

    const { roles: __, ...refreshTokenPayload } = payload;

    const refreshToken = sign(refreshTokenPayload, CONFIG.JWT.SECRET.REFRESH, {
      expiresIn: CONFIG.JWT.TIMEOUT.REFRESH,
    });
    return { accessToken, refreshToken };
  }

  async login(args: LoginDto): Promise<LoginResponseDto> {
    const { password, usernameOrEmail } = args;
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) throw new BadRequestException('Invalid Username or Password');

    const isCorrectPassword = await verify(user.password, password).catch(
      () => false
    );

    if (!isCorrectPassword)
      throw new BadRequestException('Invalid Username or Password');

    return this.generateTokens(user);
  }

  async createUser(args: CreateOneUserArgs): Promise<User> {
    const password = await hash(args.data.password);
    return this.prisma.user.create({
      ...args,
      data: { ...args.data, password },
    });
  }

  async refreshToken(req: Request): Promise<LoginResponseDto> {
    const refreshToken = req.headers.refresh_token;
    if (!refreshToken || typeof refreshToken !== 'string')
      throw new BadRequestException('Refresh Token Not Provided');
    const payloadUser = jwtverify(
      refreshToken,
      CONFIG.JWT.SECRET.REFRESH
    ) as Omit<User, 'password' | 'roles'>;

    const user = await this.prisma.user.findUnique({
      where: { id: payloadUser.id },
    });

    if (!user) throw new BadRequestException('Invalid Refresh Token');

    return this.generateTokens(user);
  }
}
