import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UploadService } from '../../modules/uploads/services/upload.service';

@Injectable()
export class VideoToUrlInterceptor implements NestInterceptor {
  constructor(private readonly uploadService: UploadService) {}
  
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    if (!req.file) return next.handle();

    // Upload the video file
    const uploadedFile = await this.uploadService.uploadVideo(req.file);
    
    // Set the videoUrl in the request body
    req.body.videoUrl = uploadedFile.secure_url;
    
    // If duration is available from Cloudinary, use it
    if (uploadedFile.duration) {
      req.body.duration = Math.round(uploadedFile.duration);
    }

    return next.handle();
  }
} 