<template>
  <div class="admin-cases">
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
      <button class="add-user-btn" @click="openAddCaseModal">
        <span class="plus-icon">+</span>
      </button>
    </div>

    <!-- Таблица с кейсами -->
    <div class="table-responsive">
      <table class="case-table">
        <thead>
          <tr>
            <th id="first">Название</th>
            <th>Описание</th>
            <th>Изображения</th>
            <th id="last">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="caseItem in filteredCases" :key="caseItem.id">
            <td>{{ caseItem.title }}</td>
            <td>{{ caseItem.description }}</td>
            <td>
              <div v-if="caseItem.images && caseItem.images.length > 0" class="images-preview">
                <img v-for="(img, index) in caseItem.images.slice(0, 3)" 
                     :key="index"
                     :src="getImageUrl(img.image)" 
                     alt="Изображение кейса" 
                     class="table-image"
                     @error="handleImageError" />
                <span v-if="caseItem.images.length > 3" class="more-images">
                  +{{ caseItem.images.length - 3 }}
                </span>
              </div>
              <span v-else style="color: #999; font-style: italic;">Нет изображений</span>
            </td>
            <td>
              <button @click="editCase(caseItem)" class="action-btn edit-btn">Редактировать</button>
              <button @click="deleteCase(caseItem.id)" class="action-btn delete-btn">Удалить</button>
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
              <img :src="getImageUrl(img.image)" alt="Текущее изображение" class="current-image" />
              <button type="button" @click="removeCurrentImage(index)" class="remove-image-btn">×</button>
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
                  <button type="button" @click="removeSelectedImage(index)" class="remove-image-btn">×</button>
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
    };
  },
  methods: {
    // Получение полного URL для изображений
    getImageUrl(imagePath) {
      if (!imagePath) return '';
      if (imagePath.startsWith('http')) return imagePath;
      return `${MEDIA_API_URL}${imagePath}`;
    },

    // Загрузка кейсов
    async fetchCases() {
      try {
        console.log('Запрашиваем кейсы...');
        const response = await axios.get(`${MEDIA_API_URL}/admin-panel/cases/`);
        this.cases = response.data;
        this.filteredCases = this.cases;
        console.log('Кейсы загружены:', this.cases);
      } catch (error) {
        console.error('Ошибка при загрузке кейсов:', error);
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
          // Отправка запроса на сервер для удаления изображения
          await axios.delete(`${MEDIA_API_URL}/admin-panel/case-images/${image.id}/`);
          console.log('Изображение удалено:', image.id);

          // Удаляем изображение из списка в интерфейсе
          this.caseForm.images.splice(index, 1);
        } catch (error) {
          console.error('Ошибка при удалении изображения:', error);
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

        if (this.isEditMode) {
          // Удаляем изображения, помеченные к удалению
          for (const imageId of this.imagesToDelete) {
            try {
              await axios.delete(`${MEDIA_API_URL}/admin-panel/case-images/${imageId}/`);
              console.log('Изображение удалено:', imageId);
            } catch (error) {
              console.error('Ошибка при удалении изображения:', error);
            }
          }

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
            this.cases[index] = response.data;
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
          this.cases.push(response.data);
        }

        this.closeModal();
        this.filterCases();
      } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        if (error.response) {
          console.error('Ответ сервера:', error.response.data);
        }
      }
    },

    // Фильтрация кейсов
    filterCases() {
      this.filteredCases = this.cases.filter(caseItem =>
        caseItem.title?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        caseItem.description?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },

    // Редактирование кейса
    editCase(caseItem) {
      this.isModalOpen = true;
      this.isEditMode = true;
      this.caseForm = {
        id: caseItem.id,
        title: caseItem.title,
        description: caseItem.description,
        images: [...(caseItem.images || [])]
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
      if (!confirm('Вы уверены, что хотите удалить этот кейс?')) {
        return;
      }

      try {
        await axios.delete(`${MEDIA_API_URL}/admin-panel/cases/${id}/`);
        this.cases = this.cases.filter(caseItem => caseItem.id !== id);
        this.filterCases();
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
.admin-cases {
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

.add-user-btn {
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

.case-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.case-table th, .case-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.case-table th {
  background-color: #f4f4f4;
}

.case-table th#first {
  border-top-left-radius: 15px;
}

.case-table th#last {
  border-top-right-radius: 15px;
}

/* Стили для изображений */
.images-preview {
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
}

.table-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.more-images {
  font-size: 12px;
  color: #666;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 10px;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  max-width: 90vw;
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #000F42;
}

/* Форма */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.file-hint {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  margin-bottom: 0;
}

.section-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 500;
}

/* Сетки изображений */
.current-images-grid,
.selected-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.current-image-item,
.selected-image-item {
  position: relative;
  border: 2px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.current-image,
.selected-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  display: block;
}

.image-name {
  padding: 5px;
  font-size: 11px;
  color: #666;
  text-align: center;
  background: #f9f9f9;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(220, 53, 69, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.remove-image-btn:hover {
  background: rgba(220, 53, 69, 1);
}

/* Кнопки */
.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-primary {
  background: #000F42;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background: #003366;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background: #5a6268;
}

/* Кнопки действий */
.action-btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
  margin-right: 10px;
  margin-bottom: 5px;
}

.edit-btn {
  background-color: #000F42;
  color: white;
}

.edit-btn:hover {
  background-color: #003366;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
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

/* Адаптивность */
@media (max-width: 768px) {
  .admin-cases {
    padding: 20px;
  }
  
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    max-width: none;
    margin-bottom: 10px;
  }
  
  .case-table th, .case-table td {
    padding: 10px;
    font-size: 14px;
  }
  
  .action-btn {
    width: 100%;
    margin-right: 0;
  }
  
  .modal-content {
    padding: 20px;
  }
  
  .current-images-grid,
  .selected-images-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>