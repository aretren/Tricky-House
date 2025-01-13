import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPZfsVqCG1kbI8d2ev74gWeHnorpD2lkM",
  authDomain: "dynamictableproject.firebaseapp.com",
  projectId: "dynamictableproject",
  storageBucket: "dynamictableproject.firebasestorage.app",
  messagingSenderId: "833661205938",
  appId: "1:833661205938:web:fa757d8070329d2dc3c8ab",
  measurementId: "G-T419JQJQVP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Сохранение данных в Firebase
function saveData(data) {
  set(ref(db, 'tableData'), data);
}

// Загрузка данных из Firebase
function loadData() {
  const tableRef = ref(db, 'tableData');
  onValue(tableRef, (snapshot) => {
    const data = snapshot.val() || [];
    updateTable(data);
  });
}

// Обновление таблицы
function updateTable(data) {
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';  // Очистить таблицу
  data.forEach((item, index) => {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    const deleteCell = document.createElement('td');
    
    cell.textContent = item;
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteData(index);
    
    deleteCell.appendChild(deleteButton);
    row.appendChild(cell);
    row.appendChild(deleteCell);
    tableBody.appendChild(row);
  });
}

// Удаление данных
function deleteData(index) {
  const tableRef = ref(db, 'tableData');
  onValue(tableRef, (snapshot) => {
    const data = snapshot.val();
    data.splice(index, 1);
    saveData(data);  // Сохранить обновлённый список
  });
}

// Добавление нового значения
document.getElementById('addButton').onclick = () => {
  const newData = document.getElementById('newData').value.trim();
  if (newData) {
    const tableRef = ref(db, 'tableData');
    onValue(tableRef, (snapshot) => {
      const data = snapshot.val() || [];
      data.push(newData);
      saveData(data);  // Сохранить новые данные
    });
    document.getElementById('newData').value = '';  // Очистить поле ввода
  }
};

// Загрузить данные при старте
loadData();
