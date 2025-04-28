import * as d3 from 'd3';
import { JobAverages } from '@/types';
import { getEvaluationCategoryNames } from './data-processor';

// 카테고리 항목 이름과 EvaluationItem의 필드 매핑
export const categoryToFieldMap: Record<string, string> = {
    '요구지식': '항목1',
    '복잡성': '항목2',
    '글로벌': '항목3',
    '문제해결': '항목4',
    '의사소통': '항목5',
    '혁신': '항목6',
    '전략적영향력': '항목7',
    '스킬희소성': '항목8'
};

// 역방향 매핑 (필드 이름에서 카테고리 이름으로)
export const fieldToCategoryMap: Record<string, string> = {
    '항목1': '요구지식',
    '항목2': '복잡성',
    '항목3': '글로벌',
    '항목4': '문제해결',
    '항목5': '의사소통',
    '항목6': '혁신',
    '항목7': '전략적영향력',
    '항목8': '스킬희소성'
};

// 레이더 차트 데이터 형식 변환
export interface RadarChartData {
    axis: string;
    value: number;
}

// 레이더 차트 데이터 준비 함수
export const prepareRadarChartData = (jobAverage: JobAverages): RadarChartData[] => {
    const categoryNames = getEvaluationCategoryNames();

    return [
        { axis: categoryNames.항목1, value: jobAverage.평균점수.항목1 },
        { axis: categoryNames.항목2, value: jobAverage.평균점수.항목2 },
        { axis: categoryNames.항목3, value: jobAverage.평균점수.항목3 },
        { axis: categoryNames.항목4, value: jobAverage.평균점수.항목4 },
        { axis: categoryNames.항목5, value: jobAverage.평균점수.항목5 },
        { axis: categoryNames.항목6, value: jobAverage.평균점수.항목6 },
        { axis: categoryNames.항목7, value: jobAverage.평균점수.항목7 },
        { axis: categoryNames.항목8, value: jobAverage.평균점수.항목8 },
    ];
};

// 레이더 차트 그리기 위한 경로 생성
export const radarLine = (data: RadarChartData[], radius: number, angleSlice: number) => {
    return d3.line<RadarChartData>()
        .x((d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
        .y((d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
        .curve(d3.curveLinearClosed)(data);
};

// 라인 차트 데이터 형식
export interface LineChartData {
    category: string;
    value: number;
    job?: string;
    evaluator?: string;
}

// 직무 평가 데이터를 라인 차트 데이터로 변환
export const prepareLineChartData = (
    jobAverage: JobAverages,
    jobName: string
): LineChartData[] => {
    const categoryNames = getEvaluationCategoryNames();

    return [
        { category: categoryNames.항목1, value: jobAverage.평균점수.항목1, job: jobName },
        { category: categoryNames.항목2, value: jobAverage.평균점수.항목2, job: jobName },
        { category: categoryNames.항목3, value: jobAverage.평균점수.항목3, job: jobName },
        { category: categoryNames.항목4, value: jobAverage.평균점수.항목4, job: jobName },
        { category: categoryNames.항목5, value: jobAverage.평균점수.항목5, job: jobName },
        { category: categoryNames.항목6, value: jobAverage.평균점수.항목6, job: jobName },
        { category: categoryNames.항목7, value: jobAverage.평균점수.항목7, job: jobName },
        { category: categoryNames.항목8, value: jobAverage.평균점수.항목8, job: jobName },
    ];
};

// x, y 축 스케일 생성 (라인 차트용)
export const createScales = (
    width: number,
    height: number,
    margin: { top: number; right: number; bottom: number; left: number },
    categories: string[],
    maxValue: number
) => {
    const xScale = d3.scaleBand()
        .domain(categories)
        .range([0, width - margin.left - margin.right])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([height - margin.top - margin.bottom, 0]);

    return { xScale, yScale };
};

// 레이더 차트 틱 생성 함수
export const createRadarTicks = (maxValue: number): number[] => {
    return d3.range(0, maxValue + 1, Math.ceil(maxValue / 5));
}; 