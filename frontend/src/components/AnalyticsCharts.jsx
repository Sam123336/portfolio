// filepath: /home/sambit/Documents/portfolio-main/frontend/src/components/AnalyticsCharts.jsx
import React from 'react';

// Simple Line Chart Component
export const LineChart = ({ data, xKey, yKey, title, color = "#3B82F6" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d[yKey] || 0));
  const minValue = Math.min(...data.map(d => d[yKey] || 0));
  const range = maxValue - minValue || 1;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="relative h-64">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="0"
              y1={i * 40}
              x2="400"
              y2={i * 40}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}
          
          {/* Chart line */}
          <polyline
            points={data.map((d, i) => {
              const x = (i / (data.length - 1)) * 400;
              const y = 200 - ((d[yKey] - minValue) / range) * 180;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 400;
            const y = 200 - ((d[yKey] - minValue) / range) * 180;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill={color}
                className="hover:r-6 transition-all duration-200 cursor-pointer"
              >
                <title>{`${d[xKey]}: ${d[yKey]}`}</title>
              </circle>
            );
          })}
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-gray-500 -ml-8">
          {[maxValue, Math.round(maxValue * 0.75), Math.round(maxValue * 0.5), Math.round(maxValue * 0.25), minValue].map((value, i) => (
            <span key={i}>{value}</span>
          ))}
        </div>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0).map(d => (
          <span key={d[xKey]}>{d[xKey]}</span>
        ))}
      </div>
    </div>
  );
};

// Simple Bar Chart Component
export const BarChart = ({ data, xKey, yKey, title, color = "#10B981" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d[yKey] || 0));

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-sm text-gray-600 truncate">
              {item[xKey]}
            </div>
            <div className="flex-1 mx-3">
              <div className="bg-gray-200 rounded-full h-4 relative overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${(item[yKey] / maxValue) * 100}%`,
                    backgroundColor: color
                  }}
                />
              </div>
            </div>
            <div className="w-12 text-sm font-medium text-gray-900 text-right">
              {item[yKey]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Donut Chart Component
export const DonutChart = ({ data, title, colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);
  let currentAngle = 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.count / total) * 100;
              const angle = (item.count / total) * 360;
              const startAngle = currentAngle;
              currentAngle += angle;
              
              const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 100 + 80 * Math.cos(((startAngle + angle) * Math.PI) / 180);
              const y2 = 100 + 80 * Math.sin(((startAngle + angle) * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 100 100`,
                `L ${x1} ${y1}`,
                `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={colors[index % colors.length]}
                  className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                >
                  <title>{`${item.device}: ${item.count} (${percentage.toFixed(1)}%)`}</title>
                </path>
              );
            })}
            
            {/* Center circle */}
            <circle cx="100" cy="100" r="50" fill="white" />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="ml-8 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-4 h-4 rounded mr-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-700">{item.device}</span>
              <span className="ml-2 text-sm font-medium text-gray-900">
                {((item.count / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Real-time Activity Feed
export const ActivityFeed = ({ events, title }) => {
  const getEventIcon = (type) => {
    switch (type) {
      case 'page_view':
        return '👁️';
      case 'project_click':
        return '🚀';
      case 'contact_form_submit':
        return '📧';
      case 'external_link_click':
        return '🔗';
      default:
        return '📊';
    }
  };

  const getEventDescription = (event) => {
    switch (event.type) {
      case 'page_view':
        return `Viewed ${event.page || 'page'}`;
      case 'project_click':
        return `Clicked project: ${event.project || 'Unknown'}`;
      case 'contact_form_submit':
        return 'Submitted contact form';
      case 'external_link_click':
        return 'Clicked external link';
      default:
        return event.type;
    }
  };

  const formatTime = (time) => {
    const date = new Date(time);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {events && events.length > 0 ? (
          events.map((event, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <span className="text-2xl mr-3">{getEventIcon(event.type)}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {getEventDescription(event)}
                </p>
                <p className="text-xs text-gray-500">
                  {event.device && `${event.device} • `}{formatTime(event.time)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default { LineChart, BarChart, DonutChart, ActivityFeed };