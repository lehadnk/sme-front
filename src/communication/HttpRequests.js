export async function getTickerList()
{
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/stocks/tickers', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })

    return await response.json();
}

export async function makeExperiment(ticker, trainFrom, trainTo, testFrom, testTo) {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/experiments/make', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            ticker,
            train_from: trainFrom,
            train_to: trainTo,
            test_from: testFrom,
            test_to: testTo
        }),
    });

    return await response.json();
}


export async function getTickerDates(ticker) {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/stocks/tickers/' + ticker, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })

    return await response.json();
}

export async function getStockPriceHistory(ticker, from, to) {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/stocks/prices?ticker=' + ticker + '&start_date=' + from + '&end_date=' + to, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })

    return await response.json();
}

export async function getExperimentList()
{
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    const url = `${import.meta.env.VITE_BACKEND_URL}/experiments?${queryParams.toString()}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })

    return response.json();
}

export async function saveExperiment(id)
{
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/experiments/' + id + "/save", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    })

    return await response.json();
}