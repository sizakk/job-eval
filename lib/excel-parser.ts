import * as XLSX from 'xlsx';
import { EvaluationItem, JobHierarchy, GroupedData } from '@/types';
import { groupBy } from 'lodash';

export const parseExcelFile = (file: File): Promise<EvaluationItem[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // 데이터를 JSON으로 변환
                const rawData = XLSX.utils.sheet_to_json(worksheet);

                if (!Array.isArray(rawData) || rawData.length === 0) {
                    reject(new Error('데이터를 찾을 수 없습니다.'));
                    return;
                }

                // 데이터 유효성 검증 - 필요한 컬럼이 있는지 확인
                const firstRow = rawData[0] as Record<string, unknown>;
                const requiredColumns = ['직군', '직렬', '직무', '평가자', '요구지식', '복잡성', '글로벌', '문제해결', '의사소통', '혁신', '전략적영향력', '스킬희소성'];

                // 누락된 컬럼 확인
                const missingColumns = requiredColumns.filter(column => !(column in firstRow));

                if (missingColumns.length > 0) {
                    reject(new Error(`다음 컬럼이 없습니다: ${missingColumns.join(', ')}`));
                    return;
                }

                // 데이터 형식 변환
                const processedData = (rawData as Record<string, unknown>[]).map((item) => ({
                    직군: String(item['직군'] || ''),
                    직렬: String(item['직렬'] || ''),
                    직무: String(item['직무'] || ''),
                    평가자: String(item['평가자'] || ''),
                    항목1: Number(item['요구지식'] || 0),
                    항목2: Number(item['복잡성'] || 0),
                    항목3: Number(item['글로벌'] || 0),
                    항목4: Number(item['문제해결'] || 0),
                    항목5: Number(item['의사소통'] || 0),
                    항목6: Number(item['혁신'] || 0),
                    항목7: Number(item['전략적영향력'] || 0),
                    항목8: Number(item['스킬희소성'] || 0)
                })) as EvaluationItem[];

                // 문자열 값이 숫자로 변환되는지 확인
                const numberFields = ['항목1', '항목2', '항목3', '항목4', '항목5', '항목6', '항목7', '항목8'];
                const invalidRows = processedData.filter(item =>
                    numberFields.some(field => isNaN(item[field as keyof EvaluationItem] as number))
                );

                if (invalidRows.length > 0) {
                    reject(new Error('일부 평가 항목에 숫자가 아닌 값이 있습니다.'));
                    return;
                }

                resolve(processedData);
            } catch (error) {
                console.error('엑셀 파일 파싱 오류:', error);
                reject(new Error('엑셀 파일 처리 중 오류가 발생했습니다.'));
            }
        };

        reader.onerror = () => {
            reject(new Error('파일 읽기 오류가 발생했습니다.'));
        };

        reader.readAsBinaryString(file);
    });
};

export const extractJobHierarchy = (data: EvaluationItem[]): JobHierarchy => {
    const jobGroups = [...new Set(data.map(item => item.직군))];
    const jobSeries: Record<string, string[]> = {};
    const jobPositions: Record<string, string[]> = {};

    jobGroups.forEach(group => {
        // 해당 직군의 직렬 추출
        const seriesInGroup = [...new Set(data
            .filter(item => item.직군 === group)
            .map(item => item.직렬))];

        jobSeries[group] = seriesInGroup;

        // 각 직렬의 직무 추출
        seriesInGroup.forEach(series => {
            const key = `${group}-${series}`;
            const positionsInSeries = [...new Set(data
                .filter(item => item.직군 === group && item.직렬 === series)
                .map(item => item.직무))];

            jobPositions[key] = positionsInSeries;
        });
    });

    return {
        직군: jobGroups,
        직렬: jobSeries,
        직무: jobPositions
    };
};

export const groupData = (data: EvaluationItem[]): GroupedData => {
    // 직무별 그룹화
    const byJob = groupBy(data, item => `${item.직군}-${item.직렬}-${item.직무}`);

    // 평가자별 그룹화
    const byEvaluator = groupBy(data, '평가자');

    return { byJob, byEvaluator };
};

export const getEvaluatorsSorted = (data: EvaluationItem[]): string[] => {
    return [...new Set(data.map(item => item.평가자))].sort();
}; 