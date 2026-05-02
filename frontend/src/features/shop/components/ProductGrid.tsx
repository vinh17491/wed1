import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProductStore } from '../../../store/useProductStore';
import { useExtraStore } from '../../../store/useExtraStore';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ErrorMessage } from '../../../components/ErrorMessage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function ProductGrid() {
  const { products, loading, error, fetchProducts } = useProductStore();
  const { filters } = useExtraStore();
  
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                            product.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'All' || product.category === filters.category;
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, filters]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, page * itemsPerPage);
  }, [page, filteredProducts]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && displayedProducts.length < filteredProducts.length) {
        setPage((prev) => prev + 1);
      }
    },
    [displayedProducts.length, filteredProducts.length]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [handleObserver]);

  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchProducts} />;
  }

  return (
    <div className="w-full">
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          <p className="text-xl mb-2">Không tìm thấy sản phẩm nào</p>
          <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
        </div>
      ) : (
        <>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
          >
            {displayedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
          
          {displayedProducts.length < filteredProducts.length && (
            <div ref={observerTarget} className="py-10 flex justify-center">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
