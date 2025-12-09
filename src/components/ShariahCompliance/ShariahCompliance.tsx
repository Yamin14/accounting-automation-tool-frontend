import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import useCalculationsStore from '../../store/calculationsStore';
import { shariahStandards, defaultStandard, type ShariahStandardKey } from './shariahStandards';

const ShariahCompliance: React.FC = () => {
  const { totals } = useCalculationsStore();
  const [selectedStandard, setSelectedStandard] = useState<ShariahStandardKey>(defaultStandard);

  const standard = shariahStandards[selectedStandard];
  const criteria = useMemo(() => standard.financialCriteria(totals), [standard, totals]);

  const passedCount = criteria.filter(c => c.pass).length;
  const totalFinancial = criteria.length;
  const allPassed = passedCount === totalFinancial;
  const compliancePercentage = Math.round((passedCount / totalFinancial) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Shariah Compliance Screening
            </h1>
            <p className="mt-3 text-lg text-gray-600 max-w-2xl">
              Evaluate company compliance against {standard.name} Shariah standards using latest financial data.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value as ShariahStandardKey)}
                className="appearance-none flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition pr-10 cursor-pointer"
              >
                {Object.entries(shariahStandards).map(([key, std]) => (
                  <option key={key} value={key}>{std.name}</option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>

            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </Link>
          </div>
        </div>

        {/* Compliance Summary Card – Big & Beautiful */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden mb-10">
          <div className="p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold text-gray-900">Compliance Result</h2>
                <p className="mt-3 text-lg text-gray-600">
                  {passedCount} out of {totalFinancial} financial screening criteria passed
                </p>
              </div>
              <div className={`p-8 rounded-2xl shadow-md ${allPassed ? 'bg-green-50' : 'bg-red-50'}`}>
                {allPassed ? (
                  <CheckCircle2 className="h-16 w-16 text-green-600" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-600" />
                )}
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <span className="text-6xl font-bold text-gray-900">{compliancePercentage}</span>
                  <span className={`text-3xl font-semibold ml-3 ${allPassed ? 'text-green-600' : 'text-red-600'}`}>%</span>
                </div>
                <span className={`px-8 py-4 rounded-full text-xl font-bold ${allPassed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {allPassed ? 'Shariah Compliant' : 'Not Compliant'}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className={`h-6 rounded-full transition-all duration-1000 ease-out shadow-lg ${
                    allPassed
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                      : 'bg-gradient-to-r from-red-500 to-pink-600'
                  }`}
                  style={{ width: `${compliancePercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Business Activity Rules (if any) */}
        {standard.businessActivityRules && standard.businessActivityRules.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Activity Requirements</h2>
            <ul className="space-y-4">
              {standard.businessActivityRules.map((rule, i) => (
                <li key={i} className="flex items-start gap-4 text-gray-700">
                  <AlertCircle className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-base leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
            {standard.notes && (
              <p className="mt-6 text-sm text-gray-600 italic bg-gray-50 px-5 py-4 rounded-xl">
                {standard.notes}
              </p>
            )}
          </div>
        )}

        {/* Financial Criteria Grid – Premium Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {criteria.map((crit, i) => (
            <div
              key={i}
              className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3.5 rounded-xl shadow-sm ${crit.pass ? 'bg-green-50' : 'bg-red-50'}`}>
                    {crit.pass ? (
                      <CheckCircle2 className="h-7 w-7 text-green-600" />
                    ) : (
                      <XCircle className="h-7 w-7 text-red-600" />
                    )}
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${crit.pass ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                    {crit.pass ? 'Pass' : 'Fail'}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-gray-600 mb-2">{crit.name}</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {crit.value !== null ? `${crit.value.toFixed(2)}%` : 'N/A'}
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Threshold:</span>
                    <span className="font-medium text-gray-900">{crit.threshold}</span>
                  </div>
                  <div className="text-gray-500">
                    <span>Formula:</span>{' '}
                    <code className="font-mono bg-gray-100 px-2 py-1 rounded">{crit.formula}</code>
                  </div>
                </div>

                {crit.description && (
                  <p className="mt-4 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                    {crit.description}
                  </p>
                )}

                <div className={`mt-4 h-1 rounded-full ${crit.pass ? 'bg-green-200' : 'bg-red-200'}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Reference + CTA */}
        <div className="text-center mt-16 space-y-8">
          <p className="text-sm text-gray-600">
            Screening based on:{' '}
            <a
              href={standard.referenceUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 hover:underline"
            >
              {standard.referenceName}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShariahCompliance;