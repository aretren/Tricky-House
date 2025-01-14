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
const nominationInputs = document.getElementById("nominationInputs");

// Загрузка номинаций
onValue(nominationRef, (snapshot) => {
  nominationInputs.innerHTML = ""; // Очищаем список номинаций
  const data = snapshot.val();
  if (data) {
    Object.values(data).forEach((nomination) => {
      const label = document.createElement("label");
      label.textContent = nomination;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = nomination;

      label.appendChild(checkbox);
      nominationInputs.appendChild(label);
    });
  }
});

// Добавление конкурсанта
addButton.onclick = () => {
  const name = inputField.value.trim();
  if (!name) {
    alert("Введите имя участника.");
    return;
  }

  const nominations = Array.from(
    nominationInputs.querySelectorAll("input:checked")
  ).map((checkbox) => checkbox.value);

  if (nominations.length === 0) {
    alert("Выберите хотя бы одну номинацию.");
    return;
  }

  const votesByNomination = nominations.reduce((acc, nomination) => {
    acc[nomination] = 0; // У каждого конкурсанта начальное количество голосов 0
    return acc;
  }, {});

  push(secondListRef, { name, nominations, votesByNomination })
    .then(() => {
      inputField.value = ""; // Очистка поля ввода
      nominationInputs.querySelectorAll("input").forEach((input) => (input.checked = false));
    })
    .catch((error) => {
      console.error("Ошибка при добавлении участника:", error);
      alert("Не удалось добавить участника. Попробуйте снова.");
    });
};

// Обновление таблицы конкурсантов
onValue(secondListRef, (snapshot) => {
  tableBody.innerHTML = ""; // Очищаем таблицу
  const data = snapshot.val();
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      const row = document.createElement("tr");

      // Имя конкурсанта
      const nameCell = document.createElement("td");
      nameCell.textContent = value.name;
      row.appendChild(nameCell);

      // Номинации
      const nominationsCell = document.createElement("td");
      nominationsCell.textContent = value.nominations.join(", ");
      row.appendChild(nominationsCell);

      // Голоса по номинациям
      const votesCell = document.createElement("td");
      votesCell.textContent = Object.entries(value.votesByNomination)
        .map(([nomination, count]) => `${nomination}: ${count}`)
        .join(", ");
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
