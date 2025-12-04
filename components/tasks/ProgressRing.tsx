"use client";

type Props = {
  total: number;
  completed: number;
  label?: string;
};

export function ProgressRing({ total, completed, label = "完成度" }: Props) {
  const radius = 28;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const ratio = total === 0 ? 0 : completed / total;
  const strokeDashoffset = circumference - ratio * circumference;

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <svg height={radius * 2} width={radius * 2} className="flex-shrink-0">
        <circle
          stroke="#e2e8f0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="url(#grad)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s ease-out" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-slate-700 text-xs font-medium"
        >
          {Math.round(ratio * 100)}%
        </text>
      </svg>
      <div className="text-xs text-slate-500 hidden sm:block">
        <div className="font-medium text-slate-600">{label}</div>
        <div>{completed} / {total}</div>
      </div>
    </div>
  );
}
