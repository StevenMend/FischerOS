import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  Clock,
  MessageSquare,
  Send,
  Users,
  ChevronDown,
  ChevronUp,
  Timer,
  Zap,
  CloudRain,
  Sun,
  Wind,
  Thermometer,
  Phone,
  PhoneOff,
  Bell,
  BellOff,
  ArrowRight,
  Link,
  User,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  Eye,
  Filter,
  RefreshCw
} from 'lucide-react';

interface LiveUpdatesCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LiveUpdate {
  id: string;
  type: 'confirmation' | 'issue' | 'emergency';
  title: string;
  message: string;
  timestamp: string;
  department: string;
  guest?: string;
  room?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'acknowledged' | 'resolved';
  escalationTimer?: number;
  linkedRequests?: string[];
  assignedTo?: string;
  details?: any;
}

interface BroadcastMessage {
  id: string;
  from: string;
  department: string;
  message: string;
  timestamp: string;
  recipients: string[];
  priority: 'normal' | 'urgent';
  acknowledged: string[];
}

interface WeatherImpact {
  condition: string;
  severity: 'low' | 'medium' | 'high';
  affectedServices: string[];
  alternatives: string[];
  timeline: string;
  icon: any;
}

export default function LiveUpdatesCenter({ isOpen, onClose }: LiveUpdatesCenterProps) {
  const [selectedUpdate, setSelectedUpdate] = useState<LiveUpdate | null>(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(['All']);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulated live updates with escalation timers
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([
    {
      id: 'UPD-001',
      type: 'confirmation',
      title: 'Catamaran Tour Confirmed',
      message: 'Maria Rodriguez - 4 guests confirmed for sunset cruise',
      timestamp: '2 min ago',
      department: 'Tours',
      guest: 'Maria Rodriguez',
      room: '304',
      priority: 'medium',
      status: 'new',
      assignedTo: 'Ana Gutierrez',
      details: {
        service: 'Catamaran Sunset Cruise',
        time: '5:00 PM',
        guests: 4,
        partner: 'Catamaran Adventures',
        revenue: '$340'
      }
    },
    {
      id: 'UPD-002',
      type: 'issue',
      title: 'Weather Impact Alert',
      message: 'Rain expected 3:00 PM - 12 outdoor activities affected',
      timestamp: '5 min ago',
      department: 'Operations',
      priority: 'high',
      status: 'acknowledged',
      escalationTimer: 25,
      details: {
        affectedTours: ['ATV Adventure', 'Horseback Riding', 'Beach Volleyball'],
        alternatives: ['Spa packages', 'Cooking class', 'Wine tasting'],
        guestsAffected: 28
      }
    },
    {
      id: 'UPD-003',
      type: 'emergency',
      title: 'Kitchen Equipment Issue',
      message: 'El Pelícano main grill malfunction - 15 min delay expected',
      timestamp: '8 min ago',
      department: 'Restaurants',
      priority: 'critical',
      status: 'new',
      escalationTimer: 22,
      assignedTo: 'Miguel Santos',
      details: {
        restaurant: 'El Pelícano',
        issue: 'Main grill malfunction',
        affectedOrders: 8,
        estimatedFix: '15 minutes',
        backup: 'Secondary kitchen activated'
      }
    },
    {
      id: 'UPD-004',
      type: 'confirmation',
      title: 'Linked Reservation Created',
      message: 'Auto-created dinner reservation for tour guests',
      timestamp: '12 min ago',
      department: 'System',
      priority: 'low',
      status: 'resolved',
      linkedRequests: ['REQ-001', 'REST-045'],
      details: {
        originalRequest: 'Catamaran tour for 4',
        linkedRequest: 'Dinner at Nari for 4',
        autoCreated: true,
        reason: 'Tour + dinner package protocol'
      }
    },
    {
      id: 'UPD-005',
      type: 'issue',
      title: 'Escalation Alert',
      message: 'Deep sea fishing request pending >30min - supervisor notified',
      timestamp: '15 min ago',
      department: 'Tours',
      guest: 'David Chen',
      room: '156',
      priority: 'high',
      status: 'acknowledged',
      escalationTimer: 0,
      assignedTo: 'Ana Gutierrez',
      details: {
        originalRequest: 'Deep sea fishing charter',
        pendingTime: '32 minutes',
        escalatedTo: 'Tours Supervisor',
        issue: 'Partner response delay'
      }
    }
  ]);

  // Broadcast messages
  const [broadcastMessages, setBroadcastMessages] = useState<BroadcastMessage[]>([
    {
      id: 'BC-001',
      from: 'Operations Manager',
      department: 'Management',
      message: 'Rain expected 3:00-5:00 PM. Prepare indoor alternatives for all outdoor activities.',
      timestamp: '10 min ago',
      recipients: ['Tours', 'Beach Club', 'Activities'],
      priority: 'urgent',
      acknowledged: ['Ana Gutierrez', 'Miguel Santos']
    },
    {
      id: 'BC-002',
      from: 'Front Desk',
      department: 'Reception',
      message: 'VIP guest arriving 3:00 PM - Room 304 priority setup required.',
      timestamp: '25 min ago',
      recipients: ['Housekeeping', 'Concierge', 'Tours'],
      priority: 'normal',
      acknowledged: ['Carmen Vega', 'Luis Morales', 'Ana Gutierrez']
    }
  ]);

  // Weather impact data
  const weatherImpact: WeatherImpact = {
    condition: 'Rain Expected',
    severity: 'medium',
    affectedServices: ['ATV Tours', 'Horseback Riding', 'Beach Activities', 'Catamaran Tours'],
    alternatives: ['Spa Packages', 'Cooking Classes', 'Wine Tasting', 'Indoor Fitness'],
    timeline: '3:00 PM - 5:00 PM',
    icon: CloudRain
  };

  // Guest communication templates
  const communicationTemplates = [
    {
      id: 'weather-alternative',
      title: 'Weather Alternative Offer',
      template: 'Dear [GUEST_NAME], due to weather conditions, we\'d like to offer you these amazing indoor alternatives: [ALTERNATIVES]. Would you like us to arrange any of these for you?'
    },
    {
      id: 'confirmation',
      title: 'Booking Confirmation',
      template: 'Great news [GUEST_NAME]! Your [SERVICE] is confirmed for [TIME]. Meeting point: [LOCATION]. Any questions? We\'re here to help!'
    },
    {
      id: 'delay-notification',
      title: 'Service Delay',
      template: 'Hi [GUEST_NAME], we\'re experiencing a brief [DELAY_REASON]. Your [SERVICE] will be ready in approximately [TIME]. We apologize for any inconvenience.'
    },
    {
      id: 'upsell-offer',
      title: 'Upgrade Opportunity',
      template: 'Hello [GUEST_NAME]! Since you\'re enjoying [CURRENT_SERVICE], would you be interested in our [UPGRADE_OPTION]? Special rate: [PRICE].'
    }
  ];

  const departments = ['All', 'Tours', 'Restaurants', 'Spa', 'Front Desk', 'Housekeeping', 'Management'];

  // Auto-refresh simulation
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate new updates
      const newUpdate: LiveUpdate = {
        id: `UPD-${Date.now()}`,
        type: Math.random() > 0.7 ? 'issue' : 'confirmation',
        title: 'New Update',
        message: 'Simulated real-time update',
        timestamp: 'Just now',
        department: 'Tours',
        priority: 'medium',
        status: 'new'
      };
      
      // Don't actually add to avoid infinite growth in demo
      // setLiveUpdates(prev => [newUpdate, ...prev]);
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'confirmation': return 'border-green-500 bg-green-50';
      case 'issue': return 'border-yellow-500 bg-yellow-50';
      case 'emergency': return 'border-red-500 bg-red-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'confirmation': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'issue': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'emergency': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <CheckCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    
    const newBroadcast: BroadcastMessage = {
      id: `BC-${Date.now()}`,
      from: 'Current User',
      department: 'Operations',
      message: broadcastMessage,
      timestamp: 'Just now',
      recipients: selectedDepartments,
      priority: 'normal',
      acknowledged: []
    };
    
    setBroadcastMessages(prev => [newBroadcast, ...prev]);
    setBroadcastMessage('');
    setShowBroadcast(false);
  };

  const filteredUpdates = liveUpdates.filter(update => {
    if (filterType === 'all') return true;
    return update.type === filterType;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-primary text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Live Coordination Center</h2>
              <p className="text-blue-100 text-sm">Real-time operations • Zero phone calls</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-2 rounded-lg transition-colors ${autoRefresh ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-white'}`}
            >
              <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Live</span>
            </div>
            
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Main Feed */}
          <div className="flex-1 flex flex-col">
            {/* Controls */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-primary" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="all">All Updates</option>
                      <option value="confirmation">Confirmations</option>
                      <option value="issue">Issues</option>
                      <option value="emergency">Emergencies</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={() => setShowBroadcast(!showBroadcast)}
                    className="flex items-center space-x-2 px-3 py-1 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Broadcast</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{filteredUpdates.length} updates</span>
                  <span>•</span>
                  <span>{liveUpdates.filter(u => u.escalationTimer && u.escalationTimer > 0).length} escalating</span>
                </div>
              </div>

              {/* Broadcast Interface */}
              {showBroadcast && (
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex-1">
                      <textarea
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        placeholder="Broadcast message to departments..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                        rows={2}
                      />
                    </div>
                    <button
                      onClick={handleBroadcast}
                      disabled={!broadcastMessage.trim()}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {departments.map(dept => (
                      <button
                        key={dept}
                        onClick={() => {
                          if (dept === 'All') {
                            setSelectedDepartments(['All']);
                          } else {
                            setSelectedDepartments(prev => 
                              prev.includes(dept) 
                                ? prev.filter(d => d !== dept)
                                : [...prev.filter(d => d !== 'All'), dept]
                            );
                          }
                        }}
                        className={`px-2 py-1 rounded-full text-xs transition-colors ${
                          selectedDepartments.includes(dept)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Updates Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredUpdates.map((update) => (
                <div
                  key={update.id}
                  onClick={() => setSelectedUpdate(update)}
                  className={`p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-all ${getUpdateColor(update.type)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getUpdateIcon(update.type)}
                      <span className="font-medium text-gray-900">{update.title}</span>
                      {update.linkedRequests && (
                        <Link className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {update.escalationTimer !== undefined && update.escalationTimer > 0 && (
                        <div className="flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                          <Timer className="w-3 h-3" />
                          <span>{update.escalationTimer}min</span>
                        </div>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(update.priority)}`}>
                        {update.priority}
                      </span>
                      <span className="text-xs text-gray-500">{update.timestamp}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{update.message}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span>{update.department}</span>
                      {update.guest && <span>Guest: {update.guest}</span>}
                      {update.room && <span>Room: {update.room}</span>}
                    </div>
                    {update.assignedTo && (
                      <span>Assigned: {update.assignedTo}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-gray-50">
            <div className="p-4">
              {/* Weather Impact */}
              <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Weather Impact</h3>
                  <weatherImpact.icon className="w-5 h-5 text-blue-500" />
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Condition:</span>
                    <span className="text-sm font-medium">{weatherImpact.condition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Timeline:</span>
                    <span className="text-sm font-medium">{weatherImpact.timeline}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Affected:</span>
                    <span className="text-sm font-medium">{weatherImpact.affectedServices.length} services</span>
                  </div>
                </div>
                
                <div className="text-xs text-gray-600 mb-2">Suggested alternatives:</div>
                <div className="flex flex-wrap gap-1">
                  {weatherImpact.alternatives.map((alt, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Communication Templates */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Quick Templates</h3>
                <div className="space-y-2">
                  {communicationTemplates.slice(0, 3).map((template) => (
                    <button
                      key={template.id}
                      className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors"
                    >
                      <div className="font-medium text-sm text-gray-900 mb-1">{template.title}</div>
                      <div className="text-xs text-gray-600 truncate">{template.template}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Broadcasts */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Recent Broadcasts</h3>
                <div className="space-y-3">
                  {broadcastMessages.slice(0, 2).map((broadcast) => (
                    <div key={broadcast.id} className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{broadcast.from}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          broadcast.priority === 'urgent' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {broadcast.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{broadcast.message}</p>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{broadcast.timestamp}</span>
                        <span>{broadcast.acknowledged.length}/{broadcast.recipients.length} ack</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Update Details Modal */}
        {selectedUpdate && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-primary">Update Details</h3>
                  <button onClick={() => setSelectedUpdate(null)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  {getUpdateIcon(selectedUpdate.type)}
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedUpdate.title}</h4>
                    <p className="text-sm text-gray-600">{selectedUpdate.message}</p>
                  </div>
                </div>
                
                {selectedUpdate.details && (
                  <div className="space-y-3 mb-4">
                    {Object.entries(selectedUpdate.details).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-sm font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setSelectedUpdate(null)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                  <button className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    Take Action
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}