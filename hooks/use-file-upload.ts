import { useState, useEffect } from 'react';
import { EvaluationItem, GroupedData, JobHierarchy } from '@/types';
import { parseExcelFile, extractJobHierarchy, groupData } from '@/lib/excel-parser';
import { toast } from 'sonner';

export function useFileUpload() {
    const [data, setData] = useState<EvaluationItem[]>([]);
    const [groupedData, setGroupedData] = useState<GroupedData | null>(null);
    const [jobHierarchy, setJobHierarchy] = useState<JobHierarchy | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 초기화 시 localStorage에서 데이터를 가져옴
    useEffect(() => {
        try {
            const savedData = localStorage.getItem('evaluationData');
            const savedGroupedData = localStorage.getItem('groupedData');
            const savedJobHierarchy = localStorage.getItem('jobHierarchy');

            if (savedData) {
                setData(JSON.parse(savedData));
                console.log('localStorage에서 데이터를 불러왔습니다.');
            }

            if (savedGroupedData) {
                setGroupedData(JSON.parse(savedGroupedData));
            }

            if (savedJobHierarchy) {
                setJobHierarchy(JSON.parse(savedJobHierarchy));
            }
        } catch (err) {
            console.error('localStorage에서 데이터를 불러오는 중 오류 발생:', err);
            toast.error('저장된 데이터를 불러오는 중 오류가 발생했습니다.');
        }
    }, []);

    const handleFileUpload = async (file: File) => {
        if (!file) return;

        // 파일 형식 검증
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
            setError('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
            toast.error('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // 엑셀 파일 파싱
            const parsedData = await parseExcelFile(file);

            // 직무 계층 구조 추출
            const hierarchy = extractJobHierarchy(parsedData);

            // 데이터 그룹화
            const grouped = groupData(parsedData);

            // 상태 업데이트
            setData(parsedData);
            setJobHierarchy(hierarchy);
            setGroupedData(grouped);

            // localStorage에 데이터 저장
            localStorage.setItem('evaluationData', JSON.stringify(parsedData));
            localStorage.setItem('jobHierarchy', JSON.stringify(hierarchy));
            localStorage.setItem('groupedData', JSON.stringify(grouped));

            toast.success('파일이 성공적으로 처리되었습니다.');
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : '파일 처리 중 오류가 발생했습니다.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const resetData = () => {
        setData([]);
        setGroupedData(null);
        setJobHierarchy(null);
        setError(null);

        // localStorage에서 데이터 삭제
        localStorage.removeItem('evaluationData');
        localStorage.removeItem('groupedData');
        localStorage.removeItem('jobHierarchy');

        toast.info('모든 데이터가 초기화되었습니다.');
    };

    return {
        data,
        groupedData,
        jobHierarchy,
        isLoading,
        error,
        handleFileUpload,
        resetData
    };
} 