/**
 * API service for reminder operations
 */

/**
 * Get all reminders with pagination and filtering
 * @param {string} token - Auth token
 * @param {number} page - Page number (starts at 1)
 * @param {number} pageSize - Number of items per page
 * @param {string} status - Filter by status ('all', 'pending', or 'sent')
 * @returns {Promise<Object>} - Response containing emails array and total count
 */
export const getAllReminders = async (token, page, pageSize, status = 'all') => {
    // console.log("this isd "+process.env)
    try {
      let endpoint;
      // Calculate skip value for pagination
      if(page && pageSize){
      const skip = (page - 1) * pageSize;
      endpoint  = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/email/getall?limit=${pageSize}&skip=${skip}`;
      }
     else{
      endpoint  = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/email/getall`;
     }
      let t = JSON.parse(token)

      // Add status filter if not 'all'
      if (status === 'pending' || status === 'sent') {
        endpoint += `&status=${status}`;
      }
      
      const response = await fetch(endpoint, {
        headers: {
          "auth-token": t.token
        }
      });
      const data = await response.json();
  
      if (data.error) {
        return { error: data.error };
      }
      
      return {
        emails: data.emails || [],
        total: data.total || 0
      };
    } catch (error) {
      console.log(error)
      return { error: "Failed to fetch reminders. Please try again." };
    }
  };
  
  /**
   * Schedule a new email reminder
   * @param {Object} emailDetails - Email details object
   * @param {string} token - Auth token
   * @returns {Promise<Object>} - Response containing success or error message
   */
  export const scheduleEmail = async (emailDetails, token,setAIPrompt) => {
    try {
      let t =JSON.parse(token);
      // console.log("JFg",emailDetails.scheduledTime)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/email/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": t.token
        },
        body: JSON.stringify({
          subject: emailDetails.subject,
          body: emailDetails.message,
          scheduleTime: emailDetails.scheduledTime 
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        return { error: data.error };
      }
      setAIPrompt("")
      return { success: true, message: "Successfully scheduled!" };
    } catch (error) {
      return { error: "Failed to schedule reminder. Please try again." };
    }
  };
  
  /**
   * Delete an email reminder
   * @param {string} jobId - ID of the job to delete
   * @param {string} token - Auth token
   * @returns {Promise<Object>} - Response containing success or error message
   */
  export const deleteReminder = async (jobId, token) => {
    try {
      let t = JSON.parse(token)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/email/delete/${jobId}`, {
        method: "DELETE",
        headers: {
          "auth-token": t.token
        }
      });
      
      const data = await response.json();
      
      if (data.error) {
        return { error: data.error };
      }
      
      return { success: true, message: "Deleted successfully!" };
    } catch (error) {
      return { error: "Failed to delete reminder. Please try again." };
    }
  };


  export const generateAIContent = async (aiPrompt,setEmailDetails,setWaiting,setMessage,EmailDetails) => {
    try {
        setWaiting(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/email/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: aiPrompt 
        }),
      });
      const data = await response.json();
      // console.log(data)
    if(data.error){
        setMessage(data.error)
    }
    else{
        let {message,subject}=data;
        setEmailDetails({scheduledTime:EmailDetails.scheduledTime,message,subject})
    }
    } catch (error) {
        // console.log(error)
     setMessage("Some Error Accured While Genrating AI Content !")
    }
    finally{
        setWaiting(false)
    }
  };

