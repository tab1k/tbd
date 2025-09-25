<template>
  <div class="admin-page">
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
      <button class="add-btn" @click="openAddLogoModal">
        <span class="plus-icon">+</span>
      </button>
    </div>

    <!-- Таблица с логотипами -->
    <div class="table-responsive">
      <table class="data-table">
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
            <p class="file-hint">Поддерживаемые форматы: JPG, PNG, GIF</p>
            <!-- Превью изображения -->
            <div v-if="logoForm.image" class="image-preview">
              <img :src="getImageUrl(logoForm.image)" alt="Логотип" class="selected-image" />
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
import '@/assets/css/common-admin.css';
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

</style>
