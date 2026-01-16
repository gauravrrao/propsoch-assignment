'use client';

import { ProjectListingResponse } from '@/types/types';
import dynamic from 'next/dynamic';

const LazyMap = dynamic(() => import("@/components/discovery-map"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

function MapCaller(props:ProjectListingResponse) {
  return <LazyMap {...props} />;
}

export default MapCaller;
