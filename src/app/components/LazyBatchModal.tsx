"use client";

import { lazy, Suspense } from 'react';
import LoaderOverlay from './LoaderOverlay';

const BatchModal = lazy(() => import('./BatchModal'));

interface LazyBatchModalProps {
  onClose: () => void;
}

export default function LazyBatchModal({ onClose }: LazyBatchModalProps) {
  return (
    <Suspense fallback={<LoaderOverlay title="Loading..." message="Please wait" />}>
      <BatchModal onClose={onClose} />
    </Suspense>
  );
}