const conf = require('../../conf.json');
const appName = conf.appName || 'App';

const css = `
        /* Сброс стилей */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        /* Основные стили */
        :root {
            --bg-primary: #0f172a;
            --bg-secondary: #1e293b;
            --bg-tertiary: #334155;
            --text-primary: #f1f5f9;
            --text-secondary: #94a3b8;
            --accent-primary: #22c55e;
            --accent-secondary: #3b82f6;
            --accent-warning: #f59e0b;
            --accent-danger: #ef4444;
            --border-radius: 8px;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
            padding: 0;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 30px 20px;
            background: var(--bg-secondary);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
        }
        
        .header h1 {
            font-size: 2.2rem;
            margin-bottom: 10px;
            color: var(--accent-primary);
        }
        
        .header p {
            color: var(--text-secondary);
            font-size: 1.1rem;
        }
        
        .grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        @media (min-width: 768px) {
            .grid {
                grid-template-columns: 1fr 1fr;
            }
        }
        
        .card {
            background: var(--bg-secondary);
            padding: 20px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            border: 1px solid var(--bg-tertiary);
        }
        
        .card-large {
            grid-column: 1 / -1;
        }
        
        .card h3 {
            font-size: 1.3rem;
            margin-bottom: 20px;
            color: var(--accent-primary);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .card h3::before {
            content: '';
            width: 6px;
            height: 6px;
            background: var(--accent-primary);
            border-radius: 50%;
        }
        
        .current-core-highlight {
            background: linear-gradient(135deg, var(--bg-secondary), #2d3748);
            border: 2px solid var(--accent-primary);
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.2);
        }
        
        .stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 12px;
            margin-top: 15px;
        }
        
        .stat-item {
            background: var(--bg-tertiary);
            padding: 12px;
            border-radius: 6px;
            text-align: center;
        }
        
        .stat-value {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 4px;
            color: var(--accent-primary);
        }
        
        .stat-label {
            font-size: 0.85rem;
            color: var(--text-secondary);
        }
        
        .core-item {
            background: var(--bg-tertiary);
            padding: 10px;
            border-radius: 6px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .core-item.current {
            background: linear-gradient(135deg, #166534, #1e40af);
            color: #ffffff;
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
            border: 2px solid var(--accent-primary);
        }
        
        .core-item.current .stat-value {
            color: #ffffff;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .core-item.current .stat-label {
            color: #e2e8f0;
            font-weight: 500;
        }
        
        .progress-bar {
            width: 100%;
            height: 6px;
            background: var(--bg-secondary);
            border-radius: 3px;
            overflow: hidden;
            margin: 8px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
            border-radius: 3px;
            transition: width 0.3s ease;
        }
        
        .badge {
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 0.75rem;
            font-weight: bold;
            display: inline-block;
            margin-top: 5px;
        }
        
        .badge-current {
            background: #ffffff;
            color: #166534;
            border: 1px solid var(--accent-primary);
        }
        
        .badge-warning {
            background: var(--accent-warning);
            color: var(--bg-primary);
        }
        
        .badge-danger {
            background: var(--accent-danger);
            color: var(--bg-primary);
        }
        
        /* Стили для простых графиков */
        .chart-container {
            height: 200px;
            margin-top: 15px;
            position: relative;
            overflow: hidden;
        }
        
        .simple-chart {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: flex-end;
            gap: 2px;
            position: relative;
        }
        
        .chart-bar {
            flex: 1;
            background: linear-gradient(to top, var(--accent-primary), var(--accent-secondary));
            border-radius: 2px 2px 0 0;
            transition: height 0.3s ease;
            min-height: 1px;
            position: relative;
        }
        
        .chart-axis {
            position: absolute;
            background: var(--bg-tertiary);
        }
        
        .chart-axis-x {
            bottom: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: var(--text-secondary);
        }
        
        .chart-axis-y {
            top: 0;
            left: 0;
            bottom: 0;
            width: 1px;
            background: var(--text-secondary);
        }
        
        .chart-labels {
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
            color: var(--text-secondary);
            font-size: 0.75rem;
            padding: 0 5px;
        }
        
        .chart-y-labels {
            position: absolute;
            left: -35px;
            top: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: var(--text-secondary);
            font-size: 0.75rem;
            width: 30px;
        }
        
        .chart-y-label {
            text-align: right;
            padding-right: 5px;
        }
        
        .chart-title {
            text-align: center;
            color: var(--text-secondary);
            font-size: 0.8rem;
            margin-top: 5px;
        }
        
        /* Легенда графиков */
        .chart-legend {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 10px;
            font-size: 0.8rem;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 5px;
            color: var(--text-secondary);
        }
        
        .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 2px;
        }
        
        .legend-cpu {
            background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary));
        }
        
        .legend-lag {
            background: var(--accent-warning);
        }
        
        /* Улучшенная прокрутка */
        html {
            scroll-behavior: smooth;
        }
        
        body {
            overflow-x: hidden;
        }
        
        /* Анимации */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .card {
            animation: fadeIn 0.5s ease-out;
        }
        
        .card:nth-child(1) { animation-delay: 0.1s; }
        .card:nth-child(2) { animation-delay: 0.2s; }
        .card:nth-child(3) { animation-delay: 0.3s; }
        .card:nth-child(4) { animation-delay: 0.4s; }
`;

