import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card rounded-xl px-3.5 py-2.5 border border-border">
      <p className="text-text-tertiary text-[10px] font-medium">{label}</p>
      <p className="text-text text-[14px] font-bold tabular-nums">{payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export default function ProgressChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-52 flex flex-col items-center justify-center text-center gap-2">
        <p className="text-text-secondary text-[15px]">No data yet</p>
        <p className="text-text-tertiary text-[13px]">Complete some sets to see your progress</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
        <defs>
          <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.08} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fill: '#636366', fontSize: 10 }}
          tickFormatter={(d) => d.slice(5)}
          axisLine={{ stroke: 'rgba(255,255,255,0.04)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#636366', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="volume"
          stroke="#FFFFFF"
          strokeWidth={1.5}
          fill="url(#volumeGradient)"
          dot={{ fill: '#FFFFFF', r: 2.5, strokeWidth: 0 }}
          activeDot={{ fill: '#FFFFFF', r: 4, strokeWidth: 2, stroke: 'rgba(255,255,255,0.2)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
