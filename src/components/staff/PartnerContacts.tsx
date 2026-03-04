// 4. src/components/staff/PartnerContacts.tsx
import React from 'react';
import { MessageSquare, Phone, Headphones } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

interface Partner {
  name: string;
  phone: string;
  status: 'online' | 'busy' | 'offline';
}

interface PartnerContactsProps {
  partners?: Partner[];
}

export default function PartnerContacts({ partners }: PartnerContactsProps) {
  const defaultPartners: Partner[] = [
    { name: 'Catamaran Adventures', phone: '+506 2653-1234', status: 'online' },
    { name: 'ATV Volcano Tours', phone: '+506 2653-5678', status: 'online' },
    { name: 'Horseback Expeditions', phone: '+506 2653-9012', status: 'busy' },
    { name: 'Deep Sea Fishing Co.', phone: '+506 2653-3456', status: 'offline' },
    { name: 'Spa Wellness Center', phone: '+506 2653-7890', status: 'online' }
  ];

  const data = partners || defaultPartners;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handlePartnerContact = (partner: Partner, method: 'whatsapp' | 'call') => {
    if (method === 'whatsapp') {
      const message = encodeURIComponent(`Hola ${partner.name}, necesito coordinar una reserva desde ${SITE_CONFIG.shortName}. ¿Podrían confirmar disponibilidad?`);
      window.open(`https://wa.me/${partner.phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
    } else {
      window.open(`tel:${partner.phone}`, '_self');
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-4 flex items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3 shadow-sm animate-float-subtle">
          <Headphones className="w-4 h-4 text-white" />
        </div>
        Partner Contacts
      </h3>
    
      <div className="space-y-3">
        {data.map((partner, index) => (
          <div key={index} className="group flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] card-interactive">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(partner.status)} shadow-sm`}></div>
                <span className="text-sm font-bold text-gray-900">{partner.name}</span>
              </div>
              <span className="text-xs text-gray-600 font-medium">{partner.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handlePartnerContact(partner, 'whatsapp')}
                className="group/btn p-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg hover:scale-110 transition-all duration-300 shadow-sm btn-premium ripple-effect"
                title="WhatsApp"
              >
                <MessageSquare className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </button>
              <button 
                onClick={() => handlePartnerContact(partner, 'call')}
                className="group/btn p-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg hover:shadow-lg hover:scale-110 transition-all duration-300 shadow-sm btn-premium ripple-effect"
                title="Call"
              >
                <Phone className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}