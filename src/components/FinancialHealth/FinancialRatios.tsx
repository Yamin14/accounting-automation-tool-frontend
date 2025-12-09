import React, { useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer, ReferenceLine
} from 'recharts';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import useCalculationsStore from '../../store/calculationsStore';
import { ratioDescriptions, ratioOverview } from './ratioDescriptions';

type Category = 'profitability' | 'return' | 'solvency' | 'liquidity' | 'efficiency';

const CATEGORY_LABELS: Record<Category, string> = {
    profitability: 'Profitability Ratios',
    return: 'Return Ratios',
    solvency: 'Solvency Ratios',
    liquidity: 'Liquidity Ratios',
    efficiency: 'Efficiency Ratios'
};

const FinancialRatios: React.FC = () => {
    const { ratios } = useCalculationsStore();
    const [category, setCategory] = useState<Category>('profitability');

    const chartData = useMemo(() => {
        const catData: { name: string; value: number | null }[] = [];
        const add = (key: string, value: number | null) =>
            catData.push({ name: ratioDescriptions[key]?.title ?? key, value });

        if (category === 'profitability') {
            const p = ratios.profitability;
            add('grossProfitMargin', p.grossProfitMargin);
            add('operatingProfitMargin', p.operatingProfitMargin);
            add('pretaxMargin', p.pretaxMargin);
            add('netProfitMargin', p.netProfitMargin);
            add('cashFlowMargin', p.cashFlowMargin);
        }

        if (category === 'return') {
            const r = ratios.return;
            add('roa', r.roa);
            add('roe', r.roe);
            add('roce', r.roce);
            add('roi', r.roi);
        }

        if (category === 'solvency') {
            const s = ratios.solvency;
            add('debtToEquity', s.debtToEquity);
            add('debtRatio', s.debtRatio);
            add('interestCoverage', s.interestCoverage);
            add('equityRatio', s.equityRatio);
        }

        if (category === 'liquidity') {
            const l = ratios.liquidity;
            add('currentRatio', l.currentRatio);
            add('quickRatio', l.quickRatio);
            add('cashRatio', l.cashRatio);
        }

        if (category === 'efficiency') {
            const e = ratios.efficiency;
            add('inventoryTurnover', e.inventoryTurnover);
            add('receivablesTurnover', e.receivablesTurnover);
            add('payablesTurnover', e.payablesTurnover);
            add('assetTurnover', e.assetTurnover);
            add('fixedAssetTurnover', e.fixedAssetTurnover);
            add('workingCapitalTurnover', e.workingCapitalTurnover);
        }

        return catData;
    }, [category, ratios]);

    const formatValue = (val: number | null) => {
        if (val === null || val === undefined) return '—';
        if (Math.abs(val) >= 1000) return val.toFixed(0);
        return val.toFixed(2);
    };

    const getBenchmarkValue = () => {
        const benchmarks: Record<string, number> = {
            grossProfitMargin: 40, operatingProfitMargin: 15, netProfitMargin: 10,
            roa: 8, roe: 15, roce: 12, roi: 10,
            debtToEquity: 2, debtRatio: 0.5, interestCoverage: 3, equityRatio: 0.5,
            currentRatio: 2, quickRatio: 1, cashRatio: 0.5
        };

        const validRatios = chartData.filter(r => r.value !== null);
        if (!validRatios.length) return null;

        const highestValue = validRatios.reduce((max, curr) =>
            Math.abs(curr.value!) > Math.abs(max.value!) ? curr : max
        );

        const foundKey = Object.keys(ratioDescriptions).find(
            k => ratioDescriptions[k].title === highestValue.name
        );

        return foundKey ? benchmarks[foundKey] ?? null : null;
    };

    const benchmarkValue = getBenchmarkValue();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* === HEADER === */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">

                        {/* Left: Title + Description */}
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                {CATEGORY_LABELS[category]}
                            </h1>

                            <p className="mt-6 text-lg text-gray-600 max-w-3xl leading-relaxed">
                                {ratioOverview[category].description}
                            </p>
                        </div>

                        {/* Right: Controls */}
                        <div className="flex items-center gap-4 self-start">
                            {/* Category Selector */}
                            <div className="relative">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as Category)}
                                    className="appearance-none bg-white border border-gray-300 rounded-xl px-5 py-3 pr-10 font-medium text-gray-700 shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer"
                                >
                                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                            </div>

                            {/* Back Button */}
                            <Link
                                to="/financial-health"
                                className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                Back
                            </Link>
                        </div>
                    </div>
                </div>

                {/* === CHART === */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Ratio Performance Overview</h2>
                        {benchmarkValue !== null && (
                            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                                Industry Benchmark: <span className="text-emerald-600 font-bold">{benchmarkValue.toFixed(1)}</span>
                            </span>
                        )}
                    </div>

                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData.map(d => ({ name: d.name, value: d.value ?? 0 }))}
                                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                            >
                                <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    angle={-40}
                                    textAnchor="end"
                                    height={100}
                                    tick={{ fontSize: 13, fill: '#555' }}
                                    interval={0}
                                />
                                <YAxis tickFormatter={formatValue} tick={{ fill: '#666' }} />
                                <Tooltip
                                    formatter={(v: number) => formatValue(v)}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={32} />
                                {benchmarkValue !== null && (
                                    <ReferenceLine
                                        y={benchmarkValue}
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        strokeDasharray="6 6"
                                        label={{ value: 'Benchmark', position: 'right', fill: '#10b981', fontSize: 13 }}
                                    />
                                )}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* === RATIO CARDS – Beautifully Redesigned === */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {chartData.map((ratio) => {
                        const key = Object.keys(ratioDescriptions).find(
                            k => ratioDescriptions[k].title === ratio.name
                        );
                        const desc = key ? ratioDescriptions[key] : { title: ratio.name, description: '', formula: '' };

                        const isPositive = ratio.value !== null && ratio.value > 0;
                        const accentColor = isPositive
                            ? 'border-l-indigo-500'
                            : ratio.value === null
                                ? 'border-l-gray-300'
                                : 'border-l-red-400';

                        return (
                            <div
                                key={ratio.name}
                                className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${accentColor} border-l-4`}
                            >
                                <div className="p-7">
                                    {/* Title + Value */}
                                    <div className="flex justify-between items-start mb-5">
                                        <h3 className="text-lg font-bold text-gray-900 pr-4">
                                            {desc.title}
                                        </h3>
                                        <span className={`text-2xl font-bold font-mono ${ratio.value === null ? 'text-gray-400' : 'text-indigo-600'}`}>
                                            {formatValue(ratio.value)}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 text-base leading-relaxed mb-5">
                                        {desc.description}
                                    </p>

                                    {/* Formula */}
                                    {desc.formula && (
                                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4">
                                            <p className="text-sm font-semibold text-indigo-800 mb-1">Formula</p>
                                            <p className="text-sm font-mono text-indigo-700 break-all">
                                                {desc.formula}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FinancialRatios;