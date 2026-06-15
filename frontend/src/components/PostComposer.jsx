import { useState } from 'react';
import { createPost } from '../services/postService';

const PostComposer = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    try {
      setLoading(true);

      const response = await createPost({
        content: content.trim(),
      });

      setContent('');

      if (onPostCreated) {
        onPostCreated(response.data);
      }
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message ||
          'Failed to create post'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: '#18253f',
        padding: '20px',
        borderRadius: '16px',
        marginBottom: '24px',
      }}
    >
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening today?"
          maxLength={500}
          rows={4}
          style={{
            width: '100%',
            resize: 'none',
            border: '1px solid #2f4269',
            borderRadius: '12px',
            padding: '14px',
            background: '#101b33',
            color: '#ffffff',
            fontSize: '15px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px',
          }}
        >
          <span
            style={{
              color: '#8ea0c5',
              fontSize: '13px',
            }}
          >
            {content.length}/500
          </span>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            style={{
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600',
              opacity:
                loading || !content.trim()
                  ? 0.6
                  : 1,
            }}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostComposer;