import { MiddlewareFn } from 'type-graphql';
import { AuthenticationError } from 'apollo-server';
/**
 * context.user中的id必须是参数中id
 * 参数必须包含id!!
 */
export const OwnerAccess: MiddlewareFn = async ({ context, args }, next) => {
  const user = (context as any).user;
  console.log(user);
  if (!user || args.id != user.id) {
    throw new AuthenticationError("Not Authorized!");
  }
  // 要返回next()而不是直接调用next()！！
  return next();
};