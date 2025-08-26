"use client";
import { Sidebar } from "@/src/components/Sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Clock,
  Eye,
  Filter,
  Heart,
  MessageSquare,
  Pin,
  Plus,
  Reply,
  Search,
  Send,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useState } from "react";

const StudentDiscussionPageComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDiscussion, setSelectedDiscussion] = useState<any>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "Question",
    course: "React Development",
  });
  const [newReply, setNewReply] = useState("");

  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: "Best practices for React component optimization?",
      content:
        "I'm working on optimizing my React components and wondering what are the best practices for performance optimization. Any suggestions?",
      author: "Sarah Chen",
      authorRole: "student",
      course: "React Development",
      category: "Question",
      replies: 12,
      views: 156,
      likes: 8,
      likedBy: ["user1", "user2"],
      lastActivity: "2 hours ago",
      status: "active",
      isPinned: false,
      tags: ["react", "performance", "optimization"],
    },
    {
      id: 2,
      title: "Assignment 3 - Need help with API integration",
      content:
        "Having trouble with the API integration part of assignment 3. Anyone else facing similar issues?",
      author: "Kong KEAT",
      authorRole: "student",
      course: "React Development",
      category: "Help",
      replies: 5,
      views: 89,
      likes: 3,
      likedBy: ["user3"],
      lastActivity: "5 hours ago",
      status: "answered",
      isPinned: false,
      tags: ["api", "assignment", "help"],
    },
    {
      id: 3,
      title: "Study Group for JavaScript Fundamentals",
      content:
        "Anyone interested in forming a study group for JavaScript fundamentals? We could meet weekly to discuss concepts and practice together.",
      author: "Alex Rivera",
      authorRole: "student",
      course: "JavaScript Fundamentals",
      category: "Study Group",
      replies: 18,
      views: 234,
      likes: 15,
      likedBy: ["user1", "user4", "user5"],
      lastActivity: "1 day ago",
      status: "active",
      isPinned: true,
      tags: ["study-group", "javascript", "collaboration"],
    },
  ]);

  const replies = [
    {
      id: 1,
      author: "Dr. Smith",
      authorRole: "instructor",
      content:
        "Great question! For React optimization, consider using React.memo for functional components and useMemo for expensive calculations. Also, don't forget about useCallback for event handlers.",
      timestamp: "1 hour ago",
      likes: 5,
      likedBy: ["user1", "user2"],
    },
    {
      id: 2,
      author: "Alex Rivera",
      authorRole: "student",
      content:
        "I also recommend using the React DevTools Profiler to identify performance bottlenecks. It's been really helpful in my projects!",
      timestamp: "45 minutes ago",
      likes: 2,
      likedBy: ["user3"],
    },
  ];

  const categories = [
    "All",
    "Question",
    "Help",
    "Study Group",
    "Project",
    "General",
  ];

  const handleCreatePost = () => {
    if (newPost.title && newPost.content) {
      const post = {
        id: discussions.length + 1,
        ...newPost,
        content: newPost.content,
        author: "Kong KEAT",
        authorRole: "student",
        replies: 0,
        views: 1,
        likes: 0,
        likedBy: [],
        lastActivity: "Just now",
        status: "active",
        isPinned: false,
        tags: [],
      };
      setDiscussions([post, ...discussions]);
      setNewPost({
        title: "",
        content: "",
        category: "Question",
        course: "React Development",
      });
      setShowNewPost(false);
    }
  };

  const handleReply = () => {
    if (newReply.trim()) {
      console.log("New reply:", newReply);
      setNewReply("");
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Question":
        return "bg-blue-100 text-blue-800";
      case "Help":
        return "bg-red-100 text-red-800";
      case "Study Group":
        return "bg-green-100 text-green-800";
      case "Project":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "instructor":
        return "bg-purple-101 text-purple-800";
      case "admin":
        return "bg-red-101 text-red-800";
      default:
        return "bg-blue-101 text-blue-800";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2);
  };

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || discussion.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort discussions: pinned first, then by last activity
  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  if (selectedDiscussion) {
    return (
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setSelectedDiscussion(null)}
              >
                ← Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {selectedDiscussion.title}
                </h1>
                <p className="text-sm text-gray-500">
                  by {selectedDiscussion.author} • {selectedDiscussion.course}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getCategoryColor(selectedDiscussion.category)}>
                {selectedDiscussion.category}
              </Badge>
              {selectedDiscussion.isPinned && (
                <Pin className="w-4 h-4 text-yellow-600" />
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Original Post */}
            <Card className="border-2 border-blue-100">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-600 text-white">
                      {getInitials(selectedDiscussion.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-gray-900">
                        {selectedDiscussion.author}
                      </span>
                      <Badge
                        className={getRoleColor(selectedDiscussion.authorRole)}
                      >
                        {selectedDiscussion.authorRole}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {selectedDiscussion.lastActivity}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {selectedDiscussion.course}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  {selectedDiscussion.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span>{selectedDiscussion.likes}</span>
                    </button>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Eye className="w-5 h-5" />
                      <span>{selectedDiscussion.views} views</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedDiscussion.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Replies Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  {replies.length} Replies
                </h3>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Sort by
                </Button>
              </div>

              {replies.map((reply) => (
                <Card key={reply.id} className="ml-6">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-green-600 text-white">
                          {getInitials(reply.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {reply.author}
                          </span>
                          <Badge className={getRoleColor(reply.authorRole)}>
                            {reply.authorRole}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {reply.timestamp}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {reply.content}
                        </p>
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span>{reply.likes}</span>
                          </button>
                          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Reply className="w-4 h-4" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Reply Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  Add a Reply
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-600 text-white">
                      KK
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Write your reply..."
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Be respectful and constructive</span>
                      </div>
                      <Button
                        onClick={handleReply}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Post Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Community Discussions
              </h1>
              <p className="text-sm text-gray-500">
                Connect with peers, ask questions, and share knowledge
              </p>
            </div>
            <Button
              onClick={() => setShowNewPost(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Discussion
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Discussions</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {discussions.length}
                    </p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Students</p>
                    <p className="text-2xl font-bold text-green-600">24</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Replies</p>
                    <p className="text-2xl font-bold text-purple-600">51</p>
                  </div>
                  <Reply className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">This Week</p>
                    <p className="text-2xl font-bold text-orange-600">+8</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* New Post Form */}
          {showNewPost && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Discussion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Discussion Title"
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost({ ...newPost, title: e.target.value })
                    }
                  />
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md"
                    value={newPost.category}
                    onChange={(e) =>
                      setNewPost({ ...newPost, category: e.target.value })
                    }
                  >
                    <option value="Question">Question</option>
                    <option value="Help">Help</option>
                    <option value="Study Group">Study Group</option>
                    <option value="Project">Project</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <Textarea
                  placeholder="What would you like to discuss?"
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  rows={4}
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={handleCreatePost}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Create Discussion
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewPost(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Discussions List */}
          <div className="space-y-4">
            {sortedDiscussions.map((discussion) => (
              <Card
                key={discussion.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardHeader onClick={() => setSelectedDiscussion(discussion)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-600 text-white">
                          {getInitials(discussion.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge
                            className={getCategoryColor(discussion.category)}
                          >
                            {discussion.category}
                          </Badge>
                          {discussion.isPinned && (
                            <Pin className="w-4 h-4 text-yellow-600" />
                          )}
                          <span className="text-sm text-gray-500">
                            {discussion.course}
                          </span>
                        </div>
                        <CardTitle className="text-lg mb-2 hover:text-blue-600 transition-colors">
                          {discussion.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-gray-600">
                            by {discussion.author}
                          </span>
                          <Badge
                            className={getRoleColor(discussion.authorRole)}
                            variant="secondary"
                          >
                            {discussion.authorRole}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {discussion.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{discussion.replies}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{discussion.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{discussion.likes}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {discussion.lastActivity}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDiscussionPageComponent;
