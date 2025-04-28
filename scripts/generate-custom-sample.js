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

// 실제 다양한 값을 가진 샘플 데이터 생성 함수
function generateCustomSampleData() {
    const data = [];

    jobGroups.forEach(jobGroup => {
        const seriesForGroup = jobSeries[jobGroup];

        seriesForGroup.forEach(jobSeries => {
            const positionsForSeries = jobPositions[`${jobGroup}-${jobSeries}`];

            positionsForSeries.forEach(jobPosition => {
                // 각 직무별로 모든 평가자가 평가
                evaluators.forEach(evaluator => {
                    // 평가자별로 다양한 점수 패턴 부여 (1~7 사이의 값)
                    let values;

                    // 평가자별로 다른 패턴의 점수 분포를 생성
                    switch (evaluator) {
                        case '김평가':
                            // 김평가는 2~5 사이의 점수로 고르게 분포
                            values = [
                                Math.floor(Math.random() * 4) + 2, // 요구지식
                                Math.floor(Math.random() * 4) + 2, // 복잡성
                                Math.floor(Math.random() * 4) + 2, // 글로벌
                                Math.floor(Math.random() * 4) + 2, // 문제해결
                                Math.floor(Math.random() * 4) + 2, // 의사소통
                                Math.floor(Math.random() * 4) + 2, // 혁신
                                Math.floor(Math.random() * 4) + 2, // 전략적영향력
                                Math.floor(Math.random() * 4) + 2  // 스킬희소성
                            ];
                            break;
                        case '이리뷰':
                            // 이리뷰는 1~4 사이의 낮은 점수 경향
                            values = [
                                Math.floor(Math.random() * 4) + 1, // 요구지식
                                Math.floor(Math.random() * 4) + 1, // 복잡성
                                Math.floor(Math.random() * 4) + 1, // 글로벌
                                Math.floor(Math.random() * 4) + 1, // 문제해결
                                Math.floor(Math.random() * 4) + 1, // 의사소통
                                Math.floor(Math.random() * 4) + 1, // 혁신
                                Math.floor(Math.random() * 4) + 1, // 전략적영향력
                                Math.floor(Math.random() * 4) + 1  // 스킬희소성
                            ];
                            break;
                        case '박관찰':
                            // 박관찰는 전반적으로 높은 점수, 특히 혁신/전략에 높은 점수
                            values = [
                                Math.floor(Math.random() * 3) + 3, // 요구지식
                                Math.floor(Math.random() * 3) + 3, // 복잡성
                                Math.floor(Math.random() * 3) + 3, // 글로벌
                                Math.floor(Math.random() * 3) + 3, // 문제해결
                                Math.floor(Math.random() * 3) + 3, // 의사소통
                                Math.floor(Math.random() * 2) + 5, // 혁신 (5-6점)
                                Math.floor(Math.random() * 2) + 5, // 전략적영향력 (5-6점)
                                Math.floor(Math.random() * 3) + 3  // 스킬희소성
                            ];
                            break;
                        case '최심사':
                            // 최심사는 1~7까지 넓은 분포의 점수
                            values = [
                                Math.floor(Math.random() * 7) + 1, // 요구지식
                                Math.floor(Math.random() * 7) + 1, // 복잡성
                                Math.floor(Math.random() * 7) + 1, // 글로벌
                                Math.floor(Math.random() * 7) + 1, // 문제해결
                                Math.floor(Math.random() * 7) + 1, // 의사소통
                                Math.floor(Math.random() * 7) + 1, // 혁신
                                Math.floor(Math.random() * 7) + 1, // 전략적영향력
                                Math.floor(Math.random() * 7) + 1  // 스킬희소성
                            ];
                            break;
                        case '정검토':
                            // 정검토는 각 항목별로 확연히 다른 점수 분포
                            values = [
                                Math.floor(Math.random() * 2) + 1, // 요구지식 (낮은 점수)
                                Math.floor(Math.random() * 2) + 2, // 복잡성 (중하 점수)
                                Math.floor(Math.random() * 2) + 3, // 글로벌 (중간 점수)
                                Math.floor(Math.random() * 2) + 4, // 문제해결 (중상 점수)
                                Math.floor(Math.random() * 2) + 5, // 의사소통 (높은 점수)
                                Math.floor(Math.random() * 2) + 6, // 혁신 (매우 높은 점수)
                                Math.floor(Math.random() * 2) + 4, // 전략적영향력 (중상 점수)
                                Math.floor(Math.random() * 2) + 2  // 스킬희소성 (중하 점수)
                            ];
                            break;
                        default:
                            // 기본적으로는 1~5 사이의 랜덤한 점수
                            values = [
                                Math.floor(Math.random() * 5) + 1,
                                Math.floor(Math.random() * 5) + 1,
                                Math.floor(Math.random() * 5) + 1,
                                Math.floor(Math.random() * 5) + 1,
                                Math.floor(Math.random() * 5) + 1,
                                Math.floor(Math.random() * 5) + 1,
                                Math.floor(Math.random() * 5) + 1,
                                Math.floor(Math.random() * 5) + 1
                            ];
                    }

                    const row = {
                        '직군': jobGroup,
                        '직렬': jobSeries,
                        '직무': jobPosition,
                        '평가자': evaluator,
                        '요구지식': values[0],
                        '복잡성': values[1],
                        '글로벌': values[2],
                        '문제해결': values[3],
                        '의사소통': values[4],
                        '혁신': values[5],
                        '전략적영향력': values[6],
                        '스킬희소성': values[7]
                    };

                    data.push(row);
                });
            });
        });
    });

    return data;
}

// 엑셀 파일 생성
const sampleData = generateCustomSampleData();
const worksheet = XLSX.utils.json_to_sheet(sampleData);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, '직무평가');

// 파일 저장
XLSX.writeFile(workbook, 'custom-sample-data.xlsx');
console.log('다양한 점수 패턴의 샘플 데이터 파일이 생성되었습니다: custom-sample-data.xlsx'); 