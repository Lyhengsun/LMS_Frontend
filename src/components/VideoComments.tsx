"use client"
import { useState } from 'react';
import { MessageCircle, Send, ThumbsUp, Reply, MoreHorizontal, Heart, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Reply {
  id: number;
  user: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  isLiked: boolean;
}

interface Comment {
  id: number;
  user: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  isLiked: boolean;
  replies: Reply[];
  showReplies: boolean;
}

interface VideoCommentsProps {
  courseId: number;
  lessonId: number;
}

export const VideoComments = ({ courseId, lessonId }: VideoCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: 'Alice Johnson',
      avatar: 'AJ',
      time: '2 hours ago',
      content: 'Great explanation of cybersecurity fundamentals! This really helped me understand network security concepts better.',
      likes: 15,
      isLiked: false,
      replies: [
        {
          id: 101,
          user: 'Mike Chen',
          avatar: 'MC',
          time: '1 hour ago',
          content: 'I agree! The practical examples were very helpful.',
          likes: 5,
          isLiked: true
        }
      ],
      showReplies: false
    },
    {
      id: 2,
      user: 'Sarah Davis',
      avatar: 'SD',
      time: '5 hours ago',
      content: 'Could you provide more details about penetration testing tools? This topic is very interesting.',
      likes: 8,
      isLiked: true,
      replies: [],
      showReplies: false
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: Date.now(),
        user: 'You',
        avatar: 'Y',
        time: 'Just now',
        content: newComment,
        likes: 0,
        isLiked: false,
        replies: [],
        showReplies: false
      };
      setComments([newCommentObj, ...comments]);
      setNewComment('');
    }
  };

  const handleAddReply = (commentId: number) => {
    if (replyText.trim()) {
      const newReply: Reply = {
        id: Date.now(),
        user: 'You',
        avatar: 'Y',
        time: 'Just now',
        content: replyText,
        likes: 0,
        isLiked: false
      };

      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              replies: [...comment.replies, newReply],
              showReplies: true
            }
          : comment
      ));
      
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const handleLikeComment = (commentId: number) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          }
        : comment
    ));
  };

  const toggleReplies = (commentId: number) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, showReplies: !comment.showReplies }
        : comment
    ));
  };

  return (
    <div className="space-y-6">
      {/* Add Comment Section */}
      <Card className="border-2 border-gray-100 hover:border-blue-200 transition-colors duration-200">
        <CardContent className="p-4">
          <div className="flex space-x-3">
            <Avatar className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500">
              <AvatarFallback className="text-white font-bold">Y</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share your thoughts about this lesson..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none border-gray-200 focus:border-blue-400 transition-colors duration-200"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Share your insights with fellow students</p>
                <Button 
                  onClick={handleAddComment} 
                  disabled={!newComment.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">{comments.length} Comments</h3>
        </div>

        {comments.map((comment) => (
          <Card key={comment.id} className="border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <Avatar className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500">
                  <AvatarFallback className="text-white font-bold text-sm">
                    {comment.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-gray-900">{comment.user}</span>
                    <span className="text-xs text-gray-500">{comment.time}</span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed mb-3">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center space-x-2 text-sm transition-colors duration-200 ${
                        comment.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                      <span>{comment.likes}</span>
                    </button>
                    
                    <button 
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="flex items-center space-x-2 text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Reply className="w-4 h-4" />
                      <span>Reply</span>
                    </button>

                    {comment.replies.length > 0 && (
                      <button 
                        onClick={() => toggleReplies(comment.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        {comment.showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                      </button>
                    )}
                  </div>

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="mt-4 flex space-x-3">
                      <Avatar className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500">
                        <AvatarFallback className="text-white font-bold text-xs">Y</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder={`Reply to ${comment.user}...`}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="text-sm border-gray-200 focus:border-blue-400"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleAddReply(comment.id);
                            }
                          }}
                        />
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleAddReply(comment.id)}
                            disabled={!replyText.trim()}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Reply
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setReplyingTo(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.showReplies && comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-100">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-3">
                          <Avatar className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500">
                            <AvatarFallback className="text-white font-bold text-xs">
                              {reply.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm text-gray-900">{reply.user}</span>
                              <span className="text-xs text-gray-500">{reply.time}</span>
                            </div>
                            <p className="text-gray-800 text-sm mb-2">{reply.content}</p>
                            <button 
                              onClick={() => {}}
                              className={`flex items-center space-x-1 text-xs transition-colors duration-200 ${
                                reply.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                              <span>{reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
