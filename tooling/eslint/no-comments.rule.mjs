const SHEBANG_COMMENT_TYPE = 'Shebang';

export const noCommentsRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow comments of any kind; intent must be expressed through naming and structure',
    },
    schema: [],
    messages: {
      noComments:
        'Comments are not allowed. Rename or extract a well-named function to express the intent.',
    },
  },
  create(context) {
    return {
      Program() {
        const comments = context.sourceCode
          .getAllComments()
          .filter((comment) => comment.type !== SHEBANG_COMMENT_TYPE);

        for (const comment of comments) {
          context.report({ loc: comment.loc, messageId: 'noComments' });
        }
      },
    };
  },
};
