// src/pages/staff/housekeeping/widgets/InventoryWidget.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../../lib/api/supabase';

interface InventoryWidgetProps {
  onQuickRequest: (item: string) => void;
}

function useInventoryEstimates() {
  return useQuery({
    queryKey: ['inventory-widget'],
    queryFn: async () => {
      const { count } = await supabase
        .from('guests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active');

      const occupied = count || 0;
      return {
        towels: occupied * 3,
        pillows: occupied * 2,
        blankets: occupied,
        soap: occupied * 2,
        shampoo: occupied * 2,
        tissue: occupied * 3,
      };
    },
    staleTime: 1000 * 60 * 5,
  });
}

export const InventoryWidget: React.FC<InventoryWidgetProps> = ({ onQuickRequest }) => {
  const { data } = useInventoryEstimates();

  const quickItems = [
    { icon: '🧴', label: 'Towels', count: data?.towels ?? 0 },
    { icon: '🛏️', label: 'Pillows', count: data?.pillows ?? 0 },
    { icon: '🧺', label: 'Blankets', count: data?.blankets ?? 0 },
    { icon: '🧼', label: 'Soap', count: data?.soap ?? 0 },
    { icon: '🚿', label: 'Shampoo', count: data?.shampoo ?? 0 },
    { icon: '📄', label: 'Tissue', count: data?.tissue ?? 0 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
      <h3 className="font-semibold mb-4 text-gray-900">
        Quick Inventory Requests
      </h3>

      <div className="grid grid-cols-2 gap-2">
        {quickItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onQuickRequest(item.label)}
            className="flex flex-col items-center justify-center p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-all group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="text-xs font-medium text-green-700">{item.label}</span>
            <span className="text-xs text-green-600">Est: {item.count}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-all">
          + Custom Request
        </button>
      </div>
    </div>
  );
};
