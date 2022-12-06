import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

import { ApiAuthModule } from '@wallet-collector/api/auth';
import { PrismaModule } from '@wallet-collector/prisma';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesGuard } from '@wallet-collector/api/guards';
import { APP_GUARD } from '@nestjs/core';
import { ApiProjectModule } from '@wallet-collector/api/project';
import { ApiAddressModule } from '@wallet-collector/api/address';
import { ApiCsvExportModule } from '@wallet-collector/api/csv-export';

@Module({
  imports: [
    ApiAuthModule,
    PrismaModule,
    ApiProjectModule,
    ApiAddressModule,
    ApiCsvExportModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.graphql',
      playground: false,
      sortSchema: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
