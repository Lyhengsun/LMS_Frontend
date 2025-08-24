
import { Badge } from '@/src/components/ui/badge';
import { getUserRole } from '@/src/lib/utils';
import { useAssignmentStore } from '../lib/hooks/useAssignmentStore';
import { useNotifications } from '../lib/hooks/useNotifications';

export const AssignmentNotificationBadge = () => {
  const { notifications } = useNotifications();
  const { assignments } = useAssignmentStore();
  const userRole = getUserRole();

  if (userRole !== 'student') return null;

  // Count unread assignment-related notifications
  const assignmentNotifications = notifications.filter(
    n => !n.isRead && n.title.toLowerCase().includes('assignment')
  ).length;

  // Count new assignments (created in last 24 hours)
  const recentAssignments = assignments.filter(assignment => {
    const createdAt = new Date(assignment.createdAt).getTime();
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    return assignment.status === 'active' && createdAt > oneDayAgo;
  }).length;

  const totalNotifications = assignmentNotifications + recentAssignments;

  if (totalNotifications === 0) return null;

  return (
    <Badge className="bg-red-500 text-white text-xs animate-pulse">
      {totalNotifications > 9 ? '9+' : totalNotifications}
    </Badge>
  );
};
