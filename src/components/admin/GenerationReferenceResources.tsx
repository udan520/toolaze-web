import { buildAdminMediaPreviewUrl } from '@/lib/admin/media-preview'

type GenerationReferenceResourcesProps = {
  urls: string[]
  maxVisible?: number
}

export function GenerationReferenceResources({
  urls,
  maxVisible = 3,
}: GenerationReferenceResourcesProps) {
  const visibleUrls = urls.slice(0, maxVisible)
  const hiddenCount = Math.max(0, urls.length - visibleUrls.length)

  if (urls.length === 0) {
    return <p className="text-xs text-slate-400">无参考资源</p>
  }

  return (
    <div className="w-52">
      <div className="grid grid-cols-3 gap-2">
        {visibleUrls.map((url, index) => {
          const previewUrl = buildAdminMediaPreviewUrl(url) ?? url
          const isVideo = isVideoResource(url)

          return (
            <a
              key={`${url}-${index}`}
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="group block overflow-hidden rounded-lg border border-slate-200 bg-slate-100 transition hover:border-indigo-300"
              title="打开参考资源"
            >
              {isVideo ? (
                <video
                  src={previewUrl}
                  muted
                  preload="none"
                  className="aspect-square w-full bg-slate-950 object-cover"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="用户上传参考资源"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="aspect-square w-full bg-slate-100 object-cover"
                />
              )}
            </a>
          )
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
        <span className="text-slate-500">共 {urls.length.toLocaleString('zh-CN')} 个</span>
        {hiddenCount > 0 ? <span className="text-slate-400">另 {hiddenCount} 个</span> : null}
        <a
          href={buildAdminMediaPreviewUrl(urls[0]) ?? urls[0]}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-indigo-600 transition hover:text-indigo-800"
        >
          打开参考
        </a>
      </div>
    </div>
  )
}

function isVideoResource(url: string): boolean {
  return /\.(?:mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(url)
}
