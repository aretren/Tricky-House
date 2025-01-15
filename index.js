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
const tableDataRef = ref(db, "tableData");
const nominationRef = ref(db, "nominations");

// DOM-элементы
const inputField = document.getElementById("newData");
const addButton = document.getElementById("addButton");
const tableBody = document.getElementById("table-body");
const nominationInputs = document.getElementById("nominationInputs");

// Загрузка списка номинаций
onValue(nominationRef, (snapshot) => {
  nominationInputs.innerHTML = ""; // Очищаем существующие элементы
  const data = snapshot.val();
  if (data) {
    Object.values(data).forEach((nomination) => {
      const wrapper = document.createElement("div"); // Контейнер для номинации
      wrapper.className = "nomination-wrapper";

      const label = document.createElement("label");
      label.textContent = nomination;

      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.value = "1"; // По умолчанию 1 голос
      input.dataset.nomination = nomination;

      label.appendChild(input);
      wrapper.appendChild(label);
      nominationInputs.appendChild(wrapper);
    });
  } else {
    nominationInputs.innerHTML = "<p>Нет доступных номинаций.</p>";
  }
});

// Добавление участника
addButton.onclick = () => {
  const name = inputField.value.trim();
  if (!name) {
    alert("Введите ФИО участника.");
    return;
  }

  const votes = {};
  nominationInputs.querySelectorAll("input").forEach((input) => {
    const nomination = input.dataset.nomination;
    const count = parseInt(input.value, 10);
    if (count > 0) votes[nomination] = count;
  });

  if (Object.keys(votes).length === 0) {
    alert("Назначьте хотя бы один голос для номинаций.");
    return;
  }

  push(tableDataRef, { name, votes })
    .then(() => {
      inputField.value = ""; // Очистка поля ввода
      nominationInputs.querySelectorAll("input").forEach((input) => (input.value = "1"));
    })
    .catch((error) => {
      console.error("Ошибка при добавлении участника:", error);
      alert("Не удалось добавить участника. Попробуйте снова.");
    });
};

// Обновление таблицы участников
onValue(tableDataRef, (snapshot) => {
  tableBody.innerHTML = ""; // Очищаем таблицу
  const data = snapshot.val();
  if (data) {
    // Сортируем участников в алфавитном порядке
    const sortedData = Object.entries(data).sort(([, a], [, b]) => a.name.localeCompare(b.name));

    sortedData.forEach(([key, value]) => {
      const row = document.createElement("tr");

      // ФИО участника
      const nameCell = document.createElement("td");
      nameCell.textContent = value.name;
      row.appendChild(nameCell);

      // Голоса по номинациям
      const votesCell = document.createElement("td");

      // Получение номинаций из базы в порядке их появления
      const sortedVotes = Object.entries(value.votes).sort(([nom1], [nom2]) => {
        const nominationOrder = Object.keys(Object.values(snapshot.val())[0].votes);
        const index1 = nominationOrder.indexOf(nom1);
        const index2 = nominationOrder.indexOf(nom2);
        return index1 - index2;
      });

      votesCell.textContent = sortedVotes
        .map(([nomination, count]) => `${nomination}: ${count}`)
        .join(", ");
      row.appendChild(votesCell);

      // Кнопка удаления
      const deleteCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Удалить";
      deleteButton.onclick = () => remove(ref(db, `tableData/${key}`));
      deleteCell.appendChild(deleteButton);
      row.appendChild(deleteCell);

      tableBody.appendChild(row);
    });
  } else {
    tableBody.innerHTML = "<tr><td colspan='3'>Список участников пуст.</td></tr>";
  }
});
