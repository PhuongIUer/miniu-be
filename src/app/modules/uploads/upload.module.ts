import { Module } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadService } from './services/upload.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'CLOUDINARY',
      useFactory: (configservice: ConfigService) => {
        return cloudinary.config({
          cloud_name: 'miniu2025',
          api_key: '516377233378875',
          api_secret: 'KPz2ewAN7HDSqrDQJxAaGh653e4',
        });
      },
      inject: [ConfigService]
    },
    UploadService,
  ],
  imports: [ConfigModule],
  exports: [UploadService],
})
export class UploadModule {}
