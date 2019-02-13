export const resolvers = {
  Query: {
    filesListFolder: async (obj, args, context, info) => {
      //debugger;
      console.log(args);
      const apiResult = await context.dropboxClient.filesListFolder({
        path: !!args.path ? args.path : ""
      });
      return apiResult.entries.map(entry => ({
        ...entry,
        __typename: "FileEntry"
      }));
    }
  },

  // This describes fields to *ADD IN* to the ones supplied
  FileEntry: {
    FileRevisions: async (fileEntry, args, context, info) => {
      if (fileEntry[".tag"] !== "file") {
        return [];
      }
      const fileListRevisionsApiResponse = await context.dropboxClient.filesListRevisions(
        { path: fileEntry.id }
      );
      return fileListRevisionsApiResponse.entries.map(entry => ({
        id: entry.rev,
        ...entry,
        __typename: "FileRevision"
      }));
    }
  },

  FileRevision: {
    temporaryDownloadLink: async (fileRevision, args, context, info) => {
      const temporaryLinkApiResponse = await context.dropboxClient.filesGetTemporaryLink(
        { path: `rev:${fileRevision.rev}` }
      );
      return temporaryLinkApiResponse.link;
    }
  }
};
