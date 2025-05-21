import {getMostGrowingStocks} from "../communication/HttpRequests.js";
import {useEffect, useState} from "react";

export default function MostGrowingStocks() {
    const [stocks, setStocks] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            // Мокаем текущую дату как 2019-04-01
            const currentDate = new Date("2018-31-01");

            // Мокаем дату прогноза как 2019-07-01
            const forecastDate = new Date("2019-01-31");

            const formattedCurrentDate = currentDate.toISOString().split('T')[0];
            const formattedForecastDate = forecastDate.toISOString().split('T')[0];

            // Отправляем даты в функцию getMostGrowingStocks
            const data = await getMostGrowingStocks(formattedCurrentDate, formattedForecastDate);
            setStocks(data.slice(0, 20));
            setLoading(false);
        }

        fetchData();
    }, []);

    // Форматируем дату прогноза
    const forecastDate = new Date("2019-04-01");
    const formattedForecastDate = forecastDate.toLocaleDateString("ru-RU");

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Прогноз цен на {formattedForecastDate}</h1>

            {/* Information Banner */}
            <div className="p-4 bg-green-100 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-semibold text-green-600 mb-2">Рекомендуемые к покупке</h2>
                <p className="text-gray-700">
                    Ожидается, что эти акции продемонстрируют наибольший рост к указанному отчетному периоду,
                    а потому они являются рекомендуемыми к покупке.
                </p>
            </div>

            {loading ? (
                <p className="text-gray-500">Загрузка...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stocks.map((stock) => (
                        <div key={stock.ticker} className="p-4 border rounded-lg shadow-md">
                            <h2 className="text-lg font-semibold">{stock.ticker}</h2>
                            <p>
                                Рост:&nbsp;
                                <span className={stock.growth < 0 ? "text-red-500" : "text-green-500"}>
                                    {(stock.growth * 100).toFixed(2)}%
                                </span>
                            </p>
                            <p>Вчерашнее закрытие: ${stock.today_close.toFixed(2)}</p>
                            <p>Прогнозируемое закрытие: ${stock.forecast_close.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}