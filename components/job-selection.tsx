'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobHierarchy } from '@/types';

interface JobSelectionProps {
    jobHierarchy: JobHierarchy | null;
    selectedJobGroup: string;
    selectedJobSeries: string;
    selectedJob: string;
    onJobGroupSelect: (group: string) => void;
    onJobSeriesSelect: (series: string) => void;
    onJobSelect: (job: string) => void;
}

export function JobSelection({
    jobHierarchy,
    selectedJobGroup,
    selectedJobSeries,
    selectedJob,
    onJobGroupSelect,
    onJobSeriesSelect,
    onJobSelect,
}: JobSelectionProps) {
    if (!jobHierarchy) {
        return null;
    }

    const { 직군, 직렬, 직무 } = jobHierarchy;

    return (
        <Card>
            <CardHeader>
                <CardTitle>직무 선택</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 직군 선택 */}
                <div>
                    <label className="block text-sm font-medium mb-1">직군</label>
                    <Select value={selectedJobGroup} onValueChange={onJobGroupSelect}>
                        <SelectTrigger>
                            <SelectValue placeholder="직군 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            {직군.map((group) => (
                                <SelectItem key={group} value={group}>
                                    {group}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 직렬 선택 */}
                <div>
                    <label className="block text-sm font-medium mb-1">직렬</label>
                    <Select
                        value={selectedJobSeries}
                        onValueChange={onJobSeriesSelect}
                        disabled={!selectedJobGroup}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="직렬 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedJobGroup &&
                                직렬[selectedJobGroup]?.map((series) => (
                                    <SelectItem key={series} value={series}>
                                        {series}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 직무 선택 */}
                <div>
                    <label className="block text-sm font-medium mb-1">직무</label>
                    <Select
                        value={selectedJob}
                        onValueChange={onJobSelect}
                        disabled={!selectedJobSeries}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="직무 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedJobGroup && selectedJobSeries &&
                                직무[`${selectedJobGroup}-${selectedJobSeries}`]?.map((job) => (
                                    <SelectItem key={job} value={job}>
                                        {job}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
} 