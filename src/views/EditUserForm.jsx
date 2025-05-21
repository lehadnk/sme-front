import React, {useEffect, useState} from 'react';

const EditUserForm = ({ user, onSubmit }) => {
  // States for form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  // Check if we're editing or creating a new user
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setRole(mapRoleToLabel(user.role));
    }
  }, [user]);

  // Role mapping for display
  const roleOptions = {
    researcher: 'Исследователь',
    administrator: 'Администратор',
    investor: 'Инвестор',
  };

  // Reverse mapping for submission
  const mapRoleToLabel = (role) => {
    return roleOptions[role] || '';
  };

  const mapLabelToRole = (role) => {
    return Object.keys(roleOptions).find(key => roleOptions[key] === role) || '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      username,
      password: password || undefined, // Only send password if it's not empty
      role: mapLabelToRole(role),
    };
    onSubmit(userData);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{user ? 'Редактирование пользователя' : 'Создание пользователя'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Имя пользователя</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Пароль</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Заполните, если требуется изменить пароль"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Роль</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {Object.values(roleOptions).map((roleLabel) => (
              <option key={roleLabel} value={roleLabel}>
                {roleLabel}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {user ? 'Сохранить Пользователя' : 'Создать Пользователя'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;