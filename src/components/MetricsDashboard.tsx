import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Cpu, CpuIcon, HardDrive, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockMetrics } from '../utils/mockData';

const data = [
  { name: '00:00', cpu: 20, gpu: 40 },
  { name: '00:05', cpu: 35, gpu: 55 },
  { name: '00:10', cpu: 28, gpu: 48 },
  { name: '00:15', cpu: 45, gpu: 70 },
  { name: '00:20', cpu: 32, gpu: 62 },
];

export function MetricsDashboard() {
  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">System Metrics</h2>
        <p className="text-slate-500 mt-1">Real-time hardware performance monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="CPU Usage"
          value={`${mockMetrics.cpu}%`}
          icon={<Cpu className="w-5 h-5" />}
          color="text-blue-600"
          bg="bg-blue-100"
        />
        <MetricCard
          title="Memory"
          value={`${mockMetrics.memory}%`}
          icon={<HardDrive className="w-5 h-5" />}
          color="text-emerald-600"
          bg="bg-emerald-100"
        />
        <MetricCard
          title="GPU Load"
          value={`${mockMetrics.gpu}%`}
          icon={<Activity className="w-5 h-5" />}
          color="text-purple-600"
          bg="bg-purple-100"
        />
        <MetricCard
          title="VRAM"
          value={`${mockMetrics.vram}%`}
          icon={<CpuIcon className="w-5 h-5" />}
          color="text-orange-600"
          bg="bg-orange-100"
        />
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Performance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: 'none' }}
                />
                <Line type="monotone" dataKey="cpu" stroke="#2563eb" strokeWidth={2} dot={false} name="CPU" />
                <Line type="monotone" dataKey="gpu" stroke="#9333ea" strokeWidth={2} dot={false} name="GPU" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, icon, color, bg }: any) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${bg} ${color}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}