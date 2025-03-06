import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const requiredRoles: string = this.reflector.getAllAndOverride('roles', [
        context.getHandler(),
        context.getClass(),
      ]);
      console.log('required roles type ' + requiredRoles);
      if (!requiredRoles) return true;

      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        console.log('no bearer or token');
        throw new UnauthorizedException({ message: 'User is not authorized!' });
      }

      const user = this.jwtService.verify(token);
      if (user.password === '')
        throw new UnauthorizedException({ message: 'User is not authorized!' });
      req.user = user;

      const isAccessable = user.roles.some((role) =>
        requiredRoles.includes(role.value),
      );

      if (!isAccessable)
        throw new ForbiddenException({
          message: 'You do not have permission!',
        });

      return isAccessable;
    } catch (err) {
      console.log(err);
      throw new ForbiddenException({ message: 'You do not have permission!' });
    }
  }
}
