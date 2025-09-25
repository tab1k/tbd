<template>
  <div class="admin-page"> <!-- Изменил класс -->
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
      <button class="add-btn" @click="openAddUserModal"> <!-- Изменил класс -->
        <span class="plus-icon">+</span>
      </button>
    </div>

    <!-- Таблица с пользователями -->
    <div class="table-responsive">
      <table class="data-table"> <!-- Изменил класс -->
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

    <!-- Модальное окно для добавления/редактирования пользователя -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
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
          
          <div class="modal-actions">
            <button type="submit" class="btn-primary">
              {{ isEditMode ? 'Сохранить изменения' : 'Добавить' }}
            </button>
            <button type="button" @click="closeModal" class="btn-secondary">
              Закрыть
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/common-admin.css';
import axios from 'axios';
import { MEDIA_API_URL } from '@/config';

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

</style>