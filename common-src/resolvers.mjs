const getDropboxAPI = context => context.dataSources.dropboxAPI;

export const resolvers = {
  Query: {
    filesListFolder: async (obj, args, context, info) => {
      // TODO: automatically wrap each resolver in a try/stringify-error-catch
      try {
        console.log("Query.filesListFolder resolver");
        const dropboxAPI = getDropboxAPI(context);
        const apiResult = await dropboxAPI.filesListFolder({
          path: !!args.path ? args.path : ""
        });
        console.log(apiResult);
        return apiResult.entries.map(entry => ({
          ...entry,
          tag: entry[".tag"],
          __typename: "FileEntry"
        }));
      } catch (err) {
        throw new Error(JSON.stringify(err));
      }
    }
  },

  // This describes fields to *ADD IN* to the ones supplied
  FileEntry: {
    revisions: async (fileEntry, args, context, info) => {
      console.log("FileEntry.revisions resolver");
      if (fileEntry.tag !== "file") {
        return [];
      }
      const dropboxAPI = getDropboxAPI(context);
      const fileListRevisionsApiResponse = await dropboxAPI.filesListRevisions({
        path: fileEntry.id
      });
      return fileListRevisionsApiResponse.entries.map(entry => ({
        ...entry,
        id: entry.rev,
        __typename: "FileRevision"
      }));
    }
  },

  FileRevision: {
    temporaryDownloadLink: async (fileRevision, args, context, info) => {
      console.log("FileRevision.temporaryDownloadLink resolver");
      const dropboxAPI = getDropboxAPI(context);
      const temporaryLinkApiResponse = await dropboxAPI.filesGetTemporaryLink({
        path: `rev:${fileRevision.id}`
      });
      return temporaryLinkApiResponse.link;
    }
  }
};

export default resolvers;
