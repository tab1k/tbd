<template>
  <div class="admin-page">
    <div class="mb-3">
      <a class="link-back" href="/admin">Назад</a>
    </div>

    <div class="page-header">
      <h1>Команда</h1>
      <p>Управляйте участниками команды</p>
    </div>

    <!-- Фильтрация команд -->
    <div class="filters">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Поиск по имени или роли" 
        @input="filterTeams" 
        class="search-input"
      />
      <!-- Плюсик для добавления команды -->
      <button class="add-btn" @click="openAddTeamModal">
        <span class="plus-icon">+</span>
      </button>
    </div>

    <!-- Таблица с командами -->
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th id="first">Имя</th>
            <th>Роль</th>
            <th>Описание</th>
            <th>Фото</th>
            <th id="last">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in filteredTeams" :key="team.id">
            <td>{{ team.name }}</td>
            <td>{{ team.role }}</td>
            <td class="description-cell">
              <span v-if="team.description" :title="team.description">
                {{ truncateDescription(team.description) }}
              </span>
              <span v-else style="color: #999; font-style: italic;">Нет описания</span>
            </td>
            <td>
              <img v-if="team.photo" :src="team.photo" alt="Фото участника" 
                   class="table-image-small" style="border-radius: 50%;" />
              <span v-else style="color: #999; font-style: italic;">Нет фото</span>
            </td>
            <td>
              <button @click="editTeam(team)" class="action-btn edit-btn">Редактировать</button>
              <button @click="deleteTeam(team.id)" class="action-btn delete-btn">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно для добавления/редактирования команды -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ isEditMode ? 'Редактировать участника' : 'Добавить участника' }}</h2>
        
        <!-- Превью текущего фото при редактировании -->
        <div v-if="isEditMode && teamForm.photo" class="current-images-section">
          <p class="section-title">Текущее фото:</p>
          <div class="current-images-grid">
            <div class="current-image-item">
              <img :src="teamForm.photo" alt="Текущее фото" class="current-image" style="border-radius: 50%;" />
            </div>
          </div>
        </div>
        
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">Имя:</label>
            <input type="text" v-model="teamForm.name" id="name" required />
          </div>
          <div class="form-group">
            <label for="role">Роль:</label>
            <input type="text" v-model="teamForm.role" id="role" required />
          </div>
          <div class="form-group">
            <label for="description">Описание (для карточки при наведении):</label>
            <textarea 
              v-model="teamForm.description" 
              id="description" 
              rows="4" 
              placeholder="Введите описание участника (максимум 350 символов)"
              maxlength="350"
              class="description-textarea"
            ></textarea>
            <div class="char-counter">
              {{ teamForm.description ? teamForm.description.length : 0 }}/350 символов
            </div>
          </div>
          <div class="form-group">
            <label for="photo">Фото:</label>
            <input type="file" ref="photoInput" @change="handlePhotoChange" id="photo" accept="image/*" />
            <p class="file-hint">Поддерживаемые форматы: JPG, PNG, GIF</p>
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
  name: 'AdminTeams',
  data() {
    return {
      teams: [], // Массив участников команды, получаемых с бэкенда
      filteredTeams: [],
      searchQuery: '',
      isModalOpen: false,  // Открытие модального окна
      isEditMode: false,   // Режим редактирования или добавления
      teamForm: {
        id: null,
        name: '',
        role: '',
        description: '',
        photo: null,
      },
      selectedPhotoFile: null, // Для хранения выбранного файла
    };
  },
  methods: {
    // Метод для получения всех участников команды с бэкенда
    async fetchTeams() {
      try {
        console.log('Запрашиваем участников команды...');
        const response = await axios.get(MEDIA_API_URL + "/admin-panel/teams/");
        this.teams = response.data;  // Сохраняем данные команды
        this.filteredTeams = this.teams;  // Инициализируем отфильтрованных участников
        console.log('Участники команды загружены:', this.teams);
      } catch (error) {
        console.error('Ошибка при загрузке участников команды:', error);
      }
    },

    // Обрезание описания для таблицы
    truncateDescription(description) {
      if (description.length > 100) {
        return description.substring(0, 100) + '...';
      }
      return description;
    },

    // Открытие модального окна для добавления нового участника
    openAddTeamModal() {
      console.log('Открываем модалку для добавления участника');
      this.isModalOpen = true;
      this.isEditMode = false;
      this.teamForm = { id: null, name: '', role: '', description: '', photo: null }; // сброс формы
      this.selectedPhotoFile = null;
      // Очищаем input файла
      if (this.$refs.photoInput) {
        this.$refs.photoInput.value = '';
      }
    },

    // Закрытие модального окна
    closeModal() {
      this.isModalOpen = false;
      this.selectedPhotoFile = null;
    },

    // Обработка выбора фото
    handlePhotoChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedPhotoFile = file;
        console.log('Выбран файл:', file.name);
      }
    },

    // Отправка данных формы для создания или редактирования участника
    async submitForm() {
      try {
        console.log('Данные формы:', this.teamForm);
        
        // Создаем FormData для отправки файла
        const formData = new FormData();
        formData.append('name', this.teamForm.name);
        formData.append('role', this.teamForm.role);
        formData.append('description', this.teamForm.description);
        
        // Добавляем фото если оно выбрано
        if (this.selectedPhotoFile) {
          formData.append('photo', this.selectedPhotoFile);
        }
        
        if (this.isEditMode) {
          // Редактирование участника
          console.log('Редактируем участника с id:', this.teamForm.id);
          const response = await axios.put(`${MEDIA_API_URL}/admin-panel/teams/${this.teamForm.id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          const index = this.teams.findIndex(team => team.id === this.teamForm.id);
          if (index !== -1) {
            this.teams[index] = response.data; // Обновляем данные участника
            console.log('Участник обновлен:', response.data);
          }
        } else {
          // Добавление нового участника
          console.log('Добавляем нового участника...');
          const response = await axios.post(`${MEDIA_API_URL}/admin-panel/teams/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          this.teams.push(response.data); // Добавляем нового участника в список
          console.log('Новый участник добавлен:', response.data);
        }
        this.closeModal(); // Закрываем модальное окно
        this.filterTeams(); // Применяем фильтрацию
      } catch (error) {
        console.error('Ошибка при отправке данных формы:', error);
        if (error.response) {
          console.error('Ответ сервера:', error.response.data);
        }
      }
    },

    // Фильтрация участников команды
    filterTeams() {
      console.log('Фильтруем участников по запросу:', this.searchQuery);
      this.filteredTeams = this.teams.filter(team =>
        team.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        team.role.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (team.description && team.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
      console.log('Отфильтрованные участники:', this.filteredTeams);
    },

    // Редактирование участника
    editTeam(team) {
      console.log('Редактирование участника:', team);
      this.isModalOpen = true;
      this.isEditMode = true;
      this.teamForm = { ...team }; // Копируем данные участника в форму
      this.selectedPhotoFile = null; // Сбрасываем выбранный файл
      // Очищаем input файла при редактировании
      this.$nextTick(() => {
        if (this.$refs.photoInput) {
          this.$refs.photoInput.value = '';
        }
      });
    },

    // Удаление участника
    async deleteTeam(id) {
      try {
        console.log('Удаляем участника с id:', id);
        await axios.delete(`${MEDIA_API_URL}/admin-panel/teams/${id}/`);
        this.teams = this.teams.filter(team => team.id !== id);
        this.filterTeams(); // Применяем фильтрацию после удаления
        console.log('Участник удален');
      } catch (error) {
        console.error('Ошибка при удалении участника:', error);
      }
    }
  },
  created() {
    this.fetchTeams();  // Получаем участников команды при создании компонента
  }
};
</script>

<style scoped>
.description-cell {
  max-width: 300px;
  word-wrap: break-word;
}

.description-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
}

.description-textarea:focus {
  outline: none;
  border-color: #007bff;
}

.char-counter {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

/* Адаптивность для мобильных */
@media (max-width: 768px) {
  .description-cell {
    max-width: 150px;
  }
  
  .description-textarea {
    font-size: 16px; /* Улучшает UX на мобильных */
  }
}
</style>