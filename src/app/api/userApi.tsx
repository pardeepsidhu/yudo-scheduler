

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
      throw new Error('Authentication token not found');
    }
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/get`, {
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch task');
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
      console.log("this is token: " + token);
      
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
      console.log(data);
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