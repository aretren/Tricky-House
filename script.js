import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPZfsVqCG1kbI8d2ev74gWeHnorpD2lkM",
  authDomain: "dynamictableproject.firebaseapp.com",
  databaseURL: "https://dynamictableproject-default-rtdb.asia-southeast1.firebasedatabase.app", // Убедитесь, что адрес корректен
  projectId: "dynamictableproject",
  storageBucket: "dynamictableproject.firebasestorage.app",
  messagingSenderId: "833661205938",
  appId: "1:833661205938:web:fa757d8070329d2dc3c8ab",
  measurementId: "G-T419JQJQVP"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const tableRef = ref(db, "tableData");

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

    // Ячейка с баллом
    const scoreCell = document.createElement("td");
    scoreCell.textContent = value.score;
    row.appendChild(scoreCell);

    // Ячейка с действиями
    const actionsCell = document.createElement("td");

    // Кнопка восстановления балла
    const restoreButton = document.createElement("button");
    restoreButton.textContent = "Восстановить балл";
    restoreButton.onclick = () => {
      if (value.score === 0) {
        update(ref(db, `tableData/${key}`), { score: 1 }); // Устанавливаем балл = 1
      } else {
        alert("Баллы уже восстановлены!");
      }
    };
    actionsCell.appendChild(restoreButton);

    // Кнопка удаления участника
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Удалить";
    deleteButton.onclick = () => remove(ref(db, `tableData/${key}`)); // Удаление участника
    actionsCell.appendChild(deleteButton);

    row.appendChild(actionsCell);
    tableBody.appendChild(row);
  });
}

// Загрузка данных из базы в реальном времени
onValue(tableRef, (snapshot) => {
  const data = snapshot.val() || {};
  updateTable(data); // Обновление таблицы
});

// Обработка кнопки добавления
addButton.onclick = () => {
  const newData = inputField.value.trim();
  if (newData) {
    // Добавляем нового участника с баллом = 0
    push(tableRef, { name: newData, score: 0 })
      .then(() => {
        inputField.value = ""; // Очищаем поле ввода после добавления
      })
      .catch((error) => {
        console.error("Ошибка при добавлении данных:", error);
        alert("Не удалось добавить данные. Попробуйте позже.");
      });
  } else {
    alert("Введите значение перед добавлением.");
  }
};
