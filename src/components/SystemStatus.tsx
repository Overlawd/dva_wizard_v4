import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '/components/ui/card';
import { generateMetrics } from '../utils/mockData';
import { getLoadColor, getLoadBgColor, determineTaskBound, getSuggestedModel } from '../utils/helpers';
import { SystemMetrics, TaskBoundStatus } from '../types';
import { Cpu, HardDrive, Network, Activity, Zap, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export function SystemStatus() {
  const [metrics, setMetrics] = useState<SystemMetrics>(generateMetrics());
  const [taskBound, setTaskBound] = useState<TaskBoundStatus>('Normal');
  const [showModelSuggestion, setShowModelSuggestion] = useState(false);
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const newMetrics = generateMetrics();
      setMetrics(newMetrics);
      setTaskBound(determineTaskBound(newMetrics));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const warnings = [
    { id: 'gpu-temp', condition: metrics.gpuTemp >= 80, message: `GPU Temperature Critical: ${metrics.gpuTemp.toFixed(0)}°C` },
    { id: 'vram', condition: metrics.vram >= 90, message: `VRAM Critical: ${metrics.vram.toFixed(0)}% used` },
    { id: 'memory', condition: metrics.memory >= 90, message: `Memory Critical: ${metrics.memory.toFixed(0)}% used` },
    { id: 'cpu', condition: metrics.cpu >= 90, message: `CPU Critical: ${metrics.cpu.toFixed(0)}% used` },
  ];

  const activeWarnings = warnings.filter(w => w.condition && !dismissedWarnings.has(w.id));

  const dismissWarning = (id: string) => {
    setDismissedWarnings(prev => new Set([...prev, id]));
    setTimeout(() => {
      setDismissedWarnings(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 30000);
  };

  const StatBar = ({ label, value, icon: Icon, suffix = '%' }: { label: string; value: number; icon: any; suffix?: string }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </div>
        <span className={`font-semibold ${getLoadColor(value)}`}>
          {value.toFixed(0)}{suffix}
        </span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getLoadBgColor(value)} transition-all duration-500 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800">System Status</CardTitle>
          <div className="flex items-center gap-2">
            {metrics.ollamaActive ? (
              <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                <Activity className="w-3 h-3 animate-pulse" />
                Ollama Active
              </div>
            ) : (
              <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                <XCircle className="w-3 h-3" />
                Idle
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeWarnings.length > 0 && (
          <div className="space-y-2">
            {activeWarnings.map(warning => (
              <div key={warning.id} className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-red-800 font-medium">{warning.message}</p>
                </div>
                <button 
                  onClick={() => dismissWarning(warning.id)}
                  className="text-red-400 hover:text-red-600 flex-shrink-0"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={`p-3 rounded-lg border ${
          taskBound === 'Normal' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <div className="flex items-center gap-2">
            {taskBound === 'Normal' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {taskBound === 'Normal' ? 'System Operating Normally' : `${taskBound} Detected`}
            </span>
          </div>
          {taskBound !== 'Normal' && (
            <p className="text-xs mt-1 opacity-80">
              Applying 95% weight to bottleneck resource
            </p>
          )}
        </div>

        <div className="space-y-3">
          <StatBar label="GPU Utilization" value={metrics.gpu} icon={Activity} />
          <StatBar label="VRAM Usage" value={metrics.vram} icon={HardDrive} />
          <StatBar label="CPU Usage" value={metrics.cpu} icon={Cpu} />
          <StatBar label="Memory" value={metrics.memory} icon={HardDrive} />
          <StatBar label="Disk I/O" value={metrics.disk} icon={HardDrive} />
          <StatBar label="Network" value={metrics.network} icon={Network} />
          
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">GPU Temperature</span>
              <span className={`font-semibold ${metrics.gpuTemp >= 80 ? 'text-red-600' : 'text-slate-700'}`}>
                {metrics.gpuTemp.toFixed(0)}°C
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200">
          <button
            onClick={() => setShowModelSuggestion(!showModelSuggestion)}
            className="w-full flex items-center justify-between text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            <span>Model Suggestion</span>
            <span className="text-xs text-slate-500">
              {showModelSuggestion ? '▼' : '▶'}
            </span>
          </button>
          
          {showModelSuggestion && (
            <div className="mt-3 p-3 bg-slate-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Available VRAM:</span>
                <span className="font-semibold text-slate-800">
                  {metrics.vramTotal} GB
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Recommended:</span>
                <span className="font-semibold text-blue-600">
                  {getSuggestedModel(metrics.vramTotal)}
                </span>
              </div>
              <div className="text-xs text-slate-500 pt-1">
                Based on hardware detection and current load
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-slate-400 text-center pt-2">
          Updates every 2 seconds
        </div>
      </CardContent>
    </Card>
  );
}