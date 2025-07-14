import { Global, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/roles.entity';
import * as bcrypt from 'bcrypt'
import { PasswordService } from './services/password.service';
import { WhitelistJwt } from './entities/whitelist-jwt.entity';
@Global()
@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, Role, WhitelistJwt]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '1d' },
      }),
    }),
    ConfigModule,
  ],
  providers: [
    AuthService, 
    JwtStrategy, 
    LocalStrategy,
    {
      provide: 'bcrypt',
      useValue: bcrypt
    },
    PasswordService
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    PasswordService,
    JwtModule,
  ],
})
export class AuthModule {}
