

const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          return userData.token;
        } catch (e) {
          console.error('Error parsing user data:', e);
          return null;
        }
      }
    }
    return null;
  };


  export async function fetchUser(): Promise {
    const token = getAuthToken();
    if (!token) {
      return {error:"some error accured !"};
    }
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/get`, {
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
    });
    
    if (!response.ok) {
      return {error:"some error accured !"};
    }
  
    return await response.json();
  }

  export async function sendTelegramLink() {
    try {
      const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication token not found');
    }
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/telegram`, {
      method:"put",
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
    });

    return await response.json()
    
    } catch (error) {
      return {error:"some error accured while sending telegram link !"}
    }
  } 



  export async function updateProfile(user) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      
      // Create request body with only the fields that are provided
      const updateData = {};
      if (user.name !== undefined) updateData.name = user.name;
      if (user.profile !== undefined) updateData.profile = user.profile;
      
      let response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/update`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify(updateData)
      });
      
      const data = await response.json();

      return data;
    } catch (error) {
      return { error: "some error occurred while updating profile!" };
    }
  }




  export async function sendRestPassLink() {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }
     
      
      let response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/resetPass`, {
        headers: {
          'auth-token': token
        }
  
      });
      
      const data = await response.json();
 
      return data;
    } catch (error) {
      return { error: "some error occurred while updating profile!" };
    }
  }





  /**
 * Interface for notification response from API
 */
interface NotificationsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Notification[];
}

/**
 * Interface for notification object
 */
interface Notification {
  _id: string;
  title: string;
  createdAt: string;
  type: 'form' | 'auth' | 'telegram' | 'yudo';
  description: string;
  user: string;
  read: boolean;
}

/**
 * Fetches notifications for the authenticated user with optional filtering
 * 
 * @param options - Optional parameters for filtering and pagination
 * @param options.limit - Maximum number of notifications to return
 * @param options.skip - Number of notifications to skip (for pagination)
 * @param options.type - Filter by notification type
 * @param options.read - Filter by read status (true/false)
 * @returns Promise with notifications data and pagination info
 */
export async function fetchNotifications(options?: {
  limit?: number;
  skip?: number;
  type?: 'auth' | 'telegram' | 'yudo';
  read?: boolean;
  page?: number;
}): Promise<NotificationsResponse> {
  const token = getAuthToken();
  if (!token) {
  
  }

  const queryParams = new URLSearchParams();
  
  if (options?.limit) queryParams.append('limit', options.limit.toString());
  if (options?.skip) queryParams.append('skip', options.skip.toString());
  if (options?.type) queryParams.append('type', options.type);
  if (options?.read !== undefined) queryParams.append('read', options.read.toString());
  if (options?.page) queryParams.append('page', options.page.toString());
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/notification/getall/${queryString}`, {
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token
    },
  });
  const result =await response.json();

  return result
}


export const sendOtp = async (email, password, setMessage, setReceivedOtp, setOtpSent, setOtpTimer, setWaiting) => {
  try {
    setWaiting(true);
    // Replace with your actual API call
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/sendotp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setReceivedOtp(data.otp);
      setOtpSent(true);
      setOtpTimer(60); // 60 second timer
      setMessage.succes("OTP sent to your email");
    } else {
      setMessage.error(data.error || "Failed to send OTP");
    }
  } catch (error) {
    setMessage.error("An error occurred while sending OTP");
  } finally {
    setWaiting(false);
  }
};



export const verifyOtp = async (email, otp, password, setMessage, navigate, setWaiting, setUser) => {
  try {
    setWaiting(true);
    // Replace with your actual API call
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/verifyotp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, password })
    });
    
    const data = await response.json();
    
 
    if (response.ok && !data?.error) {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data.user);
      navigate("/dashboard/profile");
    } else {
      setMessage.error(data.error || "OTP verification failed");
    }
  } catch (error) {
    setMessage.error("An error occurred during verification");
  } finally {
    setWaiting(false);
  }
};



export const handleResetPassword =async(setWaiting,password,setMessage,navigate)=>{
    try {
      setWaiting(true);
      // Replace with your actual API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/reset?resetId=${resetId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({password })
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage.success("password changed login please")
        navigate("/login");
      } else {
        setMessage.error(data.error || "Authentication failed");
      }
    } catch (error) {
      setMessage.error("An error occurred during resent password");
    } finally {
      setWaiting(false);
    }
  }


export const handleSignIn = async (email, password, setMessage, e, navigate, setWaiting, setUser) => {
  try {
    setWaiting(true);
    // Replace with your actual API call
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setMessage.success("Login successfuly !")
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data.user);
      navigate("/dashboard/profile");
    } else {
      setMessage.error(data.error || "Authentication failed");
    }
  } catch (error) {
    setMessage.error("An error occurred during sign in");
  } finally {
    setWaiting(false);
  }
};

export const handleQuickLogin = async(setMessage,email,setWaiting)=>{
    if(!email){
      setMessage.error("Please fill email to get quick link")
    }
    else{
      try {
        setWaiting(true);
   
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/sendQuickLogin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({email })
        });
        
       let data = await response.json()
        if (response.ok) {
          setMessage.success("Link sent successfuly please check inbox")
        } else {
          setMessage.error("An error occurred while sending quick link");
        }
      } catch (error) {
        setMessage.error("An error occurred while sending quick link");
      } finally {
        setWaiting(false);
      }
    }
  }