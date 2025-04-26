import { useState, useEffect } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs,  TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Bell,
  Trash2,
  Calendar,
  Clock,
  Plus,
  Loader2,
  Eye,
  Mail,
  MailCheck,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Columns,
  Loader,
} from "lucide-react"
import { format } from "date-fns"
import { generateAIContent } from "../api/reminderService"
// Types
interface Reminder {
  status: string;
  _id: string;
  to: string;
  subject: string;
  body: string;
  scheduleTime: string; // ISO 8601 format
  jobId: string;
  createdAt: string;    // ISO 8601 format
  updatedAt: string;    // ISO 8601 format
}

export default function RemindersComponent() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "sent">("all")
  const [aiPrompt,setAiPrompt]=useState<string>('');

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteReminderData, setDeleteReminderData] = useState<{id: string, subject: string} | null>(null)
  const [currentReminder, setCurrentReminder] = useState<Reminder | null>(null)
  
  // Form state for creating new reminder
  const [newReminder, setNewReminder] = useState({
    subject: "",
    message: "",
    scheduledTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16) // Default to tomorrow
  })
  const [waiting, setWaiting] = useState(false)

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("user") || ""
  }

  // Load initial reminders
  useEffect(() => {
    fetchReminders(true)
  }, [activeTab])

 
  // Fetch reminders from API
  const fetchReminders = async (reset = false) => {
    console.log("fetcherd")
    if (reset) {
      setPage(1)
      setReminders([])
    }
    
    try {
      const token = getToken()
      const currentPage = reset ? 1 : page
      
      // Import API functions dynamically
      const { getAllReminders } = await import("../api/reminderService")
      
      const result = await getAllReminders(token, currentPage, pageSize, activeTab)
      
      if (result.error) {
        showMessage(result.error, "error")
      } else {
        setTotal(result.total)
        
        // Calculate the new reminders array
        const newReminders = reset ? result.emails : [...reminders, ...result.emails]
        
        // Set reminders state
        setReminders(newReminders)
        
        console.log("lengths : " + newReminders.length + " " + result.total)
        
        // Use the calculated array length directly when setting hasMore
        setHasMore(newReminders.length < result.total)
        
        if (reset) {
          setPage(2) // Set to 2 for next fetch
        } else {
          setPage(currentPage + 1)
        }
      }
    } catch (error) {
      if (error);
      showMessage("Error loading reminders", "error")
    } finally {
      setInitialLoading(false)
    }
  }

  // Handle create reminder
  const handleCreateReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setWaiting(true)
    
    try {
      const token = getToken()
      
      // Import API functions dynamically
      const { scheduleEmail } = await import("../api/reminderService")
      
      const result = await scheduleEmail(newReminder, token,setAiPrompt)
      
      if (result.error) {
        showMessage(result.error, "error")
      } else {
        showMessage("Reminder scheduled successfully!", "success")
        setCreateDialogOpen(false)
        setNewReminder({
          subject: "",
          message: "",
          scheduledTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
        })
        fetchReminders(true)
      }
    } catch (error) {
      showMessage("Failed to schedule reminder. Please try again.", "error")
    } finally {
      setWaiting(false)
    }
  }

  const handleDelete = (jobId: string, subject: string) => {
    setDeleteReminderData({ id: jobId, subject })
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteReminderData) return
    
    setWaiting(true)
    try {
      const token = getToken()
      
      // Import API functions dynamically
      const { deleteReminder } = await import("../api/reminderService")
      
      const result = await deleteReminder(deleteReminderData.id, token)
      
      if (result.error) {

        showMessage(result.error, "error")
      } else {
        showMessage("Reminder deleted successfully!", "success")
        setReminders(reminders.filter(r => r.jobId !== deleteReminderData.id))
        setDeleteDialogOpen(false)
      }
    } catch (error) {
      if(error)
      showMessage("Failed to delete reminder. Please try again.", "error")
    } finally {
      setWaiting(false)
    }
  }

  const handleViewReminder = (reminder: Reminder) => {
    setCurrentReminder(reminder)
    setViewDialogOpen(true)
  }

  const handleCreateReminder = () => {
    setCreateDialogOpen(true)
  }

  const showMessage = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg)
    setMessageType(type)
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage("")
    }, 5000)
  }

  // Helper for formatting dates
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: format(date, "MMM d, yyyy"),
      time: format(date, "h:mm a")
    }
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as "all" | "pending" | "sent")
  }

  return (
    <div   className="container mx-auto  p-1 sm:p-2 md::p-4 rounded-2xl border-1 "   >
      {/* Header with title and new reminder button */}
      <div className=" py-2 sm:py-6 mb-2  px-4  rounded-2xl rounded-b-none border-1 flex   bg-white flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <Bell className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Reminders</h1>
          {!initialLoading && reminders.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {reminders.length} of {total}
            </Badge>
          )}
        </div>
        <Button onClick={handleCreateReminder} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> New Reminder
        </Button>
      </div>

      {/* Notification message */}
      {message && (
        <div className={`mb-4 p-3 rounded-md rounded-t-none flex items-center ${
          messageType === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
        }`}>
          {messageType === "error" ? (
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
          )}
          {message}
        </div>
      )}

      {/* Main card with reminder list */}
      <Card className="border shadow-lg rounded-t-none" >
        <CardHeader className="pb-1 sm:pb-3">
          <CardTitle className="text-xl">All Reminders</CardTitle>
          
          {/* Tabs for filtering */}
          <div className="mt-2 sm:mt-4">
            <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  All
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Pending
                </TabsTrigger>
                <TabsTrigger value="sent" className="flex items-center">
                  <MailCheck className="mr-2 h-4 w-4" />
                  Sent
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          {initialLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">Loading reminders...</p>
            </div>
          ) : reminders.length > 0 ? (
            // <div   style={{ height: "600px", overflow: "auto" }}>
            <InfiniteScroll
              dataLength={reminders.length}
              next={fetchReminders}
              hasMore={hasMore}
              loader={
                <div className="flex flex-col items-center">
                <Loader size={32} className="animate-spin text-blue-600 mb-2" />
                <p className="text-gray-600">Loading Reminders...</p>
              </div>
              }
              endMessage={
                <p className="text-center text-sm text-muted-foreground py-4">
                  {reminders.length >= total && "No more reminders to load"}
                </p>
              }
              scrollableTarget="scrollableDiv"
            >
              <div className="divide-y">
                {reminders.map((reminder) => {
                  const isPending = reminder.status==="pending"
                  const formatted = formatDateTime(reminder.scheduleTime)
                  
                  return (
                    <div key={reminder._id} className="py-1 sm:py-4">
                      <div 
                        className="group flex flex-col rounded-lg p-1 py-2 sm:p-4 transition-colors hover:bg-slate-50 cursor-pointer"
                        onClick={() => handleViewReminder(reminder)}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-900 line-clamp-1">{reminder.subject}</h3>
                          <Badge variant={isPending ? "outline" : "default"} className="ml-2 shrink-0">
                            {isPending ? "Pending" : "Sent"}
                          </Badge>
                        </div>
                        
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                          <Calendar className="h-4 w-4 shrink-0" />
                          <span>{formatted.date}</span>
                          <Clock className="ml-2 h-4 w-4 shrink-0" />
                          <span>{formatted.time}</span>
                        </div>
                        
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{reminder.body}</p>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewReminder(reminder)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(reminder.jobId, reminder.subject)
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      <Separator className="mt-2" />
                    </div>
                  )
                })}
              </div>
            </InfiniteScroll>
            // </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No reminders found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {activeTab !== "all" 
                  ? `You don't have any ${activeTab === "pending" ? "pending" : "sent"} reminders.` 
                  : "Create a new reminder to get started."}
              </p>
              {activeTab !== "all" && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab("all")}
                >
                  View All Reminders
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reminder</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p>Are you sure you want to delete this reminder?</p>
            {deleteReminderData && (
              <p className="mt-2 font-medium">{deleteReminderData.subject}</p>
            )}
            <p className="mt-4 text-sm text-red-600">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={waiting}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={waiting}
            >
              {waiting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Reminder Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reminder Details</DialogTitle>
          </DialogHeader>
          {currentReminder && (
            <div className="py-4 space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <Badge variant={currentReminder.sent ? "default" : "outline"}>
                    {currentReminder.sent ? "Sent" : "Pending"}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Subject</Label>
                <p className="mt-1 font-medium">{currentReminder.subject}</p>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Scheduled For</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDateTime(currentReminder.scheduleTime).date}</span>
                  <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                  <span>{formatDateTime(currentReminder.scheduleTime).time}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Message</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md max-h-48 overflow-y-auto">
                  <p className="whitespace-pre-wrap">{currentReminder.body}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                if (currentReminder) {
                  handleDelete(currentReminder.jobId, currentReminder.subject)
                  setViewDialogOpen(false)
                }
              }}
              className="hidden sm:flex"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Reminder Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Create New Reminder</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleCreateReminderSubmit}>
      <div className="py-4 space-y-4">
        {/* AI Generation Section at the top */}
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200 space-y-2">
          <Label htmlFor="aiPrompt" className="text-sm font-medium">Generate with AI</Label>
          <div className="flex items-center gap-2">
            <Input
              id="aiPrompt"
              placeholder="Type what reminder you need..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <Button 
              type="button" 
              size="sm" 
              onClick={() => generateAIContent(aiPrompt, setNewReminder, setWaiting, setMessage, newReminder)}
              disabled={!aiPrompt || waiting}
            >
            
              {waiting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb fontSize="small" />
              )}
            </Button>
          </div>
          {message && <p className="text-xs text-red-500">{message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Enter reminder subject"
            value={newReminder.subject}
            onChange={(e) => setNewReminder({...newReminder, subject: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="scheduledTime">Schedule Date and Time</Label>
          <Input
            id="scheduledTime"
            type="datetime-local"
            value={newReminder.scheduledTime}
            onChange={(e) => setNewReminder({...newReminder, scheduledTime: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Enter your reminder message"
            value={newReminder.message}
            onChange={(e) => setNewReminder({...newReminder, message: e.target.value})}
            className="min-h-32"
            required
          />
        </div>
      </div>
      
      <DialogFooter className="justify-start">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCreateDialogOpen(false)}
          disabled={waiting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={waiting || !newReminder.subject || !newReminder.message || !newReminder.scheduledTime}
        >
          {waiting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>Create Reminder</>
          )}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
    </div>
  )
}