const html = `
    <div class="container">
        <div class="header">
            <h1>🚀 Node.js Core Monitoring</h1>
            <p>Real-time performance monitoring</p>
        </div>
        
        <!-- Большой график текущего ядра -->
        <div class="card card-large current-core-highlight">
            <h3>⭐ Current Execution Core</h3>
            <div id="current-core-info">
                <div class="stat-value" id="current-core-value">0%</div>
                <div class="stat-label" id="current-core-label">Core #0</div>
                <div class="progress-bar">
                    <div class="progress-fill" id="current-core-progress" style="width: 0%"></div>
                </div>
            </div>
            <div class="chart-container">
                <div class="chart-y-labels">
                    <div class="chart-y-label">100%</div>
                    <div class="chart-y-label">75%</div>
                    <div class="chart-y-label">50%</div>
                    <div class="chart-y-label">25%</div>
                    <div class="chart-y-label">0%</div>
                </div>
                <div class="simple-chart" id="current-core-chart"> 
                    <div class="chart-axis-x"></div>
                    <div class="chart-axis-y"></div>
                </div>
            </div>
            <div class="chart-labels">
                <span>← 20s ago</span>
                <span>Now →</span>
            </div>
            <div class="chart-title">CPU Usage Over Time</div>
        </div>
        
        <div class="grid">
            <!-- Общая загрузка CPU -->
            <div class="card">
                <h3>📊 Total CPU Usage</h3>
                <div class="stat-value" id="total-cpu-value">0%</div>
                <div class="chart-container">
                    <div class="chart-y-labels">
                        <div class="chart-y-label">100%</div>
                        <div class="chart-y-label">50%</div>
                        <div class="chart-y-label">0%</div>
                    </div>
                    <div class="simple-chart" id="total-cpu-chart">
                        <div class="chart-axis-x"></div>
                        <div class="chart-axis-y"></div>
                    </div>
                </div>
                <div class="chart-labels">
                    <span>← Time</span>
                    <span>→</span>
                </div>
                <div class="chart-legend">
                    <div class="legend-item">
                        <div class="legend-color legend-cpu"></div>
                        <span>CPU %</span>
                    </div>
                </div>
            </div>
            
            <!-- Event Loop Lag -->
            <div class="card">
                <h3>⏰ Event Loop Lag</h3>
                <div class="stat-value" id="event-loop-value">0ms</div>
                <div class="chart-container">
                    <div class="chart-y-labels">
                        <div class="chart-y-label">100ms</div>
                        <div class="chart-y-label">50ms</div>
                        <div class="chart-y-label">0ms</div>
                    </div>
                    <div class="simple-chart" id="event-loop-chart">
                        <div class="chart-axis-x"></div>
                        <div class="chart-axis-y"></div>
                    </div>
                </div>
                <div class="chart-labels">
                    <span>← Time</span>
                    <span>→</span>
                </div>
                <div class="chart-legend">
                    <div class="legend-item">
                        <div class="legend-color legend-lag"></div>
                        <span>Lag (ms)</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Все ядра -->
        <div class="card">
            <h3>🔢 All CPU Cores</h3>
            <div class="stat-grid" id="cores-stats"></div>
        </div>
        
        <div class="grid">
            <!-- Memory Usage -->
            <div class="card">
                <h3>💾 Memory Usage</h3>
                <div class="stat-grid" id="memory-stats"></div>
            </div>
            
            <!-- System Info -->
            <div class="card">
                <h3>⚡ System Information</h3>
                <div class="stat-grid" id="system-stats"></div>
            </div>
        </div>
    </div>
`;

