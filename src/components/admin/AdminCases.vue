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
            <th id="first">Название (рус)</th>
            <th>Описание (рус)</th>
            <th>Название (англ)</th>
            <th>Описание (англ)</th>
            <th>Изображения</th>
            <th id="last">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="caseItem in filteredCases" :key="caseItem?.id">
            <td>{{ getCaseTitle(caseItem, 'ru') }}</td>
            <td>{{ getCaseDescription(caseItem, 'ru') }}</td>
            <td>{{ getCaseTitle(caseItem, 'en') }}</td>
            <td>{{ getCaseDescription(caseItem, 'en') }}</td>
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
          <!-- Поля для создания -->
          <div v-if="!isEditMode" class="form-group">
            <label for="title">Название (русский):</label>
            <input type="text" v-model="caseForm.title_ru" id="title" required />
          </div>
          <div v-if="!isEditMode" class="form-group">
            <label for="description">Описание (русский):</label>
            <textarea v-model="caseForm.description_ru" id="description" required></textarea>
          </div>

          <!-- Поля для редактирования -->
          <div v-if="isEditMode" class="form-group">
            <label for="title_ru">Название (русский):</label>
            <input type="text" v-model="caseForm.title_ru" id="title_ru" required />
          </div>
          <div v-if="isEditMode" class="form-group">
            <label for="description_ru">Описание (русский):</label>
            <textarea v-model="caseForm.description_ru" id="description_ru" required></textarea>
          </div>

          <hr>
          <div v-if="isEditMode" class="form-group">
            <label for="title_en">Название (английский):</label>
            <input type="text" v-model="caseForm.title_en" id="title_en" />
          </div>
          
          <div v-if="isEditMode" class="form-group">
            <label for="description_en">Описание (английский):</label>
            <textarea v-model="caseForm.description_en" id="description_en"></textarea>
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
        title_ru: '',
        title_en: '',
        description_ru: '',
        description_en: '',
        images: [],
      },
      selectedImageFiles: [],
      error: null,
    };
  },
  methods: {
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      if (imagePath.startsWith('http')) return imagePath;
      return `${MEDIA_API_URL}${imagePath}`;
    },

    getCaseTitle(caseItem, language = 'ru') {
      if (!caseItem) return 'Без названия';
      if (language === 'ru') {
        return caseItem.title_ru || caseItem.title || 'Без названия';
      } else {
        return caseItem.title_en || 'No title';
      }
    },

    getCaseDescription(caseItem, language = 'ru') {
      if (!caseItem) return 'Без описания';
      if (language === 'ru') {
        return caseItem.description_ru || caseItem.description || 'Без описания';
      } else {
        return caseItem.description_en || 'No description';
      }
    },

    async fetchCases() {
      try {
        console.log('Запрашиваем кейсы из админки...');
        const response = await axios.get(`${MEDIA_API_URL}/admin-panel/cases/`);
        
        this.cases = (response.data || []).map(caseItem => ({
          id: caseItem?.id || null,
          title: caseItem?.title || '',
          description: caseItem?.description || '',
          title_ru: caseItem?.title_ru || '',
          title_en: caseItem?.title_en || '',
          description_ru: caseItem?.description_ru || '',
          description_en: caseItem?.description_en || '',
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

    openAddCaseModal() {
      this.isModalOpen = true;
      this.isEditMode = false;
      this.caseForm = { 
        id: null, 
        title_ru: '', 
        title_en: '', 
        description_ru: '', 
        description_en: '', 
        images: [] 
      };
      this.selectedImageFiles = [];
      this.clearFileInput();
    },

    closeModal() {
      this.isModalOpen = false;
      this.selectedImageFiles = [];
    },

    clearFileInput() {
      if (this.$refs.imagesInput) {
        this.$refs.imagesInput.value = '';
      }
    },

    handleImagesChange(event) {
      const files = Array.from(event.target.files);
      this.selectedImageFiles = files;
    },

    getFilePreview(file) {
      return URL.createObjectURL(file);
    },

    removeSelectedImage(index) {
      this.selectedImageFiles.splice(index, 1);
    },

    async removeCurrentImage(index) {
      const image = this.caseForm.images[index];
      if (image && image.id) {
        try {
          await axios.delete(`${MEDIA_API_URL}/admin-panel/case-images/${image.id}/`);
          console.log('Изображение удалено:', image.id);
          this.caseForm.images.splice(index, 1);
        } catch (error) {
          console.error('Ошибка при удалении изображения:', error);
          alert('Ошибка при удаления изображения');
        }
      }
    },

    async submitForm() {
      try {
        const formData = new FormData();

        if (this.isEditMode) {
          // Для редактирования отправляем все четыре поля
          formData.append('title_ru', this.caseForm.title_ru);
          formData.append('title_en', this.caseForm.title_en);
          formData.append('description_ru', this.caseForm.description_ru);
          formData.append('description_en', this.caseForm.description_en);
        } else {
          // Для создания отправляем только русские поля
          formData.append('title', this.caseForm.title_ru);
          formData.append('description', this.caseForm.description_ru);
        }

        // Добавляем новые изображения
        this.selectedImageFiles.forEach(file => {
          formData.append('images', file);
        });

        if (this.isEditMode && this.caseForm.id) {
          // Обновляем кейс
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
            this.cases[index] = {
              ...response.data,
              title: response.data.title || '',
              description: response.data.description || '',
              title_ru: response.data.title_ru || '',
              title_en: response.data.title_en || '',
              description_ru: response.data.description_ru || '',
              description_en: response.data.description_en || ''
            };
          }
        } else {
          // Создаем новый кейс
          const response = await axios.post(
            `${MEDIA_API_URL}/admin-panel/cases/`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          this.cases.push({
            ...response.data,
            title: response.data.title || '',
            description: response.data.description || '',
            title_ru: response.data.title_ru || '',
            title_en: response.data.title_en || '',
            description_ru: response.data.description_ru || '',
            description_en: response.data.description_en || ''
          });
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

    filterCases() {
      if (!this.cases.length) return;
      
      this.filteredCases = this.cases.filter(caseItem =>
        this.getCaseTitle(caseItem, 'ru').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        this.getCaseDescription(caseItem, 'ru').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        this.getCaseTitle(caseItem, 'en').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        this.getCaseDescription(caseItem, 'en').toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },

    editCase(caseItem) {
      if (!caseItem?.id) {
        console.error('Нельзя редактировать кейс без ID');
        return;
      }
      
      this.isModalOpen = true;
      this.isEditMode = true;
      
      // Заполняем ВСЕ поля из данных кейса
      this.caseForm = {
        id: caseItem.id,
        title_ru: caseItem.title_ru || '',
        title_en: caseItem.title_en || '',
        description_ru: caseItem.description_ru || '',
        description_en: caseItem.description_en || '',
        images: Array.isArray(caseItem.images) ? [...caseItem.images] : []
      };
      
      console.log('Редактируем кейс:', this.caseForm);
      this.selectedImageFiles = [];
      this.clearFileInput();
    },

    handleImageError(event) {
      console.error('Ошибка загрузки изображения:', event.target.src);
      event.target.style.display = 'none';
    },

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
.current-images-grid, .selected-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.current-image-item, .selected-image-item {
  position: relative;
}

.current-image, .selected-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}


.section-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.image-name {
  font-size: 12px;
  margin-top: 5px;
  word-break: break-all;
}

.table-image-small {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 5px;
  border-radius: 3px;
}

.images-preview {
  display: flex;
  align-items: center;
}

.more-images {
  color: #666;
  font-size: 12px;
}
</style>