'use client';

import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EvaluationItem } from '@/types';
import { getEvaluationCategories } from '@/lib/data-processor';
import { getColorByIndex } from '@/lib/data-processor';
import { categoryToFieldMap } from '@/lib/chart-utils';

interface ScatterChartProps {
    jobData: EvaluationItem[];
    jobName: string;
}

export function ScatterChart({ jobData, jobName }: ScatterChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || !jobData || jobData.length === 0) return;

        renderScatterChart(svgRef.current, jobData);

        const handleResize = () => {
            if (svgRef.current) {
                renderScatterChart(svgRef.current, jobData);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [jobData]);

    const renderScatterChart = (svg: SVGSVGElement, data: EvaluationItem[]) => {
        // 차트 크기 설정
        const containerWidth = svg.parentElement?.clientWidth || 600;
        const containerHeight = svg.parentElement?.clientHeight || 400;

        const margin = { top: 30, right: 80, bottom: 60, left: 60 };
        const width = containerWidth - margin.left - margin.right;
        const height = containerHeight - margin.top - margin.bottom;

        // SVG 초기화
        const svgEl = d3.select(svg);
        svgEl.selectAll('*').remove();
        svgEl.attr('width', containerWidth).attr('height', containerHeight);

        const categories = getEvaluationCategories();
        const evaluators = [...new Set(data.map(d => d.평가자))];

        // 스케일 설정
        const xScale = d3.scaleBand()
            .domain(categories)
            .range([0, width])
            .padding(0.1);

        // 데이터의 최대값 계산 (실제 값에 기반한 y축 범위 설정)
        const allValues = [];
        for (const item of data) {
            allValues.push(item.항목1, item.항목2, item.항목3, item.항목4, item.항목5, item.항목6, item.항목7, item.항목8);
        }
        const maxValue = Math.max(...allValues);
        // 최소값은 0으로 고정하고, 최대값은 데이터에서 가져온 실제 최대값 사용
        // 단, 최대값이 5 이하면 5를 사용하고, 5보다 크면 실제 최대값 + 1을 사용 (여유 공간)
        const yDomainMax = maxValue <= 5 ? 5 : Math.ceil(maxValue);

        const yScale = d3.scaleLinear()
            .domain([0, yDomainMax])
            .range([height, 0])
            .nice();

        // 그래프 영역 생성
        const g = svgEl.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // X축 그리기
        g.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-45)');

        // X축 레이블
        g.append('text')
            .attr('x', width / 2)
            .attr('y', height + margin.bottom - 10)
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('평가 항목');

        // Y축 그리기
        g.append('g')
            .call(d3.axisLeft(yScale));

        // Y축 레이블
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -margin.left + 15)
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('점수');

        // 평가자별 데이터 포인트 및 라인 그리기
        evaluators.forEach((evaluator, idx) => {
            const evaluatorData = data.filter(d => d.평가자 === evaluator);
            const color = getColorByIndex(idx);

            // 라인 데이터 생성 - 해당 평가자의 현재 직무에 대한 평가 항목 값들
            const evalItem = evaluatorData[0]; // 현재 직무에 대한 평가 데이터

            if (!evalItem) return; // 데이터가 없으면 건너뛰기

            const lineData = categories.map(category => {
                // 컬럼 이름을 EvaluationItem 타입의 필드로 매핑
                const fieldName = categoryToFieldMap[category] as keyof EvaluationItem;
                const value = evalItem[fieldName] as number;

                return {
                    category,
                    value,
                    evaluator
                };
            });

            // 라인 생성기
            const line = d3.line<{ category: string, value: number }>()
                .x(d => (xScale(d.category) || 0) + xScale.bandwidth() / 2)
                .y(d => yScale(d.value));

            // 라인 그리기
            g.append('path')
                .datum(lineData)
                .attr('fill', 'none')
                .attr('stroke', color)
                .attr('stroke-width', 1.5)
                .attr('d', line);

            // 데이터 포인트 그리기
            g.selectAll(`.dot-${idx}`)
                .data(lineData)
                .enter()
                .append('circle')
                .attr('class', `dot-${idx}`)
                .attr('cx', d => (xScale(d.category) || 0) + xScale.bandwidth() / 2)
                .attr('cy', d => yScale(d.value))
                .attr('r', 4)
                .attr('fill', color)
                .attr('stroke', '#fff')
                .attr('stroke-width', 1);
        });

        // 평균선 그리기
        const averageData = categories.map(category => {
            const values = data.map(d => {
                const fieldName = categoryToFieldMap[category] as keyof EvaluationItem;
                return d[fieldName] as number;
            });
            const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
            return { category, value: avg };
        });

        // 평균선 생성기
        const avgLine = d3.line<{ category: string, value: number }>()
            .x(d => (xScale(d.category) || 0) + xScale.bandwidth() / 2)
            .y(d => yScale(d.value));

        // 평균선 그리기
        g.append('path')
            .datum(averageData)
            .attr('fill', 'none')
            .attr('stroke', 'rgb(0, 0, 0)')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5')
            .attr('d', avgLine);

        // 평균값 표시
        g.selectAll('.avg-value-text')
            .data(averageData)
            .enter()
            .append('text')
            .attr('class', 'avg-value-text')
            .attr('x', d => (xScale(d.category) || 0) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.value) - 10) // 점 위에 텍스트 표시
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('fill', 'black')
            .text(d => d.value.toFixed(1));

        // 범례 추가
        const legend = svgEl.append('g')
            .attr('transform', `translate(${containerWidth - margin.right + 10}, ${margin.top})`);

        // 평가자 범례
        evaluators.forEach((evaluator, idx) => {
            const legendG = legend.append('g')
                .attr('transform', `translate(0, ${idx * 20})`);

            legendG.append('rect')
                .attr('width', 12)
                .attr('height', 12)
                .attr('fill', getColorByIndex(idx));

            legendG.append('text')
                .attr('x', 20)
                .attr('y', 10)
                .style('font-size', '10px')
                .text(evaluator);
        });

        // 평균선 범례
        const avgLegend = legend.append('g')
            .attr('transform', `translate(0, ${evaluators.length * 20 + 10})`);

        avgLegend.append('line')
            .attr('x1', 0)
            .attr('y1', 6)
            .attr('x2', 12)
            .attr('y2', 6)
            .attr('stroke', 'rgb(0, 0, 0)')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5');

        avgLegend.append('text')
            .attr('x', 20)
            .attr('y', 10)
            .style('font-size', '10px')
            .text('평균');
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{jobName} 평가자별 점수 분포</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full h-[400px]">
                    <svg ref={svgRef} width="100%" height="100%" />
                </div>
            </CardContent>
        </Card>
    );
} 