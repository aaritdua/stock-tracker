function showToast(message) {
    const toast = document.getElementById('toast')
    toast.textContent = message
    toast.classList.add('show')
    setTimeout(() => toast.classList.remove('show'), 3000)
}

const button = document.getElementById('predict-btn')
const input = document.getElementById('ticker-input')
const results = document.getElementById('results')

button.addEventListener('click', async function() {
    const result = input.value
    input.value = ''
    const response = await(fetch(`http://localhost:8000/predict/${result}`))
    const response_text = await(response.json())

    const delta = response_text.predicted_price - response_text.prev_close
    const pct = ((delta / response_text.prev_close) * 100).toFixed(2)
    const deltaFormatted = delta.toFixed(2)
    const color = delta > 0 ? '#00ff88' : '#ff4444'

    const cardCount = results.querySelectorAll('.card').length
    if (cardCount < 3) {
        results.insertAdjacentHTML('beforeend', `
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
                    <button class="chart-btn">Show Chart</button>
                    <button class="predictions-btn">Past Predictions</button>
                </div>
                <canvas class="price-chart"></canvas>
                <div class="prediction-table"></div>
            </div>
        `)    
        const newCard = results.lastElementChild
        const chart_button = newCard.querySelector('.chart-btn')
        const predictions_button = newCard.querySelector('.predictions-btn')

    chart_button.addEventListener('click', async function() {
        const response_chart = await(fetch(`http://localhost:8000/history/${result}/90`))
        const response_chart_text = await(response_chart.json())

        const labels = response_chart_text.map(item => item.timestamp)
        const prices = response_chart_text.map(item => item.close)

        const ctx = newCard.querySelector('.price-chart').getContext('2d')
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

    predictions_button.addEventListener('click', async function() {
        const predictions_chart = await(fetch(`http://localhost:8000/predictions/${result}`))
        const predictions_chart_text = await(predictions_chart.json())

        const prediction_table = newCard.querySelector('.prediction-table')

        const rows = predictions_chart_text.map(item => `
            <tr>
                <td>${item.created_at.slice(0, 10)}</td>
                <td>$${item.predicted_price.toFixed(2)}</td>
            </tr>
            `).join('')

        prediction_table.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Predicted Price</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        
        `

    })
    } else {
        showToast('Maximum of 3 cards reached')
}
})