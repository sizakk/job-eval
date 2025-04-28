'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { JobSelection } from '@/components/job-selection';
import { ModeToggle } from '@/components/mode-toggle';
import { RadarChart } from '@/components/radar-chart';
import { ScatterChart } from '@/components/scatter-chart';
import { EvaluatorView } from '@/components/evaluator-view';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/hooks/use-file-upload';
import { useJobData } from '@/hooks/use-job-data';

export default function DashboardPage() {
    const router = useRouter();
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const { data, groupedData, jobHierarchy, resetData } = useFileUpload();

    const {
        selectedJobGroup,
        selectedJobSeries,
        selectedJob,
        selectedEvaluator,
        viewMode,
        selectedJobData,
        jobAverages,
        selectedEvaluatorData,
        evaluators,
        handleJobGroupSelect,
        handleJobSeriesSelect,
        handleJobSelect,
        handleEvaluatorSelect,
        toggleViewMode
    } = useJobData(data, groupedData);

    // 데이터 확인 및 리다이렉트 처리
    useEffect(() => {
        const hasLocalStorageData = localStorage.getItem('evaluationData') !== null;

        if ((!data || data.length === 0) && !hasLocalStorageData) {
            router.push('/');
        } else {
            setIsDataLoaded(true);
        }
    }, [data, router]);

    if (!isDataLoaded) {
        return null;
    }

    return (
        <main className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">직무 평가 결과 대시보드</h1>
                <div className="flex gap-4">
                    <Button
                        onClick={resetData}
                        variant="outline"
                    >
                        새 파일 업로드
                    </Button>
                    <Button
                        onClick={() => router.push('/')}
                        variant="ghost"
                    >
                        홈으로
                    </Button>
                </div>
            </div>

            <div className="mb-6">
                <ModeToggle currentMode={viewMode} onToggle={toggleViewMode} />
            </div>

            {viewMode === '직무별' ? (
                <>
                    <div className="mb-6">
                        <JobSelection
                            jobHierarchy={jobHierarchy}
                            selectedJobGroup={selectedJobGroup}
                            selectedJobSeries={selectedJobSeries}
                            selectedJob={selectedJob}
                            onJobGroupSelect={handleJobGroupSelect}
                            onJobSeriesSelect={handleJobSeriesSelect}
                            onJobSelect={handleJobSelect}
                        />
                    </div>

                    {jobAverages && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <RadarChart jobAverages={jobAverages} />

                            {selectedJobData && selectedJobData.length > 0 && (
                                <ScatterChart
                                    jobData={selectedJobData}
                                    jobName={jobAverages.직무}
                                />
                            )}
                        </div>
                    )}
                </>
            ) : (
                <div>
                    <EvaluatorView
                        evaluatorData={selectedEvaluatorData}
                        evaluators={evaluators}
                        selectedEvaluator={selectedEvaluator}
                        onEvaluatorSelect={handleEvaluatorSelect}
                    />
                </div>
            )}
        </main>
    );
} 