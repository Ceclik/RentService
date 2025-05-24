import { JwtService } from '@nestjs/jwt';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { context as ctx, CONTEXT_KEYS } from '@common/cls/request-context';

@Injectable()
export abstract class BaseGuard {
  protected constructor(protected readonly jwtService: JwtService) {}

  decodeToken(context: ExecutionContext): boolean {
    try {
      const req = context.switchToHttp().getRequest();
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
      ctx.set(CONTEXT_KEYS.USER, user);
      return true;
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException({ message: 'User is not authorized!' });
    }
  }
}
