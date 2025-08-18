"use client"
import { useState, useEffect } from 'react';

interface Assignment {
  id: number;
  title: string;
  description: string;
  course: string;
  dueDate: string;
  status: string;
  points: number;
  type: string;
  difficulty: string;
  estimatedTime: string;
  attachedFile?: string; // New field for instructor file uploads
  submissions?: StudentSubmission[];
  createdBy: string;
  createdAt: string;
}

interface StudentSubmission {
  id: number;
  studentId: string;
  studentName: string;
  assignmentId: number;
  submissionText: string;
  fileName?: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  status: 'submitted' | 'graded';
}

export const useAssignmentStore = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);

  // Load data from localStorage on mount with fallback
  useEffect(() => {
    const savedAssignments = localStorage.getItem('assignments');
    const savedSubmissions = localStorage.getItem('submissions');
    
    if (savedAssignments) {
      try {
        const parsedAssignments = JSON.parse(savedAssignments);
        setAssignments(parsedAssignments);
        console.log('Loaded assignments:', parsedAssignments);
      } catch (error) {
        console.error('Error parsing assignments:', error);
        setAssignments([]);
      }
    } else {
      // Create some sample assignments if none exist
      const sampleAssignments = [
        {
          id: 1,
          title: "React Components Assignment",
          description: "Create a functional React component with props and state management",
          course: "React Development",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          points: 100,
          type: "Project",
          difficulty: "Medium",
          estimatedTime: "3-4 hours",
          createdBy: "Instructor",
          createdAt: new Date().toISOString()
        }
      ];
      setAssignments(sampleAssignments);
      localStorage.setItem('assignments', JSON.stringify(sampleAssignments));
    }
    
    if (savedSubmissions) {
      try {
        const parsedSubmissions = JSON.parse(savedSubmissions);
        setSubmissions(parsedSubmissions);
      } catch (error) {
        console.error('Error parsing submissions:', error);
        setSubmissions([]);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (assignments.length > 0) {
      localStorage.setItem('assignments', JSON.stringify(assignments));
      console.log('Saved assignments to localStorage:', assignments);
    }
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }, [submissions]);

  const addAssignment = (assignment: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setAssignments(prev => {
      const updated = [newAssignment, ...prev];
      console.log('Adding new assignment:', newAssignment);
      return updated;
    });
    return newAssignment;
  };

  const updateAssignment = (id: number, updates: Partial<Assignment>) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === id ? { ...assignment, ...updates } : assignment
      )
    );
  };

  const deleteAssignment = (id: number) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    setSubmissions(prev => prev.filter(submission => submission.assignmentId !== id));
  };

  const addSubmission = (submission: Omit<StudentSubmission, 'id' | 'submittedAt'>) => {
    const newSubmission: StudentSubmission = {
      ...submission,
      id: Date.now(),
      submittedAt: new Date().toISOString(),
    };
    setSubmissions(prev => [newSubmission, ...prev]);
    return newSubmission;
  };

  const gradeSubmission = (submissionId: number, grade: number, feedback?: string) => {
    setSubmissions(prev =>
      prev.map(submission =>
        submission.id === submissionId
          ? { ...submission, grade, feedback, status: 'graded' as const }
          : submission
      )
    );
  };

  const getAssignmentSubmissions = (assignmentId: number) => {
    return submissions.filter(submission => submission.assignmentId === assignmentId);
  };

  const getStudentSubmissions = (studentId: string) => {
    return submissions.filter(submission => submission.studentId === studentId);
  };

  // New method to get student assignments for a specific student
  const getStudentAssignments = (studentId: string) => {
    const studentSubmissions = submissions.filter(submission => submission.studentId === studentId);
    
    return assignments.map(assignment => {
      const submission = studentSubmissions.find(sub => sub.assignmentId === assignment.id);
      return {
        ...assignment,
        submittedAt: submission?.submittedAt,
        grade: submission?.grade,
        feedback: submission?.feedback,
        submissionStatus: submission?.status
      };
    });
  };

  // New method to get student grades for leaderboard
  const getStudentGrades = (studentId: string) => {
    const studentSubmissions = submissions.filter(
      submission => submission.studentId === studentId && submission.status === 'graded'
    );
    
    const totalPoints = studentSubmissions.reduce((acc, submission) => {
      return acc + (submission.grade || 0);
    }, 0);
    
    const averageGrade = studentSubmissions.length > 0 
      ? studentSubmissions.reduce((acc, submission) => acc + (submission.grade || 0), 0) / studentSubmissions.length
      : 0;
    
    return {
      totalPoints,
      averageGrade: Math.round(averageGrade),
      gradedAssignments: studentSubmissions.length
    };
  };

  return {
    assignments,
    submissions,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    addSubmission,
    gradeSubmission,
    getAssignmentSubmissions,
    getStudentSubmissions,
    getStudentAssignments,
    getStudentGrades,
  };
};
