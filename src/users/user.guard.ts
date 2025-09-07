import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class UpdateUserGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const userIdToUpdate = request.params.id;

    const targetUser = await this.userService.findById(userIdToUpdate);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'admin') {
      return true;
    }

    if (user.role === 'vendor') {
      if (targetUser.vendorId === user.vendorId) {
        return true;
      }
      throw new ForbiddenException('You can only update users of your vendor');
    }

    throw new ForbiddenException('Not allowed to update users');
  }
}
