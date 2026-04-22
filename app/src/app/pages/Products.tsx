import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockProducts } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Filter, Download, RefreshCw, MoreVertical } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';
import { usePersistentCollection } from '../components/form/usePersistentCollection';
import { downloadCsv } from '../components/form/exportData';

function getProductStatusClass(status: string) {
  if (status === 'Active') return 'bg-green-100 text-green-700 hover:bg-green-100';
  if (status === 'Discontinued') return 'bg-red-100 text-red-700 hover:bg-red-100';
  return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
}

export default function Products() {
  const navigate = useNavigate();
  const { items: products } = usePersistentCollection('dynamics-collection-products', mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.productId.toLowerCase().includes(searchQuery.toLowerCase()) || product.category.toLowerCase().includes(searchQuery.toLowerCase()));
  const toggleProductSelection = (id: string) => setSelectedProducts((prev) => prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]);
  const toggleAllProducts = () => setSelectedProducts(selectedProducts.length === filteredProducts.length ? [] : filteredProducts.map((product) => product.id));
  const resetProductFilters = () => {
    setSearchQuery('');
    setSelectedProducts([]);
  };
  return <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Button className="bg-[#0B71C7] hover:bg-[#106ebe] h-8 text-sm" onClick={() => navigate('/products/new')}><Plus className="w-4 h-4 mr-2" />New Product</Button><div className="h-6 w-px bg-gray-200 dark:bg-gray-600" /><Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={resetProductFilters}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button><Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => downloadCsv('products.csv', filteredProducts)}><Download className="w-4 h-4 mr-2" />Export</Button></div><div className="flex items-center gap-2"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" /><Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 h-8 w-80 bg-[#f3f2f1] dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 focus:border-gray-300 dark:focus:border-gray-500" /></div><Button variant="ghost" size="sm" className="h-8" onClick={resetProductFilters}><Filter className="w-4 h-4" /></Button></div></div></div>
    <div className="flex-1 overflow-auto bg-white dark:bg-gray-800"><Table><TableHeader className="bg-[#faf9f8] dark:bg-gray-900 sticky top-0 z-10"><TableRow className="border-b border-gray-200 dark:border-gray-700 hover:bg-[#faf9f8] dark:hover:bg-gray-900"><TableHead className="w-12"><Checkbox checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0} onCheckedChange={toggleAllProducts} /></TableHead><TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Product ID</TableHead><TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Name</TableHead><TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Category</TableHead><TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Unit Price</TableHead><TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Stock</TableHead><TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader><TableBody>{filteredProducts.map((product) => <TableRow key={product.id} onClick={() => navigate(`/products/${product.id}`)} className="cursor-pointer hover:bg-[#f3f2f1] dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700"><TableCell><Checkbox checked={selectedProducts.includes(product.id)} onCheckedChange={() => toggleProductSelection(product.id)} onClick={(e) => e.stopPropagation()} /></TableCell><TableCell className="text-sm text-gray-700 dark:text-gray-300">{product.productId}</TableCell><TableCell className="text-sm font-medium text-[#0B71C7] hover:underline">{product.name}</TableCell><TableCell className="text-sm text-gray-700 dark:text-gray-300">{product.category}</TableCell><TableCell className="text-sm font-medium text-gray-900 dark:text-white">${product.unitPrice.toLocaleString()}</TableCell><TableCell className="text-sm text-gray-700 dark:text-gray-300">{product.stock}</TableCell><TableCell><Badge variant="secondary" className={getProductStatusClass(product.status)}>{product.status}</Badge></TableCell><TableCell><Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}><MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-300" /></Button></TableCell></TableRow>)}</TableBody></Table></div>
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-2"><div className="text-xs text-gray-600 dark:text-gray-400">Showing {filteredProducts.length} of {products.length} records</div></div>
  </div>;
}
