import { useState } from 'react';
import {
  Heart,
  Trash2,
  MessageCircle,
} from 'lucide-react';

import {
  likePost,
  deletePost,
  addComment,
  deleteComment,
} from '../services/postService';

import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();

  const [likesCount, setLikesCount] = useState(
    post.likes?.length || 0
  );

  const [liked, setLiked] = useState(false);

  const [commentText, setCommentText] =
    useState('');

  const [comments, setComments] = useState(
    post.comments || []
  );

  const handleLike = async () => {
    try {
      const response = await likePost(post._id);

      setLiked(response.liked);
      setLikesCount(response.likesCount);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Delete this post?'
    );

    if (!confirmDelete) return;

    try {
      await deletePost(post._id);

      if (onDelete) {
        onDelete(post._id);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete post');
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await addComment(
        post._id,
        commentText
      );

      setComments(
        response.data.comments || []
      );

      setCommentText('');
    } catch (error) {
      console.error(error);
      alert('Failed to add comment');
    }
  };

  const handleDeleteComment = async (
    commentId
  ) => {
    const confirmDelete = window.confirm(
      'Delete this comment?'
    );

    if (!confirmDelete) return;

    try {
      await deleteComment(
        post._id,
        commentId
      );

      setComments((prev) =>
        prev.filter(
          (comment) =>
            comment._id !== commentId
        )
      );
    } catch (error) {
      console.error(error);
      alert('Failed to delete comment');
    }
  };

  const isOwner =
    user?.id === post.user?._id;

  return (
    <div
      style={{
        background: '#1a2338',
        padding: '20px',
        marginBottom: '15px',
        borderRadius: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <h4>{post.user?.name}</h4>

          <p
            style={{
              color: '#8ea2c0',
              marginBottom: '10px',
            }}
          >
            @{post.user?.username}
          </p>
        </div>

        {isOwner && (
          <button
            onClick={handleDelete}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#ff6b6b',
            }}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <p>{post.content}</p>

      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginTop: '15px',
          alignItems: 'center',
        }}
      >
        <button
          onClick={handleLike}
          style={{
            background: 'transparent',
            border: 'none',
            color: liked
              ? '#ff4d6d'
              : '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Heart size={18} />
          {likesCount}
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <MessageCircle size={18} />
          {comments.length}
        </div>
      </div>

      <div
        style={{
          marginTop: '15px',
        }}
      >
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) =>
            setCommentText(
              e.target.value
            )
          }
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '6px',
            border: 'none',
          }}
        />

        <button
          onClick={handleAddComment}
          className="btn btn-primary"
        >
          Comment
        </button>
      </div>

      <div
        style={{
          marginTop: '15px',
        }}
      >
        {comments.map((comment) => (
          <div
            key={comment._id}
            style={{
              padding: '10px',
              borderTop:
                '1px solid #2a3550',
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong>
                {comment.user?.name}
              </strong>

              <p>{comment.text}</p>
            </div>

            {user?.id ===
              comment.user?._id && (
              <button
                onClick={() =>
                  handleDeleteComment(
                    comment._id
                  )
                }
                style={{
                  background:
                    'transparent',
                  border: 'none',
                  color: '#ff6b6b',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCard;