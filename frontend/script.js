function showToast(message) {
    const toast = document.getElementById('toast')
    toast.textContent = message
    toast.classList.add('show')
    setTimeout(() => toast.classList.remove('show'), 3000)
}

function updateBestPerformer() {
    const datasets = compareChart.data.datasets
    if (datasets.length === 0) return
    const best = datasets.reduce((best, item) => {
        const pct = (item.data[item.data.length - 1] - item.data[0]) / item.data[0] * 100
        const bestPct = (best.data[best.data.length - 1] - best.data[0]) / best.data[0] * 100
        return pct > bestPct ? item : best
    })
    const bestPct = (best.data[best.data.length - 1] - best.data[0]) / best.data[0] * 100
    const compare_card_best_performer = document.getElementById('compare-card-best-performer')
    compare_card_best_performer.innerHTML = `
        <div class="best-performer">
            <div class="best-performer-label">Top Performer</div>
            <div class="best-performer-ticker" style="color: ${best.borderColor}">${best.label}</div>
            <div class="best-performer-pct" style="color: ${best.borderColor}">+${bestPct.toFixed(2)}%</div>
        </div>
    `

}

const button = document.getElementById('predict-btn')
const input = document.getElementById('ticker-input')
input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') button.click()
})
input.addEventListener('input', function() {
    input.value = input.value.toUpperCase()
})
const results = document.getElementById('results')

button.addEventListener('click', async function() {
    const result = input.value
    document.getElementById('spinner').style.display = 'block'
    input.value = ''
    const response = await(fetch(`http://localhost:8000/predict/${result}`))
    const response_text = await(response.json())

    if (!response.ok) {
        document.getElementById('spinner').style.display = 'none'
        showToast(`Invalid ticker: ${result}`)
        return
    }

    document.getElementById('spinner').style.display = 'none'

    const delta = response_text.predicted_price - response_text.prev_close
    const pct = ((delta / response_text.prev_close) * 100).toFixed(2)
    const deltaFormatted = delta.toFixed(2)
    const color = delta > 0 ? '#00ff88' : '#ff4444'

    const existingTickers = Array.from(results.querySelectorAll('.card-ticker')).map(el => el.textContent)
    if (existingTickers.includes(result)) {
        showToast(`${result} is already on the board`)
        return
    }

    const cardCount = results.querySelectorAll('.card').length
    if (cardCount < 3) {
        results.insertAdjacentHTML('beforeend', `
            <div class="card">
                <button class="remove-btn">X</button>
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
                    <button class="chart-btn btn-inactive">Show Chart</button>
                    <button class="predictions-btn btn-inactive">Past Predictions</button>
                </div>
                <div class="chart-wrapper" style="display:none">
                    <canvas class="price-chart"></canvas>
                </div>
                <div class="prediction-table"></div>
            </div>
        `)    
        const newCard = results.lastElementChild
        const remove_button = newCard.querySelector('.remove-btn')
        remove_button.addEventListener('click', function() {
            newCard.remove()
        })
        let chartVisible = false
        let chartCreated = false
        let tableVisible = false
        let tableCreated = false
        const chart_button = newCard.querySelector('.chart-btn')
        const predictions_button = newCard.querySelector('.predictions-btn')

    chart_button.addEventListener('click', async function() {
        chartVisible = !chartVisible
        chart_button.classList.toggle('btn-inactive', !chartVisible)
        if (chartVisible) {
            if (!chartCreated) {
                const response_chart = await(fetch(`http://localhost:8000/history/${result}/90`))
                const response_chart_text = await(response_chart.json())
        
                const labels = response_chart_text.map(item => item.timestamp)
                const prices = response_chart_text.map(item => item.close)
        
                const ctx = newCard.querySelector('.price-chart').getContext('2d')
                chartCreated = true
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
            }
            newCard.querySelector('.chart-wrapper').style.display = 'block'
        } else {
            newCard.querySelector('.chart-wrapper').style.display = 'none'
        }

    })

    predictions_button.addEventListener('click', async function() {
        tableVisible = !tableVisible
        predictions_button.classList.toggle('btn-inactive', !tableVisible)
        if (tableVisible) {
            if (!tableCreated) {
                const history_response = await(fetch(`http://localhost:8000/history/${result}/365`))
                const history_data = await(history_response.json())
                const price_by_date = {}
                history_data.forEach(item => {
                    price_by_date[item.timestamp.slice(0, 10)] = item.close
                })
                const predictions_chart = await(fetch(`http://localhost:8000/predictions/${result}`))
                const predictions_chart_text = await(predictions_chart.json())
        
                const prediction_table = newCard.querySelector('.prediction-table')

                const seen_prediction_dates = new Set()
                const unique_predictions = predictions_chart_text.filter(item => {
                    const date = item.created_at.slice(0, 10)
                    if (seen_prediction_dates.has(date)) return false
                    seen_prediction_dates.add(date)
                    return true
                })

                const rows = unique_predictions.map(item => `
                    <tr>
                        <td>${item.created_at.slice(0, 10)}</td>
                        <td>$${item.predicted_price.toFixed(2)}</td>
                        <td>${price_by_date[item.created_at.slice(0, 10)] ? `$${price_by_date[item.created_at.slice(0, 10)].toFixed(2)}` : 'N/A'}</td>
                    </tr>
                    `).join('')
        
                prediction_table.innerHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Predicted Closing Price</th>
                                <th>Actual Closing Price</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                
                `
            tableCreated = true
            }
        newCard.querySelector('.prediction-table').style.display = 'block'
        } else {
            newCard.querySelector('.prediction-table').style.display = 'none'
        }
        

    })
    } else {
        showToast('Maximum of 3 cards reached')
}
})

const COLORS = ['#60a5fa', '#f97316', '#e879f9', '#facc15', '#fb7185', '#a78bfa', '#38bdf8', '#f472b6', '#fb923c', '#4ade80']
let colorIndex = 0

// compare card graph
const compareCtx = document.getElementById('compare-chart').getContext('2d')
const compareChart = new Chart(compareCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: { maxTicksLimit: 6 }
            }
        }
    }
})


const compare_card_btn = document.getElementById('compare-toggle')
const compare_card = document.getElementById('compare-card')
compare_card_btn.addEventListener('change', function() {
    compare_card.style.display = this.checked ? 'flex' : 'none'
})
const compare_card_input = document.getElementById('compare-card-ticker-input')
compare_card_input.addEventListener('input', function() {
    compare_card_input.value = compare_card_input.value.toUpperCase()
})
compare_card_input.addEventListener('keydown', async function(e) {
    if (e.key === 'Enter') {
        const result = compare_card_input.value
        compare_card_input.value = ''
        const compare_chart = await(fetch(`http://localhost:8000/history/${result}/90`))
        if (!compare_chart.ok) {
            showToast(`Invalid ticker: ${result}`)
            return
        }
        const compare_chart_text = await(compare_chart.json())

        if (compareChart.data.datasets.length >= 10) {
            showToast('Maximum of 10 tickers reached')
            return
        }

        if (compare_chart_text.length === 0) {
            showToast(`No data found for ${result}`)
            return
        }

        const existingLabels = compareChart.data.datasets.map(d => d.label)
        if (existingLabels.includes(result)) {
            showToast(`${result} is already on the chart`)
        return
        }

        const color = COLORS[colorIndex % COLORS.length]
        colorIndex++
        
        const labels = compare_chart_text.map(item => item.timestamp.slice(0, 10))
        const prices = compare_chart_text.map(item => item.close)

        if (compareChart.data.labels.length === 0) {
            compareChart.data.labels = labels
        }

        compareChart.data.datasets.push({
            label: result,
            data: prices,
            borderColor: color,
            backgroundColor: 'transparent',
            pointRadius: 0
        })

        compareChart.update()

        const list = document.getElementById('compare-card-scrollable-list')
        list.insertAdjacentHTML('beforeend', `
            <div class="compare-list-item">
                <span class="compare-dot" style="background-color: ${color}"></span>
                <span class="compare-ticker-name">${result}</span>
                <button class="compare-remove-btn">x</button>
            </div>
        `)
        const newListItem = list.lastElementChild
        const compare_remove_button = newListItem.querySelector('.compare-remove-btn')
        compare_remove_button.addEventListener('click', function() {
            compareChart.data.datasets = compareChart.data.datasets.filter(d => d.label !== result)
            compareChart.update()
            newListItem.remove()
            if (compareChart.data.datasets.length === 0) {
                document.getElementById('compare-card-best-performer').innerHTML = ''
            } else {
                updateBestPerformer()
            }
        })

        updateBestPerformer()
    }
})