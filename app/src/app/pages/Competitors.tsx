import { mockCompetitors } from '../data/mockData';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { usePersistentCollection } from '../components/form/usePersistentCollection';

export default function Competitors() {
  const navigate = useNavigate();
  const { items: competitors } = usePersistentCollection('dynamics-collection-competitors', mockCompetitors);
  return (
    <div className="h-full p-6 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl mb-1">Competitor Analysis</h1>
            <p className="text-sm text-gray-600">Track and analyze your competition</p>
          </div>
          <Button className="bg-[#0B71C7] hover:bg-[#106ebe]" onClick={() => navigate('/competitors/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Competitor
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors.map((competitor) => (
            <Card key={competitor.id} onClick={() => navigate(`/competitors/${competitor.id}`)} className="border border-gray-200 cursor-pointer">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{competitor.name}</span>
                  <div className="flex items-center gap-1 text-sm font-normal">
                    {competitor.winRate < 50 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={competitor.winRate < 50 ? 'text-green-600' : 'text-red-600'}>
                      {competitor.winRate}% Win Rate
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Industry</label>
                  <p className="text-sm text-gray-900">{competitor.industry}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Strengths</label>
                  <p className="text-sm text-gray-700">{competitor.strengths}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide block mb-1">Weaknesses</label>
                  <p className="text-sm text-gray-700">{competitor.weaknesses}</p>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Opportunities</span>
                    <span className="text-sm font-semibold text-gray-900">{competitor.opportunities}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
