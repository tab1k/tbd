<template>
  <div class="admin-page">
    <div class="mb-3">
      <a class="link-back" href="/admin">Назад</a>
    </div>

    <div class="page-header">
      <h1>Кейсы</h1>
      <p>Управляйте кейсами системы</p>
    </div>

    <!-- Фильтрация кейсов -->
    <div class="filters">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Поиск по названию или описанию" 
        @input="filterCases" 
        class="search-input"
      />
      <!-- Плюсик для добавления кейса -->
      <button class="add-btn" @click="openAddCaseModal">
        <span class="plus-icon">+</span>
      </button>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Таблица с кейсами -->
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th id="first">Название</th>
            <th>Описание</th>
            <th>Изображения</th>
            <th id="last">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="caseItem in filteredCases" :key="caseItem?.id || caseItem?.title">
            <td>{{ caseItem?.title || 'Без названия' }}</td>
            <td>{{ caseItem?.description || 'Без описания' }}</td>
            <td>
              <div v-if="caseItem?.images && caseItem.images.length > 0" class="images-preview">
                <img v-for="(img, index) in caseItem.images.slice(0, 3)" 
                     :key="index"
                     :src="getImageUrl(img?.image)" 
                     alt="Изображение кейса" 
                     class="table-image-small"
                     @error="handleImageError" />
                <span v-if="caseItem.images.length > 3" class="more-images">
                  +{{ caseItem.images.length - 3 }}
                </span>
              </div>
              <span v-else style="color: #999; font-style: italic;">Нет изображений</span>
            </td>
            <td>
              <button @click="editCase(caseItem)" class="action-btn edit-btn">Редактировать</button>
              <button @click="deleteCase(caseItem?.id)" class="action-btn delete-btn">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно для добавления/редактирования кейса -->
    <div v-if="isModalOpen" 
         class="modal-overlay"
         @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ isEditMode ? 'Редактировать кейс' : 'Добавить кейс' }}</h2>
        
        <!-- Превью текущих изображений при редактировании -->
        <div v-if="isEditMode && caseForm.images && caseForm.images.length > 0" class="current-images-section">
          <p class="section-title">Текущие изображения:</p>
          <div class="current-images-grid">
            <div v-for="(img, index) in caseForm.images" :key="index" class="current-image-item">
              <img :src="getImageUrl(img?.image)" alt="Текущее изображение" class="current-image" />
            </div>
          </div>
        </div>
        
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="title">Название:</label>
            <input type="text" v-model="caseForm.title" id="title" required />
          </div>
          <div class="form-group">
            <label for="description">Описание:</label>
            <textarea v-model="caseForm.description" id="description" required></textarea>
          </div>
          <div class="form-group">
            <label for="images">Изображения:</label>
            <input type="file" ref="imagesInput" @change="handleImagesChange" id="images" accept="image/*" multiple />
            <p class="file-hint">Поддерживаемые форматы: JPG, PNG, GIF. Можно выбрать несколько файлов.</p>
            
            <!-- Превью выбранных изображений -->
            <div v-if="selectedImageFiles.length > 0" class="selected-images-preview">
              <p class="section-title">Выбранные изображения:</p>
              <div class="selected-images-grid">
                <div v-for="(file, index) in selectedImageFiles" :key="index" class="selected-image-item">
                  <img :src="getFilePreview(file)" alt="Превью" class="selected-image" />
                  <p class="image-name">{{ file.name }}</p>
                </div>
              </div>
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
  name: 'AdminCases',
  data() {
    return {
      cases: [],
      filteredCases: [],
      searchQuery: '',
      isModalOpen: false,
      isEditMode: false,
      caseForm: {
        id: null,
        title: '',
        description: '',
        images: [],
      },
      selectedImageFiles: [],
      imagesToDelete: [],
      error: null,
    };
  },
  methods: {
    // Получение полного URL для изображений
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      if (imagePath.startsWith('http')) return imagePath;
      return `${MEDIA_API_URL}${imagePath}`;
    },

    // Загрузка кейсов - ИСПРАВЛЕННЫЙ ENDPOINT ДЛЯ АДМИНКИ
    async fetchCases() {
      try {
        console.log('Запрашиваем кейсы из админки...');
        // Используем endpoint админки
        const response = await axios.get(`${MEDIA_API_URL}/admin-panel/cases/`);
        
        // Фильтруем null значения и добавляем проверки
        this.cases = (response.data || []).map(caseItem => ({
          id: caseItem?.id || null,
          title: caseItem?.title || 'Без названия',
          description: caseItem?.description || 'Без описания',
          images: Array.isArray(caseItem?.images) ? caseItem.images : []
        }));
        
        this.filteredCases = this.cases;
        console.log('Кейсы загружены:', this.cases);
        this.error = null;
      } catch (error) {
        console.error('Ошибка при загрузке кейсов:', error);
        this.error = 'Ошибка при загрузке кейсов. Проверьте подключение к серверу.';
        this.cases = [];
        this.filteredCases = [];
      }
    },

    // Открытие модального окна для добавления
    openAddCaseModal() {
      this.isModalOpen = true;
      this.isEditMode = false;
      this.caseForm = { id: null, title: '', description: '', images: [] };
      this.selectedImageFiles = [];
      this.imagesToDelete = [];
      this.clearFileInput();
    },

    // Закрытие модального окна
    closeModal() {
      this.isModalOpen = false;
      this.selectedImageFiles = [];
      this.imagesToDelete = [];
    },

    // Очистка input файлов
    clearFileInput() {
      if (this.$refs.imagesInput) {
        this.$refs.imagesInput.value = '';
      }
    },

    // Обработка выбора изображений
    handleImagesChange(event) {
      const files = Array.from(event.target.files);
      this.selectedImageFiles = files;
    },

    // Получение превью файла
    getFilePreview(file) {
      return URL.createObjectURL(file);
    },

    // Удаление выбранного изображения
    removeSelectedImage(index) {
      this.selectedImageFiles.splice(index, 1);
    },

    // Удаление текущего изображения (при редактировании)
    async removeCurrentImage(index) {
      const image = this.caseForm.images[index];
      if (image && image.id) {
        try {
          await axios.delete(`${MEDIA_API_URL}/admin-panel/case-images/${image.id}/`);
          console.log('Изображение удалено:', image.id);
          this.caseForm.images.splice(index, 1);
        } catch (error) {
          console.error('Ошибка при удалении изображения:', error);
          alert('Ошибка при удалении изображения');
        }
      }
    },

    // Отправка формы
    async submitForm() {
      try {
        const formData = new FormData();
        formData.append('title', this.caseForm.title);
        formData.append('description', this.caseForm.description);

        // Добавляем новые изображения
        this.selectedImageFiles.forEach(file => {
          formData.append('images', file);
        });

        if (this.isEditMode && this.caseForm.id) {
          // Обновляем кейс через админку
          const response = await axios.put(
            `${MEDIA_API_URL}/admin-panel/cases/${this.caseForm.id}/`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );

          // Обновляем кейс в списке
          const index = this.cases.findIndex(item => item.id === this.caseForm.id);
          if (index !== -1) {
            this.cases[index] = response.data;
          }
        } else {
          // Создаем новый кейс через админку
          const response = await axios.post(
            `${MEDIA_API_URL}/admin-panel/cases/`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          this.cases.push(response.data);
        }

        this.closeModal();
        this.filterCases();
        
      } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        if (error.response) {
          console.error('Ответ сервера:', error.response.data);
          alert('Ошибка сервера: ' + JSON.stringify(error.response.data));
        } else {
          alert('Ошибка сети. Проверьте подключение к серверу.');
        }
      }
    },

    // Фильтрация кейсов
    filterCases() {
      if (!this.cases.length) return;
      
      this.filteredCases = this.cases.filter(caseItem =>
        (caseItem?.title || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (caseItem?.description || '').toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },

    // Редактирование кейса
    editCase(caseItem) {
      if (!caseItem?.id) {
        console.error('Нельзя редактировать кейс без ID');
        return;
      }
      
      this.isModalOpen = true;
      this.isEditMode = true;
      this.caseForm = {
        id: caseItem.id,
        title: caseItem.title || '',
        description: caseItem.description || '',
        images: Array.isArray(caseItem.images) ? [...caseItem.images] : []
      };
      this.selectedImageFiles = [];
      this.imagesToDelete = [];
      this.clearFileInput();
    },

    // Обработка ошибок загрузки изображений
    handleImageError(event) {
      console.error('Ошибка загрузки изображения:', event.target.src);
      event.target.style.display = 'none';
    },

    // Удаление кейса
    async deleteCase(id) {
      if (!id) {
        console.error('Нельзя удалить кейс без ID');
        return;
      }
      
      if (!confirm('Вы уверены, что хотите удалить этот кейс?')) {
        return;
      }

      try {
        await axios.delete(`${MEDIA_API_URL}/admin-panel/cases/${id}/`);
        this.cases = this.cases.filter(caseItem => caseItem.id !== id);
        this.filterCases();
        alert('Кейс успешно удален');
        
      } catch (error) {
        console.error('Ошибка при удалении кейса:', error);
        alert('Ошибка при удалении кейса');
      }
    }
  },
  created() {
    this.fetchCases();
  }
};
</script>

<style scoped>

</style>