import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, User, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

const technicians = [
  { id: 1, name: 'John Smith', skills: ['HVAC', 'Electrical'], color: '#0B71C7' },
  { id: 2, name: 'Sarah Johnson', skills: ['Elevators', 'Mechanical'], color: '#7FBA00' },
  { id: 3, name: 'Mike Davis', skills: ['IT', 'Network'], color: '#37BEF3' },
  { id: 4, name: 'Emily Wilson', skills: ['Electrical', 'Emergency'], color: '#F25022' },
  { id: 5, name: 'David Brown', skills: ['Security', 'Access Control'], color: '#FFB900' },
];

const appointments = [
  { id: 1, techId: 1, title: 'HVAC System Repair', customer: 'Acme Corp', location: 'New York, NY', start: 10, duration: 3, status: 'In Progress' },
  { id: 2, techId: 2, title: 'Elevator Maintenance', customer: 'Downtown Plaza', location: 'Chicago, IL', start: 8, duration: 4, status: 'Scheduled' },
  { id: 3, techId: 3, title: 'Network Installation', customer: 'Tech Innovations', location: 'San Francisco, CA', start: 14, duration: 2, status: 'Scheduled' },
  { id: 4, techId: 4, title: 'Emergency - Power Outage', customer: 'Metro Hospital', location: 'Boston, MA', start: 9, duration: 6, status: 'In Progress' },
  { id: 5, techId: 5, title: 'Security Upgrade', customer: 'Retail Solutions', location: 'Los Angeles, CA', start: 13, duration: 5, status: 'Scheduled' },
  { id: 6, techId: 1, title: 'Inspection', customer: 'Building 42', location: 'New York, NY', start: 14, duration: 2, status: 'Scheduled' },
  { id: 7, techId: 3, title: 'Equipment Setup', customer: 'Startup Inc', location: 'San Francisco, CA', start: 10, duration: 3, status: 'Completed' },
];

const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

export default function ScheduleBoard() {
  const [currentDate, setCurrentDate] = useState(new Date('2026-03-25'));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-500';
      case 'Scheduled': return 'bg-purple-500';
      case 'Completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl mb-1">Schedule Board</h1>
              <p className="text-sm text-gray-600">View and manage technician schedules</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => changeDate(-1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="font-medium">{formatDate(currentDate)}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => changeDate(1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button className="bg-[#0B71C7] hover:bg-[#106ebe]">
                Today
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-3">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-3 pb-3">
                <p className="text-xs text-gray-600 mb-1">Available Techs</p>
                <p className="text-xl font-semibold">{technicians.length}</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-3 pb-3">
                <p className="text-xs text-gray-600 mb-1">Scheduled</p>
                <p className="text-xl font-semibold">{appointments.filter(a => a.status === 'Scheduled').length}</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-3 pb-3">
                <p className="text-xs text-gray-600 mb-1">In Progress</p>
                <p className="text-xl font-semibold">{appointments.filter(a => a.status === 'In Progress').length}</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-3 pb-3">
                <p className="text-xs text-gray-600 mb-1">Completed</p>
                <p className="text-xl font-semibold">{appointments.filter(a => a.status === 'Completed').length}</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-3 pb-3">
                <p className="text-xs text-gray-600 mb-1">Utilization</p>
                <p className="text-xl font-semibold">78%</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[1200px]">
                  {/* Header Row */}
                  <div className="grid grid-cols-[200px_1fr] border-b border-gray-200 bg-gray-50">
                    <div className="p-4 border-r border-gray-200 font-semibold">
                      Technician
                    </div>
                    <div className="grid grid-cols-11">
                      {hours.map((hour) => (
                        <div key={hour} className="p-2 text-center text-xs font-semibold border-r border-gray-200">
                          {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technician Rows */}
                  {technicians.map((tech) => {
                    const techAppointments = appointments.filter(a => a.techId === tech.id);
                    
                    return (
                      <div key={tech.id} className="grid grid-cols-[200px_1fr] border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <div className="p-4 border-r border-gray-200">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                              style={{ backgroundColor: tech.color }}
                            >
                              {tech.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{tech.name}</p>
                              <div className="flex gap-1 mt-1">
                                {tech.skills.map((skill) => (
                                  <Badge key={skill} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Timeline Grid */}
                        <div className="relative grid grid-cols-11">
                          {hours.map((hour) => (
                            <div key={hour} className="border-r border-gray-200 h-24"></div>
                          ))}
                          
                          {/* Appointments */}
                          {techAppointments.map((apt) => {
                            const startPos = ((apt.start - 8) / 11) * 100;
                            const width = (apt.duration / 11) * 100;
                            
                            return (
                              <div
                                key={apt.id}
                                className="absolute top-2 h-20 rounded overflow-hidden hover:opacity-90 transition-opacity"
                                style={{
                                  left: `${startPos}%`,
                                  width: `${width}%`,
                                  backgroundColor: tech.color,
                                }}
                              >
                                <div className="p-2 text-white text-xs h-full flex flex-col">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold truncate flex-1">{apt.title}</span>
                                    <div className={`w-2 h-2 rounded-full ${getStatusColor(apt.status)}`}></div>
                                  </div>
                                  <div className="flex items-center gap-1 mb-1">
                                    <User className="w-3 h-3" />
                                    <span className="truncate">{apt.customer}</span>
                                  </div>
                                  <div className="flex items-center gap-1 mb-1">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate">{apt.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs opacity-90">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                      {apt.start > 12 ? apt.start - 12 : apt.start}:00 {apt.start >= 12 ? 'PM' : 'AM'} ({apt.duration}h)
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-6 text-sm">
            <span className="font-medium">Status:</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500"></div>
              <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span>Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
