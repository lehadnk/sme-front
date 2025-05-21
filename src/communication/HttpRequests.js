export async function getTickerList()
{
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/stocks/tickers', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })

    return await response.json();
}

export async function makeExperiment(ticker, trainFrom, trainTo, testFrom, testTo, model) {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/experiments/make', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            ticker,
            train_from: trainFrom,
            train_to: trainTo,
            test_from: testFrom,
            test_to: testTo,
            model: model
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

export async function login(username, password)
{
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/authentication/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: username, password: password}),
    });

    return await response.json();
}

export async function getMostGrowingStocks(comparisonDate, forecastDate)
{
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/stocks/most-growing?comparison_date=' + comparisonDate + "&forecast_date=" + forecastDate, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })

    return await response.json();
}

export async function getUserList(limit, offset)
{
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/users/list?limit=' + limit + '&offset=' + offset, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })

    return await response.json();
}

export async function getUser(id)
{
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/users/' + id, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })

    return response.json();
}

export async function deleteUser(id)
{
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/users/' + id, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    })

    return response.json();
}