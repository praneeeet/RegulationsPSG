import { Injectable, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = await super.canActivate(context);
      if (!result) {
        throw new HttpException('Invalid or missing JWT token', HttpStatus.UNAUTHORIZED);
      }

      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
        throw new HttpException('User not found in request', HttpStatus.UNAUTHORIZED);
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Authentication failed: ' + error.message,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new HttpException(
        info ? info.message : 'Unauthorized',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}