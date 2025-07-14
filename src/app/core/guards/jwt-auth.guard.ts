import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(protected jwtService: JwtService) {
    super();
  }
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(error, user, info, context: ExecutionContext) {
    if (error) {
      throw error;
    }
    
    if (info?.name === 'TokenExpiredError') {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization?.split(' ')[1]
      const decoded = this.jwtService.decode(token);
      console.log(decoded);
      throw new UnauthorizedException('Token expired');
    }

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}
