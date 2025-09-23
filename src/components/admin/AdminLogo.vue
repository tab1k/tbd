<template>
  <div class="admin-logos">
    <div class="mb-3">
      <a class="link-back" href="/admin">Назад</a>
    </div>

    <div class="page-header">
      <h1>Логотипы</h1>
      <p>Управляйте логотипами системы</p>
    </div>

    <!-- Фильтрация логотипов -->
    <div class="filters">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Поиск по названию"
        @input="filterLogos"
        class="search-input"
      />
      <!-- Плюсик для добавления логотипа -->
      <button class="add-logo-btn" @click="openAddLogoModal">
        <span class="plus-icon">+</span>
      </button>
    </div>

    <!-- Таблица с логотипами -->
    <div class="table-responsive">
      <table class="logo-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Изображение</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="logo in filteredLogos" :key="logo.id">
            <td>{{ logo.title }}</td>
            <td>
              <img style="height: 40px;" :src="getImageUrl(logo.image)" alt="Логотип" class="logo-image" />
            </td>
            <td>
              <button @click="editLogo(logo)" class="action-btn edit-btn">Редактировать</button>
              <button @click="deleteLogo(logo.id)" class="action-btn delete-btn">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно для добавления/редактирования логотипа -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ isEditMode ? 'Редактировать логотип' : 'Добавить логотип' }}</h2>

        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="title">Название:</label>
            <input type="text" v-model="logoForm.title" id="title" required />
          </div>
          <div class="form-group">
            <label for="image">Изображение:</label>
            <input type="file" ref="imageInput" @change="handleImageChange" id="image" accept="image/*" />
            <p>Поддерживаемые форматы: JPG, PNG, GIF</p>
            <!-- Превью изображения -->
            <div v-if="logoForm.image" class="image-preview">
              <img :src="getImageUrl(logoForm.image)" alt="Логотип" class="image-preview-img" />
            </div>
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
import axios from 'axios';
import { API_URL, MEDIA_API_URL } from '@/config';

export default {
  name: 'AdminLogos',
  data() {
    return {
      logos: [],
      filteredLogos: [],
      searchQuery: '',
      isModalOpen: false,
      isEditMode: false,
      logoForm: {
        id: null,
        title: '',
        image: null,
      },
      selectedImageFile: null,
    };
  },
  methods: {
    // Получение полного URL для изображений
    getImageUrl(imagePath) {
      if (!imagePath) return '/assets/img/placeholder.jpg'; // Если нет изображения, показываем заглушку
      if (imagePath.startsWith('http')) return imagePath; // Если путь уже полный, возвращаем его
      return `${MEDIA_API_URL}${imagePath}`; // Добавляем базовый путь
    },

    // Загрузка логотипов
    async fetchLogos() {
      try {
        const response = await axios.get(`${MEDIA_API_URL}/admin-panel/logo/`);
        this.logos = response.data;
        this.filteredLogos = this.logos;
      } catch (error) {
        console.error('Ошибка при загрузке логотипов:', error);
      }
    },

    // Открытие модального окна для добавления логотипа
    openAddLogoModal() {
      this.isModalOpen = true;
      this.isEditMode = false;
      this.logoForm = { id: null, title: '', image: null };
      this.selectedImageFile = null;
      this.$refs.imageInput.value = ''; // Очистить input для файла
    },

    // Закрытие модального окна
    closeModal() {
      this.isModalOpen = false;
    },

    // Обработчик изменения изображения
    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedImageFile = file;
        this.logoForm.image = file.name; // Сохраняем имя файла
      }
    },

    // Удаление текущего изображения (при редактировании)
    removeCurrentImage() {
      this.logoForm.image = null;
      this.selectedImageFile = null;
    },

    // Отправка формы для добавления/редактирования логотипа
    async submitForm() {
      const formData = new FormData();
      formData.append('title', this.logoForm.title);

      if (this.selectedImageFile) {
        formData.append('image', this.selectedImageFile);
      }

      try {
        if (this.isEditMode) {
          // Редактирование логотипа
          await axios.put(`${MEDIA_API_URL}/admin-panel/logo/${this.logoForm.id}/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          // Добавление нового логотипа
          await axios.post(`${MEDIA_API_URL}/admin-panel/logo/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
        this.fetchLogos(); // Обновляем список логотипов
        this.closeModal(); // Закрываем модальное окно
      } catch (error) {
        console.error('Ошибка при отправке данных формы:', error);
      }
    },

    // Фильтрация логотипов
    filterLogos() {
      this.filteredLogos = this.logos.filter(logo =>
        logo.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },

    // Удаление логотипа
    async deleteLogo(id) {
      try {
        await axios.delete(`${MEDIA_API_URL}/admin-panel/logo/${id}/`);
        this.fetchLogos(); // Обновляем список логотипов
      } catch (error) {
        console.error('Ошибка при удалении логотипа:', error);
      }
    },

    // Редактирование логотипа
    editLogo(logo) {
      this.isModalOpen = true;
      this.isEditMode = true;
      this.logoForm = { ...logo };
      this.selectedImageFile = null;
    },
  },
  created() {
    this.fetchLogos(); // Получаем список логотипов при создании компонента
  },
};
</script>

<style scoped>

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

.admin-logos {
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
  gap: 10px;
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

.add-logo-btn {
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

.add-logo-btn:hover {
  background-color: #003366;
}

.plus-icon {
  font-size: 24px;
  font-weight: bold;
}

.table-responsive {
  overflow-x: auto;
}

.logo-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.logo-table th, .logo-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.logo-table th {
  background-color: #f4f4f4;
}

.logo-table th#first {
  background-color: #f4f4f4;
  border-top-left-radius: 15px;
}

.logo-table th#last {
  background-color: #f4f4f4;
  border-top-right-radius: 15px;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7); /* Тёмный фон */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
  max-width: 90vw;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.form-actions {
  display: flex;
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
}

button[type="button"] {
  background-color: #6c757d;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
}

.image-preview {
  margin-top: 15px;
}

.image-preview-img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>
