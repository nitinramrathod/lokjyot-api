
// Create a new category
const mergeRequestAnalyser = async (request, reply) => {
    try {

    const gitlabToken = request.headers['x-gitlab-token'];
    const eventType = request.headers['x-gitlab-event'];

    // Optional security check
    // if (gitlabToken !== process.env.GITLAB_SECRET) {
    if (gitlabToken !== 'MergeAnalyser') {
      return reply.status(403).send({ error: 'Invalid GitLab token' });
    }

    if (eventType === 'Merge Request Hook') {
      const payload = request.body;
      const action = payload?.object_attributes?.action;
      const title = payload?.object_attributes?.title;
      const source = payload?.object_attributes?.source_branch;
      const target = payload?.object_attributes?.target_branch;

      // Logging or your custom logic
      console.log(`📥 Merge Request "${title}" [${action}] from ${source} → ${target}`);

      // TODO: Your logic here (e.g. store to DB, notify Discord, etc.)
    }

    return reply.send({ success: true });

    } catch (error) {
        console.error(error);

        reply.status(500).send({
            message: 'An error occurred while processing the merge request.',
            error: error.message,
        });
    }
};

module.exports = {
    mergeRequestAnalyser,
};