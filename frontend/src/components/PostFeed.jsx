import PostCard from './PostCard';

const PostFeed = ({ posts, onDelete }) => {
  return (
    <>
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};

export default PostFeed;