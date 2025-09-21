<template>
  <div class="admin-users">
    <div class="mb-3">
      <a class="link-back" href="/admin">Назад</a>
    </div>

    <div class="page-header">
      <h1>Пользователи</h1>
      <p>Управляйте пользователями системы</p>
    </div>

    <!-- Фильтрация пользователей -->
    <div class="filters">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Поиск по имени или email" 
        @input="filterUsers" 
        class="search-input"
      />
      <!-- Плюсик для добавления пользователя -->
      <button class="add-user-btn" @click="openAddUserModal">
        <span class="plus-icon">+</span>
      </button>
    </div>

    <!-- Таблица с пользователями -->
    <div class="table-responsive">
      <table class="user-table">
        <thead>
          <tr>
            <th id="first">Логин</th>
            <th>Email</th>
            <th id="last">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button @click="editUser(user)" class="action-btn edit-btn">Редактировать</button>
              <button @click="deleteUser(user.id)" class="action-btn delete-btn">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  

    <!-- ТЕСТОВАЯ МОДАЛКА (для проверки) -->
    <div v-if="isModalOpen" 
         style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5) !important; z-index: 999999; display: flex; align-items: center; justify-content: center;">
      <div style="background: white; padding: 30px; margin: 0 10px 0 10px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <h2>{{ isEditMode ? 'Редактировать пользователя' : 'Добавить пользователя' }}</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="username">Логин:</label>
            <input type="text" v-model="userForm.username" id="username" required style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ccc; border-radius: 4px;" />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" v-model="userForm.email" id="email" required style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ccc; border-radius: 4px;" />
          </div>
          <div class="form-group">
            <label for="role">Роль:</label>
            <select v-model="userForm.role" id="role" required style="width: 100%; padding: 10px; margin: 5px 0; border: 1px solid #ccc; border-radius: 4px;">
              <option value="admin">Администратор</option>
              <option value="user">Пользователь</option>
            </select>
          </div>
          <div style="margin-top: 20px;" class="d-flex">
            <button type="submit" style="background: #000F42; color: white; padding: 10px 10px; border: none; border-radius: 10px; margin-right: 10px; cursor: pointer;">{{ isEditMode ? 'Сохранить изменения' : 'Добавить' }}</button>
            <button type="button" @click="closeModal" style="background: #6c757d; color: white; padding: 10px 10px; border: none; border-radius: 10px; cursor: pointer;">Закрыть</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальное окно для добавления/редактирования пользователя -->
    <div v-if="false" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ isEditMode ? 'Редактировать пользователя' : 'Добавить пользователя' }}</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="username">Логин:</label>
            <input type="text" v-model="userForm.username" id="username" required />
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" v-model="userForm.email" id="email" required />
          </div>
          <div class="form-group">
            <label for="role">Роль:</label>
            <select v-model="userForm.role" id="role" required>
              <option value="admin">Администратор</option>
              <option value="user">Пользователь</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit">{{ isEditMode ? 'Сохранить изменения' : 'Добавить' }}</button>
            <button type="button" @click="closeModal">Закрыть</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_URL, MEDIA_API_URL } from '@/config';

export default {
  data() {
    return {
      users: [], // Массив пользователей, получаемых с бэкенда
      filteredUsers: [],
      searchQuery: '',
      isModalOpen: false,  // Открытие модального окна
      isEditMode: false,   // Режим редактирования или добавления
      userForm: {
        id: null,
        username: '',
        email: '',
        role: 'user',
      },
    };
  },
  methods: {
    // Метод для получения всех пользователей с бэкенда
    async fetchUsers() {
      try {
        console.log('Запрашиваем пользователей...');
        const response = await axios.get(MEDIA_API_URL + "/admin-panel/users/");
        this.users = response.data;  // Сохраняем данные пользователей
        this.filteredUsers = this.users;  // Инициализируем отфильтрованных пользователей
        console.log('Пользователи загружены:', this.users);
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
      }
    },

    // Открытие модального окна для добавления нового пользователя
    openAddUserModal() {
      console.log('Открываем модалку для добавления');
      console.log('isModalOpen ДО изменения:', this.isModalOpen);
      this.isModalOpen = true;
      this.isEditMode = false;
      this.userForm = { id: null, username: '', email: '', role: 'user' }; // сброс формы
      console.log('isModalOpen ПОСЛЕ изменения:', this.isModalOpen);
      console.log('Vue данные:', this.$data);
      
      // Принудительно обновляем DOM
      this.$nextTick(() => {
        console.log('Next tick - isModalOpen:', this.isModalOpen);
      });
    },

    // Закрытие модального окна
    closeModal() {
      this.isModalOpen = false;
    },

    // Отправка данных формы для создания или редактирования пользователя
    async submitForm() {
      try {
        console.log('Данные формы:', this.userForm);
        if (this.isEditMode) {
          // Редактирование пользователя
          console.log('Редактируем пользователя с id:', this.userForm.id);
          const response = await axios.put(`${MEDIA_API_URL}/admin-panel/users/${this.userForm.id}/`, this.userForm);
          const index = this.users.findIndex(user => user.id === this.userForm.id);
          if (index !== -1) {
            this.users[index] = response.data; // Обновляем данные пользователя
            console.log('Пользователь обновлен:', response.data);
          }
        } else {
          // Добавление нового пользователя
          console.log('Добавляем нового пользователя...');
          const response = await axios.post(`${MEDIA_API_URL}/admin-panel/users/`, this.userForm);
          this.users.push(response.data); // Добавляем нового пользователя в список
          console.log('Новый пользователь добавлен:', response.data);
        }
        this.closeModal(); // Закрываем модальное окно
        this.filterUsers(); // Применяем фильтрацию
      } catch (error) {
        console.error('Ошибка при отправке данных формы:', error);
      }
    },

    // Фильтрация пользователей
    filterUsers() {
      console.log('Фильтруем пользователей по запросу:', this.searchQuery);
      this.filteredUsers = this.users.filter(user =>
        user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      console.log('Отфильтрованные пользователи:', this.filteredUsers);
    },

    // Редактирование пользователя (ИСПРАВЛЕНО)
    editUser(user) {
      console.log('editUser вызван с пользователем:', user);
      console.log('isModalOpen ДО изменения:', this.isModalOpen);
      this.isModalOpen = true;
      this.isEditMode = true;
      this.userForm = { ...user }; // Копируем данные пользователя в форму
      console.log('isModalOpen ПОСЛЕ изменения:', this.isModalOpen);
      console.log('userForm:', this.userForm);
      
      // Принудительно обновляем DOM
      this.$nextTick(() => {
        console.log('Next tick - isModalOpen:', this.isModalOpen);
      });
    },

    // Удаление пользователя
    async deleteUser(id) {
      try {
        console.log('Удаляем пользователя с id:', id);
        await axios.delete(`${MEDIA_API_URL}/admin-panel/users/${id}/`);
        this.users = this.users.filter(user => user.id !== id);
        this.filterUsers(); // Применяем фильтрацию после удаления
        console.log('Пользователь удален');
      } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
      }
    }
  },
  created() {
    this.fetchUsers();  // Получаем пользователей при создании компонента
  }
};
</script>

