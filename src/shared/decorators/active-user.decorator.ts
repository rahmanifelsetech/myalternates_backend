import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserWithRelations } from '@app/modules/iam/users/domain/users.repository.interface';

export const ActiveUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserWithRelations => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
