import { MiddlewareFn } from 'type-graphql';
/**
 * context.user中的id必须是目标的id
 * 否则抛出异常
 */
export const OwnerAccess: MiddlewareFn = async ({ context, args }, next) => {

  const ctx = (context as any).user;
  // console.log(ctx, args);
  if (!ctx || args.id != ctx.id) {
    throw new Error("Not Authorized!");
  }
  // 要返回next()而不是直接调用next()！！
  return next();
};