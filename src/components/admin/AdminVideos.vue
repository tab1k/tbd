<template>
  <div class="admin-page"> <!-- Изменил класс -->
    <div class="mb-3">
      <a class="link-back" href="/admin">Назад</a>
    </div>

    <div class="page-header">
      <h1>Видео</h1>
      <p>Управляйте видео контентом</p>
    </div>

    <!-- Фильтрация видео -->
    <div class="filters">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Поиск по названию" 
        @input="filterVideos" 
        class="search-input"
      />
      <!-- Плюсик для добавления видео -->
      <button class="add-btn" @click="openAddVideoModal"> <!-- Изменил класс -->
        <span class="plus-icon">+</span>
      </button>
    </div>

    <!-- Таблица с видео -->
    <div class="table-responsive">
      <table class="data-table"> <!-- Изменил класс -->
        <thead>
          <tr>
            <th id="first">Название</th>
            <th>Видео</th>
            <th id="last">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="video in filteredVideos" :key="video.id">
            <td>{{ video.title || 'Без названия' }}</td>
            <td>
              <video v-if="video.video" height="100" width="150" controls 
                     :src="video.video" 
                     class="table-video"> <!-- Добавил класс -->
                Ваш браузер не поддерживает элемент video.
              </video>
              <span v-else class="no-video">Нет видео</span> <!-- Добавил класс -->
            </td>
            <td>
              <button @click="editVideo(video)" class="action-btn edit-btn">Редактировать</button>
              <button @click="deleteVideo(video.id)" class="action-btn delete-btn">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно для добавления/редактирования видео -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal"> <!-- Используем CSS классы -->
      <div class="modal-content">
        <h2>{{ isEditMode ? 'Редактировать видео' : 'Добавить видео' }}</h2>
        
        <!-- Превью текущего видео при редактировании -->
        <div v-if="isEditMode && videoForm.video" class="current-video-section"> <!-- Добавил класс -->
          <p class="section-title">Текущее видео:</p> <!-- Используем существующий класс -->
          <video :src="videoForm.video" height="150" width="250" controls 
                 class="current-video"> <!-- Добавил класс -->
            Ваш браузер не поддерживает элемент video.
          </video>
        </div>
        
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="title">Название:</label>
            <input type="text" v-model="videoForm.title" id="title" required />
          </div>
          <div class="form-group">
            <label for="video">Видео:</label>
            <input type="file" ref="videoInput" @change="handleVideoChange" id="video" accept="video/*"
                   :required="!isEditMode" />
            <p class="file-hint">Поддерживаемые форматы: MP4, AVI, MOV, WebM</p> <!-- Используем существующий класс -->
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
  name: 'AdminVideos',
  data() {
    return {
      videos: [], // Массив видео, получаемых с бэкенда
      filteredVideos: [],
      searchQuery: '',
      isModalOpen: false,  // Открытие модального окна
      isEditMode: false,   // Режим редактирования или добавления
      videoForm: {
        id: null,
        title: '',
        video: null,
      },
      selectedVideoFile: null, // Для хранения выбранного файла
    };
  },
  methods: {
    // Метод для получения всех видео с бэкенда
    async fetchVideos() {
      try {
        console.log('Запрашиваем видео...');
        const response = await axios.get(MEDIA_API_URL + "/admin-panel/videos/");
        this.videos = response.data;  // Сохраняем данные видео
        this.filteredVideos = this.videos;  // Инициализируем отфильтрованные видео
        console.log('Видео загружены:', this.videos);
      } catch (error) {
        console.error('Ошибка при загрузке видео:', error);
      }
    },

    // Открытие модального окна для добавления нового видео
    openAddVideoModal() {
      console.log('Открываем модалку для добавления видео');
      this.isModalOpen = true;
      this.isEditMode = false;
      this.videoForm = { id: null, title: '', video: null }; // сброс формы
      this.selectedVideoFile = null;
      // Очищаем input файла
      if (this.$refs.videoInput) {
        this.$refs.videoInput.value = '';
      }
    },

    // Закрытие модального окна
    closeModal() {
      this.isModalOpen = false;
      this.selectedVideoFile = null;
    },

    // Обработка выбора видео
    handleVideoChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedVideoFile = file;
        console.log('Выбран файл:', file.name);
      }
    },

    // Отправка данных формы для создания или редактирования видео
    async submitForm() {
      try {
        console.log('Данные формы:', this.videoForm);
        
        // Создаем FormData для отправки файла
        const formData = new FormData();
        formData.append('title', this.videoForm.title);
        
        // Добавляем видео если оно выбрано
        if (this.selectedVideoFile) {
          formData.append('video', this.selectedVideoFile);
        }
        
        if (this.isEditMode) {
          // Редактирование видео
          console.log('Редактируем видео с id:', this.videoForm.id);
          const response = await axios.put(`${MEDIA_API_URL}/admin-panel/videos/${this.videoForm.id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          const index = this.videos.findIndex(video => video.id === this.videoForm.id);
          if (index !== -1) {
            this.videos[index] = response.data; // Обновляем данные видео
            console.log('Видео обновлено:', response.data);
          }
        } else {
          // Добавление нового видео
          console.log('Добавляем новое видео...');
          const response = await axios.post(`${MEDIA_API_URL}/admin-panel/videos/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          this.videos.push(response.data); // Добавляем новое видео в список
          console.log('Новое видео добавлено:', response.data);
        }
        this.closeModal(); // Закрываем модальное окно
        this.filterVideos(); // Применяем фильтрацию
      } catch (error) {
        console.error('Ошибка при отправке данных формы:', error);
        if (error.response) {
          console.error('Ответ сервера:', error.response.data);
        }
      }
    },

    // Фильтрация видео
    filterVideos() {
      console.log('Фильтруем видео по запросу:', this.searchQuery);
      this.filteredVideos = this.videos.filter(video =>
        video.title && video.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      console.log('Отфильтрованные видео:', this.filteredVideos);
    },

    // Редактирование видео
    editVideo(video) {
      console.log('Редактирование видео:', video);
      this.isModalOpen = true;
      this.isEditMode = true;
      this.videoForm = { ...video }; // Копируем данные видео в форму
      this.selectedVideoFile = null; // Сбрасываем выбранный файл
      // Очищаем input файла при редактировании
      this.$nextTick(() => {
        if (this.$refs.videoInput) {
          this.$refs.videoInput.value = '';
        }
      });
    },

    // Удаление видео
    async deleteVideo(id) {
      try {
        console.log('Удаляем видео с id:', id);
        await axios.delete(`${MEDIA_API_URL}/admin-panel/videos/${id}/`);
        this.videos = this.videos.filter(video => video.id !== id);
        this.filterVideos(); // Применяем фильтрацию после удаления
        console.log('Видео удалено');
      } catch (error) {
        console.error('Ошибка при удалении видео:', error);
      }
    }
  },
  created() {
    this.fetchVideos();  // Получаем видео при создании компонента
  }
};
</script>

<style scoped>

</style>