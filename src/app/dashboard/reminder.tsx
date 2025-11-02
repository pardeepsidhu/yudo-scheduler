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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  RefreshCw,
  Sparkles,
  FileText,
  CalendarDays,
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
  // sent ?:boolean;
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
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteReminderData, setDeleteReminderData] = useState<{ id: string, subject: string } | null>(null)
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
    setIsLoading(true)
    if (reset) {
      setPage(1)
      setReminders([])
    }

    try {
      const token = getToken()
      const currentPage = reset ? 1 : page

      // Import API functions dynamically
      const { getAllReminders } = await import("../api/reminderService")

      const result: any = await getAllReminders(token, currentPage, pageSize, activeTab)

      if (result.error) {
        showMessage(result.error, "error")
      } else {
        setTotal(result.total)

        // Calculate the new reminders array
        const newReminders = reset ? result.emails : [...reminders, ...result.emails]

        // Set reminders state
        setReminders(newReminders)


        // Use the calculated array length directly when setting hasMore
        setHasMore(newReminders.length < result.total)

        if (reset) {
          setPage(2) // Set to 2 for next fetch
        } else {
          setPage(currentPage + 1)
        }
      }
    } catch (error) {

      showMessage("Error loading reminders", "error")
    } finally {
      setInitialLoading(false)
      setIsLoading(false)
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

      const result: any = await scheduleEmail(newReminder, token, setAiPrompt)

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

      const result: any = await deleteReminder(deleteReminderData.id, token)

      if (result.error) {

        showMessage(result.error, "error")
      } else {
        showMessage("Reminder deleted successfully!", "success")
        setReminders(reminders.filter(r => r.jobId !== deleteReminderData.id))
        setDeleteDialogOpen(false)
      }
    } catch (error) {
      if (error)
        showMessage("Failed to delete reminder. Please try again.", "error")
    } finally {
      setWaiting(false)
    }
  }

  const handleViewReminder = (reminder: Reminder) => {
    console.log("thisis curre", currentReminder)
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

  const handleRefresh = () => {
    setIsLoading(true)

    setIsLoading(false)
  }

  return (
    <div className="container mx-auto    border-1 "   >
      {/* Header with title and new reminder button */}
      <div className=" py-2 sm:py-6 mb-2  px-4 rounded-b-none border-1    bg-white flex-col sm:flex-row justify-between items-center hidden md:flex">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <Bell className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Reminders</h1>
          {!initialLoading && reminders.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {reminders.length} of {total}
            </Badge>
          )}
        </div>
        <div className="flex gap-3 ">

          <Button onClick={handleCreateReminder} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> New Reminder
          </Button>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full "
            title="Refresh"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (

              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

        </div>
      </div>

      {/* Notification message */}
      {message && (
        <div className={`mb-4 p-3 rounded-sm rounded-t-none flex items-center ${messageType === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
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
      <Card className="border shadow-lg rounded-t-none py-2 py-4 gap-1  sm:gap-3" >
        <CardHeader className="pb-1 sm:pb-3 space-y-4 px-2 sm-px-6 gap-none gap-0">
          <div className="flex justify-between items-center md:hidden">
            <div className="flex items-center gap-3">
              <Button onClick={handleCreateReminder}  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-sm">
                <Plus className="mr-2 h-4 w-4" /> New Reminder
              </Button>
              {!initialLoading && reminders.length > 0 && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-medium rounded-sm">
                  {reminders.length} of {total}
                </Badge>
              )}
            </div>

            <button
              onClick={handleRefresh}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 flex items-center gap-1"
              title="Refresh"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <div className="text-sm font-medium flex items-center gap-1">
                  Refresh <RefreshCw className="w-4 h-4" />
                </div>
              )}
            </button>
          </div>

          <div className="w-full">
            <Tabs defaultValue="all" className="w-full rounded-sm" onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1 rounded-sm h-[content] rounded-sm">
                <TabsTrigger
                  value="all"
                  className="flex items-center justify-center py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 rounded-sm"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="flex items-center justify-center py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 rounded-sm"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Pending
                </TabsTrigger>
                <TabsTrigger
                  value="sent"
                  className="flex items-center justify-center py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 rounded-sm"
                >
                  <MailCheck className="mr-2 h-4 w-4" />
                  Sent
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="px-3">
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
                  const isPending = reminder.status === "pending"
                  const formatted = formatDateTime(reminder.scheduleTime)

                  return (
                    <div key={reminder._id} className="py-0 sm:py-4">
                      <div
                        className="group flex flex-col rounded-sm p-1 py-2 sm:p-4 transition-colors hover:bg-slate-50 cursor-pointer"
                        onClick={() => handleViewReminder(reminder)}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-900 line-clamp-1">{reminder.subject}</h3>
                          <Badge variant={isPending ? "outline" : "default"} className="ml-2 shrink-0">
                            {isPending ? "Pending" : "Sent"}
                          </Badge>
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                          <Calendar className="h-4 w-4 shrink-0" />
                          <span>{formatted.date}</span>
                          <Clock className="ml-2 h-4 w-4 shrink-0" />
                          <span>{formatted.time}</span>
                        </div>

                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{reminder.body}</p>

                        <div className="mt-1 flex justify-between items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary rounded-sm"
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
                            className="text-destructive hover:bg-destructive/10 rounded-sm"
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
                      {/* <Separator className="mt-2" /> */}
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
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} >
        <DialogContent className="sm:max-w-md rounded-sm">
          <DialogHeader>
            <DialogTitle>Reminder Details</DialogTitle>
          </DialogHeader>
          {currentReminder && (
            <div className="py-4 space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <Badge variant={currentReminder.status == "sent" ? "default" : "outline"}>
                    {currentReminder?.status === "sent" ? "Sent" : "Pending"}
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
                <div className="mt-1 p-3 bg-gray-50 rounded-sm max-h-48 overflow-y-auto">
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
        <DialogContent className="sm:max-w-md max-h-[90vh] bg-white rounded-sm shadow-2xl border-0 p-0 overflow-hidden">
          {/* Gradient Header */}
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 sticky top-0 z-10">
            <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Create New Reminder
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-3 sm:px-4  sm:py-4">
            <form onSubmit={handleCreateReminderSubmit} className="space-y-5">
              {/* AI Generation Section with subtle gradient */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-sm border border-blue-100 shadow-sm space-y-2">
                <Label htmlFor="aiPrompt" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Generate with AI
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="aiPrompt"
                    placeholder="Type what reminder you need..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="border border-blue-200 rounded-sm focus:outline-none focus:ring-0 focus:border-blue-200"
                  />

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => generateAIContent(aiPrompt, setNewReminder, setWaiting, setMessage, newReminder)}
                    disabled={!aiPrompt || waiting}
                    className={`h-10 px-3 flex-shrink-0 ${!aiPrompt || waiting ? 'bg-gray-200 text-gray-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90'}`}
                  >
                    {waiting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Lightbulb className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {message && <p className="text-xs text-red-600 font-medium">{message}</p>}
              </div>

              {/* Subject with icon */}
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="Enter reminder subject"
                  value={newReminder.subject}
                  onChange={(e) => setNewReminder({ ...newReminder, subject: e.target.value })}
                  className="border border-gray-300 rounded-sm focus:outline-none focus:ring-0 focus:border-gray-300"
                  required
                />

              </div>

              {/* Date and Time with icon */}
              <div className="space-y-2">
                <Label htmlFor="scheduledTime" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-blue-500" />
                  Schedule Date and Time
                </Label>
                <Input
                  id="scheduledTime"
                  type="datetime-local"
                  value={newReminder.scheduledTime}
                  onChange={(e) => setNewReminder({ ...newReminder, scheduledTime: e.target.value })}
                  className="border border-gray-300 rounded-sm focus:outline-none focus:ring-0 focus:border-gray-300"
                  required
                />
              </div>

              {/* Message with icon */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Enter your reminder message"
                  value={newReminder.message}
                  onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                  className="h-24 border border-gray-300 rounded-sm resize-none focus:outline-none focus:ring-0 focus:border-gray-300"
                  required
                />

              </div>
            </form>
          </div>

          {/* Footer with gradient button - sticky at bottom */}
          <DialogFooter className="px-2 sm:px-4 py-4 bg-gray-50 border-t border-gray-100 sticky bottom-0 z-10 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={waiting}
              className="px-4 py-2 rounded-sm text-gray-700 bg-white hover:bg-gray-50 border border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateReminderSubmit}
              disabled={waiting || !newReminder.subject || !newReminder.message || !newReminder.scheduledTime}
              className={`px-4 py-2 rounded-sm flex items-center gap-2 ${waiting || !newReminder.subject || !newReminder.message || !newReminder.scheduledTime ? 'bg-gray-200 text-gray-500' : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:opacity-90'}`}
            >
              {waiting ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>Create Reminder</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}