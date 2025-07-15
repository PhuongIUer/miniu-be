import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// Loại bỏ import BullModule nếu không còn sử dụng
// import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './app/modules/database/database.module';
import { UserModule } from './app/modules/users/users.module';
import { RolesModule } from './app/modules/roles/roles.module';
import { AuthModule } from './app/modules/auth/auth.module';
import { CurriculumModule } from './app/modules/curriculum/curriculum.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UserModule,
    RolesModule,
    AuthModule,
    CurriculumModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
