export function SkeletonCard() {
  return (
    <div className="rounded-xl p-3 mb-2" style={{ background: '#1a1a2e', border: '0.5px solid #2a2a45' }}>
      <div className="h-3 rounded-full mb-2 animate-pulse" style={{ background: '#2a2a45', width: '75%' }}></div>
      <div className="h-2.5 rounded-full mb-3 animate-pulse" style={{ background: '#1e1e35', width: '55%' }}></div>
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full animate-pulse" style={{ background: '#2a2a45' }}></div>
        <div className="h-2 rounded-full animate-pulse" style={{ background: '#1e1e35', width: '20%' }}></div>
      </div>
    </div>
  )
}

export function SkeletonColumn() {
  return (
    <div style={{ minWidth: 280, flex: 1, maxWidth: 360 }}>
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#2a2a45' }}></div>
        <div className="h-3 rounded-full animate-pulse" style={{ background: '#2a2a45', width: 80 }}></div>
        <div className="ml-auto h-4 w-6 rounded-full animate-pulse" style={{ background: '#1e1e35' }}></div>
      </div>
      <div className="rounded-xl p-2" style={{ background: '#13131f', border: '0.5px solid #1e1e2e' }}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}
