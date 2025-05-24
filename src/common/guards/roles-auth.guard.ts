import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { context as ctx, CONTEXT_KEYS } from '@common/cls/request-context';
import { User } from '@modules/users/users.model';
import { BaseGuard } from '@common/guards/base.guard';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesAuthGuard extends BaseGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    protected jwtService: JwtService,
  ) {
    super(jwtService);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles: string = this.reflector.getAllAndOverride('roles', [
        context.getHandler(),
        context.getClass(),
      ]);
      console.log('required roles type ' + requiredRoles);
      if (!requiredRoles) return true;

      this.decodeToken(context);
      const user: User = ctx.get(CONTEXT_KEYS.USER);
      const isAccessible: boolean = user.roles.some((role) =>
        requiredRoles.includes(role.value),
      );

      if (!isAccessible)
        throw new ForbiddenException({
          message: 'You do not have permission!',
        });

      return isAccessible;
    } catch (err) {
      console.log(err);
      throw new ForbiddenException({ message: 'You do not have permission!' });
    }
  }
}
