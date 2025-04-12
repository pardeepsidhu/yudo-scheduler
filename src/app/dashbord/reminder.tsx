import { useState, useEffect } from "react"
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
import {
  Bell,
  Trash2,
  Calendar,
  Clock,
  Search,
  Plus,
  Loader2,
} from "lucide-react"
import { format } from "date-fns"

// Types
interface Reminder {
  _id: string
  jobId: string
  subject: string
  body: string
  scheduleTime: string
}

export default function RemindersComponent() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [filteredReminders, setFilteredReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState(Date.now())
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call to get reminders
    const mockReminders: Reminder[] = [
      {
        _id: "1",
        jobId: "job1",
        subject: "Project Deadline Reminder",
        body: "Don't forget to submit your project report by end of day.",
        scheduleTime: new Date(currentTime + 86400000).toISOString() // tomorrow
      },
      {
        _id: "2",
        jobId: "job2",
        subject: "Team Meeting",
        body: "Weekly team sync at 10:00 AM in the main conference room.",
        scheduleTime: new Date(currentTime - 3600000).toISOString() // 1 hour ago
      },
      {
        _id: "3",
        jobId: "job3",
        subject: "Dentist Appointment",
        body: "Reminder for your dental checkup at 3:30 PM.",
        scheduleTime: new Date(currentTime + 172800000).toISOString() // day after tomorrow
      },
      {
        _id: "4",
        jobId: "job4",
        subject: "Lunch with Client",
        body: "Meeting with ABC Corp representatives at Downtown Cafe.",
        scheduleTime: new Date(currentTime - 86400000).toISOString() // yesterday
      },
      {
        _id: "5",
        jobId: "job5",
        subject: "Renew Subscription",
        body: "Your software subscription is expiring soon. Please renew it.",
        scheduleTime: new Date(currentTime + 43200000).toISOString() // 12 hours from now
      }
    ]

    setTimeout(() => {
      setReminders(mockReminders)
      setFilteredReminders(mockReminders)
      setLoading(false)
    }, 1000) // Simulate loading delay

    // Update current time every 5 seconds
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Apply search filter
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredReminders(reminders)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = reminders.filter(reminder => 
        reminder.subject.toLowerCase().includes(query) || 
        reminder.body.toLowerCase().includes(query)
      )
      setFilteredReminders(filtered)
    }
  }, [searchQuery, reminders])

  const handleDelete = (id: string) => {
    setDeleteId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deleteId) {
      // Filter out the deleted reminder
      setReminders(reminders.filter(reminder => reminder.jobId !== deleteId))
      setDeleteDialogOpen(false)
    }
  }

  const handleViewReminder = () => {
    setViewDialogOpen(true)
  }

  const handleCreateReminder = () => {
    setCreateDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">My Reminders</h1>
        </div>
        <Button onClick={handleCreateReminder} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> New Reminder
        </Button>
      </div>

      <Card className="border shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">All Reminders</CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search reminders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm text-muted-foreground">Loading reminders...</p>
            </div>
          ) : filteredReminders.length > 0 ? (
            <div className="divide-y">
              {filteredReminders.map((reminder) => {
                const isPending = new Date(reminder.scheduleTime) > new Date(currentTime)
                return (
                  <div key={reminder._id} className="py-4">
                    <div 
                      className="group flex flex-col rounded-lg p-4 transition-colors hover:bg-slate-50 cursor-pointer"
                      onClick={handleViewReminder}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900">{reminder.subject}</h3>
                        <Badge variant={isPending ? "outline" : "default"} className="ml-2">
                          {isPending ? "Pending" : "Sent"}
                        </Badge>
                      </div>
                      
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(reminder.scheduleTime), "MMM d, yyyy")}
                        </span>
                        <Clock className="ml-2 h-4 w-4" />
                        <span>
                          {format(new Date(reminder.scheduleTime), "h:mm a")}
                        </span>
                      </div>
                      
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{reminder.body}</p>
                      
                      <div className="mt-3 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(reminder.jobId)
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
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No reminders found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery ? "Try changing your search terms." : "Create a new reminder to get started."}
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
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
          <p>Are you sure you want to delete this reminder? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Reminder Dialog (Empty) */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reminder Details</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">Reminder details would appear here.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Reminder Dialog (Empty) */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Reminder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">New reminder form would appear here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateDialogOpen(false)}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}