import 'reflect-metadata';
import * as express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import * as jwt from "express-jwt";
import { buildSchema } from "type-graphql";

async function bootstrap() {
  const app = express();
  const path = "/graphql";
  const schema = await buildSchema({
    resolvers: [__dirname + "/modules/**/*.resolver.{ts,js}", __dirname + "/resolvers/**/*.{ts,js}"],
    emitSchemaFile: true
  });;
  // Create a GraphQL server
  const server = new ApolloServer({
    schema,
    playground: true,
    context: ({ req }) => {
      const context = {
        req,
        // user: req.user, // `req.user` comes from `express-jwt`
      };
      return context;
    },
  });

  // Mount a jwt or other authentication middleware that is run before the GraphQL execution
  app.use(
    path,
    jwt({
      secret: "secret",
      credentialsRequired: false,
    }),
  );

  // Apply the GraphQL server middleware
  server.applyMiddleware({ app, path });

  // Launch the express server
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
  )
}

bootstrap();