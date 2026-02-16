import { AlertTriangle, Clock } from "lucide-react";
import Link from "next/link";

export function MaintenanceScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} className="text-amber-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Under Maintenance
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          We are currently performing scheduled maintenance to improve your experience. 
          Please check back later.
        </p>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 py-3 px-4 rounded-lg">
          <Clock size={16} />
          <span>Estimated return: Soon</span>
        </div>

        <div className="mt-8 text-xs text-gray-400">
          Admin access is still available via <Link href="/admin" className="underline hover:text-gray-600">/admin</Link>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-400 font-medium tracking-wide">
        ARKIVE E-COMMERCE
      </p>
    </div>
  );
}
