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
            <th>Изображение</th>
            <th id="last">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="caseItem in filteredCases" :key="caseItem.id">
            <td>{{ caseItem.title }}</td>
            <td>{{ caseItem.description }}</td>
            <td>
              <img v-if="caseItem.image" :src="caseItem.image" alt="Изображение кейса" 
                   style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
              <span v-else style="color: #999; font-style: italic;">Нет изображения</span>
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
         style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); z-index: 999999; display: flex; align-items: center; justify-content: center;"
         @click.self="closeModal">
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); max-width: 90vw; width: 500px;">
        <h2 style="margin-bottom: 20px; font-size: 24px; color: #000F42;">{{ isEditMode ? 'Редактировать кейс' : 'Добавить кейс' }}</h2>
        
        <!-- Превью текущего изображения при редактировании -->
        <div v-if="isEditMode && caseForm.image" style="margin-bottom: 20px; text-align: center;">
          <p style="margin-bottom: 10px; font-size: 14px; color: #666;">Текущее изображение:</p>
          <img :src="caseForm.image" alt="Текущее изображение" 
               style="max-width: 200px; max-height: 150px; object-fit: cover; border-radius: 8px; border: 2px solid #eee;" />
        </div>
        
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="title" style="display: block; font-size: 14px; color: #333; margin-bottom: 5px; font-weight: 500;">Название:</label>
            <input type="text" v-model="caseForm.title" id="title" required 
                   style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 16px;" />
          </div>
          <div class="form-group">
            <label for="description" style="display: block; font-size: 14px; color: #333; margin-bottom: 5px; font-weight: 500;">Описание:</label>
            <textarea v-model="caseForm.description" id="description" required 
                      style="width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 16px; min-height: 100px; resize: vertical;"></textarea>
          </div>
          <div class="form-group">
            <label for="image" style="display: block; font-size: 14px; color: #333; margin-bottom: 5px; font-weight: 500;">Изображение:</label>
            <input type="file" ref="imageInput" @change="handleImageChange" id="image" accept="image/*"
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
  name: 'AdminCases',
  data() {
    return {
      cases: [], // Массив кейсов, получаемых с бэкенда
      filteredCases: [],
      searchQuery: '',
      isModalOpen: false,  // Открытие модального окна
      isEditMode: false,   // Режим редактирования или добавления
      caseForm: {
        id: null,
        title: '',
        description: '',
        image: null,
      },
      selectedImageFile: null, // Для хранения выбранного файла
    };
  },
  methods: {
    // Метод для получения всех кейсов с бэкенда
    async fetchCases() {
      try {
        console.log('Запрашиваем кейсы...');
        const response = await axios.get(MEDIA_API_URL + "/admin-panel/cases/");
        this.cases = response.data;  // Сохраняем данные кейсов
        this.filteredCases = this.cases;  // Инициализируем отфильтрованные кейсы
        console.log('Кейсы загружены:', this.cases);
      } catch (error) {
        console.error('Ошибка при загрузке кейсов:', error);
      }
    },

    // Открытие модального окна для добавления нового кейса
    openAddCaseModal() {
      console.log('Открываем модалку для добавления кейса');
      this.isModalOpen = true;
      this.isEditMode = false;
      this.caseForm = { id: null, title: '', description: '', image: null }; // сброс формы
      this.selectedImageFile = null;
      // Очищаем input файла
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = '';
      }
    },

    // Закрытие модального окна
    closeModal() {
      this.isModalOpen = false;
      this.selectedImageFile = null;
    },

    // Обработка выбора изображения
    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedImageFile = file;
        console.log('Выбран файл:', file.name);
      }
    },

    // Отправка данных формы для создания или редактирования кейса
    async submitForm() {
      try {
        console.log('Данные формы:', this.caseForm);
        
        // Создаем FormData для отправки файла
        const formData = new FormData();
        formData.append('title', this.caseForm.title);
        formData.append('description', this.caseForm.description);
        
        // Добавляем изображение если оно выбрано
        if (this.selectedImageFile) {
          formData.append('image', this.selectedImageFile);
        }
        
        if (this.isEditMode) {
          // Редактирование кейса
          console.log('Редактируем кейс с id:', this.caseForm.id);
          const response = await axios.put(`${MEDIA_API_URL}/admin-panel/cases/${this.caseForm.id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          const index = this.cases.findIndex(caseItem => caseItem.id === this.caseForm.id);
          if (index !== -1) {
            this.cases[index] = response.data; // Обновляем данные кейса
            console.log('Кейс обновлен:', response.data);
          }
        } else {
          // Добавление нового кейса
          console.log('Добавляем новый кейс...');
          const response = await axios.post(`${MEDIA_API_URL}/admin-panel/cases/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          this.cases.push(response.data); // Добавляем новый кейс в список
          console.log('Новый кейс добавлен:', response.data);
        }
        this.closeModal(); // Закрываем модальное окно
        this.filterCases(); // Применяем фильтрацию
      } catch (error) {
        console.error('Ошибка при отправке данных формы:', error);
        if (error.response) {
          console.error('Ответ сервера:', error.response.data);
        }
      }
    },

    // Фильтрация кейсов
    filterCases() {
      console.log('Фильтруем кейсы по запросу:', this.searchQuery);
      this.filteredCases = this.cases.filter(caseItem =>
        caseItem.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        caseItem.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      console.log('Отфильтрованные кейсы:', this.filteredCases);
    },

    // Редактирование кейса
    editCase(caseItem) {
      console.log('Редактирование кейса:', caseItem);
      this.isModalOpen = true;
      this.isEditMode = true;
      this.caseForm = { ...caseItem }; // Копируем данные кейса в форму
      this.selectedImageFile = null; // Сбрасываем выбранный файл
      // Очищаем input файла при редактировании
      this.$nextTick(() => {
        if (this.$refs.imageInput) {
          this.$refs.imageInput.value = '';
        }
      });
    },

    // Удаление кейса
    async deleteCase(id) {
      try {
        console.log('Удаляем кейс с id:', id);
        await axios.delete(`${MEDIA_API_URL}/admin-panel/cases/${id}/`);
        this.cases = this.cases.filter(caseItem => caseItem.id !== id);
        this.filterCases(); // Применяем фильтрацию после удаления
        console.log('Кейс удален');
      } catch (error) {
        console.error('Ошибка при удалении кейса:', error);
      }
    }
  },
  created() {
    this.fetchCases();  // Получаем кейсы при создании компонента
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
  background-color: #f4f4f4;
  border-top-left-radius: 15px;
}

.case-table th#last {
  background-color: #f4f4f4;
  border-top-right-radius: 15px;
}

/* Адаптивность для модального окна */
@media (max-width: 768px) {
  .admin-cases {
    padding: 20px;
  }
  
  .case-table th, .case-table td {
    padding: 10px;
    font-size: 14px;
  }
  
  .action-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>