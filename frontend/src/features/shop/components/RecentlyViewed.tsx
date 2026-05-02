import { useExtraStore } from '../../store/useExtraStore';
import { useUIStore } from '../../store/useUIStore';

export function RecentlyViewed() {
  const { recentlyViewed } = useExtraStore();
  const { openProductModal } = useUIStore();

  if (recentlyViewed.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-slate-800">
      <h3 className="text-xl font-bold text-white mb-6">Recently Viewed</h3>
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
        {recentlyViewed.map((product) => (
          <div
            key={product.id}
            onClick={() => openProductModal(product)}
            className="flex-shrink-0 w-48 bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-all snap-start group"
          >
            <div className="aspect-square bg-slate-800 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <div className="text-sm font-medium text-white line-clamp-1">{product.name}</div>
              <div className="text-emerald-400 font-bold mt-1">${product.price.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
