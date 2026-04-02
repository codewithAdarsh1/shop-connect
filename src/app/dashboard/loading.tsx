export default function DashboardLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded-lg bg-white/[0.05]" />
          <div className="h-4 w-80 rounded-lg bg-white/[0.03]" />
        </div>
        <div className="h-8 w-36 rounded-full bg-white/[0.04]" />
      </div>

      {/* Checklist skeleton */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#08080f] p-5">
        <div className="flex justify-between mb-3">
          <div className="h-4 w-28 rounded bg-white/[0.05]" />
          <div className="h-4 w-12 rounded bg-white/[0.03]" />
        </div>
        <div className="h-1 rounded-full bg-white/[0.06] mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-10 rounded-xl bg-white/[0.03]" />
          ))}
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="rounded-2xl border border-white/[0.06] bg-[#08080f] p-5 h-28">
            <div className="h-4 w-24 rounded bg-white/[0.05] mb-4" />
            <div className="h-7 w-20 rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-white/[0.06] bg-[#08080f] h-[340px] col-span-2" />
        <div className="rounded-2xl border border-white/[0.06] bg-[#08080f] h-[340px]" />
      </div>
    </div>
  )
}
