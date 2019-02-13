import ApolloServerModule from "apollo-server";
import DropboxModule from "dropbox";
import fetch from "node-fetch";

const { typeDefs } = SchemaModule;
const { ApolloServer } = ApolloServerModule;
const { Dropbox } = DropboxModule;

import SchemaModule from "./common-src/schema";
import resolvers from "./common-src/resolvers";
import CommonEnv from "./common-src/.env";

(async () => {
  const dataSources = () => ({
    dropboxAPI: new Dropbox({
      accessToken: CommonEnv.DROPBOX_ACCESS_TOKEN,
      fetch
    })
  });
  const server = new ApolloServer({ typeDefs, resolvers, dataSources });
  const { url } = await server.listen();
  console.log(`🚀 Server ready at ${url}`);

  try {
    const apiResult = await dataSources().dropboxAPI.filesListFolder({
      path: ""
    });
    console.log("oneoff api", apiResult);
  } catch (err) {
    console.log("err", err);
  }
})();
