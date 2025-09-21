<template>
  <div class="admin-requests">
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
      <button class="add-user-btn" @click="openAddRequestModal">
        <span class="plus-icon">+</span>
      </button>
    </div>

    <!-- Таблица с запросами -->
    <div class="table-responsive">
      <table class="request-table">
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
    <div v-if="isModalOpen" 
         style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); z-index: 999999; display: flex; align-items: center; justify-content: center;"
         @click.self="closeModal">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); max-width: 90vw; width: 500px;">
        <h2 style="margin-bottom: 20px; font-size: 24px; color: #000F42;">{{ isEditMode ? 'Редактировать запрос' : 'Добавить запрос' }}</h2>
        
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name" style="display: block; font-size: 14px; color: #333; margin-bottom: 5px; font-weight: 500;">Имя:</label>
            <input type="text" v-model="requestForm.name" id="name" required 
                   style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 16px;" />
          </div>
          <div class="form-group">
            <label for="phone" style="display: block; font-size: 14px; color: #333; margin-bottom: 5px; font-weight: 500;">Телефон:</label>
            <input type="tel" v-model="requestForm.phone" id="phone" required 
                   style="width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 16px;"
                   placeholder="+7 (000) 000-00-00" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button type="submit" 
                    style="background: #000F42; color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; transition: background-color 0.3s;">
              {{ isEditMode ? 'Сохранить изменения' : 'Добавить' }}
            </button>
            <button type="button" @click="closeModal" 
                    style="background: #6c757d; color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; transition: background-color 0.3s;">
              Закрыть
            </button>
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

.admin-requests {
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

.request-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.request-table th, .request-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.request-table th {
  background-color: #f4f4f4;
}

.request-table th#first {
  background-color: #f4f4f4;
  border-top-left-radius: 15px;
}

.request-table th#last {
  background-color: #f4f4f4;
  border-top-right-radius: 15px;
}

/* Адаптивность для модального окна */
@media (max-width: 768px) {
  .admin-requests {
    padding: 20px;
  }
  
  .request-table th, .request-table td {
    padding: 10px;
    font-size: 14px;
  }
  
  .action-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>