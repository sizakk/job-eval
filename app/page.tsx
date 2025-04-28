'use client';

import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/file-upload';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { data, handleFileUpload, isLoading, error } = useFileUpload();

  // 데이터가 로드되면 대시보드로 이동
  useEffect(() => {
    // 메모리에 데이터가 있거나 localStorage에 데이터가 저장되어 있으면 대시보드로 이동
    const hasLocalStorageData = localStorage.getItem('evaluationData') !== null;

    if ((data && data.length > 0) || hasLocalStorageData) {
      router.push('/dashboard');
    }
  }, [data, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">직무 평가 시각화 시스템</h1>
        <p className="text-lg text-gray-600 max-w-xl">
          직무 평가 데이터를 업로드하여 직무별 또는 평가자별 결과를 시각화하세요.
        </p>
      </div>

      <div className="w-full max-w-3xl">
        <FileUpload
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>엑셀 파일은 다음 컬럼을 포함해야 합니다:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>기본 정보: 직군, 직렬, 직무, 평가자</li>
          <li>평가 항목: 요구지식, 복잡성, 글로벌, 문제해결, 의사소통, 혁신, 전략적영향력, 스킬희소성</li>
        </ul>
      </div>
    </div>
  );
}
