import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {login} from "../communication/HttpRequests.js";
import {isAuthenticated, setToken} from "../domain/Authentication.jsx";

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/");
        }
    }, [navigate]);

    const handleLogin = async () => {
        setError("");
        try {
            const response = await login(username, password);
            if (response.token) {
                setToken(response.token);
                navigate("/");
            } else {
                setError("Неправильные имя пользователя/пароль");
            }
        } catch (err) {
            setError("Произошла ошибка. Пожалуйста, повторите попытку, или обратитесь к администратору.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Добро пожаловать!</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="login"
                    placeholder="Имя пользователя"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                    Войти
                </button>
            </div>
        </div>
    );
}
