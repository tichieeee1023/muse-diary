interface MuseDollIconProps { size?: number; className?: string }
export function MuseDollIcon({ size = 18, className }: MuseDollIconProps) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="7" cy="6" r="3" fill="currentColor" opacity=".78"/><circle cx="17" cy="6" r="3" fill="currentColor" opacity=".78"/>
    <path d="M5.5 11.5C5.5 7.9 8.4 5 12 5s6.5 2.9 6.5 6.5c0 2.2-1.1 4.2-2.8 5.3.8.6 1.3 1.5 1.3 2.7H7c0-1.2.5-2.1 1.3-2.7a6.48 6.48 0 0 1-2.8-5.3Z" fill="currentColor"/>
    <circle cx="9.5" cy="11" r=".9" fill="var(--paper,#fff)"/><circle cx="14.5" cy="11" r=".9" fill="var(--paper,#fff)"/>
    <path d="M10.4 14c.8.7 2.4.7 3.2 0" stroke="var(--paper,#fff)" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
}
