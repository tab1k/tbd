<template>
  <div class="admin-page"> <!-- Изменил класс -->
    <div class="mb-3">
      <a class="link-back" href="/admin">Назад</a>
    </div>

    <div class="page-header">
      <h1>Запросы</h1>
      <p>Управляйте запросами</p>
    </div>

    <!-- Фильтрация запросов -->
    <div class="filters">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Поиск по имени или телефону" 
        @input="filterRequests" 
        class="search-input"
      />
      <!-- Плюсик для добавления запроса -->
      <button class="add-btn" @click="openAddRequestModal"> <!-- Изменил класс -->
        <span class="plus-icon">+</span>
      </button>
    </div>

    <!-- Таблица с запросами -->
    <div class="table-responsive">
      <table class="data-table"> <!-- Изменил класс -->
        <thead>
          <tr>
            <th id="first">Имя</th>
            <th>Телефон</th>
            <th>Дата</th>
            <th id="last">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in filteredRequests" :key="request.id">
            <td>{{ request.name }}</td>
            <td>{{ request.phone }}</td>
            <td>{{ formatDate(request.created_at) }}</td>
            <td>
              <button @click="editRequest(request)" class="action-btn edit-btn">Редактировать</button>
              <button @click="deleteRequest(request.id)" class="action-btn delete-btn">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно для добавления/редактирования запроса -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal"> <!-- Используем CSS классы -->
      <div class="modal-content">
        <h2>{{ isEditMode ? 'Редактировать запрос' : 'Добавить запрос' }}</h2>
        
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Имя:</label>
            <input type="text" v-model="requestForm.name" id="name" required />
          </div>
          <div class="form-group">
            <label for="phone">Телефон:</label>
            <input type="tel" v-model="requestForm.phone" id="phone" required 
                   placeholder="+7 (000) 000-00-00" />
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
  name: 'AdminRequests',
  data() {
    return {
      requests: [], // Массив запросов, получаемых с бэкенда
      filteredRequests: [],
      searchQuery: '',
      isModalOpen: false,  // Открытие модального окна
      isEditMode: false,   // Режим редактирования или добавления
      requestForm: {
        id: null,
        name: '',
        phone: '',
        created_at: null,
      },
    };
  },
  methods: {
    // Метод для получения всех запросов с бэкенда
    async fetchRequests() {
      try {
        console.log('Запрашиваем запросы...');
        const response = await axios.get(MEDIA_API_URL + "/admin-panel/requests/");
        this.requests = response.data;  // Сохраняем данные запросов
        this.filteredRequests = this.requests;  // Инициализируем отфильтрованные запросы
        console.log('Запросы загружены:', this.requests);
      } catch (error) {
        console.error('Ошибка при загрузке запросов:', error);
      }
    },

    // Открытие модального окна для добавления нового запроса
    openAddRequestModal() {
      console.log('Открываем модалку для добавления запроса');
      this.isModalOpen = true;
      this.isEditMode = false;
      this.requestForm = { id: null, name: '', phone: '', created_at: null }; // сброс формы
    },

    // Закрытие модального окна
    closeModal() {
      this.isModalOpen = false;
    },

    // Отправка данных формы для создания или редактирования запроса
    async submitForm() {
      try {
        console.log('Данные формы:', this.requestForm);
        
        if (this.isEditMode) {
          // Редактирование запроса
          console.log('Редактируем запрос с id:', this.requestForm.id);
          const response = await axios.put(`${MEDIA_API_URL}/admin-panel/requests/${this.requestForm.id}/`, {
            name: this.requestForm.name,
            phone: this.requestForm.phone
          });
          const index = this.requests.findIndex(request => request.id === this.requestForm.id);
          if (index !== -1) {
            this.requests[index] = response.data; // Обновляем данные запроса
            console.log('Запрос обновлен:', response.data);
          }
        } else {
          // Добавление нового запроса
          console.log('Добавляем новый запрос...');
          const response = await axios.post(`${MEDIA_API_URL}/admin-panel/requests/`, {
            name: this.requestForm.name,
            phone: this.requestForm.phone
          });
          this.requests.push(response.data); // Добавляем новый запрос в список
          console.log('Новый запрос добавлен:', response.data);
        }
        this.closeModal(); // Закрываем модальное окно
        this.filterRequests(); // Применяем фильтрацию
      } catch (error) {
        console.error('Ошибка при отправке данных формы:', error);
        if (error.response) {
          console.error('Ответ сервера:', error.response.data);
        }
      }
    },

    // Фильтрация запросов
    filterRequests() {
      console.log('Фильтруем запросы по запросу:', this.searchQuery);
      this.filteredRequests = this.requests.filter(request =>
        request.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        request.phone.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      console.log('Отфильтрованные запросы:', this.filteredRequests);
    },

    // Редактирование запроса
    editRequest(request) {
      console.log('Редактирование запроса:', request);
      this.isModalOpen = true;
      this.isEditMode = true;
      this.requestForm = { ...request }; // Копируем данные запроса в форму
    },

    // Удаление запроса
    async deleteRequest(id) {
      try {
        console.log('Удаляем запрос с id:', id);
        await axios.delete(`${MEDIA_API_URL}/admin-panel/requests/${id}/`);
        this.requests = this.requests.filter(request => request.id !== id);
        this.filterRequests(); // Применяем фильтрацию после удаления
        console.log('Запрос удален');
      } catch (error) {
        console.error('Ошибка при удалении запроса:', error);
      }
    },

    // Форматирование даты для отображения
    formatDate(dateString) {
      if (!dateString) return 'Не указана';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return 'Неверный формат';
      }
    }
  },
  created() {
    this.fetchRequests();  // Получаем запросы при создании компонента
  }
};
</script>

<style scoped>

</style>