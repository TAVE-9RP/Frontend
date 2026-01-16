import React from 'react';
import { Line } from '@ant-design/plots';

interface LeadTimeChartData {
  month: string;
  value: number;
  type: 'actual' | 'predict';
}

interface LeadTimeChartProps {
  data?: LeadTimeChartData[];
}

const LeadTimeChart: React.FC<LeadTimeChartProps> = ({ data: propData }) => {
  const defaultData: LeadTimeChartData[] = [
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
    { month: '12월', value: 4.1, type: 'actual' },
    { month: '12월', value: 4.1, type: 'predict' },
    { month: '1월 ', value: 3.8, type: 'predict' },
  ];

  const data = propData && propData.length > 0 ? propData : defaultData;

  // y축 scale 계산 (5 단위로)
  const getYScaleDomain = () => {
    if (!data || data.length === 0) {
      return { min: 0, max: 10, tickCount: 3 };
    }

    const values = data.map((d) => d.value).filter((v) => !isNaN(v) && v !== null && v !== undefined);
    
    if (values.length === 0) {
      return { min: 0, max: 10, tickCount: 3 };
    }

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // 5 단위로 반올림
    const min = Math.floor(minValue / 5) * 5;
    const max = Math.ceil(maxValue / 5) * 5;

    // 최소값이 0보다 작으면 0으로 설정
    const adjustedMin = Math.max(0, min);

    // 최대값이 0이면 기본값 10으로 설정
    const adjustedMax = adjustedMin === 0 && max === 0 ? 10 : max;

    // tickCount 계산 (5 단위 간격)
    const range = adjustedMax - adjustedMin;
    const tickCount = Math.max(2, Math.ceil(range / 5) + 1);

    return { min: adjustedMin, max: adjustedMax, tickCount };
  };

  const yScale = getYScaleDomain();

  const config = {
    data,
    xField: 'month',
    yField: 'value',
    colorField: 'type',
    width: 1070,
    height: 363,
    autoFit: false,
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 80,
    paddingBottom: 90,
    scale: {
      color: { range: ['#2688FF', '#FFB13B'] },
      y: { domain: [yScale.min, yScale.max], tickCount: yScale.tickCount },
    },
    axis: {
      y: { grid: true, gridLineDash: [0, 0], gridStroke: '#F0F0F0' },
      x: {
        line: true,
        lineStroke: '#F0F0F0',
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
    <div className="relative h-full w-full font-pretendard" style={{ minWidth: 0, minHeight: 0 }}>
      <span className="absolute left-[35px] top-[45px] text-[12px] text-greyColor-grey500">
        Days
      </span>

      <div className="absolute left-1/2 top-[35px] -translate-x-1/2 text-[16px] font-bold text-greyColor-grey600">
        2025년 - 2026년
      </div>

      {data && data.length > 0 ? (
        <Line {...config} />
      ) : (
        <div className="flex h-full items-center justify-center text-greyColor-grey500">
          데이터를 불러오는 중...
        </div>
      )}
    </div>
  );
};

export default LeadTimeChart;
