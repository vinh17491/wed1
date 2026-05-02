import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronLeft } from 'lucide-react';
import AdminLayout from './AdminLayout';
import AddProductModal from '../../features/shop/components/AddProductModal';
import EditProductModal from '../../features/shop/components/EditProductModal';
import { Link } from 'react-router-dom';
import { useProducts, useProductMutations } from '../../hooks/useProducts';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

export default function ShopDashboard() {
  const { data: products = [], isLoading, error, refetch } = useProducts();
  const { createProduct, updateProduct, deleteProduct, isMutating } = useProductMutations();
  
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleAddProduct = async (formData: any) => {
    await createProduct.mutateAsync(formData);
    setIsAddModalOpen(false);
  };

  const handleEditSave = async (updatedData: any) => {
    await updateProduct.mutateAsync(updatedData);
    setEditingProduct(null);
  };

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

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={(error as Error).message} onRetry={() => refetch()} />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl overflow-x-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                          <button 
                            disabled={isMutating}
                            onClick={() => deleteProduct.mutate(p.id)} 
                            className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-400 transition-colors disabled:opacity-50"
                          >
                            {deleteProduct.isPending ? '...' : 'Confirm'}
                          </button>
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
      )}

      {isMutating && <LoadingSpinner fullPage />}

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
