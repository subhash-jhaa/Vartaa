'use client'
import { useState, useRef, useEffect } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'
import { useCurrentUser } from '@/hooks/useCurrentUser'

interface VoiceRecorderProps {
  roomId: Id<'rooms'>
  onRecordingChange: (recording: boolean) => void
}

export default function VoiceRecorder({ roomId, onRecordingChange }: VoiceRecorderProps) {
  const { isAuthenticated } = useCurrentUser()
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cancelledRef = useRef(false)

  const generateUploadUrl = useMutation(api.messages.generateUploadUrl)
  const sendVoiceMessage = useMutation(api.messages.sendVoiceMessage)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const getMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
    ]
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) return type
    }
    return 'audio/webm'
  }

  const uploadVoiceMessage = async (blob: Blob, mimeType: string) => {
    if (!isAuthenticated || cancelledRef.current || blob.size < 100) return
    setIsUploading(true)
    try {
      const uploadUrl = await generateUploadUrl({})
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': mimeType },
        body: blob,
      })
      
      if (!uploadRes.ok) throw new Error('Upload failed')
      
      const { storageId } = await uploadRes.json()
      
      await sendVoiceMessage({ 
        roomId, 
        audioStorageId: storageId as Id<'_storage'>, 
        audioDuration: recordingDuration 
      })
    } catch (err) {
      console.error('Voice upload failed:', err)
    } finally {
      setIsUploading(false)
      setRecordingDuration(0)
    }
  }

  const startRecording = async () => {
    if (!isAuthenticated) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      })
      
      const mimeType = getMimeType()
      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      
      cancelledRef.current = false
      chunksRef.current = []
      setRecordingDuration(0)

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
        if (cancelledRef.current) return
        
        const blob = new Blob(chunksRef.current, { type: mimeType })
        await uploadVoiceMessage(blob, mimeType)
      }

      mediaRecorder.start(100)
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
      onRecordingChange(true)

      timerRef.current = setInterval(() => {
        setRecordingDuration(d => d + 1)
      }, 1000)

    } catch (err) {
      console.error('Microphone access denied:', err)
      alert('Please allow microphone access to record voice messages.')
    }
  }

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    onRecordingChange(false)
  }

  const cancelRecording = () => {
    cancelledRef.current = true
    if (timerRef.current) clearInterval(timerRef.current)
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    setRecordingDuration(0)
    onRecordingChange(false)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isUploading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b6960', fontSize: 13 }}>
        <div style={{ width: 14, height: 14, border: '2px solid rgba(240,237,230,0.15)', borderTopColor: '#c8c5be', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <span>Sending...</span>
      </div>
    )
  }

  if (isRecording) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 100, padding: '4px 12px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f87171', animation: 'pulse 1s ease-in-out infinite' }} />
          <span style={{ fontSize: 13, color: '#f87171', fontFamily: 'monospace', fontWeight: 500 }}>{formatDuration(recordingDuration)}</span>
        </div>
        <button 
          onClick={stopRecording} 
          style={{ height: 32, padding: '0 16px', borderRadius: 100, background: '#4ade80', border: 'none', color: '#0c0c0b', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'transform 0.1s' }}
        >
          Send
        </button>
        <button 
          onClick={cancelRecording} 
          style={{ height: 32, padding: '0 12px', borderRadius: 100, background: 'rgba(240,237,230,0.05)', border: '1px solid rgba(240,237,230,0.1)', color: '#6b6960', fontSize: 13, cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={startRecording}
      title="Record voice message"
      style={{ width: 32, height: 32, borderRadius: 100, background: 'none', border: 'none', cursor: 'pointer', color: '#6b6960', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, transition: 'all 0.15s' }}
      onMouseEnter={(e) => { e.currentTarget.style.color = '#c8c5be'; e.currentTarget.style.background = 'rgba(240,237,230,0.03)' }}
      onMouseLeave={(e) => { e.currentTarget.style.color = '#6b6960'; e.currentTarget.style.background = 'none' }}
    >
      🎤
    </button>
  )
}