import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { BaseGuard } from '@common/guards/base.guard';

@Injectable()
export class JwtAuthGuard extends BaseGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.decodeToken(context);
  }
}
