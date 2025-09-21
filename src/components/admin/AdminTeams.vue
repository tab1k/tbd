<template>
  <div class="admin-teams">
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
      <button class="add-user-btn" @click="openAddTeamModal">
        <span class="plus-icon">+</span>
      </button>
    </div>

    <!-- Таблица с командами -->
    <div class="table-responsive">
      <table class="team-table">
        <thead>
          <tr>
            <th id="first">Имя</th>
            <th>Роль</th>
            <th>Фото</th>
            <th id="last">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="team in filteredTeams" :key="team.id">
            <td>{{ team.name }}</td>
            <td>{{ team.role }}</td>
            <td>
              <img v-if="team.photo" :src="team.photo" alt="Фото участника" 
                   style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%;" />
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
    <div v-if="isModalOpen" 
         style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); z-index: 999999; display: flex; align-items: center; justify-content: center;"
         @click.self="closeModal">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); max-width: 90vw; width: 500px;">
        <h2 style="margin-bottom: 20px; font-size: 24px; color: #000F42;">{{ isEditMode ? 'Редактировать участника' : 'Добавить участника' }}</h2>
        
        <!-- Превью текущего фото при редактировании -->
        <div v-if="isEditMode && teamForm.photo" style="margin-bottom: 20px; text-align: center;">
          <p style="margin-bottom: 10px; font-size: 14px; color: #666;">Текущее фото:</p>
          <img :src="teamForm.photo" alt="Текущее фото" 
               style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%; border: 3px solid #eee;" />
        </div>
        
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name" style="display: block; font-size: 14px; color: #333; margin-bottom: 5px; font-weight: 500;">Имя:</label>
            <input type="text" v-model="teamForm.name" id="name" required 
                   style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 16px;" />
          </div>
          <div class="form-group">
            <label for="role" style="display: block; font-size: 14px; color: #333; margin-bottom: 5px; font-weight: 500;">Роль:</label>
            <input type="text" v-model="teamForm.role" id="role" required 
                   style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 16px;" />
          </div>
          <div class="form-group">
            <label for="photo" style="display: block; font-size: 14px; color: #333; margin-bottom: 5px; font-weight: 500;">Фото:</label>
            <input type="file" ref="photoInput" @change="handlePhotoChange" id="photo" accept="image/*"
                   style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 16px;" />
            <p style="font-size: 12px; color: #666; margin-top: -10px; margin-bottom: 20px;">Поддерживаемые форматы: JPG, PNG, GIF</p>
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

    // Открытие модального окна для добавления нового участника
    openAddTeamModal() {
      console.log('Открываем модалку для добавления участника');
      this.isModalOpen = true;
      this.isEditMode = false;
      this.teamForm = { id: null, name: '', role: '', photo: null }; // сброс формы
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
        team.role.toLowerCase().includes(this.searchQuery.toLowerCase())
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

.admin-teams {
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

.team-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.team-table th, .team-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.team-table th {
  background-color: #f4f4f4;
}

.team-table th#first {
  background-color: #f4f4f4;
  border-top-left-radius: 15px;
}

.team-table th#last {
  background-color: #f4f4f4;
  border-top-right-radius: 15px;
}

/* Адаптивность для модального окна */
@media (max-width: 768px) {
  .admin-teams {
    padding: 20px;
  }
  
  .team-table th, .team-table td {
    padding: 10px;
    font-size: 14px;
  }
  
  .action-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>