'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ViewMode } from '@/types';

interface ModeToggleProps {
    currentMode: ViewMode;
    onToggle: () => void;
}

export function ModeToggle({ currentMode, onToggle }: ModeToggleProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">현재 모드: {currentMode}</span>
                    <Button onClick={onToggle} variant="outline" size="sm">
                        {currentMode === '직무별' ? '평가자별 보기로 전환' : '직무별 보기로 전환'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 