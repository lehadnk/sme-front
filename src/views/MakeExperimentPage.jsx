import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    getStockPriceHistory,
    getTickerDates,
    getTickerList,
    makeExperiment,
    saveExperiment
} from "../communication/HttpRequests.js";
import {Line} from "react-chartjs-2";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";
import {useNavigate} from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const fieldNamesInRussian = {
    trainFrom: "Дата начала обучения",
    trainTo: "Дата окончания обучения",
    testFrom: "Дата начала тестирования",
    testTo: "Дата окончания тестирования"
};

export default function MakeExperimentPage() {
    const [tickers, setTickers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedTicker, setSelectedTicker] = useState(null);
    const [availableDates, setAvailableDates] = useState(null);
    const [selectedDates, setSelectedDates] = useState({ trainFrom: null, trainTo: null, testFrom: null, testTo: null });
    const [experimentResult, setExperimentResult] = useState(null);
    const [stockPriceHistory, setStockPriceHistory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [experimentInProgress, setExperimentInProgress] = useState(false);
    const [selectedModel, setSelectedModel] = useState("gradient_boosting");
    const [notification, setNotification] = useState(null);  // Add notification state

    useEffect(() => {
        getTickerList().then(setTickers);
    }, []);

    const filteredTickers = tickers.filter(ticker => ticker.toLowerCase().includes(search.toLowerCase()));

    const handleTickerSelect = async (ticker) => {
        setIsLoading(true);
        setSelectedTicker(ticker);
        setExperimentResult(null);  // Reset experiment result when ticker is changed
        const dates = await getTickerDates(ticker);
        setAvailableDates(dates);

        const stockHistory = await getStockPriceHistory(ticker, dates.from, dates.to);
        setStockPriceHistory(stockHistory);

        const startDate = new Date(dates.from);
        const endDate = new Date(dates.to);

        const trainTo = new Date(endDate);
        trainTo.setDate(trainTo.getDate() - 120);

        const testFrom = new Date(trainTo);
        testFrom.setDate(testFrom.getDate() + 1);

        setSelectedDates({
            trainFrom: startDate,
            trainTo: trainTo,
            testFrom: testFrom,
            testTo: endDate
        });

        setIsLoading(false);
    };

    const handleExperiment = async () => {
        setExperimentInProgress(true);
        setExperimentResult(null); // Clear previous experiment data
        const result = await makeExperiment(
            selectedTicker,
            selectedDates.trainFrom.toISOString().split('T')[0],
            selectedDates.trainTo.toISOString().split('T')[0],
            selectedDates.testFrom.toISOString().split('T')[0],
            selectedDates.testTo.toISOString().split('T')[0],
            selectedModel
        );
        setExperimentResult(result);
        setExperimentInProgress(false);
    };

    const handleSaveModel = async () => {
        setExperimentInProgress(true);
        const result = await saveExperiment(experimentResult.id);
        setExperimentInProgress(false);
        setNotification("Модель сохранена");  // Show success notification
        setTimeout(() => setNotification(null), 5000); // Hide notification after 5 seconds
    };

    const handleSaveModelClick = () => {
        if (!experimentInProgress) {
            handleSaveModel();
        }
    };

    const allDatesSelected = Object.values(selectedDates).every(date => date !== null);

    const formatDate = (date) => new Date(date).toLocaleDateString("ru-RU");

    const graphData = experimentResult ? {
        labels: experimentResult.dates.map(date => formatDate(date)),
        datasets: [
            {
                label: "Прогноз",
                data: experimentResult.y_pred,
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                fill: true,
                pointRadius: 0,
            },
            {
                label: "Тестовые данные",
                data: experimentResult.y_test,
                borderColor: "rgba(255,99,132,1)",
                backgroundColor: "rgba(255,99,132,0.2)",
                fill: true,
                pointRadius: 0,
            }
        ]
    } : null;

    const stockPriceGraphData = stockPriceHistory ? {
        labels: stockPriceHistory.dates.map(date => formatDate(date)),
        datasets: [
            {
                label: "Цена акций",
                data: stockPriceHistory.closing_prices,
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                fill: true,
                pointRadius: 0,
            }
        ]
    } : null;

    return (
        <div className="flex h-screen">
            {/* Sidebar: Ticker List */}
            <div className="w-[250px] p-4 border-r">
                <input
                    type="text"
                    placeholder="Поиск тикеров..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-2 p-2 border rounded w-full"
                />
                <ul>
                    {filteredTickers.map((ticker) => (
                        <li
                            key={ticker}
                            className={`p-2 cursor-pointer ${selectedTicker === ticker ? "bg-blue-500 text-white" : "hover:bg-gray-200"}`}
                            onClick={() => handleTickerSelect(ticker)}
                        >
                            {ticker}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex-1 p-6 relative">
                {isLoading ? (
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                    </div>
                ) : selectedTicker && availableDates ? (
                    <div>
                        <h2 className="text-xl font-bold mb-4">{selectedTicker} - Выберите даты</h2>

                        <p className="text-gray-700 mb-4">
                            Доступный диапазон: <strong>{availableDates.from}</strong> по <strong>{availableDates.to}</strong>
                        </p>

                        {stockPriceGraphData && (
                            <div className="mb-14" style={{ maxHeight: "250px" }}>
                                <h3 className="text-lg font-semibold mb-2">История цен акций</h3>
                                <Line
                                    data={stockPriceGraphData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: {
                                            x: {
                                                ticks: { maxRotation: 0, minRotation: 0 },
                                            },
                                            y: {
                                                ticks: {
                                                    callback: (value) => value.toFixed(2),
                                                },
                                            }
                                        }
                                    }}
                                    height={400}
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {Object.keys(selectedDates).map((key) => (
                                <div key={key}>
                                    <label className="block mb-1 capitalize">{fieldNamesInRussian[key]}</label>
                                    <DatePicker
                                        selected={selectedDates[key]}
                                        onChange={(date) => setSelectedDates(prev => ({ ...prev, [key]: date }))}
                                        minDate={new Date(availableDates.from)}
                                        maxDate={new Date(availableDates.to)}
                                        showYearDropdown
                                        scrollableYearDropdown
                                        yearDropdownItemNumber={50}
                                        dateFormat="yyyy-MM-dd"
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-4">
                            <label className="block mb-1 capitalize">Тип модели</label>
                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="gradient_boosting">Градиентный бустинг</option>
                                <option value="random_forest">Случайный лес</option>
                                <option value="xgboost">Экстремальный градиентный бустинг</option>
                            </select>
                        </div>

                        {allDatesSelected && !experimentInProgress && (
                            <button
                                className="mt-4 p-2 bg-blue-500 text-white rounded"
                                onClick={handleExperiment}
                            >
                                Запуск эксперимента
                            </button>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500">Выберите тикер для начала.</p>
                )}

                {experimentResult && graphData && (
                    <div className="mt-6" style={{ maxHeight: "250px" }}>
                        <h3 className="text-xl font-bold mb-4">Прогнозирование vs Тестовые данные</h3>
                        <Line
                            data={graphData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        ticks: { maxRotation: 0, minRotation: 0 },
                                    },
                                    y: {
                                        min: 0,
                                        ticks: {
                                            callback: (value) => value.toFixed(2),
                                        },
                                    }
                                }
                            }}
                            height={400}
                        />

                        <div className="mt-4">
                            <p><strong>RMSE:</strong> {experimentResult.rmse.toFixed(2)}</p>
                            <p><strong>Мин:</strong> {experimentResult.min.toFixed(2)}</p>
                            <p><strong>Макс:</strong> {experimentResult.max.toFixed(2)}</p>
                        </div>

                        {/* Save model button */}
                        <button
                            onClick={handleSaveModelClick}
                            className={`mt-4 p-2 rounded ${experimentInProgress ? 'bg-gray-400' : 'bg-green-500'} text-white`}
                            disabled={experimentInProgress}
                        >
                            Сохранить модель
                        </button>
                    </div>
                )}

                {experimentInProgress && (
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                    </div>
                )}

                {/* Notification */}
                {notification && (
                    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 p-4 bg-green-500 text-white rounded-md">
                        {notification}
                    </div>
                )}
            </div>
        </div>
    );
}