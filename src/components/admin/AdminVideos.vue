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
      <button class="add-video-btn" @click="openAddVideoModal">
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
            <td><a :href="video.video" target="_blank">Смотреть</a></td>
            <td>
              <button @click="editVideo(video)" class="action-btn edit-btn">Редактировать</button>
              <button @click="deleteVideo(video.id)" class="action-btn delete-btn">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно для добавления/редактирования видео -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal">
        <h2>{{ isEditMode ? 'Редактировать видео' : 'Добавить видео' }}</h2>
        <form @submit.prevent="submitForm" enctype="multipart/form-data">
          <div class="form-group">
            <label for="title">Название:</label>
            <input type="text" v-model="videoForm.title" id="title" required />
          </div>
          <div class="form-group">
            <label for="video">Видео:</label>
            <input type="file" @change="handleFileChange" id="video" required />
          </div>
          <button type="submit">{{ isEditMode ? 'Сохранить изменения' : 'Добавить' }}</button>
          <button type="button" @click="closeModal">Закрыть</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videos: [
        { id: 1, title: 'Видео 1', video: 'path/to/video1.mp4' },
        { id: 2, title: 'Видео 2', video: 'path/to/video2.mp4' },
        { id: 3, title: 'Видео 3', video: 'path/to/video3.mp4' },
      ],
      filteredVideos: [],
      searchQuery: '',
      isModalOpen: false,
      isEditMode: false,
      videoForm: {
        id: null,
        title: '',
        video: null,
      },
    };
  },
  methods: {
    openAddVideoModal() {
      this.isModalOpen = true;
      this.isEditMode = false;
      this.videoForm = { id: null, title: '', video: null }; // сброс формы
    },
    closeModal() {
      this.isModalOpen = false;
    },
    submitForm() {
      if (this.isEditMode) {
        // Редактирование видео
        const index = this.videos.findIndex(video => video.id === this.videoForm.id);
        if (index !== -1) {
          this.videos[index] = { ...this.videoForm };
        }
      } else {
        // Добавление нового видео
        const newVideo = { 
          ...this.videoForm, 
          id: Date.now(), 
          video: URL.createObjectURL(this.videoForm.video) // Предположим, что видео загружается локально
        };
        this.videos.push(newVideo);
      }
      this.closeModal();
      this.filterVideos();
    },
    handleFileChange(event) {
      this.videoForm.video = event.target.files[0];
    },
    filterVideos() {
      this.filteredVideos = this.videos.filter(video => 
        video.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    editVideo(video) {
      this.isModalOpen = true;
      this.isEditMode = true;
      this.videoForm = { ...video };
    },
    deleteVideo(id) {
      this.videos = this.videos.filter(video => video.id !== id);
      this.filterVideos();
    }
  },
  created() {
    this.filteredVideos = this.videos;
  }
};
</script>

<style scoped>

.admin-videos {
    padding: 30px;
    font-family: 'Montserrat', sans-serif;
    color: #000F42; /* Темно-синий цвет */
}

.edit-btn {
  background-color: #000F42; /* Темно-синий для редактирования */
  color: white;
}

.edit-btn:hover {
  background-color: #003366; /* Более темный синий при наведении */
}

/* Кнопка удаления */
.delete-btn {
  background-color: #003366; /* Красный для удаления */
  color: white;
}

.delete-btn:hover {
  background-color: #003366; /* Более светлый красный при наведении */
}

/* Стандартные стили для кнопок */
.action-btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Добавление и фильтрация видео */
.add-video-btn {
  background-color: #000F42;
  color: #fff;
  font-size: 24px;
  width: 45px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.3s;
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
  position: relative;
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


.plus-icon {
  font-size: 24px;
  font-weight: bold;
}

/* Стиль для таблицы видео */
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
  border-top-left-radius: 15px; /* Скругляем верхний левый угол */
}

.video-table th#last {
  background-color: #f4f4f4;
  border-top-right-radius: 15px; /* Скругляем верхний правый угол */
}

/* Стили модального окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 400px;
}

.modal h2 {
  margin-bottom: 20px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #333;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
}

button[type="submit"] {
  background-color: #00bcd4;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
}

button[type="submit"]:hover {
  background-color: #0097a7;
}

button[type="button"] {
  background-color: #ccc;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}

button[type="button"]:hover {
  background-color: #bbb;
}
</style>
