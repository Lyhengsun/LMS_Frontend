
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserCheck, UserX, Clock, User } from 'lucide-react';

interface PendingRegistration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const AdminApprovalPanel = () => {
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadPendingRegistrations();
  }, []);

  const loadPendingRegistrations = () => {
    const stored = localStorage.getItem('pendingRegistrations');
    if (stored) {
      const registrations = JSON.parse(stored);
      setPendingRegistrations(registrations.filter((reg: PendingRegistration) => reg.status === 'pending'));
    }
  };

  const handleApproval = (registrationId: string, approved: boolean) => {
    const action = approved ? 'approve' : 'reject';
    const confirmed = window.confirm(`Are you sure you want to ${action} this registration?`);
    
    if (!confirmed) return;

    // Update registration status
    const allRegistrations = JSON.parse(localStorage.getItem('pendingRegistrations') || '[]');
    const updatedRegistrations = allRegistrations.map((reg: PendingRegistration) => {
      if (reg.id === registrationId) {
        return { ...reg, status: approved ? 'approved' : 'rejected' };
      }
      return reg;
    });
    
    localStorage.setItem('pendingRegistrations', JSON.stringify(updatedRegistrations));

    // If approved, add to user credentials
    if (approved) {
      const registration = allRegistrations.find((reg: PendingRegistration) => reg.id === registrationId);
      if (registration) {
        const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
        approvedUsers.push({
          email: registration.email,
          password: registration.password,
          role: 'student',
          firstName: registration.firstName,
          lastName: registration.lastName,
          approvedDate: new Date().toISOString()
        });
        localStorage.setItem('approvedUsers', JSON.stringify(approvedUsers));
      }
    }

    // Notify the user
    const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '{}');
    const registration = allRegistrations.find((reg: PendingRegistration) => reg.id === registrationId);
    
    if (registration) {
      if (!userNotifications[registration.email]) {
        userNotifications[registration.email] = [];
      }
      
      userNotifications[registration.email].unshift({
        id: Date.now().toString(),
        type: approved ? 'approval' : 'rejection',
        title: approved ? 'Registration Approved' : 'Registration Rejected',
        message: approved 
          ? 'Your account has been approved! You can now login with your credentials.'
          : 'Your registration request has been rejected. Please contact support for more information.',
        timestamp: new Date().toISOString(),
        isRead: false
      });
      
      localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
    }

    toast({
      title: approved ? "Registration Approved" : "Registration Rejected",
      description: `The registration has been ${approved ? 'approved' : 'rejected'} and the user has been notified.`,
      variant: approved ? "default" : "destructive"
    });

    // Refresh the list
    loadPendingRegistrations();
  };

  if (pendingRegistrations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <UserCheck className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No pending registrations</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-orange-600" />
          Pending Registrations ({pendingRegistrations.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingRegistrations.map((registration) => (
            <div key={registration.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {registration.firstName} {registration.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">{registration.email}</p>
                    <p className="text-xs text-gray-400">
                      Registered: {new Date(registration.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleApproval(registration.id, true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <UserCheck className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleApproval(registration.id, false)}
                    >
                      <UserX className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
