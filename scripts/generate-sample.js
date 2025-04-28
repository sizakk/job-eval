import * as XLSX from 'xlsx';

// 샘플 데이터 생성
const jobGroups = ['개발', '경영', '마케팅'];
const jobSeries = {
    '개발': ['프론트엔드', '백엔드', '인프라'],
    '경영': ['인사', '재무', '전략'],
    '마케팅': ['디지털', '브랜드', '콘텐츠']
};
const jobPositions = {
    '개발-프론트엔드': ['주니어 개발자', '시니어 개발자', '테크 리드'],
    '개발-백엔드': ['주니어 개발자', '시니어 개발자', '아키텍트'],
    '개발-인프라': ['시스템 엔지니어', '데브옵스 엔지니어', '클라우드 엔지니어'],
    '경영-인사': ['인사 담당자', 'HR 매니저', 'HR 디렉터'],
    '경영-재무': ['재무 담당자', '회계 담당자', '재무 매니저'],
    '경영-전략': ['전략 담당자', '비즈니스 분석가', '전략 매니저'],
    '마케팅-디지털': ['디지털 마케터', '그로스 해커', '마케팅 매니저'],
    '마케팅-브랜드': ['브랜드 담당자', '브랜드 매니저', '브랜드 디렉터'],
    '마케팅-콘텐츠': ['콘텐츠 크리에이터', '콘텐츠 에디터', '콘텐츠 디렉터']
};
const evaluators = ['김평가', '이리뷰', '박관찰', '최심사', '정검토'];

// 샘플 데이터 생성 함수
function generateSampleData() {
    const data = [];

    jobGroups.forEach(jobGroup => {
        const seriesForGroup = jobSeries[jobGroup];

        seriesForGroup.forEach(jobSeries => {
            const positionsForSeries = jobPositions[`${jobGroup}-${jobSeries}`];

            positionsForSeries.forEach(jobPosition => {
                // 각 직무별로 모든 평가자가 평가
                evaluators.forEach(evaluator => {
                    const row = {
                        '직군': jobGroup,
                        '직렬': jobSeries,
                        '직무': jobPosition,
                        '평가자': evaluator,
                        '요구지식': Math.floor(Math.random() * 5) + 1,
                        '복잡성': Math.floor(Math.random() * 5) + 1,
                        '글로벌': Math.floor(Math.random() * 5) + 1,
                        '문제해결': Math.floor(Math.random() * 5) + 1,
                        '의사소통': Math.floor(Math.random() * 5) + 1,
                        '혁신': Math.floor(Math.random() * 5) + 1,
                        '전략적영향력': Math.floor(Math.random() * 5) + 1,
                        '스킬희소성': Math.floor(Math.random() * 5) + 1
                    };

                    data.push(row);
                });
            });
        });
    });

    return data;
}

// 엑셀 파일 생성
const sampleData = generateSampleData();
const worksheet = XLSX.utils.json_to_sheet(sampleData);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, '직무평가');

// 파일 저장
XLSX.writeFile(workbook, 'sample-data.xlsx');
console.log('샘플 데이터 파일이 생성되었습니다: sample-data.xlsx'); 