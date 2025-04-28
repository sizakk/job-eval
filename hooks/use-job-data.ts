import { useState, useMemo } from 'react';
import { EvaluationItem, GroupedData, JobAverages, ViewMode } from '@/types';
import { calculateJobAverages } from '@/lib/data-processor';
import { getEvaluatorsSorted } from '@/lib/excel-parser';

export function useJobData(data: EvaluationItem[], groupedData: GroupedData | null) {
    const [selectedJobGroup, setSelectedJobGroup] = useState<string>('');
    const [selectedJobSeries, setSelectedJobSeries] = useState<string>('');
    const [selectedJob, setSelectedJob] = useState<string>('');
    const [selectedEvaluator, setSelectedEvaluator] = useState<string>('');
    const [viewMode, setViewMode] = useState<ViewMode>('직무별');

    // 선택된 직무에 대한 데이터 및 평균
    const selectedJobData = useMemo(() => {
        if (!groupedData || !selectedJob) return null;

        const jobKey = `${selectedJobGroup}-${selectedJobSeries}-${selectedJob}`;
        return groupedData.byJob[jobKey] || null;
    }, [groupedData, selectedJobGroup, selectedJobSeries, selectedJob]);

    // 직무 평균 계산
    const jobAverages = useMemo<JobAverages | null>(() => {
        if (!selectedJobData) return null;
        return calculateJobAverages(selectedJobData);
    }, [selectedJobData]);

    // 선택된 평가자의 데이터
    const selectedEvaluatorData = useMemo(() => {
        if (!groupedData || !selectedEvaluator) return null;
        return groupedData.byEvaluator[selectedEvaluator] || null;
    }, [groupedData, selectedEvaluator]);

    // 평가자 목록 (이름 오름차순)
    const evaluators = useMemo(() => {
        if (!data || data.length === 0) return [];
        return getEvaluatorsSorted(data);
    }, [data]);

    // 직무, 직렬, 직군 선택 함수
    const handleJobGroupSelect = (group: string) => {
        setSelectedJobGroup(group);
        setSelectedJobSeries('');
        setSelectedJob('');
    };

    const handleJobSeriesSelect = (series: string) => {
        setSelectedJobSeries(series);
        setSelectedJob('');
    };

    const handleJobSelect = (job: string) => {
        setSelectedJob(job);
    };

    // 평가자 선택 함수
    const handleEvaluatorSelect = (evaluator: string) => {
        setSelectedEvaluator(evaluator);
    };

    // 보기 모드 전환 함수
    const toggleViewMode = () => {
        setViewMode(prev => prev === '직무별' ? '평가자별' : '직무별');
    };

    return {
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
    };
} 