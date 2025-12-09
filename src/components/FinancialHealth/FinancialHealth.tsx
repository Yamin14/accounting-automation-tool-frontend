import { useMemo, useCallback } from 'react';
import {
  Activity, Shield, Target, TrendingUp, BarChart3, CreditCard,
  Banknote, Calculator, Award, CheckCircle, AlertTriangle,
  ArrowRight
} from 'lucide-react';
// import Chatbot from './Chatbot';
import useCalculationsStore from '../../store/calculationsStore';
import { calculateHealthScore } from '../../utils/calculateHealthScore';
import { Link } from 'react-router';

const FinancialHealth = () => {
  const { totals, ratios } = useCalculationsStore();

  const healthScore = useMemo(() => {
    return calculateHealthScore(totals, ratios);
  }, [totals, ratios]);

  // --- Health Status Helper ---
  const getHealthStatus = useCallback((score: number) => {
    if (score >= 80) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-50', icon: Award };
    if (score >= 60) return { status: 'Good', color: 'text-blue-600', bg: 'bg-blue-50', icon: CheckCircle };
    if (score >= 40) return { status: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertTriangle };
    return { status: 'Poor', color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle };
  }, []);

  const status = getHealthStatus(healthScore);
  const StatusIcon = status.icon;

  // Ratios
  const currentRatio = ratios.liquidity.currentRatio ?? 0;
  const netProfitMargin = ratios.profitability.netProfitMargin ?? 0;
  const ROE = ratios.return.roe ?? 0;
  const assetTurnover = ratios.efficiency.assetTurnover ?? 0;
  const debtToEquity = ratios.solvency.debtToEquity ?? 0;
  const cashRatio = ratios.liquidity.cashRatio ?? 0;
  const operatingMargin = ratios.profitability.operatingProfitMargin ?? 0;

  // --- Key Metrics (dynamic & accurate) ---
  const keyMetrics = useMemo(() => [
    {
      name: 'Health Score',
      value: `${healthScore}/100`,
      icon: Activity,
      color: status.color,
      bgColor: status.bg,
      trend: healthScore >= 70 ? '+8 pts' : healthScore >= 50 ? '+2 pts' : '-5 pts',
      trendType: healthScore >= 60 ? 'positive' : 'negative'
    },
    {
      name: 'Current Ratio',
      value: currentRatio.toFixed(2),
      icon: Shield,
      color: currentRatio >= 2 ? 'text-green-600' : currentRatio >= 1.5 ? 'text-blue-600' : 'text-red-600',
      bgColor: currentRatio >= 2 ? 'bg-green-50' : currentRatio >= 1.5 ? 'bg-blue-50' : 'bg-red-50',
      trend: currentRatio >= 2 ? 'Strong' : currentRatio >= 1.5 ? 'Good' : 'Needs Attention',
      trendType: currentRatio >= 1.5 ? 'positive' : 'negative'
    },
    {
      name: 'Net Profit Margin',
      value: `${netProfitMargin.toFixed(1)}%`,
      icon: Target,
      color: netProfitMargin > 15 ? 'text-green-600' : netProfitMargin > 5 ? 'text-blue-600' : 'text-red-600',
      bgColor: netProfitMargin > 15 ? 'bg-green-50' : netProfitMargin > 5 ? 'bg-blue-50' : 'bg-red-50',
      trend: netProfitMargin > 15 ? 'Excellent' : netProfitMargin > 0 ? 'Positive' : 'Loss-Making',
      trendType: netProfitMargin > 10 ? 'positive' : netProfitMargin > 0 ? 'neutral' : 'negative'
    },
    {
      name: 'Return on Equity',
      value: `${ROE.toFixed(1)}%`,
      icon: TrendingUp,
      color: ROE > 20 ? 'text-green-600' : ROE > 10 ? 'text-blue-600' : 'text-red-600',
      bgColor: ROE > 20 ? 'bg-green-50' : ROE > 10 ? 'bg-blue-50' : 'bg-red-50',
      trend: ROE > 20 ? 'Outstanding' : ROE > 10 ? 'Solid' : 'Low',
      trendType: ROE > 15 ? 'positive' : 'negative'
    },
    {
      name: 'Asset Turnover',
      value: `${assetTurnover.toFixed(2)}x`,
      icon: BarChart3,
      color: assetTurnover > 1.2 ? 'text-green-600' : assetTurnover > 0.8 ? 'text-blue-600' : 'text-red-600',
      bgColor: assetTurnover > 1.2 ? 'bg-green-50' : assetTurnover > 0.8 ? 'bg-blue-50' : 'bg-red-50',
      trend: assetTurnover > 1.2 ? 'Highly Efficient' : assetTurnover > 0.8 ? 'Moderate' : 'Inefficient',
      trendType: assetTurnover > 1 ? 'positive' : 'negative'
    },
    {
      name: 'Debt-to-Equity',
      value: debtToEquity === Infinity ? '∞' : debtToEquity.toFixed(2),
      icon: CreditCard,
      color: debtToEquity <= 0.5 ? 'text-green-600' : debtToEquity <= 1 ? 'text-yellow-600' : 'text-red-600',
      bgColor: debtToEquity <= 0.5 ? 'bg-green-50' : debtToEquity <= 1 ? 'bg-yellow-50' : 'bg-red-50',
      trend: debtToEquity <= 0.5 ? 'Conservative' : debtToEquity <= 1 ? 'Moderate' : 'High Risk',
      trendType: debtToEquity <= 1 ? 'positive' : 'negative'
    },
    {
      name: 'Cash Ratio',
      value: cashRatio.toFixed(2),
      icon: Banknote,
      color: cashRatio >= 0.3 ? 'text-green-600' : cashRatio >= 0.1 ? 'text-blue-600' : 'text-red-600',
      bgColor: cashRatio >= 0.3 ? 'bg-green-50' : cashRatio >= 0.1 ? 'bg-blue-50' : 'bg-red-50',
      trend: cashRatio >= 0.3 ? 'Very Strong' : cashRatio >= 0.1 ? 'Adequate' : 'Weak',
      trendType: cashRatio >= 0.2 ? 'positive' : 'negative'
    },
    {
      name: 'Operating Margin',
      value: `${operatingMargin.toFixed(1)}%`,
      icon: Calculator,
      color: operatingMargin > 20 ? 'text-green-600' : operatingMargin > 8 ? 'text-blue-600' : 'text-red-600',
      bgColor: operatingMargin > 20 ? 'bg-green-50' : operatingMargin > 8 ? 'bg-blue-50' : 'bg-red-50',
      trend: operatingMargin > 20 ? 'Excellent' : operatingMargin > 8 ? 'Healthy' : 'Concerning',
      trendType: operatingMargin > 12 ? 'positive' : 'negative'
    }
  ], [ROE, assetTurnover, cashRatio, currentRatio, debtToEquity, healthScore, netProfitMargin, operatingMargin, status.bg, status.color]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Financial Health Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Real-time AI-powered insights into your company’s financial performance
        </p>
      </div>

      {/* Top Row: Health Score + Chatbot */}
      <div className="">
        {/* Health Score Card */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Overall Financial Health</h2>
              <p className="text-gray-600 mt-1">Based on profitability, liquidity, leverage, and efficiency</p>
            </div>
            <div className={`p-5 rounded-2xl ${status.bg}`}>
              <StatusIcon className={`h-10 w-10 ${status.color}`} />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-5xl font-bold text-gray-900">{healthScore}</span>
              <span className={`text-2xl font-semibold ${status.color}`}>/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-5">
              <div
                className={`h-5 rounded-full transition-all duration-1000 ease-out ${
                  healthScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                  healthScore >= 60 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                  healthScore >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-red-500 to-pink-600'
                }`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`px-5 py-2.5 rounded-full text-sm font-bold ${status.bg} ${status.color}`}>
              {status.status} Financial Health
            </span>
            {/* <Chatbot /> */}
          </div>
        </div>

        {/* Placeholder for future sector card or quick stats */}
        {/* <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Need Help?</h3>
            <Bot className="h-8 w-8 opacity-80" />
          </div>
          <p className="text-indigo-100 mb-6">
            Ask the AI Assistant anything about your ratios, recommendations, or performance.
          </p>
          <div className="text-3xl font-bold">Just click "Open Assistant"</div>
          <p className="text-sm text-indigo-200 mt-2">Powered by real-time financial data</p>
        </div> */}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric) => {
          const Icon = metric.icon;
          const trendColor = metric.trendType === 'positive' ? 'bg-green-100 text-green-700' :
                            metric.trendType === 'negative' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700';

          return (
            <div
              key={metric.name}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${trendColor}`}>
                  {metric.trend}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600">{metric.name}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Deep Analysis Toggle */}
      <div className="text-center mt-12">
        <Link to='/financial-ratios' className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
          View Detailed Analysis
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default FinancialHealth;