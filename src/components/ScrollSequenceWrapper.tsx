'use client'; // This is the key

import dynamic from 'next/dynamic';

// Import your actual component dynamically here
const ScrollSequence = dynamic(() => import('@/components/ScrollSequence'), {
    ssr: false,
    loading: () => null,
});

export default function ScrollSequenceWrapper() {
    return <ScrollSequence />;
}