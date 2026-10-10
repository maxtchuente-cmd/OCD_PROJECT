type IconName = 'search' | 'arrow' | 'globe' | 'menu' | 'check' | 'briefcase' | 'users' | 'arrow-left' | 'arrow-right' | 'shield-check' | 'check-circle' | 'lock-keyhole' | 'alert-circle' | 'log-out' | 'plus-circle' | 'download' | 'file-text'
const paths: Record<IconName, string> = {
 search: 'M11 19a8 8 0 1 1 5.657-2.343L22 22M16.657 16.657 22 22', arrow: 'M7 17 17 7M7 7h10v10',
 globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20',
 menu: 'M4 7h16M4 12h16M4 17h16', check: 'm5 12 4 4L19 6',
 briefcase: 'M3 7h18v13H3zM8 7V4h8v3M3 12h18M10 12v2h4v-2',
 users: 'M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M23 11h-6',
 'arrow-left': 'M19 12H5M12 19l-7-7 7-7', 'arrow-right': 'M5 12h14M12 5l7 7-7 7',
 'shield-check': 'M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11ZM9 12l2 2 4-4',
 'check-circle': 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
 'lock-keyhole': 'M5 11h14v10H5zM8 11V7a4 4 0 1 1 8 0v4M12 15v2',
 'alert-circle': 'M12 8v4m0 4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
 'log-out': 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9', 'plus-circle': 'M12 8v8M8 12h8M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0', download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3', 'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8'
}
export function Icon({ name }: { name: IconName }) { return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg> }

export default Icon
