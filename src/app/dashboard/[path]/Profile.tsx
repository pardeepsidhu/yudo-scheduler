'use client'
import { useEffect, useState } from 'react';
import { User, Phone, Camera, Save, Mail, Edit, Check, X, AlertCircle, ChevronRight, Shield, Loader } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { fetchUser, sendRestPassLink, sendTelegramLink, updateProfile } from '../../api/userApi';
import toast from 'react-hot-toast';


interface UserData {
  email: string;
  name?: string;
  profile?: string;
  telegram?: string;
}

// Default user data as fallback
const defaultUser: UserData = {
  email: 'user@example.com',
  name: '',
  profile: '',
  telegram: ''
};

export default function UserProfileComponent() {
  const [userData, setUserData] = useState(defaultUser);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(userData.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);




  const getUser = async () => {
    setInitialLoading(true)
    try {
      let result = await fetchUser();
      setUserData(result)

    } catch (error) {
      toast.error("Error while fetching user!")
    }
    finally {
      setInitialLoading(false)
    }
  }


  useEffect(() => {
    getUser()
  }, [])

  const handleUpdateName = async () => {
    if (!name || name === userData.name) {
      setIsEditingName(false);
      return;
    }

    setIsLoading(true);
    try {
      setUserData({ ...userData, name: name })
      setIsEditingName(false);

    } catch (error: any) {
      console.error('Failed to update name:', error);
      toast.error(error.message)
    } finally {
      setIsLoading(false);
    }
  };



  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default'); // Replace with your Cloudinary upload preset

      const response = await fetch('https://api.cloudinary.com/v1_1/testUserPardeep/image/upload', {
        method: 'post',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      toast.success('Uploaded profile photo')
      setUserData({ ...userData, profile: data.url })

    } catch (error) {
      toast.error('Failed to upload profile photo')
      console.error('Failed to upload profile photo:', error);
    } finally {
      setIsUploadingPhoto(false);
    }
  };
  const handleUpdateProfile = async () => {
    try {
      const res = await updateProfile(userData);

      if (!res.error) {
        setInitialLoading(true)
        toast.success("Pofile updated")
        await getUser()
      }
      else{
        toast.error("Some error accured!")
      }

    } catch (error) {
      toast.error("Some error accured!")
    }

  };

  const handleResetPass = async () => {
    try {
      let result = await sendRestPassLink()
      if (result.error) {
        toast.error("some error accured!")
      }
      else {
        toast.success("Link sent Please check your email inpox")
      }
      // toast.success()
    } catch (error) {
      toast.error("some error accured!")
      throw new Error("some error accured")
    }
  }

  const handleAddTelegramClick = async () => {
    try {
      const res = await sendTelegramLink()
      if (!res.error) {
        toast.success("Link sent please check you email inbox")
      }
      else{
        toast.success("Error while sendig link")
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  };


  return initialLoading ? (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-4 mb-3 shadow-lg">
          <Loader size={32} className="animate-spin text-white" />
        </div>
        <p className="text-gray-700 font-semibold">Loading Profile...</p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto">
        <Card style={{ borderRadius: "0px !important" }} className="shadow-xl border-slate-200 overflow-hidden rounded-none! gap-1 sm:gap-4 pt-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-white shadow-lg ring-4 ring-white/50">
                  <AvatarImage src={userData.profile || '/public/profile/Profile.png'} alt={userData.name || 'Profile'} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                    {userData.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>

                <label htmlFor="profile-upload" className="absolute bottom-1 right-1 p-2 rounded-full bg-white text-slate-800 cursor-pointer shadow-lg hover:bg-slate-50 transition-all duration-200 group-hover:scale-110">
                  <input
                    type="file"
                    id="profile-upload"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploadingPhoto}
                  />
                  {isUploadingPhoto ? (
                    <span className="flex items-center justify-center h-5 w-5">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </span>
                  ) : (
                    <Camera className="h-5 w-5" />
                  )}
                </label>
              </div>

              <div className="flex-1 text-center sm:text-left relative right-7 sm:right-0">
                {isEditingName ? (
                  <div className="space-y-3">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="max-w-xs bg-white/10 text-white border-white/30 placeholder:text-white/60 backdrop-blur-sm"
                    />
                    <div className="flex space-x-2 justify-center sm:justify-start">
                      <Button
                        size="sm"
                        onClick={handleUpdateName}
                        disabled={isLoading}
                        className="bg-white text-blue-600 hover:bg-white/90 rounded-sm shadow-md font-semibold"
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Save
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Check className="h-4 w-4 mr-2" />
                            Save
                          </span>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setName(userData.name || '');
                          setIsEditingName(false);
                        }}
                        className="bg-transparent border-white/50 text-white hover:bg-white/10 rounded-sm backdrop-blur-sm"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-2xl font-bold drop-shadow-md">
                        {userData.name || 'Add your name'}
                      </h2>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-white hover:bg-white/20 hover:text-white rounded-sm"
                              onClick={() => setIsEditingName(true)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit your name</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="h-4 w-4 text-white/80" />
                      <p className="text-white/90">{userData.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-2 sm:py-6 px-3 sm:px-6">
            <div className="space-y-8">
              {/* Profile Info Section */}
              <div>
                <h3 className="text-xl font-semibold mb-2 sm:mb-3 flex items-center text-gray-900">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-sm flex items-center justify-center mr-2">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  Personal Information
                </h3>
                <div className="space-y-4 pl-2 sm:pl-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-600">Full Name</h4>
                      <p className="mt-1 text-gray-900 font-medium">{userData.name || 'Not set'}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 sm:mt-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all rounded-sm! border-gray-300"
                      onClick={() => setIsEditingName(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 sm:pb-2 border-b border-gray-200">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-600">Email Address</h4>
                      <p className="mt-1 text-gray-900 font-medium">{userData.email}</p>
                    </div>
                    <div className="mt-1 sm:mt-0 flex items-center text-sm font-semibold">
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                        <Check className="h-4 w-4" />
                        Verified
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Telegram Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-sm flex items-center justify-center mr-2">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  Telegram Connection
                </h3>

                <div className="space-y-2">
                  {userData.telegram ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 p-3 sm:p-4 rounded-sm border border-blue-200 shadow-sm">
                      <div className='flex w-full justify-between'>
                        <div className="flex items-center">
                          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-full mr-3 shadow-md">
                            <Phone className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm sm:text-lg text-gray-900">Stay Updated With Telegram</h4>
                            <p className="text-sm text-gray-600 font-medium">Connected Telegram Account</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-white hover:border-blue-300 hover:text-blue-600 transition-all border-blue-300 rounded-sm"
                          onClick={handleAddTelegramClick}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Change
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-3 sm:p-4 rounded-sm border border-dashed border-gray-300">
                      <div className="flex items-center">
                        <div className="bg-slate-200 p-2 rounded-full mr-3">
                          <Phone className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">No Telegram Connected</h4>
                          <p className="text-sm text-slate-600">Add your Telegram account for easier communication</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="mt-3 sm:mt-0 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md rounded-sm"
                        onClick={handleAddTelegramClick}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Connect Telegram
                      </Button>
                    </div>
                  )}

                  <Alert className="bg-amber-50 border-l-4 border-amber-500 text-amber-800">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="font-semibold">Verification Required</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      For security reasons, we'll send a verification code to your email when you connect or change your Telegram.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <Separator className='my-2 sm:my-4' />

              {/* Account Security */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-sm flex items-center justify-center mr-2">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  Account Security
                </h3>

                <div className="sm:pl-7">
                  <Button
                    variant="outline"
                    onClick={handleResetPass}
                    className="w-full sm:w-auto flex justify-between hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-all cursor-pointer rounded-sm border-gray-300"
                  >
                    <span className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Change Password
                    </span>
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t py-2 sm:py-6 px-3 sm:px-6 bg-slate-50">
            <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-3">
              <Button
                variant="outline"
                className="hover:bg-slate-100 transition-colors order-2 sm:order-1 rounded-sm border-gray-300"
                onClick={getUser}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateProfile}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors order-1 sm:order-2 rounded-sm shadow-md font-semibold"
              >
                Save All Changes
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>

  )
}