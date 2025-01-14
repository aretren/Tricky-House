import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPZfsVqCG1kbI8d2ev74gWeHnorpD2lkM",
  authDomain: "dynamictableproject.firebaseapp.com",
  databaseURL: "https://dynamictableproject-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dynamictableproject",
  storageBucket: "dynamictableproject.firebasestorage.app",
  messagingSenderId: "833661205938",
  appId: "1:833661205938:web:fa757d8070329d2dc3c8ab",
  measurementId: "G-T419JQJQVP"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const secondListRef = ref(db, "secondTableData");

// DOM-элементы
const inputField = document.getElementById("newData");
const addButton = document.getElementById("addButton");
const tableBody = document.getElementById("table-body");

// Функция для обновления таблицы
function updateTable(data) {
  // Очистка текущей таблицы
  tableBody.innerHTML = "";

  // Заполнение таблицы новыми данными
  Object.entries(data).forEach(([key, value]) => {
    const row = document.createElement("tr");

    // Ячейка с именем
    const nameCell = document.createElement("td");
    nameCell.textContent = value.name;
    row.appendChild(nameCell);

    // Ячейка с количеством голосов
    const votesCell = document.createElement("td");
    votesCell.textContent = value.votes || 0; // Если голосов нет, отображаем 0
    row.appendChild(votesCell);

    // Ячейка с кнопкой удаления
    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Удалить";
    deleteButton.onclick = () => remove(ref(db, `secondTableData/${key}`)); // Удаление из Firebase
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    tableBody.appendChild(row);
  });
}

// Загрузка данных из базы в реальном времени
onValue(secondListRef, (snapshot) => {
  const data = snapshot.val() || {};
  updateTable(data); // Обновление таблицы
});

// Обработка кнопки добавления
addButton.onclick = () => {
  const newData = inputField.value.trim();
  if (newData) {
    // Добавляем нового участника с голосами = 0
    push(secondListRef, { name: newData, votes: 0 })
      .then(() => {
        inputField.value = ""; // Очищаем поле ввода после добавления
      })
      .catch((error) => {
        console.error("Ошибка при добавлении данных:", error);
        alert("Не удалось добавить данные. Попробуйте позже.");
      });
  } else {
    alert("Введите имя перед добавлением.");
  }
};