const scripts = `
// Простые графики на чистом JS
        const charts = {
            currentCore: { element: document.getElementById('current-core-chart'), data: [], maxValue: 100 },
            totalCpu: { element: document.getElementById('total-cpu-chart'), data: [], maxValue: 100 },
            eventLoop: { element: document.getElementById('event-loop-chart'), data: [], maxValue: 100 }
        };
        
        // Инициализация графиков
        Object.values(charts).forEach(chart => {
            // Очищаем предыдущие бары (оставляем оси)
            const axes = chart.element.querySelectorAll('.chart-axis-x, .chart-axis-y');
            chart.element.innerHTML = '';
            axes.forEach(axis => chart.element.appendChild(axis));
            
            for (let i = 0; i < 20; i++) {
                const bar = document.createElement('div');
                bar.className = 'chart-bar';
                bar.style.height = '0%';
                chart.element.appendChild(bar);
                chart.data.push(0);
            }
        });
        
        const ws = new WebSocket('ws://' + window.location.host + '/ws/cpu');
        
        ws.onmessage = function(event) {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'cpu_usage') {
                    // Обновляем большой график текущего ядра
                    updateCurrentCoreDisplay(data.data.currentCore);
                    updateSimpleChart(charts.currentCore, data.data.currentCore.usage);
                    
                    // Обновляем остальные графики
                    updateSimpleChart(charts.totalCpu, data.data.totalCpuUsage);
                    
                    // Для Event Loop используем динамический максимум
                    const currentLag = parseFloat(data.data.eventLoop.currentLag);
                    charts.eventLoop.maxValue = Math.max(100, currentLag * 1.5);
                    updateSimpleChart(charts.eventLoop, currentLag);
                    
                    document.getElementById('total-cpu-value').textContent = data.data.totalCpuUsage.toFixed(1) + '%';
                    document.getElementById('event-loop-value').textContent = data.data.eventLoop.currentLag + 'ms';
                    
                    // Обновляем статистику
                    updateCoresStats(data.data.cores);
                    updateMemoryStats(data.data.memory);
                    updateSystemStats(data.data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        
        function updateCurrentCoreDisplay(currentCore) {
            document.getElementById('current-core-value').textContent = currentCore.usage.toFixed(1) + '%';
            document.getElementById('current-core-label').textContent = 'Core #' + currentCore.core;
            document.getElementById('current-core-progress').style.width = currentCore.usage + '%';
            
            const progressBar = document.getElementById('current-core-progress');
            if (currentCore.usage > 70) {
                progressBar.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
            } else if (currentCore.usage > 30) {
                progressBar.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
            } else {
                progressBar.style.background = 'linear-gradient(90deg, #22c55e, #3b82f6)';
            }
        }
        
        function updateSimpleChart(chart, value) {
            // Сдвигаем данные
            chart.data.push(value);
            chart.data.shift();
            
            // Обновляем бары
            const bars = chart.element.querySelectorAll('.chart-bar');
            for (let i = 0; i < bars.length; i++) {
                const height = (chart.data[i] / chart.maxValue) * 100;
                bars[i].style.height = Math.max(height, 1) + '%';
            }
        }
        
        function updateCoresStats(cores) {
            const container = document.getElementById('cores-stats');
            let html = '';
            
            cores.forEach(function(core) {
                const usageClass = core.usage > 70 ? 'badge-danger' : 
                                 core.usage > 30 ? 'badge-warning' : '';
                
                html += '<div class="core-item ' + (core.isCurrent ? 'current' : '') + '">';
                html += '<div class="stat-value">' + core.usage.toFixed(1) + '%</div>';
                html += '<div class="stat-label">Core ' + core.core + '</div>';
                html += '<div class="progress-bar">';
                html += '<div class="progress-fill" style="width: ' + core.usage + '%"></div>';
                html += '</div>';
                if (core.isCurrent) {
                    html += '<div class="badge badge-current">CURRENT</div>';
                }
                if (usageClass) {
                    html += '<div class="badge ' + usageClass + '">' + (core.usage > 70 ? 'HIGH' : 'MED') + '</div>';
                }
                html += '</div>';
            });
            
            container.innerHTML = html;
        }
        
        function updateMemoryStats(memory) {
            document.getElementById('memory-stats').innerHTML = 
                '<div class="stat-item">' +
                '<div class="stat-value">' + memory.rss + '</div>' +
                '<div class="stat-label">RSS (MB)</div>' +
                '</div>' +
                '<div class="stat-item">' +
                '<div class="stat-value">' + memory.heapUsed + '</div>' +
                '<div class="stat-label">Heap Used (MB)</div>' +
                '</div>' +
                '<div class="stat-item">' +
                '<div class="stat-value">' + memory.heapTotal + '</div>' +
                '<div class="stat-label">Heap Total (MB)</div>' +
                '</div>';
        }
        
        function updateSystemStats(data) {
            document.getElementById('system-stats').innerHTML = 
                '<div class="stat-item">' +
                '<div class="stat-value">' + data.totalCores + '</div>' +
                '<div class="stat-label">Total Cores</div>' +
                '</div>' +
                '<div class="stat-item">' +
                '<div class="stat-value">' + Math.round(data.uptime) + '</div>' +
                '<div class="stat-label">Uptime (s)</div>' +
                '</div>' +
                '<div class="stat-item">' +
                '<div class="stat-value">' + data.eventLoop.avgLag + '</div>' +
                '<div class="stat-label">Avg Lag (ms)</div>' +
                '</div>';
        }
        
        // Обработка ошибок WebSocket
        ws.onerror = function(error) {
            console.error('WebSocket error:', error);
        };
        
        ws.onclose = function() {
            console.log('WebSocket connection closed');
        };
`;

const htmlPage = `
<!DOCTYPE html>
<html>
<head>
    <title>Monitoring ${appName}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
    ${css}
    </style>
</head>
<body>
    ${html}

<script>
    ${scripts}
</script>
</body>
</html>`;

module.exports = { htmlPage };
