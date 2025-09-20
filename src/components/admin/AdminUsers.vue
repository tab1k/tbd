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
      <button class="add-user-btn">
        <span class="plus-icon">+</span>
      </button>
    </div>

    <!-- Таблица с пользователями -->
    <div class="table-responsive">
      <table class="user-table">
        <thead>
          <tr>
            <th id="first">Имя</th>
            <th>Email</th>
            <th>Роль</th>
            <th id="last">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button @click="editUser(user)" class="action-btn edit-btn">Редактировать</button>
              <button @click="deleteUser(user.id)" class="action-btn delete-btn">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно для добавления/редактирования пользователя -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal">
        <h2>{{ isEditMode ? 'Редактировать пользователя' : 'Добавить пользователя' }}</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Имя:</label>
            <input type="text" v-model="userForm.name" id="name" required />
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
          <button type="submit">{{ isEditMode ? 'Сохранить изменения' : 'Добавить' }}</button>
          <button type="button" @click="closeModal">Закрыть</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [
        { id: 1, name: 'Иван Иванов', email: 'ivan@domain.com', role: 'admin' },
        { id: 2, name: 'Мария Петрова', email: 'maria@domain.com', role: 'user' },
        { id: 3, name: 'Дмитрий Смирнов', email: 'dmitry@domain.com', role: 'user' },
      ],
      filteredUsers: [],
      searchQuery: '',
      isModalOpen: false,
      isEditMode: false,
      userForm: {
        id: null,
        name: '',
        email: '',
        role: 'user',
      },
    };
  },
  methods: {
    openAddUserModal() {
      this.isModalOpen = true;
      this.isEditMode = false;
      this.userForm = { id: null, name: '', email: '', role: 'user' }; // сброс формы
    },
    closeModal() {
      this.isModalOpen = false;
    },
    submitForm() {
      if (this.isEditMode) {
        // Редактирование пользователя
        const index = this.users.findIndex(user => user.id === this.userForm.id);
        if (index !== -1) {
          this.users[index] = { ...this.userForm };
        }
      } else {
        // Добавление нового пользователя
        const newUser = { ...this.userForm, id: Date.now() }; // Генерация id на основе текущего времени
        this.users.push(newUser);
      }
      this.closeModal();
      this.filterUsers();
    },
    filterUsers() {
      this.filteredUsers = this.users.filter(user => 
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    editUser(user) {
      this.isModalOpen = true;
      this.isEditMode = true;
      this.userForm = { ...user };
    },
    deleteUser(id) {
      this.users = this.users.filter(user => user.id !== id);
      this.filterUsers();
    }
  },
  created() {
    this.filteredUsers = this.users;
  }
};
</script>

<style scoped>
/* Кнопка редактирования */
.edit-btn {
  background-color: #000F42; /* Темно-синий для редактирования */
  color: white;
}

.edit-btn:hover {
  background-color: #003366; /* Более темный синий при наведении */
}

/* Кнопка удаления */
.delete-btn {
  background-color: #003366; /* Красный для удаления */
  color: white;
}

.delete-btn:hover {
  background-color: #003366; /* Более светлый красный при наведении */
}

/* Стандартные стили для кнопок */
.action-btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
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
  position: relative;
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

.add-user-btn {
  background-color: #000F42;
  color: #fff;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-user-btn:hover {
  background-color: #000F42;
}

.filters {
  display: flex;
  align-items: center;
}

.search-input {
    height: 40px; /* Можно изменить на нужную высоту */
    padding: 0 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

.filters input {
  padding: 10px;
  width: 100%;
  max-width: 400px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.add-user-btn {
  margin-left: 10px;  /* Отступ между полем поиска и кнопкой */
  background-color: #000F42;
  color: #fff;
  font-size: 24px;
  width: 45px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-user-btn:hover {
  background-color: #000F42;
}

.plus-icon {
  font-size: 24px;
  font-weight: bold;
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
  border-top-left-radius: 15px; /* Скругляем верхний левый угол */
}

.user-table th#last {
  background-color: #f4f4f4;
  border-top-right-radius: 15px; /* Скругляем верхний правый угол */
}

.user-table button {
  background-color: #003366;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-table button:hover {
  background-color: #003366;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
}

.modal h2 {
  margin-bottom: 20px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #333;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}

button[type="submit"] {
  background-color: #00bcd4;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
}

button[type="submit"]:hover {
  background-color: #0097a7;
}

button[type="button"] {
  background-color: #ccc;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}

button[type="button"]:hover {
  background-color: #bbb;
}
</style>
