import React from 'react';
import Icon from '../../../components/AppIcon';

const RiskHeatMap = ({ risks = [] }) => {
  const getRiskLevel = (likelihood, impact) => {
    const score = likelihood * impact;
    if (score >= 20) return { level: 'critical', color: 'bg-red-600', textColor: 'text-white' };
    if (score >= 15) return { level: 'high', color: 'bg-red-500', textColor: 'text-white' };
    if (score >= 10) return { level: 'medium', color: 'bg-yellow-500', textColor: 'text-white' };
    if (score >= 5) return { level: 'low', color: 'bg-green-500', textColor: 'text-white' };
    return { level: 'minimal', color: 'bg-green-400', textColor: 'text-white' };
  };

  const riskMatrix = [];
  for (let impact = 5; impact >= 1; impact--) {
    const row = [];
    for (let likelihood = 1; likelihood <= 5; likelihood++) {
      const cellRisks = risks?.filter(risk => 
        risk?.likelihood === likelihood && risk?.impact === impact
      );
      row?.push({
        likelihood,
        impact,
        risks: cellRisks,
        ...getRiskLevel(likelihood, impact)
      });
    }
    riskMatrix?.push(row);
  }

  const riskCounts = {
    critical: risks?.filter(r => getRiskLevel(r?.likelihood, r?.impact)?.level === 'critical')?.length,
    high: risks?.filter(r => getRiskLevel(r?.likelihood, r?.impact)?.level === 'high')?.length,
    medium: risks?.filter(r => getRiskLevel(r?.likelihood, r?.impact)?.level === 'medium')?.length,
    low: risks?.filter(r => getRiskLevel(r?.likelihood, r?.impact)?.level === 'low')?.length,
    minimal: risks?.filter(r => getRiskLevel(r?.likelihood, r?.impact)?.level === 'minimal')?.length
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-enterprise">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Risk Heat Map</h3>
          <Icon name="AlertTriangle" size={20} className="text-warning" />
        </div>
      </div>
      <div className="p-6">
        {/* Risk Summary */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          <div className="text-center">
            <div className="w-4 h-4 bg-red-600 rounded mx-auto mb-1"></div>
            <div className="text-xs font-medium text-foreground">{riskCounts?.critical}</div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-red-500 rounded mx-auto mb-1"></div>
            <div className="text-xs font-medium text-foreground">{riskCounts?.high}</div>
            <div className="text-xs text-muted-foreground">High</div>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mx-auto mb-1"></div>
            <div className="text-xs font-medium text-foreground">{riskCounts?.medium}</div>
            <div className="text-xs text-muted-foreground">Medium</div>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-green-500 rounded mx-auto mb-1"></div>
            <div className="text-xs font-medium text-foreground">{riskCounts?.low}</div>
            <div className="text-xs text-muted-foreground">Low</div>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-green-400 rounded mx-auto mb-1"></div>
            <div className="text-xs font-medium text-foreground">{riskCounts?.minimal}</div>
            <div className="text-xs text-muted-foreground">Minimal</div>
          </div>
        </div>

        {/* Heat Map Grid */}
        <div className="space-y-1">
          {/* Impact Labels */}
          <div className="flex items-center">
            <div className="w-16 text-xs font-medium text-muted-foreground text-right pr-2">Impact</div>
            <div className="flex-1"></div>
          </div>
          
          {riskMatrix?.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center">
              <div className="w-16 text-xs font-medium text-muted-foreground text-right pr-2">
                {5 - rowIndex}
              </div>
              <div className="flex-1 grid grid-cols-5 gap-1">
                {row?.map((cell, cellIndex) => (
                  <div
                    key={cellIndex}
                    className={`${cell?.color} ${cell?.textColor} h-12 rounded flex items-center justify-center text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity`}
                    title={`${cell?.risks?.length} risk(s) - Likelihood: ${cell?.likelihood}, Impact: ${cell?.impact}`}
                  >
                    {cell?.risks?.length > 0 ? cell?.risks?.length : ''}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {/* Likelihood Labels */}
          <div className="flex items-center">
            <div className="w-16"></div>
            <div className="flex-1 grid grid-cols-5 gap-1">
              {[1, 2, 3, 4, 5]?.map(likelihood => (
                <div key={likelihood} className="text-xs font-medium text-muted-foreground text-center">
                  {likelihood}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-16"></div>
            <div className="flex-1 text-xs font-medium text-muted-foreground text-center">
              Likelihood
            </div>
          </div>
        </div>

        {/* Recent High Risks */}
        {riskCounts?.critical + riskCounts?.high > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3">High Priority Risks</h4>
            <div className="space-y-2">
              {risks?.filter(risk => ['critical', 'high']?.includes(getRiskLevel(risk?.likelihood, risk?.impact)?.level))?.slice(0, 3)?.map((risk, index) => (
                  <div key={risk?.id || index} className="flex items-center space-x-3 p-2 bg-muted/50 rounded">
                    <div className={`w-3 h-3 rounded-full ${getRiskLevel(risk?.likelihood, risk?.impact)?.color}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{risk?.title}</p>
                      <p className="text-xs text-muted-foreground">{risk?.owner}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      L{risk?.likelihood}×I{risk?.impact}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskHeatMap;