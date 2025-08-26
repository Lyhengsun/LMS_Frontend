"use client";
import { Sidebar } from "@/src/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNotifications } from "@/src/lib/hooks/useNotifications";
import { AlertCircle, Bell, Clock, Info, Send, Users, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const InstructorNotificationPageComponent = () => {
  const { notifications, addNotification, deleteNotification } =
    useNotifications();
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    priority: "medium" as "low" | "medium" | "high",
  });

  const handleSendNotification = () => {
    if (!notificationForm.title.trim() || !notificationForm.message.trim()) {
      toast("Error", {
        description: "Please fill in all fields",
      });
      return;
    }

    addNotification({
      title: notificationForm.title,
      message: notificationForm.message,
      priority: notificationForm.priority,
    });

    setNotificationForm({
      title: "",
      message: "",
      priority: "medium",
    });

    toast.success("Success", {
      description: "Notification sent to all students",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <Info className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Notification Management
            </h1>
            <p className="text-sm text-gray-500">
              Send and manage notifications to students
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Send New Notification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="w-5 h-5 mr-2 text-blue-600" />
                Send New Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <Input
                  placeholder="Enter notification title"
                  value={notificationForm.title}
                  onChange={(e) =>
                    setNotificationForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea
                  placeholder="Enter notification message"
                  value={notificationForm.message}
                  onChange={(e) =>
                    setNotificationForm((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <Select
                  value={notificationForm.priority}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setNotificationForm((prev) => ({
                      ...prev,
                      priority: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSendNotification} className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Send to All Students
              </Button>
            </CardContent>
          </Card>

          {/* Notification History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-600" />
                Notification History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No notifications sent yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {getPriorityIcon(notification.priority)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900">
                                {notification.title}
                              </h4>
                              <Badge
                                className={getPriorityColor(
                                  notification.priority
                                )}
                              >
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default InstructorNotificationPageComponent;
