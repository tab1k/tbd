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
      <button class="add-case-btn" @click="openAddCaseModal">
        <span class="plus-icon">+</span>
      </button>
    </div>

    <div class="table-responsive">
      <table class="case-table">
        <thead>
          <tr>
            <th id="first">Название</th>
            <th>Описание</th>
            <th id="last">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="caseItem in filteredCases" :key="caseItem.id">
            <td>{{ caseItem.title }}</td>
            <td>{{ caseItem.description }}</td>
            <td>
              <button @click="editCase(caseItem)" class="action-btn edit-btn">Редактировать</button>
              <button @click="deleteCase(caseItem.id)" class="action-btn delete-btn">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно для добавления/редактирования кейса -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal">
        <h2>{{ isEditMode ? 'Редактировать кейс' : 'Добавить кейс' }}</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="title">Название:</label>
            <input type="text" v-model="caseForm.title" id="title" required />
          </div>
          <div class="form-group">
            <label for="description">Описание:</label>
            <textarea v-model="caseForm.description" id="description" required></textarea>
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
  name: 'AdminCases',
  data() {
    return {
      cases: [
        { id: 1, title: 'Кейс 1', description: 'Описание кейса 1' },
        { id: 2, title: 'Кейс 2', description: 'Описание кейса 2' },
        { id: 3, title: 'Кейс 3', description: 'Описание кейса 3' },
      ],
      filteredCases: [],
      searchQuery: '',
      isModalOpen: false,
      isEditMode: false,
      caseForm: {
        id: null,
        title: '',
        description: '',
      },
    };
  },
  methods: {
    openAddCaseModal() {
      this.isModalOpen = true;
      this.isEditMode = false;
      this.caseForm = { id: null, title: '', description: '' }; // сброс формы
    },
    closeModal() {
      this.isModalOpen = false;
    },
    submitForm() {
      if (this.isEditMode) {
        // Редактирование кейса
        const index = this.cases.findIndex(caseItem => caseItem.id === this.caseForm.id);
        if (index !== -1) {
          this.cases[index] = { ...this.caseForm };
        }
      } else {
        // Добавление нового кейса
        const newCase = { ...this.caseForm, id: Date.now() }; // Генерация id на основе текущего времени
        this.cases.push(newCase);
      }
      this.closeModal();
      this.filterCases();
    },
    filterCases() {
      this.filteredCases = this.cases.filter(caseItem => 
        caseItem.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        caseItem.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    editCase(caseItem) {
      this.isModalOpen = true;
      this.isEditMode = true;
      this.caseForm = { ...caseItem };
    },
    deleteCase(id) {
      this.cases = this.cases.filter(caseItem => caseItem.id !== id);
      this.filterCases();
    }
  },
  created() {
    this.filteredCases = this.cases;
  }
};
</script>


<style scoped>

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


.admin-cases {
  padding: 30px;
  font-family: 'Montserrat', sans-serif;
}

/* Кнопка редактирования */
.edit-btn {
  background-color: #000F42;
  color: white;
}

.edit-btn:hover {
  background-color: #003366;
}

/* Кнопка удаления */
.delete-btn {
  background-color: #d32f2f;
  color: white;
}

.delete-btn:hover {
  background-color: #c62828;
}

.action-btn {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-case-btn {
  background-color: #000F42;
  color: #fff;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-case-btn:hover {
  background-color: #003366;
}

.plus-icon {
  font-size: 24px;
  font-weight: bold;
}

.case-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
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

.form-group input, .form-group textarea {
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

.filters {
  display: flex;
  align-items: center;
}
.search-input {
    height: 40px; /* Можно изменить на нужную высоту */
    padding: 0 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

.add-user-btn {
  margin-left: 10px;  /* Отступ между полем поиска и кнопкой */
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

.add-user-btn:hover {
  background-color: #000F42;
}

.plus-icon {
  font-size: 24px;
  font-weight: bold;
}

.filters input {
  padding: 10px;
  width: 100%;
  max-width: 400px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
}


.search-input {
  padding: 10px;
  width: 100%;
  max-width: 400px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
</style>
