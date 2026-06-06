'use client';
import { useRouter } from 'next/navigation';
import PreviousPolls from '@/components/PreviousPolls';

export default function PredchadzajucePage() {
  const router = useRouter();
  return <PreviousPolls onBack={() => router.push('/')} />;
}
