import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UsersService } from "./services/users.service";
import { UsersController } from "./users.controller";
import { AuthModule } from '../auth/auth.module';
import { Role } from "../roles/entities/roles.entity";
import { UploadModule } from "../uploads/upload.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    AuthModule,
    UploadModule
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [TypeOrmModule]
})
export class UserModule{}