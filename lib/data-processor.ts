import { EvaluationItem, JobAverages } from '@/types';
import { mean } from 'lodash';

export const calculateJobAverages = (
    jobData: EvaluationItem[]
): JobAverages => {
    if (!jobData || jobData.length === 0) {
        throw new Error('직무 데이터가 없습니다.');
    }

    const jobName = `${jobData[0].직군}-${jobData[0].직렬}-${jobData[0].직무}`;

    const averages = {
        항목1: mean(jobData.map(item => item.항목1)),
        항목2: mean(jobData.map(item => item.항목2)),
        항목3: mean(jobData.map(item => item.항목3)),
        항목4: mean(jobData.map(item => item.항목4)),
        항목5: mean(jobData.map(item => item.항목5)),
        항목6: mean(jobData.map(item => item.항목6)),
        항목7: mean(jobData.map(item => item.항목7)),
        항목8: mean(jobData.map(item => item.항목8))
    };

    return {
        직무: jobName,
        평균점수: averages
    };
};

export const getEvaluationCategories = (): string[] => {
    return ['요구지식', '복잡성', '글로벌', '문제해결', '의사소통', '혁신', '전략적영향력', '스킬희소성'];
};

export const getEvaluationCategoryNames = (): Record<string, string> => {
    return {
        항목1: '요구지식',
        항목2: '복잡성',
        항목3: '글로벌',
        항목4: '문제해결',
        항목5: '의사소통',
        항목6: '혁신',
        항목7: '전략적영향력',
        항목8: '스킬희소성'
    };
};

export const getColorByIndex = (index: number): string => {
    const colors = [
        'rgb(255, 99, 132)',   // 빨강
        'rgb(54, 162, 235)',   // 파랑
        'rgb(255, 206, 86)',   // 노랑
        'rgb(75, 192, 192)',   // 청록
        'rgb(153, 102, 255)',  // 보라
        'rgb(255, 159, 64)',   // 주황
        'rgb(199, 199, 199)',  // 회색
        'rgb(83, 102, 255)',   // 남색
        'rgb(255, 99, 255)',   // 분홍
        'rgb(99, 255, 132)'    // 연두
    ];

    // 10개 이상인 경우 색상을 반복해서 사용
    return colors[index % colors.length];
};

// 평가 항목 목록 정의 - 이미 위에 getEvaluationCategories 함수가 있으므로 중복을 피합니다
// export const EVALUATION_CATEGORIES = getEvaluationCategories();

// 직군별 데이터 필터링
export function filterJobsByDepartment(jobs: EvaluationItem[], department: string): EvaluationItem[] {
    return jobs.filter(job => job.직군 === department);
}

// 직군 목록 추출
export function getUniqueDepartments(jobs: EvaluationItem[]): string[] {
    const departments = new Set<string>();
    jobs.forEach(job => departments.add(job.직군));
    return Array.from(departments);
}

// 직렬 목록 추출
export function getUniqueJobSeries(jobs: EvaluationItem[], department?: string): string[] {
    const filteredJobs = department
        ? jobs.filter(job => job.직군 === department)
        : jobs;

    const jobSeries = new Set<string>();
    filteredJobs.forEach(job => jobSeries.add(job.직렬));
    return Array.from(jobSeries);
}

// 직무 목록 추출
export function getUniqueJobTitles(jobs: EvaluationItem[], jobSeries?: string): string[] {
    const filteredJobs = jobSeries
        ? jobs.filter(job => job.직렬 === jobSeries)
        : jobs;

    const jobTitles = new Set<string>();
    filteredJobs.forEach(job => jobTitles.add(job.직무));
    return Array.from(jobTitles);
}

// 평가자 목록 추출
export function getUniqueEvaluators(jobs: EvaluationItem[]): string[] {
    const evaluators = new Set<string>();
    jobs.forEach(job => evaluators.add(job.평가자));
    return Array.from(evaluators);
} 