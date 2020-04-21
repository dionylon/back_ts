import { MiddlewareFn } from 'type-graphql';
import { AuthenticationError } from 'apollo-server';

/**
 * 需要登录才能访问，可以作为全局中间件，想要放行可以通过info.filedName进行判断
 */
export const AuthAccess: MiddlewareFn = async ({ context, info, args }, next) => {
  // console.log('middleware:');
  // console.log(info);
  if (info.fieldName)
    if (!(context as any).user) {
      throw new AuthenticationError("no auth!");
    }
  // 要返回next()而不是直接调用next()！！
  return next();
};