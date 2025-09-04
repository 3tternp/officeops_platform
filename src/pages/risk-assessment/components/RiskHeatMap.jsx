import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const RiskHeatMap = ({ risks = [], onRiskClick }) => {
  const [selectedCell, setSelectedCell] = useState(null);

  // Define likelihood and impact levels
  const likelihoodLevels = [
    { value: 5, label: 'Very High', color: 'bg-red-600' },
    { value: 4, label: 'High', color: 'bg-red-500' },
    { value: 3, label: 'Medium', color: 'bg-yellow-500' },
    { value: 2, label: 'Low', color: 'bg-green-500' },
    { value: 1, label: 'Very Low', color: 'bg-green-600' }
  ];

  const impactLevels = [
    { value: 1, label: 'Very Low' },
    { value: 2, label: 'Low' },
    { value: 3, label: 'Medium' },
    { value: 4, label: 'High' },
    { value: 5, label: 'Very High' }
  ];

  // Calculate risk score and determine color
  const getRiskColor = (likelihood, impact) => {
    const score = likelihood * impact;
    if (score >= 20) return 'bg-red-600 text-white';
    if (score >= 15) return 'bg-red-500 text-white';
    if (score >= 10) return 'bg-yellow-500 text-white';
    if (score >= 5) return 'bg-yellow-400 text-black';
    return 'bg-green-500 text-white';
  };

  // Get risks for specific cell
  const getRisksForCell = (likelihood, impact) => {
    return risks?.filter(risk => 
      risk?.likelihood === likelihood && risk?.impact === impact
    );
  };

  const handleCellClick = (likelihood, impact) => {
    const cellRisks = getRisksForCell(likelihood, impact);
    setSelectedCell({ likelihood, impact, risks: cellRisks });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Risk Heat Map</h3>
          <p className="text-sm text-muted-foreground">Interactive likelihood × impact matrix</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-red-600 rounded"></div>
            <span className="text-muted-foreground">Critical (20-25)</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-muted-foreground">Medium (10-19)</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-muted-foreground">Low (1-9)</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            <div className="p-3"></div>
            <div className="text-center text-sm font-medium text-muted-foreground p-3">
              Impact →
            </div>
            {impactLevels?.map(impact => (
              <div key={impact?.value} className="text-center text-xs font-medium text-muted-foreground p-2">
                <div>{impact?.value}</div>
                <div className="mt-1">{impact?.label}</div>
              </div>
            ))}
          </div>

          {/* Matrix */}
          {likelihoodLevels?.map((likelihood, rowIndex) => (
            <div key={likelihood?.value} className="grid grid-cols-7 gap-1 mb-1">
              {/* Y-axis label */}
              {rowIndex === 2 && (
                <div className="row-span-5 flex items-center justify-center text-sm font-medium text-muted-foreground transform -rotate-90 p-3">
                  ← Likelihood
                </div>
              )}
              {rowIndex !== 2 && <div className="p-3"></div>}
              
              {/* Likelihood label */}
              <div className="flex items-center justify-end text-xs font-medium text-muted-foreground p-2">
                <div className="text-right">
                  <div>{likelihood?.value}</div>
                  <div className="mt-1">{likelihood?.label}</div>
                </div>
              </div>

              {/* Risk cells */}
              {impactLevels?.map(impact => {
                const cellRisks = getRisksForCell(likelihood?.value, impact?.value);
                const riskScore = likelihood?.value * impact?.value;
                
                return (
                  <div
                    key={`${likelihood?.value}-${impact?.value}`}
                    onClick={() => handleCellClick(likelihood?.value, impact?.value)}
                    className={`
                      relative h-16 rounded cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md
                      ${getRiskColor(likelihood?.value, impact?.value)}
                      ${selectedCell?.likelihood === likelihood?.value && selectedCell?.impact === impact?.value 
                        ? 'ring-2 ring-primary ring-offset-2' : ''
                      }
                    `}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                      <div className="text-xs font-bold">{riskScore}</div>
                      {cellRisks?.length > 0 && (
                        <div className="text-xs opacity-80">
                          {cellRisks?.length} risk{cellRisks?.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    {cellRisks?.length > 0 && (
                      <div className="absolute top-1 right-1">
                        <Icon name="AlertTriangle" size={12} className="opacity-80" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Selected cell details */}
      {selectedCell && selectedCell?.risks?.length > 0 && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">
              Risks: Likelihood {selectedCell?.likelihood} × Impact {selectedCell?.impact} 
              (Score: {selectedCell?.likelihood * selectedCell?.impact})
            </h4>
            <button
              onClick={() => setSelectedCell(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
          
          <div className="space-y-2">
            {selectedCell?.risks?.map(risk => (
              <div
                key={risk?.id}
                onClick={() => onRiskClick && onRiskClick(risk)}
                className="flex items-center justify-between p-3 bg-card rounded border border-border hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">{risk?.title}</p>
                  <p className="text-xs text-muted-foreground">{risk?.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    risk?.status === 'Open' ? 'bg-error/10 text-error' :
                    risk?.status === 'In Progress'? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                  }`}>
                    {risk?.status}
                  </span>
                  <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskHeatMap;