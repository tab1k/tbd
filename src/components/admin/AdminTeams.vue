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
      <button class="add-team-btn" @click="openAddTeamModal">
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
            <td><img v-if="team.photo" :src="team.photo" alt="Фото участника" class="team-photo" /></td>
            <td>
              <button @click="editUser(user)" class="action-btn edit-btn">Редактировать</button>
              <button @click="deleteUser(user.id)" class="action-btn delete-btn">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно для добавления/редактирования команды -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal">
        <h2>{{ isEditMode ? 'Редактировать команду' : 'Добавить команду' }}</h2>
        <form @submit.prevent="submitForm" enctype="multipart/form-data">
          <div class="form-group">
            <label for="name">Имя:</label>
            <input type="text" v-model="teamForm.name" id="name" required />
          </div>
          <div class="form-group">
            <label for="role">Роль:</label>
            <input type="text" v-model="teamForm.role" id="role" required />
          </div>
          <div class="form-group">
            <label for="photo">Фото:</label>
            <input type="file" @change="handleFileUpload" id="photo" />
            <div v-if="teamForm.photo">
              <img :src="teamForm.photo" alt="Фото участника" class="preview-photo" />
            </div>
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
      teams: [
        { id: 1, name: 'Алексей Петров', role: 'Менеджер', photo: '/images/team/1.jpg' },
        { id: 2, name: 'Марина Сергеева', role: 'Разработчик', photo: '/images/team/2.jpg' },
        { id: 3, name: 'Екатерина Смирнова', role: 'Дизайнер', photo: '/images/team/3.jpg' },
      ],
      filteredTeams: [],
      searchQuery: '',
      isModalOpen: false,
      isEditMode: false,
      teamForm: {
        id: null,
        name: '',
        role: '',
        photo: null,
      },
    };
  },
  methods: {
    openAddTeamModal() {
      this.isModalOpen = true;
      this.isEditMode = false;
      this.teamForm = { id: null, name: '', role: '', photo: null };
    },
    closeModal() {
      this.isModalOpen = false;
    },
    submitForm() {
      if (this.isEditMode) {
        const index = this.teams.findIndex(team => team.id === this.teamForm.id);
        if (index !== -1) {
          this.teams[index] = { ...this.teamForm };
        }
      } else {
        const newTeam = { ...this.teamForm, id: Date.now() }; // Генерация id на основе времени
        this.teams.push(newTeam);
      }
      this.closeModal();
      this.filterTeams();
    },
    filterTeams() {
      this.filteredTeams = this.teams.filter(team =>
        team.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        team.role.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    editTeam(team) {
      this.isModalOpen = true;
      this.isEditMode = true;
      this.teamForm = { ...team };
    },
    deleteTeam(id) {
      this.teams = this.teams.filter(team => team.id !== id);
      this.filterTeams();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.teamForm.photo = reader.result;
        };
        reader.readAsDataURL(file);
      }
    }
  },
  created() {
    this.filteredTeams = this.teams;
  }
};
</script>


<style scoped>
.action-btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
/* Кнопка редактирования */
.edit-btn {
  background-color: #000F42; /* Темно-синий для редактирования */
  color: white;
}

.admin-teams {
    padding: 30px;
    font-family: 'Montserrat', sans-serif;
    color: #000F42; /* Темно-синий цвет */
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

.action-btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
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

.add-team-btn {
  background-color: #000F42;
  color: #fff;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-team-btn:hover {
  background-color: #003366;
}

.filters {
  display: flex;
  align-items: center;
}

.search-input {
  height: 40px;
  padding: 0 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
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

.team-photo {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
}

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
