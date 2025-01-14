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
const nominationRef = ref(db, "nominations");

// DOM-элементы
const nominationInput = document.getElementById("nominationName");
const addButton = document.getElementById("addNominationButton");
const nominationList = document.getElementById("nominationList");

// Добавление новой номинации
addButton.onclick = () => {
  const newNomination = nominationInput.value.trim();
  if (newNomination) {
    push(nominationRef, newNomination)
      .then(() => {
        nominationInput.value = ""; // Очистка поля ввода
      })
      .catch((error) => {
        console.error("Ошибка при добавлении номинации:", error);
        alert("Не удалось добавить номинацию. Попробуйте снова.");
      });
  } else {
    alert("Введите название номинации.");
  }
};

// Загрузка списка номинаций с возможностью удаления
onValue(nominationRef, (snapshot) => {
  nominationList.innerHTML = ""; // Очищаем список
  const data = snapshot.val();
  if (data) {
    Object.entries(data).forEach(([key, nomination]) => {
      const listItem = document.createElement("li");

      // Название номинации
      const nameSpan = document.createElement("span");
      nameSpan.textContent = nomination;

      // Кнопка удаления
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Удалить";
      deleteButton.onclick = () => {
        if (confirm(`Вы уверены, что хотите удалить номинацию "${nomination}"?`)) {
          remove(ref(db, `nominations/${key}`))
            .then(() => {
              alert(`Номинация "${nomination}" удалена.`);
            })
            .catch((error) => {
              console.error("Ошибка при удалении номинации:", error);
              alert("Не удалось удалить номинацию. Попробуйте снова.");
            });
        }
      };

      listItem.appendChild(nameSpan);
      listItem.appendChild(deleteButton);
      nominationList.appendChild(listItem);
    });
  } else {
    nominationList.innerHTML = "<li>Список номинаций пуст.</li>";
  }
});
