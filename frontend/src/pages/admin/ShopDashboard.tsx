import React, { useState, useEffect } from 'react';
import { productService as shopService, Product } from '../../services/productService';
import { Package, Plus, Edit2, Trash2, ChevronLeft } from 'lucide-react';
import AdminLayout from './AdminLayout';
import AddProductModal from '../../features/shop/components/AddProductModal';
import EditProductModal from '../../features/shop/components/EditProductModal';
import { Link } from 'react-router-dom';

export default function ShopDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await shopService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (formData: any) => {
    try {
      let imageUrl = 'https://via.placeholder.com/600';
      if (formData.imageFile) {
        imageUrl = await shopService.uploadImage(formData.imageFile);
      }
      
      const newProduct = await shopService.createProduct({
        name: formData.name,
        price: formData.price,
        description: formData.description,
        image_url: imageUrl,
        category: formData.category
      });

      setProducts(prev => [newProduct, ...prev]);
    } catch (err) {
      console.error('Add failed:', err);
      throw err;
    }
  };

  const handleEditSave = async (updatedData: any) => {
    try {
      let imageUrl = updatedData.image_url;
      if (updatedData.imageFile) {
        imageUrl = await shopService.uploadImage(updatedData.imageFile);
      }

      const savedProduct = await shopService.updateProduct(updatedData.id, {
        name: updatedData.name,
        price: updatedData.price,
        description: updatedData.description,
        image_url: imageUrl,
        category: updatedData.category
      });

      setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
    } catch (err) {
      console.error('Update failed:', err);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await shopService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeletingId(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) return <AdminLayout title="Shop Management"><div className="loader"><div className="loader__spinner"></div></div></AdminLayout>;

  return (
    <AdminLayout title="Shop Management">
      <div className="mb-6">
        <Link to="/admin" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold">
          <ChevronLeft className="w-4 h-4" /> Back to Analytics
        </Link>
      </div>

      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-white">Products Inventory</h2>
          <p className="text-slate-500 text-sm">Manage your store items and stock</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-slate-800/50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="px-8 py-5">Product Details</th>
              <th className="px-8 py-5 text-right">Price</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-800/20 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-5">
                    <img src={p.image_url} className="w-12 h-12 rounded-xl object-cover border border-slate-800 shadow-lg bg-slate-950" alt={p.name} />
                    <div>
                      <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">{p.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{p.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-right font-mono font-bold text-emerald-400 text-lg">
                  ${p.price.toFixed(2)}
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-end gap-3">
                    {deletingId === p.id ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-400 transition-colors">Confirm</button>
                        <button onClick={() => setDeletingId(null)} className="text-slate-400 text-xs hover:text-white">Cancel</button>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => setEditingProduct(p)}
                          className="p-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeletingId(p.id)} className="p-2.5 bg-slate-800/50 text-slate-600 hover:text-red-400 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSubmit={handleAddProduct} 
      />
      <EditProductModal 
        product={editingProduct} 
        onClose={() => setEditingProduct(null)} 
        onSave={handleEditSave} 
      />
    </AdminLayout>
  );
}
