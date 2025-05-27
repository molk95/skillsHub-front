// Add this method to your ForumService class
async createForum(forumData: any) {
  const newForum = new forumSchema(forumData);
  return await newForum.save();
}