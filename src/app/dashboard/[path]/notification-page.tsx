'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, MessageSquare, ShieldAlert, Check, X, RefreshCw, AlertCircle, FileText, ChevronDown, Filter, CheckCheck, Inbox } from "lucide-react";
import { fetchNotifications } from '../../api/userApi';


interface Notification {
  _id: string;
  title: string;
  createdAt: string;
  type: 'form' | 'auth' | 'telegram' | 'yudo';
  description: string;
  user: string;
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200'
  };
  
  return (
    <div className={`${styles[type]} border px-4 py-3 rounded-sm shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300`}>
      {type === 'error' && <AlertCircle className="h-5 w-5 flex-shrink-0" />}
      {type === 'success' && <Check className="h-5 w-5 flex-shrink-0" />}
      {type === 'info' && <Bell className="h-5 w-5 flex-shrink-0" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

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
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const loadNotifications = useCallback(async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const options: any = {
        limit: 10,
        page: pageNum,
      };
      
      if (filterType) options.type = filterType;
      
      const result:any = await fetchNotifications(options);
      
      if (!result || !result.success) {
        throw new Error(result?.error || 'Failed to fetch notifications');
      }
      
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
  }, [filterType]);

  useEffect(() => {
    setPage(1);
    loadNotifications(1, true);
  }, [filterType]);

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

  useEffect(() => {
    if (page > 1) {
      loadNotifications(page, false);
    }
  }, [page]);

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowMobileDetail(true);
  };

  const handleRefresh = () => {
    setPage(1);
    loadNotifications(1, true);
    showToast('Notifications refreshed', 'success');
  };

  const getNotificationConfig = (type: string) => {
    const configs = {
      auth: {
        icon: <ShieldAlert className="w-5 h-5" />,
        label: 'Security',
        gradient: 'from-amber-500 to-orange-500',
        bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        iconBg: 'bg-amber-100'
      },
      telegram: {
        icon: <MessageSquare className="w-5 h-5" />,
        label: 'Telegram',
        gradient: 'from-blue-500 to-cyan-500',
        bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        iconBg: 'bg-blue-100'
      },
      yudo: {
        icon: <Check className="w-5 h-5" />,
        label: 'Task',
        gradient: 'from-purple-500 to-pink-500',
        bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        iconBg: 'bg-purple-100'
      },
      
    };
    return configs[type as keyof typeof configs];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const filters = [
    { value: '', label: 'All Notifications' },
    { value: 'auth', label: 'Security' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'yudo', label: 'Tasks' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-sm flex items-center justify-center shadow-lg">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
                <p className="text-xs text-slate-500">Stay updated with your activities</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-none px-2 py-1 sm:py-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-6 sticky top-19">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="w-5 h-5 text-slate-600" />
                <h2 className="font-semibold text-slate-900">Filters</h2>
              </div>
              
              <div className="space-y-2">
                {filters.map(filter => {
                  const isActive = filterType === filter.value;
                  return (
                    <button
                      key={filter.value}
                      onClick={() => setFilterType(filter.value as any)}
                      className={`w-full text-left px-4 py-2 sm:py-3 rounded-sm font-medium text-sm transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-slate-200">
                <div className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{notifications.length}</span> notifications
                </div>
              </div>
            </div>
          </div>
          
          {/* Notifications List */}
          <div className="lg:col-span-2">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
            
            {!loading && notifications.length === 0 ? (
              <div className="bg-white rounded-sm shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-sm flex items-center justify-center mx-auto mb-4">
                  <Inbox className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No notifications</h3>
                <p className="text-sm text-slate-500">You're all caught up! Check back later for updates.</p>
              </div>
            ) : (
              <div className="space-y-1 sm:space-y-3">
                {notifications.map((notification, index) => {
                  const config = getNotificationConfig(notification.type);
                  const isLast = index === notifications.length - 1;
                  const isSelected = selectedNotification?._id === notification._id;
                  
                  return (
                    <div
                      key={notification._id}
                      ref={isLast ? lastNotificationRef : null}
                      onClick={() => handleNotificationClick(notification)}
                      className={`bg-white rounded-sm shadow-sm border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-blue-300 ring-2 ring-blue-100 shadow-md'
                          : 'border-slate-200 hover:shadow-md hover:border-slate-300'
                      }`}
                    >
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          <div className={`flex-shrink-0 w-12 h-12 ${config.iconBg} rounded-sm flex items-center justify-center ${config.text}`}>
                            {config.icon}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className="font-semibold text-slate-900 line-clamp-1">{notification.title}</h3>
                              <span className={`flex-shrink-0 px-2.5 py-1 text-xs font-medium ${config.text} ${config.bg} rounded-lg`}>
                                {config.label}
                              </span>
                            </div>
                            
                            <p className="text-sm text-slate-600 line-clamp-2 mb-3">{notification.description}</p>
                            
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Bell className="w-3.5 h-3.5" />
                              <span>{formatDate(notification.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {loading && (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="bg-white rounded-sm shadow-sm border border-slate-200 p-5 animate-pulse">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-slate-200 rounded-sm"></div>
                          <div className="flex-1 space-y-3">
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-200 rounded w-full"></div>
                            <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {!hasMore && notifications.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-500 font-medium">
                      You've reached the end • Page {page} of {totalPages}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Mobile Detail Modal */}
      {showMobileDetail && selectedNotification && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileDetail(false)}></div>
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="p-6">
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-6"></div>
              
              {(() => {
                const config = getNotificationConfig(selectedNotification.type);
                return (
                  <>
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`flex-shrink-0 w-14 h-14 ${config.iconBg} rounded-sm flex items-center justify-center ${config.text}`}>
                        {config.icon}
                      </div>
                      <div className="flex-1">
                        <span className={`inline-block px-3 py-1 text-xs font-medium ${config.text} ${config.bg} rounded-lg mb-2`}>
                          {config.label}
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">{selectedNotification.title}</h2>
                        <p className="text-sm text-slate-500">{formatDate(selectedNotification.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-slate-700 leading-relaxed">{selectedNotification.description}</p>
                    </div>
                    
                    <button
                      onClick={() => setShowMobileDetail(false)}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-sm shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all"
                    >
                      Close
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}