"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/components/providers/user-provider";
import { fpost, fget, fpatch, fdelete } from "@/lib/api";
import { Button } from "@/components/ui/buttons/button";
import { MessageSquare, Edit2, Trash2, X, Check } from "lucide-react";

type Comment = {
  id: string;
  comment: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  };
};

export default function Comments({ movieId }: { movieId: number }) {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [movieId]);

  const fetchComments = async () => {
    try {
      const data = await fget({
        url: `/api/comments?movieId=${movieId}`,
        useCache: false,
      });
      setComments(data.comments);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fpost({
        url: "/api/comments",
        data: { movieId, comment: newComment },
        useCache: false,
      });
      setComments([data.comment, ...comments]);
      setNewComment("");
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fpatch({
        url: "/api/comments",
        data: { commentId, comment: editText },
        useCache: false,
      });
      setComments(comments.map((c) => (c.id === commentId ? data.comment : c)));
      setEditingId(null);
      setEditText("");
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to update comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setLoading(true);
    setError(null);

    try {
      await fdelete({
        url: `/api/comments?commentId=${commentId}`,
        useCache: false,
      });
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to delete comment");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.comment);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare size={24} className="text-mxpink" />
        <h2 className="text-2xl font-bold">
          Comments{" "}
          <span className="text-gray-400 font-mono">({comments.length})</span>
        </h2>
      </div>

      {user ? (
        <form onSubmit={handleAddComment} className="space-y-4 flex flex-col">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this movie..."
            className="w-full rounded-md border-0 bg-white/5 p-3 text-white placeholder:text-gray-400 min-h-[100px] resize-y"
            disabled={loading}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading || !newComment.trim()}
              Icon={MessageSquare}
              fullWidth={false}
            >
              {loading ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-gray-400">Please log in to leave a comment.</p>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg bg-slate-800/50 p-4 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      {comment.user.firstName} {comment.user.lastName}
                    </span>
                    <span className="text-sm text-gray-400">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>

                  {editingId === comment.id ? (
                    <div className="mt-2 space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full rounded-md border-0 bg-white/5 p-2 text-white min-h-[80px] resize-y"
                        disabled={loading}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          disabled={loading || !editText.trim()}
                          className="flex items-center gap-1 rounded-md bg-mxpink px-3 py-1 text-sm text-white hover:bg-mxpink/80 disabled:opacity-50"
                        >
                          <Check size={16} />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={loading}
                          className="flex items-center gap-1 rounded-md bg-slate-700 px-3 py-1 text-sm text-white hover:bg-slate-600"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-gray-200">{comment.comment}</p>
                  )}
                </div>

                {/* Edit/Delete buttons - only show for comment owner */}
                {user?.id === comment.userId && editingId !== comment.id && (
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => startEdit(comment)}
                      className="text-gray-400 hover:text-mxpink transition-colors"
                      aria-label="Edit comment"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      aria-label="Delete comment"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
