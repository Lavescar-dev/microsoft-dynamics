import { mockQueues } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import { usePersistentCollection } from '../components/form/usePersistentCollection';

export default function Queues() {
  const navigate = useNavigate();
  const { items: queues } = usePersistentCollection('dynamics-collection-queues', mockQueues);
  return (
    <div className="h-full p-6 bg-gray-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl">Queues</h1>
          <Button className="bg-[#0B71C7] hover:bg-[#106ebe] h-8 text-sm" onClick={() => navigate('/queues/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Queue
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {queues.map((queue) => (
            <Card key={queue.id} onClick={() => navigate(`/queues/${queue.id}`)} className="border border-gray-200 cursor-pointer">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-base">{queue.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between"><span className="text-sm text-gray-600">Type</span><span className="text-sm font-medium">{queue.type}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Active Items</span><span className="text-sm font-semibold text-[#0B71C7]">{queue.activeItems}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Owner</span><span className="text-sm">{queue.owner}</span></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
