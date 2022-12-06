import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, GqlSelect } from '@wallet-collector/api/decorators';
import {
  CreateManyWalletAddressArgs,
  FindFirstWalletAddressArgs,
  FindManyWalletAddressArgs,
  WalletAddress,
} from '@wallet-collector/generated/prisma-dto';
import { ICurrentUser } from '@wallet-collector/types';
import { ApiAddressService } from './api-address.service';

@Resolver()
export class ApiAddressResolver {
  constructor(private readonly addressService: ApiAddressService) {}

  @Query(() => [WalletAddress])
  async getAddressesByProject(
    @Args() args: FindManyWalletAddressArgs,
    @CurrentUser() currentUser: ICurrentUser,
    @GqlSelect() select: any
  ): Promise<WalletAddress[]> {
    try {
      return this.addressService.getAddressesByProject({
        args,
        currentUser,
        select,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Mutation(() => String)
  async addWalletAddresses(
    @Args() args: CreateManyWalletAddressArgs,
    @CurrentUser() currentUser: ICurrentUser
  ): Promise<string> {
    try {
      return this.addressService.addWalletAddresses({ args, currentUser });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Query(() => Boolean)
  async walletAddressExists(@Args() args: FindFirstWalletAddressArgs) {
    return this.addressService.walletAddressExists({ args });
  }
}
