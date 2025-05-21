import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {deleteUser, getUserList} from "../communication/HttpRequests.js";

const roleMapping = {
    researcher: "Исследователь",
    admin: "Администратор",
    investor: "Инвестор"
};

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const limit = 20;

    useEffect(() => {
        setLoading(true);
        getUserList(limit, (page - 1) * limit).then((data) => {
            setUsers(data.data);
            setCount(data.count);
            setLoading(false);
        });
    }, [page]);

    const totalPages = Math.ceil(count / limit);

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Список Пользователей</h1>
                <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition" onClick={() => navigate("/users/create")}>Создать Пользователя</button>
            </div>
            {loading ? (
                <div className="text-center text-gray-500">Загрузка...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full shadow-sm rounded-lg overflow-hidden">
                        <thead>
                        <tr className="bg-blue-500 text-white rounded-t-lg">
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Имя пользователя</th>
                            <th className="p-3 text-left">Роль</th>
                            <th className="p-3 text-left">Действия</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-100 transition">
                                <td className="p-3">{user.id}</td>
                                <td className="p-3">{user.username}</td>
                                <td className="p-3">{roleMapping[user.role] || user.role}</td>
                                <td className="p-3 flex gap-3">
                                    <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition" onClick={() => navigate(`/users/${user.id}/edit`)}>Редактировать</button>
                                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" onClick={async () => {
                                        setLoading(true);
                                        await deleteUser(user.id, () => {
                                            setUsers(users.filter(u => u.id !== user.id));
                                            setLoading(false);
                                        });
                                    }}>Удалить</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="flex justify-center mt-6 gap-2">
                {[...Array(totalPages)].map((_, index) => (
                    <button key={index + 1} className={`px-4 py-2 rounded-lg shadow-md ${page === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 transition'}`} onClick={() => setPage(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
