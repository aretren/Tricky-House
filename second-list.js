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
const nominationRef = ref(db, "nominations");

// DOM-элементы
const inputField = document.getElementById("newData");
const addButton = document.getElementById("addButton");
const tableBody = document.getElementById("table-body");
const nominationCheckboxes = document.getElementById("nominationCheckboxes");

// Загрузка списка номинаций
onValue(nominationRef, (snapshot) => {
  nominationCheckboxes.innerHTML = ""; // Очищаем чекбоксы
  const data = snapshot.val();
  if (data) {
    Object.values(data).forEach((nomination) => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = nomination;
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(nomination));
      nominationCheckboxes.appendChild(label);
    });
  } else {
    nominationCheckboxes.innerHTML = "<p>Нет доступных номинаций.</p>";
  }
});

// Функция для добавления участника
addButton.onclick = () => {
  const newData = inputField.value.trim();
  if (newData) {
    // Собираем выбранные номинации
    const selectedNominations = Array.from(
      nominationCheckboxes.querySelectorAll("input:checked")
    ).map((checkbox) => checkbox.value);

    if (selectedNominations.length === 0) {
      alert("Выберите хотя бы одну номинацию.");
      return;
    }

    push(secondListRef, { name: newData, nominations: selectedNominations, votes: 0 })
      .then(() => {
        inputField.value = ""; // Очищаем поле ввода
      })
      .catch((error) => {
        console.error("Ошибка при добавлении участника:", error);
        alert("Не удалось добавить участника. Попробуйте снова.");
      });
  } else {
    alert("Введите имя участника.");
  }
};

// Обновление таблицы участников
onValue(secondListRef, (snapshot) => {
  tableBody.innerHTML = ""; // Очищаем таблицу
  const data = snapshot.val();
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      const row = document.createElement("tr");

      // Имя участника
      const nameCell = document.createElement("td");
      nameCell.textContent = value.name;
      row.appendChild(nameCell);

      // Номинации участника
      const nominationsCell = document.createElement("td");
      nominationsCell.textContent = value.nominations.join(", ");
      row.appendChild(nominationsCell);

      // Голоса участника
      const votesCell = document.createElement("td");
      votesCell.textContent = value.votes || 0;
      row.appendChild(votesCell);

      // Кнопка удаления
      const deleteCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Удалить";
      deleteButton.onclick = () => remove(ref(db, `secondTableData/${key}`));
      deleteCell.appendChild(deleteButton);
      row.appendChild(deleteCell);

      tableBody.appendChild(row);
    });
  } else {
    tableBody.innerHTML = "<tr><td colspan='4'>Список пуст.</td></tr>";
  }
});
