"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Shield,
  UserIcon,
  Plus,
  Camera,
  Banknote,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { uploadImageService } from "@/src/service/file.service";
import User from "@/src/type/User";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import z from "zod";
import { updateProfileSchema } from "@/src/lib/zod/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "./CustomFormField";
import CustomTextFormField from "./CustomTextFormField";
import { uploadImageAction } from "@/src/action/fileAction";
import {
  updateBakongAccountIdForInstructorAction,
  updateCurrentUserProfileAction,
} from "@/src/action/userAction";

const UserProfilePageComponent = ({ currentUser }: { currentUser: User }) => {
  const [currentUserState, setCurrentUserState] = useState<User | null>(
    currentUser
  );

  console.log("[Profile Page] Current User State: ", currentUserState);

  const userRole =
    currentUser.role == "ROLE_ADMIN"
      ? "admin"
      : currentUser.role == "ROLE_INSTRUCTOR"
      ? "instructor"
      : "student";
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] =
    useState(false);
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] =
    useState(false);
  const [isBakongAccountDialogOpen, setIsBakongAccountDialogOpen] =
    useState(false);
  const [bakongAccountIdState, setBakongAccountIdState] = useState<
    string | null
  >(currentUserState?.bakongAccountId || null);

  const [profileData, setProfileData] = useState({
    phone: currentUserState?.phoneNumber,
    bio: currentUserState?.bio ?? "",
    avatarUrl: currentUserState?.avatarUrl ?? "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      bio: currentUserState?.bio || "",
      phoneNumber: currentUserState?.phoneNumber || "",
    },
  });

  const watchedPhone = form.watch("phoneNumber");
  const watchedBio = form.watch("bio");

  useEffect(() => {
    const phoneDifferent =
      (watchedPhone || "") !== (currentUserState?.phoneNumber || "");
    const bioDifferent = (watchedBio || "") !== (currentUserState?.bio || "");
    setIsUpdatingProfile(phoneDifferent || bioDifferent);
  }, [watchedPhone, watchedBio, currentUserState]);

  const [resetPasswordData, setResetPasswordData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid File", {
          description: "Please select an image file.",
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File Too Large", {
          description: "Image size must be less than 5MB.",
        });
        return;
      }

      setSelectedImage(file);
      setIsUpdatingProfile(true);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitProfile = async (
    values: z.infer<typeof updateProfileSchema>
  ) => {
    try {
      // Upload image first if a new image is selected
      let uploadedImageName: string | null = null;
      if (selectedImage) {
        setIsUploadingImage(true);
        const uploadResponse = await uploadImageAction(selectedImage);

        if (uploadResponse?.success) {
          // Update profile data with new avatar URL
          setProfileData({
            ...profileData,
            avatarUrl: uploadResponse.data?.fileName || "",
          });

          // Clear selected image and preview
          setSelectedImage(null);
          setImagePreview(null);
          uploadedImageName = uploadResponse.data?.fileName!;
        } else {
          toast.error("Upload Failed", {
            description: "Failed to upload profile picture.",
          });
          return;
        }
      }

      const res = await updateCurrentUserProfileAction(
        uploadedImageName,
        values
      );
      if (!res.success) {
        throw new Error(res.message as string | "");
      }

      // TODO: Save profile data to backend
      toast("Profile Updated", {
        description: "Your profile information has been saved successfully.",
      });
      const updatedUserData = res.data!;
      setCurrentUserState(updatedUserData);
      setProfileData({
        phone: updatedUserData?.phoneNumber || "",
        bio: updatedUserData?.bio || "",
        avatarUrl: updatedUserData?.avatarUrl || "",
      });
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsUploadingImage(false);
      setIsUpdatingProfile(false);
      setImagePreview(null);
      setSelectedImage(null);
    }
  };

  const handleCancel = () => {
    form.reset({
      bio: currentUserState?.bio || "",
      phoneNumber: currentUserState?.phoneNumber || "",
    });
    setSelectedImage(null);
    setImagePreview(null);
    setProfileData({
      phone: currentUserState?.phoneNumber || "",
      bio: currentUserState?.bio || "",
      avatarUrl: currentUserState?.avatarUrl || "",
    });
    setIsUpdatingProfile(false);
    setIsUploadingImage(false);
  };

  const handleChangePassword = () => {
    console.log("Change Password Form Submitted:", {
      currentPassword: securitySettings.currentPassword,
      newPassword: securitySettings.newPassword,
      confirmPassword: securitySettings.confirmPassword,
    });

    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast.error("Password Mismatch", {
        description: "New password and confirm password do not match.",
      });
      return;
    }

    if (securitySettings.newPassword.length < 8) {
      toast.error("Password Too Short", {
        description: "Password must be at least 8 characters long.",
      });
      return;
    }

    toast("Password Changed", {
      description: "Your password has been updated successfully.",
    });

    setSecuritySettings({
      ...securitySettings,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsChangePasswordDialogOpen(false);
  };

  const handleResetPassword = () => {
    console.log("Reset Password Form Submitted:", {
      email: resetPasswordData.email,
      newPassword: resetPasswordData.newPassword,
      confirmPassword: resetPasswordData.confirmPassword,
    });

    if (!resetPasswordData.email) {
      toast.error("Email Required", {
        description: "Please enter your email address.",
      });
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      toast.error("Password Mismatch", {
        description: "New password and confirm password do not match.",
      });
      return;
    }

    if (resetPasswordData.newPassword.length < 8) {
      toast.error("Password Too Short", {
        description: "Password must be at least 8 characters long.",
      });
      return;
    }

    toast("Password Reset", {
      description: "Your password has been reset successfully.",
    });

    setResetPasswordData({
      email: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsResetPasswordDialogOpen(false);
  };

  const handleBakongAccountId = async () => {
    const bakongAccountRes = await updateBakongAccountIdForInstructorAction(
      bakongAccountIdState!
    );
    if (bakongAccountRes.success) {
      toast.success("Update Bakong ID Successfully");
      setIsBakongAccountDialogOpen(false);
    } else {
      toast.error(
        (bakongAccountRes.message as string) ||
          "Failed to update bakong account id"
      );
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case "student":
        return "hsl(var(--student-primary))";
      case "instructor":
        return "hsl(var(--instructor-primary))";
      case "admin":
        return "hsl(var(--admin-primary))";
      default:
        return "hsl(220, 13%, 69%)";
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">
              Manage your account preferences and settings
            </p>
          </div>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 capitalize">
            {userRole} Account
          </Badge>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Settings */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitProfile)}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserIcon
                      className="w-5 h-5 mr-2"
                      style={{ color: getRoleColor() }}
                    />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture Upload Section */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="w-32 h-32">
                        <AvatarImage
                          src={
                            imagePreview ||
                            `${process.env.BASE_API_URL}/files/preview-file/${profileData.avatarUrl}` ||
                            ""
                          }
                          className="object-cover"
                          alt={currentUserState?.fullName || "Profile picture"}
                        />
                        <AvatarFallback
                          className="text-4xl"
                          style={{
                            backgroundColor: getRoleColor(),
                            color: "white",
                          }}
                        >
                          {currentUserState?.fullName
                            ?.charAt(0)
                            .toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="profile-image-upload"
                        className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition-colors shadow-lg"
                        style={{ backgroundColor: getRoleColor() }}
                      >
                        <Camera className="w-5 h-5 text-white" />
                        <input
                          id="profile-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-700">
                        {currentUserState?.fullName || "User"}
                      </p>
                      <p className="text-md text-gray-500">
                        {currentUserState?.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        Click the camera icon to upload a new profile picture
                      </p>
                      {selectedImage && (
                        <p className="text-xs text-green-600 mt-1">
                          New image selected: {selectedImage.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <CustomFormField
                        control={form.control}
                        fieldName="phoneNumber"
                        label="Phone Number"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <CustomTextFormField
                    control={form.control}
                    fieldName="bio"
                    label="Bio"
                    placeholder="Tell us about yourself"
                  />

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={!isUploadingImage && !isUpdatingProfile}
                      style={{ backgroundColor: getRoleColor() }}
                    >
                      {isUploadingImage ? "Uploading..." : "Save Profile"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={!isUploadingImage && !isUpdatingProfile}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>

          {/* Bakong Account Setting */}
          {userRole == "instructor" && (
            <Card>
              <CardContent>
                {/* Header Section */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Banknote
                        className="w-6 h-6"
                        style={{ color: getRoleColor() }}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Bakong Account Setting
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Manage your bakong account id
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bakong Account Options */}
                <div className="space-y-4">
                  {/* Bakong Account Options */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${getRoleColor()}20` }}
                      >
                        <Banknote
                          className="w-5 h-5"
                          style={{ color: getRoleColor() }}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Bakong Account ID
                        </h3>
                        <p className="text-sm text-gray-500">
                          Add or update your Bakong ID for payment features
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsBakongAccountDialogOpen(true)}
                      variant="outline"
                      className="ml-4"
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          <Card>
            <CardContent>
              {/* Header Section */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Shield
                      className="w-6 h-6"
                      style={{ color: getRoleColor() }}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Security Settings
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage your account password and security preferences
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Management Options */}
              <div className="space-y-4">
                {/* Change Password Option */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${getRoleColor()}20` }}
                    >
                      <Shield
                        className="w-5 h-5"
                        style={{ color: getRoleColor() }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Change Password
                      </h3>
                      <p className="text-sm text-gray-500">
                        Update your current password with a new one
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsChangePasswordDialogOpen(true)}
                    variant="outline"
                    className="ml-4"
                  >
                    Change
                  </Button>
                </div>

                {/* Reset Password Option */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${getRoleColor()}20` }}
                    >
                      <Shield
                        className="w-5 h-5"
                        style={{ color: getRoleColor() }}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Reset Password
                      </h3>
                      <p className="text-sm text-gray-500">
                        Reset your password using your email address
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsResetPasswordDialogOpen(true)}
                    variant="outline"
                    className="ml-4"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Change Password Dialog */}
      <Dialog
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="dialog-currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="dialog-currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={securitySettings.currentPassword}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="dialog-newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="dialog-newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={securitySettings.newPassword}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="dialog-confirmPassword">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="dialog-confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={securitySettings.confirmPassword}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsChangePasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              style={{ backgroundColor: getRoleColor() }}
            >
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={isResetPasswordDialogOpen}
        onOpenChange={setIsResetPasswordDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email and set a new password for your account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                value={resetPasswordData.email}
                onChange={(e) =>
                  setResetPasswordData({
                    ...resetPasswordData,
                    email: e.target.value,
                  })
                }
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="reset-newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="reset-newPassword"
                  type={showResetNewPassword ? "text" : "password"}
                  value={resetPasswordData.newPassword}
                  onChange={(e) =>
                    setResetPasswordData({
                      ...resetPasswordData,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showResetNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="reset-confirmPassword">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="reset-confirmPassword"
                  type={showResetConfirmPassword ? "text" : "password"}
                  value={resetPasswordData.confirmPassword}
                  onChange={(e) =>
                    setResetPasswordData({
                      ...resetPasswordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowResetConfirmPassword(!showResetConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showResetConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsResetPasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              style={{ backgroundColor: getRoleColor() }}
            >
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bakong Account Dialog */}
      <Dialog
        open={isBakongAccountDialogOpen}
        onOpenChange={setIsBakongAccountDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Bakong Account ID</DialogTitle>
            <DialogDescription>
              Set or update the bakong account id for your account.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="reset-email" className="mb-2">
                Bakong Account ID
              </Label>
              <Input
                id="bakong-account-id"
                type="text"
                defaultValue={bakongAccountIdState || ""}
                onChange={(e) => setBakongAccountIdState(e.target.value)}
                placeholder="Enter your bakong account id"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setBakongAccountIdState(
                  currentUserState?.bakongAccountId || null
                );
                setIsBakongAccountDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (
                  bakongAccountIdState == null ||
                  bakongAccountIdState.trim() == ""
                ) {
                  toast.error("Bakong Account ID can't be empty");
                } else {
                  handleBakongAccountId();
                }
              }}
              style={{ backgroundColor: getRoleColor() }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfilePageComponent;
