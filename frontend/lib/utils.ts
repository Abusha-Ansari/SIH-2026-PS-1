import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatISTTime(isoString?: string): string {
  if (!isoString) return '--:--:--';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function formatISTDateTime(isoString?: string): string {
  if (!isoString) return '--';
  const d = new Date(isoString);
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getRiskColor(level: string): { bg: string; text: string; border: string; glow: string } {
  switch (level?.toLowerCase()) {
    case 'extreme':
      return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]' };
    case 'high':
      return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]' };
    case 'moderate':
      return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]' };
    case 'low':
      return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]' };
    default:
      return { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/50', glow: '' };
  }
}
