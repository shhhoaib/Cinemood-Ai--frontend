import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/useAuthStore'
import { getReviews, createReview, deleteReview, likeReview } from '../../api/backend'
import { Link } from 'react-router-dom'

const AVATAR_COLORS = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500',
  'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500',
]

function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() / 1000) - ts)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d`
  return new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function Avatar({ name, className = '' }) {
  const initial = (name || 'U')[0].toUpperCase()
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${getAvatarColor(name)} ${className}`}>
      {initial}
    </div>
  )
}

function ReviewItem({ review, isReply, currentUser, onDelete, onLike, onReply, isPending }) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')

  const isOwner = currentUser?.id === review.user_id

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(review.id, replyText.trim())
      setReplyText('')
      setReplyOpen(false)
    }
  }

  return (
    <div className={`${isReply ? 'ml-10 pl-4 border-l-2 border-white/5' : ''} ${isPending ? 'opacity-50' : ''}`}>
      <div className="flex gap-3 group">
        <div className="flex-shrink-0 mt-1">
          {review._isOptimistic ? (
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold animate-pulse">...</div>
          ) : review.user_id === 'guest' ? (
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold">?</div>
          ) : (
            <Link to={currentUser?.id === review.user_id ? '/profile' : '#'}>
              <Avatar name={review.user_name} />
            </Link>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`rounded-2xl px-4 py-2.5 ${review._isOptimistic ? 'bg-cinema-red/10 border border-cinema-red/20' : 'bg-white/5'}`}>
            <div className="flex items-center gap-2">
              <span className="text-white text-xs font-semibold">{review.user_name || 'User'}</span>
              <span className="text-gray-600 text-[10px]">{review._isOptimistic ? 'sending...' : timeAgo(review.created_at)}</span>
              {review.updated_at > review.created_at && (
                <span className="text-gray-600 text-[10px]">· edited</span>
              )}
            </div>
            <p className="text-gray-300 text-sm mt-1 whitespace-pre-wrap break-words">{review.text}</p>
          </div>

          <div className="flex items-center gap-3 mt-1 px-2">
            <button
              onClick={() => onLike(review.id)}
              className="text-gray-500 hover:text-cinema-red text-xs flex items-center gap-1 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {review.likes > 0 && <span>{review.likes}</span>}
              <span className="ml-0.5">Like</span>
            </button>
            <button
              onClick={() => setReplyOpen(!replyOpen)}
              className="text-gray-500 hover:text-blue-400 text-xs transition-colors"
            >
              Reply
            </button>
            {isOwner && (
              <button
                onClick={() => onDelete(review.id)}
                className="text-gray-500 hover:text-red-400 text-xs transition-colors ml-auto"
              >
                Delete
              </button>
            )}
          </div>

          <AnimatePresence>
            {replyOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-3 mt-2 ml-2">
                  <Avatar name={currentUser?.name} />
                  <div className="flex-1 flex gap-2">
                    <input
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cinema-red/50"
                      onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit()}
                    />
                    {replyText.trim() && (
                      <button
                        onClick={handleReplySubmit}
                        className="bg-cinema-red text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-red-600 transition-colors"
                      >
                        Post
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {review.replies?.map((reply) => (
        <div key={reply.id} className="mt-3">
          <ReviewItem review={reply} isReply currentUser={currentUser} onDelete={onDelete} onLike={onLike} onReply={onReply} isPending={isPending} />
        </div>
      ))}
    </div>
  )
}

export default function Reviews({ contentType, contentId }) {
  const queryClient = useQueryClient()
  const { user, token } = useAuthStore()
  const [newText, setNewText] = useState('')

  const queryKey = ['reviews', contentType, String(contentId)]

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => getReviews(contentType, contentId),
    select: (r) => r.data,
  })

  const createMutation = useMutation({
    mutationFn: (body) => createReview(body, token),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey })
      const prev = queryClient.getQueryData(queryKey)
      const optimisticReview = {
        id: 'opt-' + Date.now(),
        content_type: contentType,
        content_id: Number(contentId),
        user_id: user?.id || 'guest',
        user_name: user?.name || 'You',
        text: body.text,
        parent_id: body.parent_id || null,
        created_at: Math.floor(Date.now() / 1000),
        updated_at: Math.floor(Date.now() / 1000),
        likes: 0,
        replies: [],
        _isOptimistic: true,
      }
      queryClient.setQueryData(queryKey, (old) => {
        const reviews = old?.reviews || []
        return {
          ...old,
          total: (old?.total || 0) + 1,
          reviews: body.parent_id
            ? reviews.map((r) =>
                r.id === body.parent_id
                  ? { ...r, replies: [...(r.replies || []), optimisticReview] }
                  : r
              )
            : [optimisticReview, ...reviews],
        }
      })
      return { prev }
    },
    onError: (err, body, context) => {
      if (context?.prev) queryClient.setQueryData(queryKey, context.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteReview(id, token),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const likeMutation = useMutation({
    mutationFn: (id) => likeReview(id, token),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  const handleSubmit = () => {
    if (!newText.trim()) return
    const body = { text: newText.trim() }
    if (contentType === 'movie') body.movie_id = Number(contentId)
    else body.tv_id = Number(contentId)
    createMutation.mutate(body)
    setNewText('')
  }

  const handleReply = (parentId, text) => {
    const body = { text, parent_id: parentId }
    if (contentType === 'movie') body.movie_id = Number(contentId)
    else body.tv_id = Number(contentId)
    createMutation.mutate(body)
  }

  if (isLoading) {
    return (
      <div className="mt-10">
        <div className="h-6 w-32 bg-white/5 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
              <div className="flex-1">
                <div className="h-16 bg-white/5 rounded-2xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const reviews = data?.reviews || []
  const total = data?.total || 0

  return (
    <section className="mt-10">
      <div className="flex items-center gap-2 mb-5">
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h2 className="text-white font-cinema text-xl">
          Comments
          {total > 0 && <span className="text-gray-500 text-sm ml-1.5 font-normal">({total})</span>}
        </h2>
      </div>

      {/* New Comment Input */}
      <div className="flex gap-3 mb-6">
        {user ? (
          <Avatar name={user.name} />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">?</div>
        )}
        <div className="flex-1 flex gap-2">
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder={user ? 'Write a comment...' : 'Log in to comment'}
            disabled={!user}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cinema-red/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {newText.trim() && user && (
            <button
              onClick={handleSubmit}
              className="bg-cinema-red text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Post
            </button>
          )}
        </div>
      </div>

      {!user && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-center">
          <p className="text-gray-400 text-sm">
            <Link to="/login" className="text-cinema-red hover:text-red-400 font-semibold">Log in</Link>
            {' '}or{' '}
            <Link to="/register" className="text-cinema-red hover:text-red-400 font-semibold">Sign up</Link>
            {' '}to join the conversation
          </p>
        </div>
      )}

      {/* Comments List */}
      {reviews.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-4xl mb-3 opacity-30">💬</div>
          <p className="text-gray-500 text-sm">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ReviewItem
                review={review}
                currentUser={user}
                onDelete={(id) => deleteMutation.mutate(id)}
                onLike={(id) => likeMutation.mutate(id)}
                onReply={(pid, text) => handleReply(pid, text)}
                isPending={createMutation.isPending}
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
