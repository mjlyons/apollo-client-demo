const getDropboxAPI = context => context.dataSources.dropboxAPI;

export const resolvers = {
  Query: {
    filesListFolder: async (obj, args, context, info) => {
      // TODO: automatically wrap each resolver in a try/stringify-error-catch
      try {
        const dropboxAPI = getDropboxAPI(context);
        console.log("running filesListFolder");
        const apiResult = await dropboxAPI.filesListFolder({
          path: !!args.path ? args.path : ""
        });
        console.log(apiResult);
        return apiResult.entries.map(entry => ({
          ...entry,
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
      if (fileEntry[".tag"] !== "file") {
        return [];
      }
      const dropboxAPI = getDropboxAPI(context);
      const fileListRevisionsApiResponse = await dropboxAPI.filesListRevisions({
        path: fileEntry.id
      });
      return fileListRevisionsApiResponse.entries.map(entry => ({
        id: entry.rev,
        ...entry,
        __typename: "FileRevision"
      }));
    }
  },

  FileRevision: {
    temporaryDownloadLink: async (fileRevision, args, context, info) => {
      const dropboxAPI = getDropboxAPI(context);
      const temporaryLinkApiResponse = await dropboxAPI.filesGetTemporaryLink({
        path: `rev:${fileRevision.rev}`
      });
      return temporaryLinkApiResponse.link;
    }
  }
};

export default resolvers;
