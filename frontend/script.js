const button = document.getElementById('predict-btn')
const input = document.getElementById('ticker-input')
const results = document.getElementById('results')

button.addEventListener('click', async function() {
    const result = input.value
    const response = await(fetch(`http://localhost:8000/predict/${result}`))
    const response_text = await(response.json())

    const delta = response_text.predicted_price - response_text.prev_close
    const pct = ((delta / response_text.prev_close) * 100).toFixed(2)
    const deltaFormatted = delta.toFixed(2)
    const color = delta > 0 ? '#00ff88' : '#ff4444'

    results.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="card-ticker">${response_text.ticker}</div>
                <div class="card-predicted-label">Predicted Close:</div>
                <div class="card-predicted" style="color: ${color}">$${response_text.predicted_price.toFixed(2)}</div>
            </div>
            <div class="card-middle">
                <div>
                    <div>Prev Close</div>
                    <div>$${response_text.prev_close.toFixed(2)}</div>
                </div>
                <div>
                    <div>Change</div>
                    <div style="color: ${color}">$${deltaFormatted} (${pct}%)</div>
                </div>
            </div>
            <div class="card-bottom">
                <button id="chart-btn">Show Chart</button>
                <button id="predictions-btn">Past Predictions</button>
            </div>
            <canvas id="price-chart"></canvas>
        </div>
    `
    const chart_button = document.getElementById('chart-btn')

    chart_button.addEventListener('click', async function() {
        const response_chart = await(fetch(`http://localhost:8000/history/${result}/90`))
        const response_chart_text = await(response_chart.json())

        const labels = response_chart_text.map(item => item.timestamp)
        const prices = response_chart_text.map(item => item.close)

        const ctx = document.getElementById('price-chart').getContext('2d')
        new Chart(ctx, {
            type: 'line',
            options: {
                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 6,
                            callback: function(value, index) {
                                return labels[index].slice(0, 10)
                            }
                        }
                    }
                }
            },
            data: {
                labels: labels,
                datasets: [{
                    label: 'Close Price',
                    data: prices,
                    borderColor: '#00ff88',
                    backgroundColor: 'transparent'
                }]
            }
        })


    })

})