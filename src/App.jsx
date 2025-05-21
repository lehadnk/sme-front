import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "./views/LoginPage.jsx";
import MakeExperimentPage from "./views/MakeExperimentPage.jsx";
import MostGrowingStocks from "./views/MostGrowingStocks.jsx";
import UserList from "./views/UserList.jsx";
import EditUserForm from "./views/EditUserForm.jsx";
import EditUserPage from "./views/EditUserPage.jsx";

function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route
                    index
                    element={<MakeExperimentPage />}
                />
                <Route
                    path="stocks/most-growing"
                    element={<MostGrowingStocks />}
                />
                <Route
                    path="users"
                    element={<UserList />}
                />
                <Route
                    path="users/create"
                    element={<EditUserForm />}
                />
                <Route
                    path="users/:id/edit"
                    element={<EditUserPage />}
                />
                <Route
                    path="login"
                    element={<LoginPage />}
                />
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
