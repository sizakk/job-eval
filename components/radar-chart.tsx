'use client';

import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobAverages } from '@/types';
import { prepareRadarChartData, RadarChartData, createRadarTicks } from '@/lib/chart-utils';

interface RadarChartProps {
    jobAverages: JobAverages;
}

export function RadarChart({ jobAverages }: RadarChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || !jobAverages) return;

        // 차트 데이터 준비
        const data = prepareRadarChartData(jobAverages);
        renderRadarChart(svgRef.current, data);

        // 윈도우 리사이즈 이벤트 처리
        const handleResize = () => {
            if (svgRef.current) {
                renderRadarChart(svgRef.current, data);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [jobAverages]);

    const renderRadarChart = (svg: SVGSVGElement, data: RadarChartData[]) => {
        // svg 요소 크기 계산
        const containerWidth = svg.parentElement?.clientWidth || 400;
        const containerHeight = svg.parentElement?.clientHeight || 400;
        const width = Math.min(containerWidth, 600);
        const height = Math.min(containerHeight, 600);
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };

        // SVG 요소 초기화
        const svgEl = d3.select(svg);
        svgEl.selectAll('*').remove();
        svgEl.attr('width', width).attr('height', height);

        const chartRadius = Math.min(width, height) / 2 - Math.max(margin.top, margin.right);
        const centerX = width / 2;
        const centerY = height / 2;

        // 최대값 계산
        const allValues = data.map(d => d.value);
        const maxValue = Math.max(...allValues);
        // 최소값은 0, 최대값은 데이터의 실제 최대값 또는 기본값 5 중 큰 값으로 설정
        const chartMaxValue = maxValue <= 5 ? 5 : Math.ceil(maxValue);
        const ticks = createRadarTicks(chartMaxValue);

        // 각도 계산
        const angleSlice = (Math.PI * 2) / data.length;

        // 방사형 그리드 그리기
        const axisGrid = svgEl.append('g').attr('class', 'axis-grid')
            .attr('transform', `translate(${centerX}, ${centerY})`);

        // 동심원 그리기
        ticks.forEach(tick => {
            const radius = (chartRadius / chartMaxValue) * tick;
            axisGrid.append('circle')
                .attr('r', radius)
                .attr('class', 'grid-circle')
                .style('fill', 'none')
                .style('stroke', 'rgb(220, 220, 220)')
                .style('stroke-dasharray', '4,4');

            // 틱 값 텍스트
            axisGrid.append('text')
                .attr('x', 0)
                .attr('y', -radius)
                .attr('dy', '-.3em')
                .style('text-anchor', 'middle')
                .style('font-size', '10px')
                .style('fill', 'rgb(100, 100, 100)')
                .text(tick.toString());
        });

        // 축 그리기
        const axes = axisGrid.selectAll('.axis')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'axis');

        axes.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', (d, i) => chartRadius * Math.cos(angleSlice * i - Math.PI / 2))
            .attr('y2', (d, i) => chartRadius * Math.sin(angleSlice * i - Math.PI / 2))
            .style('stroke', 'rgb(220, 220, 220)')
            .style('stroke-width', '1px');

        // 축 레이블 위치 최적화
        const labelRadiusOffset = 20; // 레이블을 축보다 약간 더 바깥에 위치시킴
        const labelRadius = chartRadius + labelRadiusOffset;

        // 축 레이블
        axes.append('text')
            .attr('class', 'axis-label')
            .attr('x', (d, i) => labelRadius * Math.cos(angleSlice * i - Math.PI / 2))
            .attr('y', (d, i) => labelRadius * Math.sin(angleSlice * i - Math.PI / 2))
            .attr('dy', '0.35em')
            .style('text-anchor', (d, i) => {
                const angle = angleSlice * i - Math.PI / 2;
                return (Math.abs(angle) < Math.PI / 6 || Math.abs(angle - Math.PI) < Math.PI / 6) ? 'middle' :
                    (angle > 0 && angle < Math.PI) ? 'start' : 'end';
            })
            .style('font-size', '11px')
            .style('fill', 'rgb(60, 60, 60)')
            .text(d => d.axis);

        // 레이더 영역 그리기
        const radarG = axisGrid.append('g').attr('class', 'radar-wrapper');

        // 데이터 맵핑 함수
        const radarPathData = data.map((d, i) => ({
            x: (chartRadius / chartMaxValue) * d.value * Math.cos(angleSlice * i - Math.PI / 2),
            y: (chartRadius / chartMaxValue) * d.value * Math.sin(angleSlice * i - Math.PI / 2)
        }));

        // 레이더 경로 생성
        const radarPathFunction = d3.line<{ x: number, y: number }>()
            .x(d => d.x)
            .y(d => d.y)
            .curve(d3.curveLinearClosed);

        // 레이더 영역 추가
        radarG.append('path')
            .attr('d', radarPathFunction(radarPathData))
            .style('fill', 'rgba(54, 162, 235, 0.2)')
            .style('stroke', 'rgb(54, 162, 235)')
            .style('stroke-width', '2px');

        // 데이터 포인트 추가
        radarG.selectAll('.radar-circle')
            .data(radarPathData)
            .enter()
            .append('circle')
            .attr('class', 'radar-circle')
            .attr('r', 4)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .style('fill', 'rgb(54, 162, 235)')
            .style('stroke', '#fff')
            .style('stroke-width', '1px');

        // 데이터 값 표시
        radarG.selectAll('.value-text')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'value-text')
            .attr('x', (d, i) => {
                const pos = (chartRadius / chartMaxValue) * d.value * Math.cos(angleSlice * i - Math.PI / 2);
                // 값의 위치를 약간 조정
                return pos * 1.1;
            })
            .attr('y', (d, i) => {
                const pos = (chartRadius / chartMaxValue) * d.value * Math.sin(angleSlice * i - Math.PI / 2);
                // 값의 위치를 약간 조정
                return pos * 1.1;
            })
            .attr('dy', '.35em')
            .style('font-size', '10px')
            .style('fill', 'rgb(70, 70, 70)')
            .style('text-anchor', 'middle')
            .text(d => d.value.toFixed(1));
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{jobAverages.직무} 평가 요소별 평균</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[400px] flex justify-center items-center">
                    <svg ref={svgRef} width="100%" height="100%" />
                </div>
            </CardContent>
        </Card>
    );
} 