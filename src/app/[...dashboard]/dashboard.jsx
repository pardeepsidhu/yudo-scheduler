import { useState } from "react";

export default function ProfessionalCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Calendar navigation functions
  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };
  
  const prevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };
  
  // Helper to get month name and year
  const getMonthYearHeader = () => {
    return currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  // Fixed colors for categories
  const categoryColors = {
    reminder: "bg-amber-100 border-amber-400 text-amber-800",
    task: "bg-blue-100 border-blue-400 text-blue-800",
    schedule: "bg-emerald-100 border-emerald-400 text-emerald-800"
  };
  
  // Sample events data with the three categories
  const events = [
    { 
      id: 1, 
      title: "Team Meeting", 
      description: "Weekly team sync to discuss project progress",
      startDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 5, 10, 0), 
      endDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 5, 11, 30),
      category: "schedule"
    },
    { 
      id: 2, 
      title: "Submit Report", 
      description: "Complete and submit quarterly report to management",
      startDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 12, 14, 0),
      category: "task"
    },
    { 
      id: 3, 
      title: "Product Launch", 
      description: "Official launch of our new product line",
      startDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 15, 9, 0), 
      endDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 15, 12, 0),
      category: "schedule"
    },
    { 
      id: 4, 
      title: "Call Client", 
      description: "Follow up with client about project requirements",
      startDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 15, 13, 30),
      category: "reminder"
    },
    { 
      id: 5, 
      title: "Budget Review", 
      description: "Review department budget allocation",
      startDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 20, 11, 0), 
      endDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 20, 12, 30),
      category: "schedule"
    },
    { 
      id: 6, 
      title: "Team Lunch", 
      description: "Monthly team lunch at the Italian restaurant",
      startDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 22, 12, 0),
      category: "reminder"
    },
    { 
      id: 7, 
      title: "Quarterly Planning", 
      description: "Develop action plan for the next quarter",
      startDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 28, 10, 0), 
      endDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 28, 12, 0),
      category: "schedule"
    },
    { 
      id: 8, 
      title: "Update Website", 
      description: "Update company website with new content",
      startDate: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 28, 14, 0),
      category: "task"
    }
  ];
  
  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  
  // Get time range for display
  const getTimeRange = (event) => {
    if (event.category === "reminder" || !event.endDate) {
      return formatTime(event.startDate);
    }
    return `${formatTime(event.startDate)} - ${formatTime(event.endDate)}`;
  };
  
  // Helper to get the number of days in a month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Helper to get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Generate calendar days array
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isCurrentMonth: true });
    }
    
    return days;
  };
  
  // Find events for a specific day
  const getEventsForDay = (day) => {
    if (!day) return [];
    
    return events.filter(event => 
      event.startDate.getDate() === day && 
      event.startDate.getMonth() === currentMonth.getMonth() &&
      event.startDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  // Handle event click
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'reminder':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        );
      case 'task':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      case 'schedule':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        );
      default:
        return null;
    }
  };

  // Get weekday labels
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Calendar days with events
  const calendarDays = generateCalendarDays();

  // Generate time slots for day view
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Get today's date object
  const today = new Date();
  
  return (
    <div className="flex flex-col   bg-white  border border-gray-200 shadow-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{getMonthYearHeader()}</h2>
            <p className="text-blue-100">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex bg-blue-800 bg-opacity-30 rounded-lg overflow-hidden">
              <button 
                onClick={() => setCurrentView("month")}
                className={`px-3 py-1.5 text-sm font-medium ${currentView === "month" ? "bg-white text-blue-800" : "hover:bg-blue-800 hover:bg-opacity-50"}`}
              >
                Month
              </button>
              <button 
                onClick={() => setCurrentView("week")}
                className={`px-3 py-1.5 text-sm font-medium ${currentView === "week" ? "bg-white text-blue-800" : "hover:bg-blue-800 hover:bg-opacity-50"}`}
              >
                Week
              </button>
              <button 
                onClick={() => setCurrentView("day")}
                className={`px-3 py-1.5 text-sm font-medium ${currentView === "day" ? "bg-white text-blue-800" : "hover:bg-blue-800 hover:bg-opacity-50"}`}
              >
                Day
              </button>
            </div>
            <div className="flex space-x-1">
              <button 
                onClick={prevMonth}
                className="p-2 rounded-full hover:bg-blue-800 hover:bg-opacity-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <button 
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1 bg-blue-800 bg-opacity-30 rounded-md hover:bg-opacity-50 transition-colors text-sm font-medium"
              >
                Today
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 rounded-full hover:bg-blue-800 hover:bg-opacity-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Legend */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex gap-3 overflow-x-auto">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-amber-400"></span>
          <span className="text-xs font-medium text-gray-700">Reminder</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-400"></span>
          <span className="text-xs font-medium text-gray-700">Task</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
          <span className="text-xs font-medium text-gray-700">Schedule</span>
        </div>
      </div>
      
      {currentView === "month" && (
        <>
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {weekdays.map((weekday, index) => (
              <div 
                key={index} 
                className="py-2 text-center text-sm font-medium text-gray-600"
              >
                {weekday}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="flex-1 grid grid-cols-7 auto-rows-fr">
            {calendarDays.map((calendarDay, index) => {
              const dayEvents = getEventsForDay(calendarDay.day);
              const isToday = calendarDay.isCurrentMonth && 
                calendarDay.day === today.getDate() && 
                currentMonth.getMonth() === today.getMonth() && 
                currentMonth.getFullYear() === today.getFullYear();
              
              const isSelected = calendarDay.isCurrentMonth && 
                calendarDay.day === selectedDate.getDate() && 
                currentMonth.getMonth() === selectedDate.getMonth() && 
                currentMonth.getFullYear() === selectedDate.getFullYear();
              
              return (
                <div 
                  key={index} 
                  className={`border-b border-r border-gray-200 p-1 transition-colors ${
                    !calendarDay.isCurrentMonth ? 'bg-gray-50' : 
                    isSelected ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => calendarDay.day && setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), calendarDay.day))}
                >
                  {calendarDay.day && (
                    <div className="h-full flex flex-col">
                      <div className="flex justify-between items-center mb-1 px-1">
                        <div className={`flex justify-center items-center w-7 h-7 rounded-full 
                          ${isToday ? 'bg-blue-600 text-white font-bold' : 'text-gray-700'}`}
                        >
                          {calendarDay.day}
                        </div>
                        {dayEvents.length > 0 && (
                          <span className="text-xs font-medium text-gray-500">{dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}</span>
                        )}
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                        {dayEvents.slice(0, 3).map(event => (
                          <div 
                            key={event.id} 
                            className={`p-1.5 text-xs rounded border-l-4 cursor-pointer hover:opacity-90 ${categoryColors[event.category]}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                          >
                            <div className="flex items-center gap-1">
                              {getCategoryIcon(event.category)}
                              <div className="font-medium truncate">{event.title}</div>
                            </div>
                            <div className="text-xs opacity-80 mt-0.5">{getTimeRange(event)}</div>
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-center text-gray-500 font-medium py-1">
                            + {dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
      
      {currentView === "week" && (
        <div className="flex-1 flex flex-col">
          {/* Week view header */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {weekdays.map((weekday, index) => {
              const currentDate = new Date(currentMonth);
              const firstDayOfWeek = new Date(currentMonth);
              const dayOffset = currentMonth.getDay() - index;
              firstDayOfWeek.setDate(currentMonth.getDate() - dayOffset);
              
              const isToday = 
                firstDayOfWeek.getDate() === today.getDate() && 
                firstDayOfWeek.getMonth() === today.getMonth() && 
                firstDayOfWeek.getFullYear() === today.getFullYear();
                
              return (
                <div key={index} className="flex flex-col items-center py-2">
                  <div className="text-sm font-medium text-gray-600">{weekday}</div>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full mt-1 ${
                    isToday ? 'bg-blue-600 text-white' : 'text-gray-700'
                  }`}>
                    {firstDayOfWeek.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Week events grid */}
          <div className="flex-1 grid grid-cols-7 gap-1 p-2 overflow-y-auto">
            {[0, 1, 2, 3, 4, 5, 6].map(dayOffset => {
              const dayDate = new Date(currentMonth);
              const firstDayOfWeek = new Date(currentMonth);
              firstDayOfWeek.setDate(currentMonth.getDate() - currentMonth.getDay() + dayOffset);
              
              const dayEvents = events.filter(event => 
                event.startDate.getDate() === firstDayOfWeek.getDate() && 
                event.startDate.getMonth() === firstDayOfWeek.getMonth() &&
                event.startDate.getFullYear() === firstDayOfWeek.getFullYear()
              );
              
              return (
                <div key={dayOffset} className="flex flex-col space-y-1">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id} 
                      className={`p-2 text-xs rounded cursor-pointer hover:opacity-90 ${categoryColors[event.category]}`}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(event.category)}
                        <div className="font-medium">{event.title}</div>
                      </div>
                      <div className="text-xs opacity-80 mt-0.5">{getTimeRange(event)}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {currentView === "day" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="text-center py-2 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="flex border-b border-gray-200">
              {/* Time slots */}
              <div className="w-20 flex-shrink-0 border-r border-gray-200">
                {timeSlots.map((time, index) => (
                  <div key={index} className="h-12 border-t border-gray-200 px-2 py-1 text-xs text-gray-500">
                    {time}
                  </div>
                ))}
              </div>
              
              {/* Events */}
              <div className="flex-1 relative">
                {timeSlots.map((time, index) => (
                  <div key={index} className="h-12 border-t border-gray-200"></div>
                ))}
                
                {/* Render the day's events */}
                {getEventsForDay(selectedDate.getDate()).map(event => {
                  const hours = event.startDate.getHours();
                  const minutes = event.startDate.getMinutes();
                  const startIndex = (hours - 8) * 2 + (minutes >= 30 ? 1 : 0);
                  
                  // Calculate duration in slots (30-min each)
                  let durationSlots = 1; // Default to 1 slot (30 min)
                  
                  if (event.endDate) {
                    const durationMs = event.endDate - event.startDate;
                    const durationMinutes = durationMs / (1000 * 60);
                    durationSlots = Math.ceil(durationMinutes / 30);
                  }
                  
                  return (
                    <div 
                      key={event.id}
                      className={`absolute left-0 right-0 mx-1 p-2 rounded cursor-pointer ${categoryColors[event.category]}`}
                      style={{ 
                        top: `${startIndex * 48}px`, 
                        height: `${durationSlots * 48}px` 
                      }}
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(event.category)}
                        <div className="font-medium truncate">{event.title}</div>
                      </div>
                      <div className="text-xs">{getTimeRange(event)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Event detail modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={() => setShowEventModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className={`p-4 rounded-t-lg ${categoryColors[selectedEvent.category]}`}>
              <div className="flex items-center gap-2">
                {getCategoryIcon(selectedEvent.category)}
                <h3 className="text-lg font-bold">{selectedEvent.title}</h3>
              </div>
              <p className="text-sm mt-1">{selectedEvent.startDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <p className="text-gray-700">{getTimeRange(selectedEvent)}</p>
              </div>
              
              <div className="flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                <p className="text-gray-700">{selectedEvent.description}</p>
              </div>
              
              <div className="flex gap-2 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/>
                  <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/>
                </svg>
                <p className="text-gray-700 capitalize">{selectedEvent.category}</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button 
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                onClick={() => setShowEventModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Quick Add Event Button */}
      <div className="fixed bottom-6 right-6">
        <button 
          className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          onClick={() => console.log("Add new event")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}