import 'reflect-metadata';
import { ApolloServer, gql, AuthenticationError } from "apollo-server";
import { buildSchema, Subscription } from "type-graphql";
import { customAuthChecker } from './authChecker';
import { TypegooseMiddleware } from './middlewares/typegoose-middleware';
import { ObjectId } from 'mongodb';
import { ObjectIdScalar } from './types/object-id.scalar';
import { connect } from 'mongoose';
import { pasrseToken } from './utils';

async function bootstrap() {
  const port = 9527;
  const subscriptionPath = "/subs";
  const mongoose = await connect('mongodb://localhost:27017',
    {
      dbName: "test",
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );

  const schema = await buildSchema({
    authChecker: customAuthChecker,
    // use document converting middleware
    globalMiddlewares: [TypegooseMiddleware],
    // use ObjectId scalar mapping
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    resolvers: [__dirname + "/**/*.resolver.{ts,js}", __dirname + "/resolvers/**/*.{ts,js}"],
    emitSchemaFile: true
  });;
  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    subscriptions: {
      path: subscriptionPath
    },
    context: (http: any) => {
      let auth = '';
      if (!http.req) { // 订阅时没有req
        // console.log(http.connection.context);
        auth = http.connection.context.authorization;
      } else {
        auth = http.req.headers.authorization;
      }
      if (!auth) {
        return undefined;
      }
      const token = auth.substr(auth.indexOf(' ') + 1);
      pasrseToken(token)
        .then(user => {
          // console.log(user);
          return { user };
        }).catch(err => {
          console.log('context error');
          console.log(err);
          return;
        })
    },
  });
  // Launch the express server
  server.listen({ port }, () => {
    console.log(`芜湖~起飞~ \nServer ready at http://localhost:${port}${server.graphqlPath}`);
  })
}

bootstrap();