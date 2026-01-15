import React from 'react';
import { Line } from '@ant-design/plots';

const LeadTimeChart = () => {
  const data = [
    { month: '1월', value: 1.1, type: 'actual' },
    { month: '2월', value: 2.1, type: 'actual' },
    { month: '3월', value: 1.5, type: 'actual' },
    { month: '4월', value: 2.5, type: 'actual' },
    { month: '5월', value: 3.1, type: 'actual' },
    { month: '6월', value: 1.6, type: 'actual' },
    { month: '7월', value: 4.1, type: 'actual' },
    { month: '8월', value: 3.1, type: 'actual' },
    { month: '9월', value: 1.8, type: 'actual' },
    { month: '10월', value: 4.1, type: 'actual' },
    { month: '11월', value: 3.7, type: 'actual' },
    { month: '12월', value: 4.1, type: 'actual' }, // 12월 실적 추가
    // 주황색 그래프 구간: 12월(시작점) ~ 1월(내년)
    { month: '12월', value: 4.1, type: 'predict' },
    { month: '1월 ', value: 3.8, type: 'predict' }, // 내년 1월 예측값 (중복 방지를 위해 공백 추가)
  ];

  const config = {
    data,
    xField: 'month',
    yField: 'value',
    colorField: 'type',
    autoFit: true,
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 80,
    paddingBottom: 90,
    scale: {
      color: { range: ['#2688FF', '#FFB13B'] },
      y: { domain: [0, 5], tickCount: 6 },
    },
    axis: {
      y: { grid: true, gridLineDash: [0, 0], gridStroke: '#F0F0F0' },
      x: {
        line: true,
        lineStroke: '#F0F0F0',
        // x축 순서 고정 (데이터 순서대로 표시)
        labelFormatter: (val: string) => val.trim(),
      },
    },
    point: {
      shapeField: 'circle',
      sizeField: 3.5,
      style: {
        fill: (d: any) => (d.type === 'actual' ? '#2688FF' : '#FFB13B'),
        stroke: (d: any) => (d.type === 'actual' ? '#2688FF' : '#FFB13B'),
        lineWidth: 1,
      },
    },
    style: { lineWidth: 2 },
    legend: {
      color: {
        position: 'bottom',
        layout: { justifyContent: 'center' },
        itemMarker: 'circle',
        itemMarkerSize: 8,
        labelFormatter: () => '평균 출하 리드타임',
        labelFontSize: 16,
        labelFontFamily: 'Pretendard',
        labelFontWeight: 500,
        labelFill: 'var(--greyColor-grey600)',
        labelLetterSpacing: -0.32,
        filter: (item: any) => item.value === 'actual',
      },
    },
    state: {
      active: { stroke: 'none', lineWidth: 0 },
      inactive: { opacity: 1 },
    },
    interaction: {
      tooltip: false,
      elementActive: false,
      elementHighlight: false,
      legendFilter: false,
    },
  };

  return (
    <div className="relative h-full w-full font-pretendard">
      <span className="absolute left-[35px] top-[45px] text-[12px] text-greyColor-grey500">
        Days
      </span>

      <div className="absolute left-1/2 top-[35px] -translate-x-1/2 text-[16px] font-bold text-greyColor-grey600">
        2025년 - 2026년
      </div>

      <Line {...config} />
    </div>
  );
};

export default LeadTimeChart;
