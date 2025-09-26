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
            <td>{{ getTeamField(team, 'name') }}</td>
            <td>{{ getTeamField(team, 'role') }}</td>
            <td class="description-cell">
              <span v-if="getTeamField(team, 'description')" :title="getTeamField(team, 'description')">
                {{ truncateDescription(getTeamField(team, 'description')) }}
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
      <div class="modal-content wide-modal">
        <h2>{{ isEditMode ? 'Редактировать участника' : 'Добавить участника' }}</h2>
        
        <!-- Превью текущего фото при редактировании -->
        <div v-if="isEditMode && teamForm.photo" class="current-photo-section">
          <p class="section-title">Текущее фото:</p>
          <div class="photo-preview">
            <div class="photo-circle">
              <img :src="teamForm.photo" alt="Текущее фото" class="current-photo" />
            </div>
          </div>
        </div>
        
        <form @submit.prevent="submitForm">
          
          <!-- Для создания показываем только русские поля -->
          <div v-if="!isEditMode" class="create-fields">
            <div class="form-group">
              <label for="name_ru">Имя:</label>
              <input type="text" v-model="teamForm.name_ru" id="name_ru" required />
            </div>
            <div class="form-group">
              <label for="role_ru">Роль:</label>
              <input type="text" v-model="teamForm.role_ru" id="role_ru" required />
            </div>
            <div class="form-group">
              <label for="description_ru">Описание:</label>
              <textarea 
                v-model="teamForm.description_ru" 
                id="description_ru" 
                rows="3" 
                placeholder="Введите описание участника"
                maxlength="350"
                class="description-textarea"></textarea>
              <div class="char-counter">
                {{ teamForm.description_ru ? teamForm.description_ru.length : 0 }}/350 символов
              </div>
            </div>
          </div>

          <!-- Для редактирования показываем оба языка -->
          <div v-else class="edit-fields">
            <div class="">
              <div class="form-group">
                <label for="name_ru">Имя (русский):</label>
                <input type="text" v-model="teamForm.name_ru" id="name_ru" required />
              </div>
              <div class="form-group">
                <label for="role_ru">Роль (русский):</label>
                <input type="text" v-model="teamForm.role_ru" id="role_ru" required />
              </div>
              <div class="form-group">
                <label for="description_ru">Описание (русский):</label>
                <textarea 
                  v-model="teamForm.description_ru" 
                  id="description_ru" 
                  rows="3" 
                  placeholder="Описание на русском"
                  maxlength="350"
                  class="description-textarea"></textarea>
                <div class="char-counter">
                  {{ teamForm.description_ru ? teamForm.description_ru.length : 0 }}/350 символов
                </div>
              </div>
            </div>

            <hr>

            <div class="">
              <div class="form-group">
                <label for="name_en">Имя (английский):</label>
                <input type="text" v-model="teamForm.name_en" id="name_en" />
              </div>
              <div class="form-group">
                <label for="role_en">Роль (английский):</label>
                <input type="text" v-model="teamForm.role_en" id="role_en" />
              </div>
              <div class="form-group">
                <label for="description_en">Описание (английский):</label>
                <textarea 
                  v-model="teamForm.description_en" 
                  id="description_en" 
                  rows="3" 
                  placeholder="Описание на английском"
                  maxlength="350"
                  class="description-textarea"
                ></textarea>
                <div class="char-counter">
                  {{ teamForm.description_en ? teamForm.description_en.length : 0 }}/350 символов
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="photo">Фото:</label>
            <input type="file" ref="photoInput" @change="handlePhotoChange" id="photo" accept="image/*" />
            <p class="file-hint">Поддерживаемые форматы: JPG, PNG, GIF</p>
          </div>

          <div v-if="isEditMode" class="form-group">
            <label for="translation_status">Статус перевода:</label>
            <select v-model="teamForm.translation_status" id="translation_status" class="status-select">
              <option value="none">Не переведен</option>
              <option value="auto">Автоматический</option>
              <option value="manual">Ручной</option>
            </select>
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
      teams: [],
      filteredTeams: [],
      searchQuery: '',
      isModalOpen: false,
      isEditMode: false,
      teamForm: {
        id: null,
        name_ru: '',
        name_en: '',
        role_ru: '',
        role_en: '',
        description_ru: '',
        description_en: '',
        photo: null,
        translation_status: 'none'
      },
      selectedPhotoFile: null,
    };
  },
  methods: {
    async fetchTeams() {
      try {
        console.log('Запрашиваем участников команды...');
        const response = await axios.get(`${MEDIA_API_URL}/admin-panel/teams/`, {
          params: { admin: 'true' }
        });
        this.teams = response.data;
        this.filteredTeams = this.teams;
        console.log('Участники команды загружены:', this.teams);
      } catch (error) {
        console.error('Ошибка при загрузке участников команды:', error);
      }
    },

    getTeamField(team, field) {
      return team[`${field}_ru`] || '';
    },

    truncateDescription(description) {
      if (!description) return '';
      if (description.length > 100) {
        return description.substring(0, 100) + '...';
      }
      return description;
    },

    openAddTeamModal() {
      console.log('Открываем модалку для добавления участника');
      this.isModalOpen = true;
      this.isEditMode = false;
      this.teamForm = {
        id: null,
        name_ru: '',
        name_en: '',
        role_ru: '',
        role_en: '',
        description_ru: '',
        description_en: '',
        photo: null,
        translation_status: 'none'
      };
      this.selectedPhotoFile = null;
      if (this.$refs.photoInput) {
        this.$refs.photoInput.value = '';
      }
    },

    closeModal() {
      this.isModalOpen = false;
      this.selectedPhotoFile = null;
    },

    handlePhotoChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedPhotoFile = file;
        console.log('Выбран файл:', file.name);
      }
    },

    async submitForm() {
      try {
        console.log('Данные формы:', this.teamForm);
        
        const formData = new FormData();
        
        // Для создания отправляем только русские поля (бэкенд сам переведет)
        // Для редактирования отправляем все поля
        if (this.isEditMode) {
          formData.append('name_ru', this.teamForm.name_ru);
          formData.append('name_en', this.teamForm.name_en);
          formData.append('role_ru', this.teamForm.role_ru);
          formData.append('role_en', this.teamForm.role_en);
          formData.append('description_ru', this.teamForm.description_ru);
          formData.append('description_en', this.teamForm.description_en);
          formData.append('translation_status', this.teamForm.translation_status);
        } else {
          // Для создания используем общие поля для обратной совместимости
          // Бэкенд сам создаст русские версии и автоматически переведет на английский
          formData.append('name', this.teamForm.name_ru);
          formData.append('role', this.teamForm.role_ru);
          formData.append('description', this.teamForm.description_ru);
        }
        
        if (this.selectedPhotoFile) {
          formData.append('photo', this.selectedPhotoFile);
        }
        
        if (this.isEditMode) {
          const response = await axios.patch(
            `${MEDIA_API_URL}/admin-panel/teams/${this.teamForm.id}/`, 
            formData, 
            {
              headers: { 'Content-Type': 'multipart/form-data' }
            }
          );
          
          const index = this.teams.findIndex(team => team.id === this.teamForm.id);
          if (index !== -1) {
            this.teams[index] = response.data;
            console.log('Участник обновлен:', response.data);
          }
        } else {
          const response = await axios.post(
            `${MEDIA_API_URL}/admin-panel/teams/`, 
            formData, 
            {
              headers: { 'Content-Type': 'multipart/form-data' }
            }
          );
          this.teams.push(response.data);
          console.log('Новый участник добавлен:', response.data);
        }
        
        this.closeModal();
        this.filterTeams();
      } catch (error) {
        console.error('Ошибка при отправке данных формы:', error);
        if (error.response) {
          console.error('Ответ сервера:', error.response.data);
        }
      }
    },

    filterTeams() {
      const query = this.searchQuery.toLowerCase();
      this.filteredTeams = this.teams.filter(team =>
        (team.name_ru && team.name_ru.toLowerCase().includes(query)) ||
        (team.name_en && team.name_en.toLowerCase().includes(query)) ||
        (team.role_ru && team.role_ru.toLowerCase().includes(query)) ||
        (team.role_en && team.role_en.toLowerCase().includes(query)) ||
        (team.description_ru && team.description_ru.toLowerCase().includes(query)) ||
        (team.description_en && team.description_en.toLowerCase().includes(query))
      );
    },

    editTeam(team) {
      console.log('Редактирование участника:', team);
      this.isModalOpen = true;
      this.isEditMode = true;
      this.teamForm = { ...team };
      this.selectedPhotoFile = null;
      
      this.$nextTick(() => {
        if (this.$refs.photoInput) {
          this.$refs.photoInput.value = '';
        }
      });
    },

    async deleteTeam(id) {
      try {
        console.log('Удаляем участника с id:', id);
        await axios.delete(`${MEDIA_API_URL}/admin-panel/teams/${id}/`);
        this.teams = this.teams.filter(team => team.id !== id);
        this.filterTeams();
        console.log('Участник удален');
      } catch (error) {
        console.error('Ошибка при удалении участника:', error);
      }
    }
  },
  created() {
    this.fetchTeams();
  }
};
</script>

<style scoped>
.wide-modal {
  max-width: 800px;
}

.create-fields .form-group {
  margin-bottom: 15px;
}

.status-select {
  width: 200px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.description-cell {
  max-width: 300px;
  word-wrap: break-word;
}

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

.photo-circle:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
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

.char-counter {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .wide-modal {
    max-width: 95%;
    margin: 10px;
  }
  
  .description-cell {
    max-width: 150px;
  }
}
</style>