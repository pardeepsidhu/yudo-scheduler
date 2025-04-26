'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchNotifications } from '../api/userApi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Bell, MessageSquare, ShieldAlert, Check, X, RefreshCw } from "lucide-react";

// Interface for Notification
interface Notification {
  _id: string;
  title: string;
  createdAt: string;
  type: 'form' | 'auth' | 'telegram' | 'yudo';
  description: string;
  user: string;
}


// Custom Toast component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const bgColor = type === 'error' ? 'bg-red-100 text-red-700 border-red-200' : 
                  type === 'success' ? 'bg-green-100 text-green-700 border-green-200' :
                  'bg-blue-100 text-blue-700 border-blue-200';
  
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md border ${bgColor} flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-5`}>
      {type === 'error' && <AlertCircle className="h-5 w-5" />}
      {type === 'success' && <Check className="h-5 w-5" />}
      {type === 'info' && <Bell className="h-5 w-5" />}
      <p>{message}</p>
      <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700">×</button>
    </div>
  );
};

// Interface for Toast
interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function FullscreenNotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [filterType, setFilterType] = useState<'form' | 'auth' | 'telegram' | 'yudo' | ''>('');
  const observer = useRef<IntersectionObserver | null>(null);

  // Custom toast function
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Function to fetch notifications
  const loadNotifications = useCallback(async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const options: any = {
        limit: 10,
        page: pageNum,
      };
      
      if (filterType) options.type = filterType;
    
      
      const result = await fetchNotifications(options);
      
      if (!result || !result.success) {
        throw new Error(result?.error || 'Failed to fetch notifications');
      }
      
      // Align with backend response structure
      const newNotifications = result.data || [];
      const totalPagesCount = result.pages || 1;
      
      setNotifications(prev => reset ? newNotifications : [...prev, ...newNotifications]);
      setTotalPages(totalPagesCount);
      setHasMore(pageNum < totalPagesCount);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [notifications, filterType]);

  // Initial load
  useEffect(() => {
    loadNotifications(1, true);
  }, [filterType]); // Reset and load when filters change

  // Setup intersection observer for infinite scroll
  const lastNotificationRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Load more notifications when page changes
  useEffect(() => {
    if (page > 1) {
      loadNotifications(page, false);
    }
  }, [page]);



  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification) return;
    setSelectedNotification(notification);
    
  };

  // Function to get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'auth':
        return <ShieldAlert className="h-6 w-6 text-purple-500" />;
      case 'telegram':
        return <MessageSquare className="h-6 w-6 text-blue-600" />;
      case 'yudo':
        return <Bell className="h-6 w-6 text-yellow-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setPage(1);
    loadNotifications(1, true);
  };

  // Handle filter changes
  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPage(1);
    setFilterType(e.target.value as any);
  };


  return (
    <div className="w-full h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast 
            key={toast.id} 
            message={toast.message} 
            type={toast.type} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>
      
      {/* Header */}
      <header className="p-4 border-b bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications
          </h1>

          <div className="flex gap-2 lg:hidden">
  <Button onClick={handleRefresh} variant="ghost" size="sm">
    Refresh
    {loading ? <RefreshCw className='animate-spin h-5'/> :<RefreshCw className='h-5'/>} 
  </Button>
</div>
          
          <div className="hidden lg:flex gap-2 items-center ">

          <div className="w-65">
          <label className="block text-sm font-medium mb-1">Filter by Type</label>
          <select 
            className="w-full p-2 border rounded-md bg-transparent dark:text-white"
            value={filterType}
            onChange={handleTypeFilterChange}
          >
            <option value="">All Types</option>
            <option value="auth">Authentication</option>
            <option value="telegram">Telegram</option>
            <option value="yudo">Yudo-Scheduler</option>
          </select>
        </div>

            <Button onClick={handleRefresh} variant="ghost" size="sm">
              Refresh
              {loading ? <RefreshCw className='animate-spin h-5'/> :<RefreshCw className='h-5'/>} 
            </Button>
          </div>
        </div>
      </header>
      
      {/* Filters */}
      <div className="container flex lg:hidden mx-auto p-4 flex-col md:flex-row gap-4 bg-white dark:bg-gray-800 shadow-sm mb-4">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <label className="block text-sm font-medium mb-1">Filter by Type</label>
          <select 
            className="w-full p-2 border rounded-md bg-transparent dark:text-white"
            value={filterType}
            onChange={handleTypeFilterChange}
          >
            <option value="">All Types</option>
            <option value="auth">Authentication</option>
            <option value="telegram">Telegram</option>
            <option value="yudo">Yudo-Scheduler</option>
          </select>
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-1 container lg:overflow-hidden mx-auto p-4 flex">
        {/* Notifications list */}
        <div className="w-full lg:w-1/2 h-full overflow-hidden lg:overflow-auto flex flex-col">
          <h2 className="text-xl font-semibold mb-4">
            {filterType ? `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} Notifications` : 'All Notifications'}
          </h2>
          
          {error && (
            <div className="p-4 mb-4 bg-red-50 text-red-500 rounded-md flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
          
          {/* <ScrollArea className="flex-1"> */}
            {(!notifications || notifications.length === 0) && !loading ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                <Bell className="h-12 w-12 mb-4 opacity-20" />
                <p>No notifications found</p>
              </div>
            ) : (
              <div className="space-y-3 p-2">
                {notifications && notifications.map((notification, index) => {
                  const isLastItem = index === notifications.length - 1;
                  return (
                    <Card
                      key={notification._id}
                      ref={isLastItem ? lastNotificationRef : null}
                      className={`cursor-pointer transition-all hover:shadow-md 
                         ${selectedNotification?._id === notification._id ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {getNotificationIcon(notification.type)}
                            <CardTitle className="text-base">{notification.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="py-0 px-4">
                        <CardDescription className="line-clamp-2">
                          {notification.description}
                        </CardDescription>
                      </CardContent>
                      <CardFooter className="py-2 px-4 text-xs text-muted-foreground">
                        {formatDate(notification.createdAt)}
                      </CardFooter>
                    </Card>
                  );
                })}
                
                {loading && (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Card key={`skeleton-${i}`}>
                        <CardHeader className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-4 w-40" />
                          </div>
                        </CardHeader>
                        <CardContent className="py-0 px-4">
                          <Skeleton className="h-3 w-full mb-1" />
                          <Skeleton className="h-3 w-3/4" />
                        </CardContent>
                        <CardFooter className="py-2 px-4">
                          <Skeleton className="h-3 w-24" />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
                
                {!hasMore && notifications && notifications.length > 0 && (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    End of notifications • Page {page} of {totalPages}
                  </div>
                )}
              </div>
            )}
          {/* </ScrollArea> */}
        </div>
        
        {/* Notification detail view */}
        <div className="hidden lg:block lg:w-1/2 border-l p-6 overflow-y-auto">
          {selectedNotification ? (
            <div className="animate-in fade-in slide-in-from-right-5">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  {getNotificationIcon(selectedNotification.type)}
                  <h2 className="text-xl font-semibold">{selectedNotification.title}</h2>
                </div>
          
              </div>
              
              <div className="text-sm text-muted-foreground mb-4">
                {formatDate(selectedNotification.createdAt)}
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
                <p>{selectedNotification.description}</p>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button onClick={() => setSelectedNotification(null)} variant="ghost">
                  <X className="h-4 w-4 mr-2" />
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <Bell className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-lg mb-2">Select a notification to view details</p>
              <p className="text-sm max-w-md">Click on any notification from the list to view its complete details here</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Mobile notification detail dialog */}
      <Dialog open={!!selectedNotification && window.innerWidth < 1024} onOpenChange={(open) => !open && setSelectedNotification(null)}>
        {selectedNotification && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getNotificationIcon(selectedNotification.type)}
                {selectedNotification.title}
              </DialogTitle>
              <DialogDescription>
                {formatDate(selectedNotification.createdAt)}
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <p className="text-sm">{selectedNotification.description}</p>
            </div>
            <div className="mt-4 flex justify-end">
           
              <Button onClick={() => setSelectedNotification(null)} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Close
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}