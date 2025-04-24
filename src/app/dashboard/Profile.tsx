import { useEffect, useState } from 'react';
import { User, Phone, Camera, Save, Mail, Edit, Check, X, AlertCircle, ChevronRight, Shield, Loader } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
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
import { fetchUser, sendRestPassLink, sendTelegramLink, updateProfile } from '../api/userApi';

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
  const [userData,setUserData]=useState(defaultUser);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(userData.name || '');
  const [telegram, setTelegram] = useState(userData.telegram || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingTelegram, setIsEditingTelegram] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showPassAlet,setPassAlert]=useState(false);
  const [initialLoading,setInitialLoading]=useState(true);


    

    const getUser = async()=>{
      setInitialLoading(true)
      try {
        let result = await fetchUser();
       setUserData(result)
        console.log(result)
      } catch (error) {
        console.log(error)
      }
      finally{
        setInitialLoading(false)
      }
    }


    useEffect(()=>{
      getUser()
    },[])

  const handleUpdateName = async () => {
    if (!name || name === userData.name) {
      setIsEditingName(false);
      return;
    }
    
    setIsLoading(true);
    try {
      setUserData({...userData,name:name})
      setIsEditingName(false);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      console.log(userData)
    } catch (error) {
      console.error('Failed to update name:', error);
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
  
      const response = await fetch('https://api.cloudinary.com/v1_1/testUserPardeep/image/upload',{
        method:'post',
        body:formData
      })
  
      if (!response.ok) {
        throw new Error('Upload failed');
      }
  
      const data = await response.json();
      console.log(data)
      
      setUserData({...userData,profile:data.url})
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error('Failed to upload profile photo:', error);
    } finally {
      setIsUploadingPhoto(false);
    }
  };
  const handleUpdateProfile = async() => {
    try {
      const res = await updateProfile(userData);
      console.log(res)
      if(!res.error){
        setInitialLoading(true)
        await getUser()
        setInitialLoading(false)
      }
  
    } catch (error) {
      console.log(error)
    }
    
  };

  const handleResetPass = async()=>{
    try {
      let result = await sendRestPassLink()
      if(result.error){
        console.log(error);
      }
      else{
         setPassAlert(true)
         setTimeout(()=>setPassAlert(false),4000)
      }
    } catch (error) {
      console.log(error)
      throw new Error("some error accured")
    }
  }

  const handleAddTelegramClick = async() => {
    try {
      const res = await sendTelegramLink()
      if(!res.error){
        setShowEmailAlert(true);
        setTimeout(() => setShowEmailAlert(false), 5000);
      }
  
    } catch (error) {
      console.log(error)
    }
    
  };

  return initialLoading? (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="rounded-full bg-blue-50 p-4 mb-3">
        <Loader size={32} className="animate-spin text-blue-600" />
      </div>
      <p className="text-gray-600 font-medium">Loading Profile...</p>
    </div>
  </div> ): (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100 ">
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Your profile has been updated successfully.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {showEmailAlert && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <Mail className="h-4 w-4 text-blue-600" />
            <AlertTitle>Verification Email Sent</AlertTitle>
            <AlertDescription>
              We've sent a verification email to {userData.email}. Please check your inbox to complete the process.
            </AlertDescription>
          </Alert>
        </div>
      )}


{showPassAlet && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <Mail className="h-4 w-4 text-blue-600" />
            <AlertTitle>Reset Pasword Email Sent</AlertTitle>
            <AlertDescription>
              We've sent a Reset Password email to {userData.email}. Please check your inbox to complete the process.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className="container mx-auto ">
        {/* <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">Account Settings</h1> */}
        
        <Card className="shadow-xl border-slate-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white py-2 sm:py-4 ">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                  <AvatarImage src={userData.profile || '/public/profile/Profile.png'} alt={userData.name || 'Profile'} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                   
                  </AvatarFallback>
                </Avatar>
                
                <label htmlFor="profile-upload" className="absolute bottom-1 right-1 p-2 rounded-full bg-white text-slate-800 cursor-pointer shadow-md hover:bg-slate-50 transition-all duration-200 group-hover:scale-110">
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
                      className="max-w-xs bg-slate-600 text-white border-slate-500 placeholder:text-slate-400"
                    />
                    <div className="flex space-x-2 justify-center sm:justify-start">
                      <Button 
                        size="sm" 
                        onClick={handleUpdateName}
                        disabled={isLoading}
                        className="bg-white text-slate-800 hover:bg-slate-100"
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                        className="bg-transparent border-white text-white hover:bg-slate-700"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-2xl font-bold">
                        {userData.name || 'Add your name'}
                      </h2>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-white hover:bg-slate-600 hover:text-white" 
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
                      <Mail className="h-4 w-4 text-slate-300" />
                      <p className="text-slate-200">{userData.email}</p>
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
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Personal Information
                </h3>
                <div className="space-y-4 pl-2 sm:pl-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Full Name</h4>
                      <p className="mt-1">{userData.name || 'Not set'}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 sm:mt-0 hover:bg-slate-50 transition-colors"
                      onClick={() => setIsEditingName(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Email Address</h4>
                      <p className="mt-1">{userData.email}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center text-sm text-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      Verified
                    </div>
                  </div>
                </div>
              </div>

              <Separator />
              
              {/* Telegram Section */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-primary" />
                  Telegram Connection
                </h3>
                
                <div className="pl-2 sm:pl-5 space-y-4">
                  {userData.telegram ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-4 rounded-lg border">
                      <div className='flex  w-full justify-between'>
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <Phone className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm sm:text-lg">Stay Update With Telegram</h4>
                            <p className="text-sm text-slate-500">Connected Telegram Account</p>
                          </div>
                        </div>
                        <Button 
                              size="sm" 
                              variant="outline"
                              className="hover:bg-slate-100 transition-colors"
                              onClick={handleAddTelegramClick}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Change
                            </Button>
                      </div>
                     
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-4 rounded-lg border border-dashed">
                      <div className="flex items-center">
                        <div className="bg-slate-100 p-2 rounded-full mr-3">
                          <Phone className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">No Telegram Connected</h4>
                          <p className="text-sm text-slate-500">Add your Telegram account for easier communication</p>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        className="mt-3 sm:mt-0 hover:bg-blue-700 transition-colors"
                        onClick={handleAddTelegramClick}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Connect Telegram
                      </Button>
                    </div>
                  )}
                  
                  <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle>Verification Required</AlertTitle>
                    <AlertDescription>
                      For security reasons, we'll send a verification code to your email when you connect or change your Telegram.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <Separator />
              
              {/* Account Security */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Account Security
                </h3>
                
                <div className="pl-7">
                  <Button variant="outline" onClick={handleResetPass} className="w-full sm:w-auto flex justify-between hover:bg-slate-50 transition-colors cursor-pointer">
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
          
          <CardFooter className="border-t py-6 px-6 bg-slate-50">
            <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-3">
              <Button 
                variant="outline" 
                className="hover:bg-slate-100 transition-colors order-2 sm:order-1"
                onClick={getUser}
              >
                Cancel
              </Button>
              <Button 
              onClick={handleUpdateProfile}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-colors order-1 sm:order-2"
              >
                Save All Changes
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}