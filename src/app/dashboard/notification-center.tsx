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
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchNotifications } from '@/app/api/userApi';

// Notification interface
interface Notification {
  _id: string;
  title: string;
  createdAt: string;
  type: 'auth' | 'telegram' | 'yudo' | 'form';
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
      
      const response: NotificationsResponse | any = await fetchNotifications(options);
      setNotifications(response.data);
      
      const unreadNotifications = response.data.filter((notification: Notification) => !notification.read);
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
    const iconProps = { className: "h-5 w-5" };
    switch (type) {
      case 'form':
        return <FileText {...iconProps} style={{ color: '#10b981' }} />;
      case 'auth':
        return <AlertCircle {...iconProps} style={{ color: '#f59e0b' }} />;
      case 'telegram':
        return <MessageSquare {...iconProps} style={{ color: '#8b5cf6' }} />;
      case 'yudo':
        return <Check {...iconProps} style={{ color: '#3b82f6' }} />;
      default:
        return <Bell {...iconProps} style={{ color: '#64748b' }} />;
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
        return "/notifications/default.png";
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
      case 'form':
        return "Form";
      default:
        return "Notification";
    }
  };

  const getBadgeStyles = (type: string) => {
    const styles = {
      form: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        color: '#10b981',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        border: '1px solid'
      },
      auth: {
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        color: '#f59e0b',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        border: '1px solid'
      },
      telegram: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        color: '#8b5cf6',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        border: '1px solid'
      },
      yudo: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        color: '#3b82f6',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        border: '1px solid'
      },
      default: {
        backgroundColor: 'rgba(100, 116, 139, 0.1)',
        color: '#64748b',
        borderColor: 'rgba(100, 116, 139, 0.3)',
        border: '1px solid'
      }
    };
    return styles[type as keyof typeof styles] || styles.default;
  };

  const renderNotificationItem = (notification: Notification) => (
    <motion.div
      key={notification._id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mb-3"
    >
      <Card 
        className="cursor-pointer border-l-4 transition-all duration-300 hover:shadow-lg group"
        style={{
          borderRadius: '0.5rem',
          borderLeftColor: notification.read ? '#e2e8f0' : getBadgeStyles(notification.type).color,
          backgroundColor: notification.read ? '#ffffff' : 'rgba(248, 250, 252, 0.5)',
          borderTop: '1px solid rgba(226, 232, 240, 0.6)',
          borderRight: '1px solid rgba(226, 232, 240, 0.6)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.6)'
        }}
        onClick={() => handleNotificationClick(notification)}
      >
        <CardHeader className="p-4 pb-3">
          <div className="flex justify-between items-start gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div 
                className="flex-shrink-0 p-2 rounded-lg transition-all duration-200 group-hover:scale-110"
                style={{
                  backgroundColor: notification.read 
                    ? 'rgba(241, 245, 249, 0.8)' 
                    : `${getBadgeStyles(notification.type).backgroundColor}`
                }}
              >
                {getNotificationIcon(notification.type)}
              </div>
              <CardTitle 
                className="text-sm font-semibold truncate leading-tight"
                style={{
                  color: notification.read ? '#64748b' : '#0f172a'
                }}
              >
                {notification.title}
              </CardTitle>
            </div>
            <Badge 
              variant="outline" 
              className="text-xs font-semibold flex-shrink-0 px-2.5 py-1"
              style={{
                borderRadius: '0.375rem',
                ...getBadgeStyles(notification.type)
              }}
            >
              {getTypeLabel(notification.type)}
            </Badge>
          </div>
          <CardDescription 
            className="text-xs mt-2 font-medium ml-14"
            style={{ color: '#94a3b8' }}
          >
            {formatTimeAgo(notification.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 pl-14">
          <p 
            className="text-sm line-clamp-2 leading-relaxed"
            style={{
              color: notification.read ? '#64748b' : '#475569'
            }}
          >
            {notification.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderSkeletonLoader = () => (
    <div className="space-y-3">
      {[...Array(3)].map((_, index) => (
        <div 
          key={index} 
          className="flex items-start space-x-4 p-4" 
          style={{
            borderRadius: '0.5rem',
            backgroundColor: 'rgba(248, 250, 252, 0.8)',
            border: '1px solid rgba(226, 232, 240, 0.6)'
          }}
        >
          <Skeleton 
            className="h-12 w-12 flex-shrink-0" 
            style={{ borderRadius: '0.5rem' }} 
          />
          <div className="space-y-2.5 flex-1">
            <Skeleton className="h-4 w-full" style={{ borderRadius: '0.375rem' }} />
            <Skeleton className="h-4 w-4/5" style={{ borderRadius: '0.375rem' }} />
            <Skeleton className="h-3 w-3/5" style={{ borderRadius: '0.375rem' }} />
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
            className="relative transition-all duration-300 hover:shadow-lg group"
            style={{ 
              borderRadius: '0.5rem',
              borderColor: 'rgba(226, 232, 240, 0.8)'
            }}
            aria-label="Open notifications"
          >
            <Bell 
              className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" 
              style={{ color: '#64748b' }} 
            />
            {unreadCount > 0 && (
              <span 
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center text-xs font-bold text-white"
                style={{
                  borderRadius: '0.375rem',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  boxShadow: '0 2px 12px rgba(239, 68, 68, 0.5)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-full sm:w-80 md:w-96 p-0 shadow-2xl border" 
          style={{ 
            borderRadius: '1rem',
            borderColor: 'rgba(226, 232, 240, 0.8)',
            backgroundColor: '#ffffff'
          }}
          align="end"
          sideOffset={10}
        >
          <div 
            className="p-5 pb-4 border-b" 
            style={{ 
              borderColor: 'rgba(226, 232, 240, 0.8)',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)'
            }}
          >
            <h3 className="font-bold text-lg" style={{ color: '#0f172a' }}>
              Notifications
            </h3>
            <p className="text-xs mt-1.5 font-medium" style={{ color: '#94a3b8' }}>
              {unreadCount > 0 
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` 
                : 'All caught up! No new notifications'}
            </p>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-3 pt-3 pb-2" style={{ borderColor: 'rgba(226, 232, 240, 0.6)' }}>
              <TabsList 
                className="grid grid-cols-4 w-full h-10 p-1" 
                style={{ 
                  backgroundColor: 'rgba(248, 250, 252, 0.8)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(226, 232, 240, 0.5)'
                }}
              >
                <TabsTrigger 
                  value="all" 
                  className="text-xs font-semibold transition-all duration-200"
                  style={{ borderRadius: '0.375rem' }}
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="form" 
                  className="text-xs font-semibold transition-all duration-200"
                  style={{ borderRadius: '0.375rem' }}
                >
                  Form
                </TabsTrigger>
                <TabsTrigger 
                  value="auth" 
                  className="text-xs font-semibold transition-all duration-200"
                  style={{ borderRadius: '0.375rem' }}
                >
                  Auth
                </TabsTrigger>
                <TabsTrigger 
                  value="telegram" 
                  className="text-xs font-semibold transition-all duration-200"
                  style={{ borderRadius: '0.375rem' }}
                >
                  Msgs
                </TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="h-96">
              <div className="p-4">
                <AnimatePresence>
                  {loading ? (
                    renderSkeletonLoader()
                  ) : notifications.length > 0 ? (
                    notifications.map(renderNotificationItem)
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center justify-center h-48 text-center"
                    >
                      <div 
                        className="w-20 h-20 flex items-center justify-center mb-4"
                        style={{
                          borderRadius: '1rem',
                          backgroundColor: 'rgba(248, 250, 252, 0.9)',
                          border: '2px solid rgba(226, 232, 240, 0.8)'
                        }}
                      >
                        <Bell className="h-10 w-10" style={{ color: '#cbd5e1' }} />
                      </div>
                      <p className="text-sm font-semibold" style={{ color: '#64748b' }}>
                        No notifications found
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#94a3b8' }}>
                        You're all caught up!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </Tabs>
          
          <div 
            className="p-3 border-t flex justify-center" 
            style={{ 
              borderColor: 'rgba(226, 232, 240, 0.6)',
              backgroundColor: 'rgba(248, 250, 252, 0.3)'
            }}
          >
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs font-semibold transition-all duration-200"
              style={{ 
                borderRadius: '0.5rem',
                color: '#64748b'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                e.currentTarget.style.color = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              Mark all as read
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Notification Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg" style={{ borderRadius: '1rem' }}>
          {selectedNotification && (
            <>
              <DialogHeader>
                <DialogTitle 
                  className="flex items-center gap-3 text-lg font-bold" 
                  style={{ color: '#0f172a' }}
                >
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${getBadgeStyles(selectedNotification.type).backgroundColor}` }}
                  >
                    {getNotificationIcon(selectedNotification.type)}
                  </div>
                  {selectedNotification.title}
                </DialogTitle>
                <DialogDescription className="text-xs mt-2 font-medium" style={{ color: '#94a3b8' }}>
                  {formatTimeAgo(selectedNotification.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start py-6">
                <div className="w-full sm:w-2/5 flex justify-center">
                  <div 
                    className="p-6 w-full"
                    style={{
                      borderRadius: '1rem',
                      backgroundColor: 'rgba(248, 250, 252, 0.8)',
                      border: '2px solid rgba(226, 232, 240, 0.6)'
                    }}
                  >
                    <img 
                      src={getNotificationImage(selectedNotification.type)} 
                      alt={`${selectedNotification.type} notification`}
                      className="w-full h-auto object-contain"
                      style={{ borderRadius: '0.5rem' }}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-3/5">
                  <Badge 
                    className="font-semibold mb-4 px-3 py-1.5"
                    style={{
                      borderRadius: '0.5rem',
                      ...getBadgeStyles(selectedNotification.type)
                    }}
                  >
                    {getTypeLabel(selectedNotification.type)}
                  </Badge>
                  <p 
                    className="text-sm leading-relaxed" 
                    style={{ color: '#475569' }}
                  >
                    {selectedNotification.description}
                  </p>
                </div>
              </div>
              
              <div 
                className="flex justify-end gap-3 mt-2 pt-5 border-t" 
                style={{ borderColor: 'rgba(226, 232, 240, 0.6)' }}
              >
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="font-semibold transition-all duration-200"
                  style={{ 
                    borderRadius: '0.5rem',
                    color: '#64748b',
                    borderColor: 'rgba(203, 213, 225, 0.6)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(248, 250, 252, 0.9)';
                    e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(203, 213, 225, 0.6)';
                  }}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setIsDialogOpen(false);
                  }}
                  className="font-semibold transition-all duration-300"
                  style={{ 
                    borderRadius: '0.5rem',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                  }}
                >
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