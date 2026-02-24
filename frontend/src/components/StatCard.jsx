export default function StatCard({ title, value, icon, color = 'indigo' }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
  };
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl text-2xl mb-4 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}
