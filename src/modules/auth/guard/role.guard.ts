import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

import { Role } from '../schema/user.schema';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { body } = context.switchToHttp().getRequest();
    try {
      const user = await this.userService.findUserByEmail(body.email);
      if (user) {
        return requiredRoles.some((role) => {
          if (user.role?.includes(role)) return true;
          throw new ForbiddenException();
        });
      }
      throw new NotFoundException();
    } catch (error) {
      if (error.status === 403) {
        throw new ForbiddenException({
          success: false,
          status: HttpStatus.FORBIDDEN,
          errorMessage: 'Forbidden resource',
        });
      } else if (error.status === 404) {
        throw new NotFoundException({
          success: false,
          status: HttpStatus.NOT_FOUND,
          errorMessage:
            "Sorry, these details aren't familiar to us, please take a look and try again",
        });
      }
    }
  }
}
