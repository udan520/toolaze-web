'use client'

import { useRef } from 'react'
import DeleteIcon from '@/components/icons/DeleteIcon'

export type MultimodalReferenceItem = {
  id: string
  name: string
  src: string
  durationSeconds?: number
}

interface MultimodalReferenceUploaderProps {
  videoItems: MultimodalReferenceItem[]
  audioItems: MultimodalReferenceItem[]
  maxVideos: number
  maxAudioFiles: number
  videoTitle: string
  audioTitle: string
  uploadLabel: string
  videoHelper: string
  audioHelper: string
  videoAccept?: string
  audioAccept?: string
  onVideoFiles: (files: FileList | null) => void
  onAudioFiles: (files: FileList | null) => void
  onRemoveVideo: (index: number) => void
  onRemoveAudio: (index: number) => void
}

export default function MultimodalReferenceUploader({
  videoItems,
  audioItems,
  maxVideos,
  maxAudioFiles,
  videoTitle,
  audioTitle,
  uploadLabel,
  videoHelper,
  audioHelper,
  videoAccept = 'video/mp4,video/quicktime,.mp4,.mov',
  audioAccept = 'audio/wav,audio/x-wav,audio/mpeg,.wav,.mp3',
  onVideoFiles,
  onAudioFiles,
  onRemoveVideo,
  onRemoveAudio,
}: MultimodalReferenceUploaderProps) {
  const videoInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  return (
    <div data-multimodal-reference-uploader className="space-y-3 rounded-xl border border-[#E0E7FF] bg-[#F8FAFF] p-3">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-700">{videoTitle}</p>
            <p className="mt-1 text-[11px] leading-4 text-slate-500">{videoHelper}</p>
          </div>
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            disabled={videoItems.length >= maxVideos}
            className="min-h-8 shrink-0 rounded-md border border-indigo-200 bg-white px-3 text-xs font-bold text-[#4F46E5] hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadLabel}
          </button>
        </div>
        <input
          ref={videoInputRef}
          type="file"
          multiple
          className="hidden"
          accept={videoAccept}
          onChange={(event) => {
            onVideoFiles(event.target.files)
            event.currentTarget.value = ''
          }}
        />
        {videoItems.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {videoItems.map((item, index) => (
              <div key={item.id} className="relative overflow-hidden rounded-lg border border-indigo-100 bg-slate-950">
                <video src={item.src} className="aspect-video h-auto w-full object-contain object-center" muted playsInline preload="metadata" />
                <div className="flex min-w-0 items-center justify-between gap-2 bg-white px-2 py-1.5">
                  <span className="min-w-0 truncate text-[10px] font-semibold text-slate-600">{item.name}</span>
                  <button type="button" onClick={() => onRemoveVideo(index)} aria-label={`Delete ${item.name}`} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600">
                    <DeleteIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-indigo-100 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-700">{audioTitle}</p>
            <p className="mt-1 text-[11px] leading-4 text-slate-500">{audioHelper}</p>
          </div>
          <button
            type="button"
            onClick={() => audioInputRef.current?.click()}
            disabled={audioItems.length >= maxAudioFiles}
            className="min-h-8 shrink-0 rounded-md border border-indigo-200 bg-white px-3 text-xs font-bold text-[#4F46E5] hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadLabel}
          </button>
        </div>
        <input
          ref={audioInputRef}
          type="file"
          multiple
          className="hidden"
          accept={audioAccept}
          onChange={(event) => {
            onAudioFiles(event.target.files)
            event.currentTarget.value = ''
          }}
        />
        {audioItems.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {audioItems.map((item, index) => (
              <div key={item.id} className="flex min-w-0 items-center gap-2 rounded-md border border-indigo-100 bg-white px-2 py-1.5">
                <audio src={item.src} controls preload="metadata" className="h-8 min-w-0 flex-1" />
                <span className="sr-only">{item.name}</span>
                <button type="button" onClick={() => onRemoveAudio(index)} aria-label={`Delete ${item.name}`} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600">
                  <DeleteIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
