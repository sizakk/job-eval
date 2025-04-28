export interface EvaluationItem {
    직군: string;
    직렬: string;
    직무: string;
    평가자: string;
    항목1: number;
    항목2: number;
    항목3: number;
    항목4: number;
    항목5: number;
    항목6: number;
    항목7: number;
    항목8: number;
}

export interface JobHierarchy {
    직군: string[];
    직렬: Record<string, string[]>;
    직무: Record<string, string[]>;
}

export interface GroupedData {
    byJob: Record<string, EvaluationItem[]>;
    byEvaluator: Record<string, EvaluationItem[]>;
}

export interface JobAverages {
    직무: string;
    평균점수: {
        항목1: number;
        항목2: number;
        항목3: number;
        항목4: number;
        항목5: number;
        항목6: number;
        항목7: number;
        항목8: number;
    };
}

export type ViewMode = "직무별" | "평가자별"; 