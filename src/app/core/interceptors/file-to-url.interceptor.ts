import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { UploadService } from '../../modules/uploads/services/upload.service';

@Injectable()
export class FileToUrlInterceptor implements NestInterceptor {
  constructor(private readonly uploadService: UploadService) {}
  
  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    if (!req.file) return next.handle();  // Early return nếu không có file

    const { fieldname } = req.file;
    let uploadedFile;
    
    if (fieldname === 'cv') {
      uploadedFile = await this.uploadService.uploadCV(req.file);
    } else if (fieldname === 'avatar') {
      uploadedFile = await this.uploadService.uploadAvatar(req.file);
    } else {
      uploadedFile = await this.uploadService.uploadImage(req.file);
    }

    req.body[fieldname] = uploadedFile.secure_url;  // Dùng dynamic key

    return next.handle();  // Không cần .pipe(map())
  }
}
