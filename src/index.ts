import 'reflect-metadata';
import * as express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { customAuthChecker } from './authChcker';
import Context from './types/Context';
import { TypegooseMiddleware } from './typegoose-middleware';
import { ObjectId } from 'mongodb';
import { ObjectIdScalar } from './types/object-id.scalar';
import { IncomingMessage } from 'http';

import * as jwt from 'jsonwebtoken';
import { userInfo } from 'os';

const secret = "secretkey";

async function bootstrap() {
  const app = express();
  const path = "/graphql";


  const schema = await buildSchema({
    authChecker: customAuthChecker,
    // use document converting middleware
    globalMiddlewares: [TypegooseMiddleware],
    // use ObjectId scalar mapping
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    resolvers: [__dirname + "/modules/**/*.resolver.{ts,js}", __dirname + "/resolvers/**/*.{ts,js}"],
    emitSchemaFile: true
  });;
  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    context: (http: any) => {
      const auth = http.req.headers['authorization'];
      if (!auth) {
        return undefined;
      }
      const token = auth.substr(auth.indexOf(' ') + 1);
      let user = undefined;
      jwt.verify(token, secret, (error: any, decoded: any) => {
        if (error) {
          console.log(error.message);
          return;
        }
        console.log(decoded);
        user = decoded;
      });
      const ctx: Context = { user };
      return ctx;
    },
  });
  // Apply the GraphQL server middleware
  server.applyMiddleware({ app, path });

  // Launch the express server
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
  )
}

bootstrap();