
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group';
import { CheckCircle, Loader2, User, Mail, Lock, Phone, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RegistrationDialog = ({ open, onOpenChange }: RegistrationDialogProps) => {
  const [step, setStep] = useState<'register' | 'pending'>('register');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) errors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) errors.email = 'Please enter a valid email';

    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const checkEmailExists = (email: string) => {
    // Check demo emails
    const demoEmails = ['student@test.com', 'instructor@test.com', 'admin@test.com'];
    if (demoEmails.includes(email.toLowerCase())) return true;
    
    // Check approved users
    const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
    if (approvedUsers.some((user: any) => user.email.toLowerCase() === email.toLowerCase())) return true;
    
    // Check pending registrations
    const pendingUsers = JSON.parse(localStorage.getItem('pendingRegistrations') || '[]');
    if (pendingUsers.some((user: any) => user.email.toLowerCase() === email.toLowerCase())) return true;
    
    return false;
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Check if email already exists
    if (checkEmailExists(formData.email)) {
      toast({
        title: "Email already exists",
        description: "An account with this email address already exists.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Save to pending registrations
    const pendingUsers = JSON.parse(localStorage.getItem('pendingRegistrations') || '[]');
    const newUser = {
      id: Date.now().toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
      status: 'pending',
      registrationDate: new Date().toISOString(),
      name: `${formData.firstName} ${formData.lastName}` // Add for user management display
    };

    pendingUsers.push(newUser);
    localStorage.setItem('pendingRegistrations', JSON.stringify(pendingUsers));

    // Also save to user profiles for future use
    const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
    userProfiles[formData.email] = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      bio: `I'm a ${formData.role} passionate about learning and growing.`,
      profileCreatedDate: new Date().toISOString()
    };
    localStorage.setItem('userProfiles', JSON.stringify(userProfiles));

    toast({
      title: "Registration Submitted",
      description: "Your registration has been submitted for admin approval.",
    });

    setIsLoading(false);
    setStep('pending');

    // Notify admin (trigger admin approval panel update)
    window.dispatchEvent(new CustomEvent('newRegistration'));
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'student'
    });
    setValidationErrors({});
    setStep('register');
    setIsLoading(false);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            {step === 'register' ? 'Create Account' : 'Registration Pending'}
          </DialogTitle>
          <DialogDescription>
            {step === 'register' 
              ? 'Fill in your details to create a new account'
              : 'Your registration is being reviewed by an administrator'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'register' && (
          <form onSubmit={handleRegistration} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={validationErrors.firstName ? 'border-red-300' : ''}
                  disabled={isLoading}
                />
                {validationErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={validationErrors.lastName ? 'border-red-300' : ''}
                  disabled={isLoading}
                />
                {validationErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="reg-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 ${validationErrors.email ? 'border-red-300' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <Label>Role</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => handleInputChange('role', value)}
                className="flex space-x-6 mt-2"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="instructor" id="instructor" />
                  <Label htmlFor="instructor">Instructor</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Password Fields */}
            <div>
              <Label htmlFor="reg-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`pl-10 ${validationErrors.password ? 'border-red-300' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`pl-10 ${validationErrors.confirmPassword ? 'border-red-300' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Finish Registration'
              )}
            </Button>
          </form>
        )}

        {step === 'pending' && (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Registration Pending</h3>
            <p className="text-gray-600 mb-6">
              Your account has been created and is awaiting administrator approval. 
              You will receive a notification once your account is approved.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium mb-2">Registration Details:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Role:</strong> {formData.role}</p>
                <p><strong>Status:</strong> Pending Approval</p>
              </div>
            </div>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              <CheckCircle className="w-4 h-4 mr-2" />
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
