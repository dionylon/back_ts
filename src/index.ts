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
    context: ({ req, connection }) => {
      let auth = '';
      if (connection) {
        auth = connection.context.Authorization;
      } else {
        auth = req.headers.authorization;
      }

      if (!auth) {
        return { user: null };
      }
      const token = auth.substr(auth.indexOf(' ') + 1);
      pasrseToken(token)
        .then(user => {
          return { user };
        }).catch(err => {
          console.log('context error');
          console.log(err);
          return { user: null };
        })
    },
  });
  // Launch the express server
  server.listen({ port }, () => {
    console.log(`芜湖~起飞~ \nServer ready at http://localhost:${port}${server.graphqlPath}`);
  })
}

bootstrap();