<template>
  <div class="admin-videos">
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
      <button class="add-user-btn" @click="openAddVideoModal">
        <span class="plus-icon">+</span>
      </button>
    </div>

    <!-- Таблица с видео -->
    <div class="table-responsive">
      <table class="video-table">
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
                     style="border-radius: 4px;">
                Ваш браузер не поддерживает элемент video.
              </video>
              <span v-else style="color: #999; font-style: italic;">Нет видео</span>
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
    <div v-if="isModalOpen" 
         style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); z-index: 999999; display: flex; align-items: center; justify-content: center;"
         @click.self="closeModal">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); max-width: 90vw; width: 500px;">
        <h2 style="margin-bottom: 20px; font-size: 24px; color: #000F42;">{{ isEditMode ? 'Редактировать видео' : 'Добавить видео' }}</h2>
        
        <!-- Превью текущего видео при редактировании -->
        <div v-if="isEditMode && videoForm.video" style="margin-bottom: 20px; text-align: center;">
          <p style="margin-bottom: 10px; font-size: 14px; color: #666;">Текущее видео:</p>
          <video :src="videoForm.video" height="150" width="250" controls 
                 style="border-radius: 8px; border: 2px solid #eee;">
            Ваш браузер не поддерживает элемент video.
          </video>
        </div>
        
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="title" style="display: block; font-size: 14px; color: #333; margin-bottom: 5px; font-weight: 500;">Название:</label>
            <input type="text" v-model="videoForm.title" id="title" required 
                   style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 16px;" />
          </div>
          <div class="form-group">
            <label for="video" style="display: block; font-size: 14px; color: #333; margin-bottom: 5px; font-weight: 500;">Видео:</label>
            <input type="file" ref="videoInput" @change="handleVideoChange" id="video" accept="video/*"
                   :required="!isEditMode"
                   style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 16px;" />
            <p style="font-size: 12px; color: #666; margin-top: -10px; margin-bottom: 20px;">Поддерживаемые форматы: MP4, AVI, MOV, WebM</p>
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

.admin-videos {
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

.video-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.video-table th, .video-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.video-table th {
  background-color: #f4f4f4;
}

.video-table th#first {
  background-color: #f4f4f4;
  border-top-left-radius: 15px;
}

.video-table th#last {
  background-color: #f4f4f4;
  border-top-right-radius: 15px;
}

/* Адаптивность для модального окна */
@media (max-width: 768px) {
  .admin-videos {
    padding: 20px;
  }
  
  .video-table th, .video-table td {
    padding: 10px;
    font-size: 14px;
  }
  
  .action-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>