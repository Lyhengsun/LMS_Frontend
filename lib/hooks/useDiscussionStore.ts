
import { useState, useEffect } from 'react';

interface DiscussionReply {
  id: number;
  authorId: string;
  authorName: string;
  authorRole: 'student' | 'instructor' | 'admin';
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
}

interface Discussion {
  id: number;
  title: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  authorRole: 'student' | 'instructor' | 'admin';
  createdAt: string;
  lastActivity: string;
  replies: DiscussionReply[];
  likes: number;
  likedBy: string[];
  isPinned: boolean;
  tags: string[];
}

export const useDiscussionStore = () => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedDiscussions = localStorage.getItem('discussions');
    if (savedDiscussions) {
      setDiscussions(JSON.parse(savedDiscussions));
    } else {
      // Initialize with sample data
      const sampleDiscussions: Discussion[] = [
        {
          id: 1,
          title: "Understanding React Hooks",
          content: "Can someone explain the difference between useState and useEffect?",
          category: "React",
          authorId: "student1",
          authorName: "Alice Johnson",
          authorRole: "student",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          lastActivity: new Date(Date.now() - 3600000).toISOString(),
          replies: [
            {
              id: 1,
              authorId: "instructor1",
              authorName: "Dr. Smith",
              authorRole: "instructor",
              content: "useState is for managing state, while useEffect is for side effects like API calls.",
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              likes: 5,
              likedBy: ["student1", "student2", "student3"]
            }
          ],
          likes: 3,
          likedBy: ["student2", "student3"],
          isPinned: false,
          tags: ["hooks", "react", "beginner"]
        }
      ];
      setDiscussions(sampleDiscussions);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('discussions', JSON.stringify(discussions));
  }, [discussions]);

  const addDiscussion = (discussion: Omit<Discussion, 'id' | 'createdAt' | 'lastActivity' | 'replies' | 'likes' | 'likedBy'>) => {
    const newDiscussion: Discussion = {
      ...discussion,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      replies: [],
      likes: 0,
      likedBy: [],
    };
    setDiscussions(prev => [newDiscussion, ...prev]);
    return newDiscussion;
  };

  const addReply = (discussionId: number, reply: Omit<DiscussionReply, 'id' | 'createdAt' | 'likes' | 'likedBy'>) => {
    const newReply: DiscussionReply = {
      ...reply,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    };

    setDiscussions(prev =>
      prev.map(discussion => {
        if (discussion.id === discussionId) {
          return {
            ...discussion,
            replies: [...discussion.replies, newReply],
            lastActivity: new Date().toISOString(),
          };
        }
        return discussion;
      })
    );

    return newReply;
  };

  const likeDiscussion = (discussionId: number, userId: string) => {
    setDiscussions(prev =>
      prev.map(discussion => {
        if (discussion.id === discussionId) {
          const isLiked = discussion.likedBy.includes(userId);
          return {
            ...discussion,
            likes: isLiked ? discussion.likes - 1 : discussion.likes + 1,
            likedBy: isLiked 
              ? discussion.likedBy.filter(id => id !== userId)
              : [...discussion.likedBy, userId],
          };
        }
        return discussion;
      })
    );
  };

  const likeReply = (discussionId: number, replyId: number, userId: string) => {
    setDiscussions(prev =>
      prev.map(discussion => {
        if (discussion.id === discussionId) {
          return {
            ...discussion,
            replies: discussion.replies.map(reply => {
              if (reply.id === replyId) {
                const isLiked = reply.likedBy.includes(userId);
                return {
                  ...reply,
                  likes: isLiked ? reply.likes - 1 : reply.likes + 1,
                  likedBy: isLiked 
                    ? reply.likedBy.filter(id => id !== userId)
                    : [...reply.likedBy, userId],
                };
              }
              return reply;
            }),
          };
        }
        return discussion;
      })
    );
  };

  const pinDiscussion = (discussionId: number) => {
    setDiscussions(prev =>
      prev.map(discussion => {
        if (discussion.id === discussionId) {
          return { ...discussion, isPinned: !discussion.isPinned };
        }
        return discussion;
      })
    );
  };

  const deleteDiscussion = (discussionId: number) => {
    setDiscussions(prev => prev.filter(discussion => discussion.id !== discussionId));
  };

  const getDiscussionsByCategory = (category: string) => {
    return discussions.filter(discussion => 
      category === 'All' || discussion.category === category
    );
  };

  return {
    discussions,
    addDiscussion,
    addReply,
    likeDiscussion,
    likeReply,
    pinDiscussion,
    deleteDiscussion,
    getDiscussionsByCategory,
  };
};
