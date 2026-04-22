import { mockKnowledgeArticles } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Eye, Star, Filter, BookOpen, ThumbsUp, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { usePersistentCollection } from '../components/form/usePersistentCollection';

export default function KnowledgeArticles() {
  const navigate = useNavigate();
  const { items: articles } = usePersistentCollection('dynamics-collection-knowledge', mockKnowledgeArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['All', 'Account Management', 'Integration', 'Technical', 'Sales', 'Security', 'Configuration', 'Mobile'];

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const topArticles = [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3);

  const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
  const avgRating = (articles.reduce((sum, article) => sum + article.rating, 0) / articles.length).toFixed(1);
  const publishedArticles = articles.filter(a => a.status === 'Published').length;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl mb-1">Knowledge Base</h1>
              <p className="text-sm text-gray-600">Browse and manage knowledge articles</p>
            </div>
            <Button className="bg-[#0B71C7] hover:bg-[#106ebe]" onClick={() => navigate('/knowledge/new')}>
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Articles</p>
                    <p className="text-2xl font-semibold">{articles.length}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-600 p-2 rounded">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Published</p>
                    <p className="text-2xl font-semibold">{publishedArticles}</p>
                  </div>
                  <div className="bg-green-100 text-green-600 p-2 rounded">
                    <ThumbsUp className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Views</p>
                    <p className="text-2xl font-semibold">{totalViews.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-100 text-purple-600 p-2 rounded">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Avg. Rating</p>
                    <p className="text-2xl font-semibold">{avgRating}</p>
                  </div>
                  <div className="bg-yellow-100 text-yellow-600 p-2 rounded">
                    <Star className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search knowledge base..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="pl-9 h-9 bg-[#f3f2f1] border-transparent focus:bg-white" 
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                size="sm"
                className={`h-8 text-xs whitespace-nowrap ${
                  (category.toLowerCase() === selectedCategory || (category === 'All' && selectedCategory === 'all'))
                    ? 'bg-[#0B71C7] text-white hover:bg-[#106ebe] hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setSelectedCategory(category === 'All' ? 'all' : category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Top Articles */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[#0B71C7]" />
              <h2 className="font-semibold">Top Articles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topArticles.map((article) => (
                <Card key={article.id} onClick={() => navigate(`/knowledge/${article.id}`)} className="border-2 border-[#0B71C7] shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm flex-1 pr-2">{article.title}</h3>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                        {article.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{article.category}</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Eye className="w-3 h-3" />
                          <span className="font-semibold">{article.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star className="w-3 h-3 fill-yellow-400" />
                          <span className="font-semibold">{article.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <span className="text-gray-500">{article.author}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Articles */}
          <div>
            <h2 className="font-semibold mb-3">All Articles ({filteredArticles.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map((article) => (
                <Card key={article.id} onClick={() => navigate(`/knowledge/${article.id}`)} className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="border-b border-gray-100 pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm flex-1 pr-2 group-hover:text-[#0B71C7] transition-colors">
                        {article.title}
                      </CardTitle>
                      <Badge variant="secondary" className={
                        article.status === 'Published' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                        article.status === 'Draft' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                        'bg-gray-100 text-gray-700 hover:bg-gray-100'
                      }>
                        {article.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      <span className="text-gray-500">{article.author}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Eye className="w-3 h-3" />
                          <span>{article.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{article.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <span className="text-gray-500">
                        {new Date(article.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
