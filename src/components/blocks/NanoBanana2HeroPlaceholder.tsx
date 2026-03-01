'use client'

/**
 * Nano Banana 2 Hero 占位组件
 * 顶部暂时没有功能，显示占位卡片
 */
export default function NanoBanana2HeroPlaceholder() {
  return (
    <div className="max-w-xl mx-auto relative z-10">
      <div className="bg-white rounded-super p-2 shadow-soft border border-indigo-50">
        <div className="border-2 border-dashed border-indigo-100 rounded-[2.2rem] p-10 bg-indigo-50/20 text-center relative overflow-hidden group hover:border-indigo-300 transition-all cursor-pointer">
          <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🎨</div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Coming Soon</h3>
          <p className="text-[12px] font-bold text-indigo-400 uppercase tracking-widest">Pro Quality • Flash Speed • 4K</p>
          <p className="text-sm text-slate-500 mt-4">Nano Banana 2 AI image generator will be available here soon.</p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-[11px] font-bold text-indigo-900/60 uppercase tracking-widest">
        <span>⚡ Flash Speed</span> <span className="hidden md:block">|</span>
        <span>🎨 4K Quality</span> <span className="hidden md:block">|</span>
        <span>👥 5-Character Consistency</span>
      </div>
    </div>
  )
}
