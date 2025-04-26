// components/NotificationCenter.tsx
import { useState, useEffect } from 'react';
import { Bell, AlertCircle, Check, FileText, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchNotifications } from '@/app/api/userApi';

// Notification interface
interface Notification {
  _id: string;
  title: string;
  createdAt: string;
  type: 'auth' | 'telegram' | 'yudo';
  description: string;
  user: string;
  read: boolean;
}

interface NotificationsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Notification[];
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  useEffect(() => {
    loadNotifications();
    
    // Poll for new notifications every minute
    const interval = setInterval(() => {
      loadNotifications();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [activeTab]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const options: any = { limit: 10 };
      
      if (activeTab !== 'all') {
        options.type = activeTab;
      }
      
      const response: NotificationsResponse = await fetchNotifications(options);
      setNotifications(response.data);
      
      // Count unread notifications
      const unreadNotifications = response.data.filter(notification => !notification.read);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDialogOpen(true);
    setIsPopoverOpen(false);
    
    // Mark as read logic would go here
    // markNotificationAsRead(notification._id);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return format(date, 'MMM d, yyyy');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'form':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'auth':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'telegram':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'yudo':
        return <Check className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNotificationImage = (type: string) => {
    switch (type) {
      case 'auth':
        return "/notifications/auth.png";
      case 'telegram':
        return "/images/notification-telegram.svg";
      case 'yudo':
        return "/notifications/auth.png";
      default:
        // return "/images/notification-default.svg";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'auth':
        return "Authentication";
      case 'telegram':
        return "Message";
      case 'yudo':
        return "Task";
      default:
        return "Notification";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'auth':
        return "bg-yellow-100 text-yellow-800";
      case 'telegram':
        return "bg-green-100 text-green-800";
      case 'yudo':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderNotificationItem = (notification: Notification) => (
    <motion.div
      key={notification._id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="mb-2"
    >
      <Card 
        className={`cursor-pointer border-l-4 ${notification.read ? 'border-l-gray-300' : 'border-l-blue-500'} hover:bg-gray-50 transition-colors`}
        onClick={() => handleNotificationClick(notification)}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {getNotificationIcon(notification.type)}
              <CardTitle className="text-sm font-medium">{notification.title}</CardTitle>
            </div>
            <Badge variant="outline" className={`text-xs ${getTypeBadgeColor(notification.type)}`}>
              {getTypeLabel(notification.type)}
            </Badge>
          </div>
          <CardDescription className="text-xs text-gray-500">
            {formatTimeAgo(notification.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm line-clamp-2">{notification.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderSkeletonLoader = () => (
    <div className="space-y-3">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="flex items-start space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative"
            aria-label="Open notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-full sm:w-80 md:w-96 p-0" 
          align="end"
          sideOffset={5}
        >
          <div className="p-4 pb-2 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-xs text-gray-500">
              {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'No new notifications'}
            </p>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b p-1">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="form">Form</TabsTrigger>
                <TabsTrigger value="auth">Auth</TabsTrigger>
                <TabsTrigger value="telegram">Msgs</TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="h-80">
              <div className="p-4">
                {loading ? (
                  renderSkeletonLoader()
                ) : notifications.length > 0 ? (
                  notifications.map(renderNotificationItem)
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <Bell className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">No notifications found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Tabs>
          
          <div className="p-2 border-t flex justify-center">
            <Button variant="ghost" size="sm" className="text-xs">
              Mark all as read
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Notification Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedNotification && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getNotificationIcon(selectedNotification.type)}
                  {selectedNotification.title}
                </DialogTitle>
                <DialogDescription>
                  {formatTimeAgo(selectedNotification.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center py-4">
                <div className="w-full sm:w-1/3 flex justify-center">
                  <img 
                    src={getNotificationImage(selectedNotification.type)} 
                    alt={`${selectedNotification.type} notification`}
                    className="h-32 w-32 object-contain"
                  />
                </div>
                <div className="w-full sm:w-2/3">
                  <Badge className={getTypeBadgeColor(selectedNotification.type)}>
                    {getTypeLabel(selectedNotification.type)}
                  </Badge>
                  <p className="mt-4 text-sm">{selectedNotification.description}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  // Action to take based on notification type
                  setIsDialogOpen(false);
                }}>
                  Take Action
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

