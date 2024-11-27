'use client';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const SimpleCoursePage = async () => {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  return <div>{jobId}</div>;
};

export default SimpleCoursePage;
