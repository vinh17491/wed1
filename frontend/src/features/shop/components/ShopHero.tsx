import { motion } from 'framer-motion';

export function ShopHero() {
  return (
    <div className="relative py-24 mb-12 rounded-3xl overflow-hidden border border-emerald-500/20 bg-slate-900/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]" />

      <div className="relative z-10 px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Premium <span className="text-emerald-400">Digital Assets</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Upgrade your creative workflow with our curated selection of high-end software licenses and digital tools. Delivered instantly.
          </p>
          <button className="px-8 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            Explore Collection
          </button>
        </motion.div>
      </div>
    </div>
  );
}
