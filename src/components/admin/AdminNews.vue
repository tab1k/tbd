<template>
  <div class="admin-page">
    <div class="mb-3">
      <a class="link-back" href="/admin">Назад</a>
    </div>

    <div class="page-header">
      <h1>Новости</h1>
      <p>Управляйте новостями системы</p>
    </div>

    <!-- Фильтрация новостей -->
    <div class="filters">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Поиск по заголовку, описанию или URL" 
        @input="filterNews" 
        class="search-input"
      />
      <button class="add-btn" @click="openAddNewsModal">
        <span class="plus-icon">+</span>
      </button>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Таблица с новостями -->
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th id="first">Заголовок (рус)</th>
            <th>Описание (рус)</th>
            <th>Заголовок (англ)</th>
            <th>Описание (англ)</th>
            <th>Изображение</th>
            <th>URL</th>
            <th>Дата</th>
            <th id="last">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="newsItem in filteredNews" :key="newsItem?.id">
            <td>{{ getNewsTitle(newsItem, 'ru') }}</td>
            <td>{{ getNewsDescription(newsItem, 'ru') }}</td>
            <td>{{ getNewsTitle(newsItem, 'en') }}</td>
            <td>{{ getNewsDescription(newsItem, 'en') }}</td>
            <td>
              <img v-if="newsItem?.image" 
                   :src="getImageUrl(newsItem.image)" 
                   alt="Изображение новости" 
                   class="table-image-small"
                   @error="handleImageError" />
              <span v-else style="color: #999; font-style: italic;">Нет изображения</span>
            </td>
            <td>
              <a v-if="newsItem?.url" :href="newsItem.url" target="_blank" class="url-link">
                {{ truncateUrl(newsItem.url) }}
              </a>
              <span v-else class="no-url">—</span>
            </td>
            <td>{{ formatDate(newsItem?.created_at) }}</td>
            <td>
              <button @click="editNews(newsItem)" class="action-btn edit-btn">Редактировать</button>
              <button @click="deleteNews(newsItem?.id)" class="action-btn delete-btn">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно для добавления/редактирования новости -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ isEditMode ? 'Редактировать новость' : 'Добавить новость' }}</h2>

        <!-- Превью текущего изображения при редактировании -->
        <div v-if="isEditMode && newsForm.image" class="current-photo-section">
          <p class="section-title">Текущее изображение:</p>
          <div class="photo-preview">
            <div class="photo-circle">
              <img :src="getImageUrl(newsForm.image)" alt="Текущее изображение" class="current-photo" />
            </div>
          </div>
          
        </div>

        <form @submit.prevent="submitForm">
          <!-- Поля для создания -->
          <div v-if="!isEditMode" class="form-group">
            <label for="title">Заголовок (русский):</label>
            <input type="text" v-model="newsForm.title_ru" id="title" required />
          </div>
          <div v-if="!isEditMode" class="form-group">
            <label for="description">Описание (русский):</label>
            <textarea v-model="newsForm.description_ru" id="description" required></textarea>
          </div>

          <!-- Поля для редактирования -->
          <div v-if="isEditMode" class="form-group">
            <label for="title_ru">Заголовок (русский):</label>
            <input type="text" v-model="newsForm.title_ru" id="title_ru" required />
          </div>

          <div v-if="isEditMode" class="form-group">
            <label for="description_ru">Описание (русский):</label>
            <textarea v-model="newsForm.description_ru" id="description_ru" required></textarea>
          </div>

          <hr>
          
          <div v-if="isEditMode" class="form-group">
            <label for="title_en">Заголовок (английский):</label>
            <input type="text" v-model="newsForm.title_en" id="title_en" />
          </div>
          
          <div v-if="isEditMode" class="form-group">
            <label for="description_en">Описание (английский):</label>
            <textarea v-model="newsForm.description_en" id="description_en"></textarea>
          </div>

          <div class="form-group">
            <label for="url">URL ссылка:</label>
            <input type="url" v-model="newsForm.url" id="url" placeholder="https://example.com" />
            <small>Необязательное поле</small>
          </div>

          <div class="form-group">
            <label for="image">Изображение:</label>
            <input type="file" ref="imageInput" @change="handleImageChange" id="image" accept="image/*" />
            <p class="file-hint">Поддерживаемые форматы: JPG, PNG, GIF</p>
            
            <!-- Превью выбранного изображения -->
            <div v-if="selectedImageFile" class="selected-images-preview">
              <p class="section-title">Выбранное изображение:</p>
              <div class="selected-image-item">
                <img :src="getFilePreview(selectedImageFile)" alt="Превью" class="selected-image" />
                <p class="image-name">{{ selectedImageFile.name }}</p>
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
  name: 'AdminNews',
  data() {
    return {
      news: [],
      filteredNews: [],
      searchQuery: '',
      isModalOpen: false,
      isEditMode: false,
      newsForm: {
        id: null,
        title_ru: '',
        title_en: '',
        description_ru: '',
        description_en: '',
        url: '',
        image: null,
      },
      selectedImageFile: null,
      error: null,
      originalNewsData: {}
    };
  },
  methods: {
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      if (imagePath.startsWith('http')) return imagePath;
      return `${MEDIA_API_URL}${imagePath}`;
    },

    getNewsTitle(newsItem, language = 'ru') {
      if (!newsItem) return 'Без заголовка';
      if (language === 'ru') {
        return newsItem.title_ru || newsItem.title || 'Без заголовка';
      } else {
        return newsItem.title_en || 'No title';
      }
    },

    getNewsDescription(newsItem, language = 'ru') {
      if (!newsItem) return 'Без описания';
      if (language === 'ru') {
        return newsItem.description_ru || newsItem.description || 'Без описания';
      } else {
        return newsItem.description_en || 'No description';
      }
    },

    async fetchNews() {
      try {
        console.log('Запрашиваем новости из админки...');
        const response = await axios.get(`${MEDIA_API_URL}/admin-panel/news/`);
        
        this.news = (response.data || []).map(newsItem => ({
          id: newsItem?.id || null,
          title: newsItem?.title || '',
          description: newsItem?.description || '',
          title_ru: newsItem?.title_ru || '',
          title_en: newsItem?.title_en || '',
          description_ru: newsItem?.description_ru || '',
          description_en: newsItem?.description_en || '',
          image: newsItem?.image || null,
          url: newsItem?.url || '',
          created_at: newsItem?.created_at || ''
        }));
        
        this.filteredNews = this.news;
        console.log('Новости загружены:', this.news);
        this.error = null;
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
        this.error = 'Ошибка при загрузке новостей. Проверьте подключение к серверу.';
        this.news = [];
        this.filteredNews = [];
      }
    },

    openAddNewsModal() {
      this.isModalOpen = true;
      this.isEditMode = false;
      this.newsForm = { 
        id: null, 
        title_ru: '', 
        title_en: '', 
        description_ru: '', 
        description_en: '', 
        url: '', 
        image: null 
      };
      this.selectedImageFile = null;
      this.clearFileInput();
    },

    closeModal() {
      this.isModalOpen = false;
      this.selectedImageFile = null;
    },

    clearFileInput() {
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = '';
      }
    },

    handleImageChange(event) {
      const file = event.target.files[0];
      this.selectedImageFile = file;
    },

    getFilePreview(file) {
      return URL.createObjectURL(file);
    },

    removeSelectedImage() {
      this.selectedImageFile = null;
    },

    async submitForm() {
      try {
        const formData = new FormData();

        if (this.isEditMode) {
          // Для редактирования отправляем только измененные поля
          if (this.newsForm.title_ru !== this.originalNewsData.title_ru) {
            formData.append('title_ru', this.newsForm.title_ru);
          }
          if (this.newsForm.title_en !== this.originalNewsData.title_en) {
            formData.append('title_en', this.newsForm.title_en || '');
          }
          if (this.newsForm.description_ru !== this.originalNewsData.description_ru) {
            formData.append('description_ru', this.newsForm.description_ru);
          }
          if (this.newsForm.description_en !== this.originalNewsData.description_en) {
            formData.append('description_en', this.newsForm.description_en || '');
          }
          if (this.newsForm.url !== this.originalNewsData.url) {
            formData.append('url', this.newsForm.url || '');
          }
        } else {
          // Для создания отправляем все обязательные поля
          formData.append('title', this.newsForm.title_ru);
          formData.append('description', this.newsForm.description_ru);
          formData.append('url', this.newsForm.url || '');
        }

        // Добавляем новое изображение только если оно выбрано
        if (this.selectedImageFile) {
          formData.append('image', this.selectedImageFile);
        } else if (!this.isEditMode) {
          // Для создания новости изображение обязательно
          alert('Пожалуйста, выберите изображение для новости');
          return;
        }

        let response;
        
        if (this.isEditMode && this.newsForm.id) {
          // Используем PATCH для частичного обновления
          response = await axios.patch(
            `${MEDIA_API_URL}/admin-panel/news/${this.newsForm.id}/`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
        } else {
          // Создаем новую новость
          response = await axios.post(
            `${MEDIA_API_URL}/admin-panel/news/`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
        }

        // Обновляем данные в интерфейсе
        if (this.isEditMode) {
          const index = this.news.findIndex(item => item.id === this.newsForm.id);
          if (index !== -1) {
            // Обновляем только измененные поля
            this.news[index] = {
              ...this.news[index],
              ...response.data
            };
          }
        } else {
          this.news.push(response.data);
        }

        this.closeModal();
        this.filterNews();
        
      } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        if (error.response) {
          console.error('Ответ сервера:', error.response.data);
          
          if (error.response.data.image) {
            alert('Ошибка с изображением: ' + error.response.data.image.join(', '));
          } else {
            alert('Ошибка сервера: ' + JSON.stringify(error.response.data));
          }
        } else {
          alert('Ошибка сети. Проверьте подключение к серверу.');
        }
      }
    },

    filterNews() {
      if (!this.news.length) return;
      
      this.filteredNews = this.news.filter(newsItem =>
        this.getNewsTitle(newsItem, 'ru').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        this.getNewsDescription(newsItem, 'ru').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        this.getNewsTitle(newsItem, 'en').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        this.getNewsDescription(newsItem, 'en').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (newsItem?.url || '').toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },

    editNews(newsItem) {
      if (!newsItem?.id) {
        console.error('Нельзя редактировать новость без ID');
        return;
      }
      
      this.isModalOpen = true;
      this.isEditMode = true;
      
      // Заполняем форму данными новости
      this.newsForm = {
        id: newsItem.id,
        title_ru: newsItem.title_ru || '',
        title_en: newsItem.title_en || '',
        description_ru: newsItem.description_ru || '',
        description_en: newsItem.description_en || '',
        url: newsItem.url || '',
        image: newsItem.image || null
      };
      
      // Сохраняем оригинальные данные для сравнения
      this.originalNewsData = {
        title_ru: newsItem.title_ru || '',
        title_en: newsItem.title_en || '',
        description_ru: newsItem.description_ru || '',
        description_en: newsItem.description_en || '',
        url: newsItem.url || '',
        image: newsItem.image || null
      };
      
      console.log('Редактируем новость:', this.newsForm);
      this.selectedImageFile = null;
      this.clearFileInput();
    },

    handleImageError(event) {
      console.error('Ошибка загрузки изображения:', event.target.src);
      event.target.style.display = 'none';
    },

    truncateUrl(url) {
      if (!url) return '';
      if (url.length > 40) {
        return url.substring(0, 40) + '...';
      }
      return url;
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('ru-RU', options);
    },

    async deleteNews(id) {
      if (!id) {
        console.error('Нельзя удалить новость без ID');
        return;
      }
      
      if (!confirm('Вы уверены, что хотите удалить эту новость?')) {
        return;
      }

      try {
        await axios.delete(`${MEDIA_API_URL}/admin-panel/news/${id}/`);
        this.news = this.news.filter(newsItem => newsItem.id !== id);
        this.filterNews();
        alert('Новость успешно удалена');
        
      } catch (error) {
        console.error('Ошибка при удалении новости:', error);
        alert('Ошибка при удалении новости');
      }
    }
  },
  created() {
    this.fetchNews();
  }
};
</script>

<style scoped>
.current-photo-section {
  text-align: center;
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.section-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  font-size: 16px;
}

.photo-preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

.photo-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: #fff;
}

.current-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Анимация при hover */
.photo-circle:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
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
  border-radius: 3px;
}

.url-link {
  color: #007bff;
  text-decoration: none;
}

.url-link:hover {
  text-decoration: underline;
}

.no-url {
  color: #999;
  font-style: italic;
}
</style>