<style scoped>
/* Кнопка редактирования */
.edit-btn {
  background-color: #000F42; /* Темно-синий для редактирования */
  color: white;
  border: none;
}

.edit-btn:hover {
  background-color: #003366; /* Более темный синий при наведении */
}

/* Кнопка удаления */
.delete-btn {
  background-color: #dc3545; /* Красный для удаления */
  color: white;
  border: none;
}

.delete-btn:hover {
  background-color: #c82333; /* Более темный красный при наведении */
}

/* Стандартные стили для кнопок */
.action-btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
}

.link-back {
  display: inline-flex;
  align-items: center;
  padding: 8px 8px 6px;
  padding-left: 28px;
  color: #262a31;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: .01em;
  text-transform: uppercase;
  background-color: #f5f7f8;
  border-radius: 8px;
  position: relative;
  line-height: 13px;
  text-decoration: none;
}

.link-back:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: url(assets/svg/arrow-left.svg) no-repeat center center;
  background-size: contain;
}

/* На десктопах кнопки рядом */
@media (min-width: 768px) {
  .action-btn {
    margin-right: 10px; /* Отступ справа для кнопок */
  }

  /* Для последней кнопки в ряду не добавляем отступ */
  .action-btn:last-child {
    margin-right: 0;
  }
}

/* На мобильных устройствах кнопки друг под другом */
@media (max-width: 767px) {
  .action-btn {
    margin-bottom: 10px; /* Отступ снизу для кнопок */
    width: 100%; /* Ширина кнопок на мобильных устройствах */
  }

  /* Убираем отступ снизу для последней кнопки */
  .action-btn:last-child {
    margin-bottom: 0;
  }
}

.admin-users {
  padding: 30px;
  font-family: 'Montserrat', sans-serif;
}

.page-header {
  text-align: left;
  margin-bottom: 1rem;
}

.page-header h1 {
  font-size: 30px;
  margin: 0;
  color: #000F42;
}

.page-header p {
  font-size: 15px;
  color: #555;
}

.filters {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  height: 40px;
  padding: 0 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
  max-width: 400px;
  box-sizing: border-box;
}

.add-user-btn {
  margin-left: 10px;
  background-color: #000F42;
  color: #fff;
  border: none;
  font-size: 24px;
  width: 45px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-user-btn:hover {
  background-color: #003366;
}

.plus-icon {
  font-size: 24px;
  font-weight: bold;
}

.table-responsive {
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.user-table th, .user-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.user-table th {
  background-color: #f4f4f4;
}

.user-table th#first {
  background-color: #f4f4f4;
  border-top-left-radius: 15px;
}

.user-table th#last {
  background-color: #f4f4f4;
  border-top-right-radius: 15px;
}

.modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background-color: rgba(0, 0, 0, 0.8) !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  z-index: 999999 !important;
}

.modal {
  background-color: white !important;
  padding: 30px !important;
  border-radius: 8px !important;
  width: 400px !important;
  max-width: 90vw !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
  position: relative !important;
  z-index: 1000000 !important;
}

.modal h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #000F42;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  box-sizing: border-box;
}

.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: #000F42;
  box-shadow: 0 0 0 2px rgba(0, 15, 66, 0.1);
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

button[type="submit"] {
  background-color: #000F42;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type="submit"]:hover {
  background-color: #003366;
}

button[type="button"] {
  background-color: #6c757d;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type="button"]:hover {
  background-color: #5a6268;
}

/* Адаптивность для модального окна */
@media (max-width: 768px) {
  .modal {
    width: 90%;
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions button {
    width: 100%;
  }
}
</style>