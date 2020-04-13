import { MiddlewareFn } from 'type-graphql';

export const Access: MiddlewareFn = async ({ context, args }, next) => {
  console.log('inac');
  console.log(context);
  // 要返回next()而不是直接调用next()！！
  return next();
};