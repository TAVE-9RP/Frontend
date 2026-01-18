import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DashboardChartProps {
  percent: number;
  label: string;
  colorType: 'blue' | 'orange' | 'black';
  maxPercent?: number;
}

const DashboardChart = ({
  percent,
  label,
  colorType,
  maxPercent = 100,
}: DashboardChartProps) => {
  const COLORS = {
    blue: '#008CFF',
    orange: '#FF9B3F',
    black: '#44454D',
    empty: '#E9EBEE',
  };

  const selectedColor = COLORS[colorType];

  const displayValue = (percent / maxPercent) * 100;

  const data = [
    { name: 'Progress', value: displayValue },
    { name: 'Remaining', value: 100 - displayValue },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[150px] w-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={75}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
              stroke="none"
            >
              <Cell key="cell-0" fill={selectedColor} />
              <Cell key="cell-1" fill={COLORS.empty} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div
          className="absolute inset-0 flex items-center justify-center font-pretendard text-[17px] font-bold"
          style={{ color: selectedColor }}
        >
          {percent % 1 === 0 ? percent : percent.toFixed(2)}%
        </div>
      </div>
      <p className="mt-[35px] text-center font-pretendard text-[15px] text-greyColor-grey500">
        {label}
      </p>
    </div>
  );
};

export default DashboardChart;
