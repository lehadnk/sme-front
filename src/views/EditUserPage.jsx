import EditUserForm from "./EditUserForm.jsx";
import {useEffect, useState} from "react";
import {getUser} from "../communication/HttpRequests.js";
import {useParams} from "react-router-dom";

const EditUserPage = ({ onSubmit }) => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(async () => {
        const fetchUser = async () => {
            const response = await fetch(`/api/users/${id}`);
            const userData = await response.json();
            setUser(userData);
        };

        const user = await getUser(id);
        setUser(user);
    }, [id]);

    if (!user) return <div>Загрузка...</div>;

    return <EditUserForm user={user} onSubmit={onSubmit} />;
};

export default EditUserPage;