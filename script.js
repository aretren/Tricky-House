import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Ваши данные Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDPZfsVqCG1kbI8d2ev74gWeHnorpD2lkM",
  authDomain: "dynamictableproject.firebaseapp.com",
  databaseURL: "https://dynamictableproject-default-rtdb.asia-southeast1.firebasedatabase.app", // URL вашей Realtime Database
  projectId: "dynamictableproject",
  storageBucket: "dynamictableproject.firebasestorage.app",
  messagingSenderId: "833661205938",
  appId: "1:833661205938:web:fa757d8070329d2dc3c8ab",
  measurementId: "G-T419JQJQVP"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Сохранение данных в Firebase
function saveData(data) {
  set(ref(db, 'tableData'), data);
}

// Загрузка данных из Firebase (однократный запрос)
function loadData(callback) {
  const tableRef = ref(db, 'tableData');
  get(tableRef).then((snapshot) => {
    const data = snapshot.val() || [];
    callback(data);  // Передаем данные в callback
  });
}

// Обновление таблицы
function updateTable(data) {
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';  // Очистить таблицу

  // Для каждого участника создаем строку
  data.forEach((item, index) => {
    const row = document.createElement('tr');
    
    // Столбец с ФИО
    const nameCell = document.createElement('td');
    nameCell.textContent = item;  // ФИО участника
    
    // Столбец с кнопкой Удалить
    const deleteCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.onclick = () => deleteData(index);  // Удаление данных по индексу
    
    deleteCell.appendChild(deleteButton);
    row.appendChild(nameCell);
    row.appendChild(deleteCell);
    tableBody.appendChild(row);
  });
}

// Удаление данных
function deleteData(index) {
  const tableRef = ref(db, 'tableData');
  get(tableRef).then((snapshot) => {
    const data = snapshot.val();
    if (data) {
      data.splice(index, 1);  // Удаляем выбранный элемент
      saveData(data);  // Сохраняем обновлённые данные в базе
    }
  });
}

// Добавление нового значения
document.getElementById('addButton').onclick = () => {
  const newData = document.getElementById('newData').value.trim();
  if (newData) {
    loadData((data) => {
      // Добавляем новое значение в массив
      data.push(newData);
      saveData(data);  // Сохраняем обновлённые данные в базе
      document.getElementById('newData').value = '';  // Очистить поле ввода
    });
  }
};

// Загрузить данные при старте
loadData(updateTable);
