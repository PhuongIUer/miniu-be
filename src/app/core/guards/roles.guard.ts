import { CanActivate, ExecutionContext, Injectable, mixin, Type } from '@nestjs/common';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import {JwtAuthGuard} from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
const RoleGuard =  (requiredRoles: string[]): Type<CanActivate> => {
  @Injectable()
  class RoleGuardMixin extends JwtAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      if (!request.user.role) {
        return false;
      }
      // return request.user.role.includes(requiredRole);
      return requiredRoles.includes(request.user.role.name)
    }
  }
  return mixin(RoleGuardMixin);
}

export default RoleGuard;