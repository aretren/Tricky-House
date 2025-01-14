import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, get, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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

// DOM-элементы
const searchField = document.getElementById("searchField");
const checkButton = document.getElementById("checkButton");
const nominationSelect = document.getElementById("nominationSelect");

// Загрузка номинаций
const nominationRef = ref(db, "nominations");
onValue(nominationRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    Object.values(data).forEach((nomination) => {
      const option = document.createElement("option");
      option.value = nomination;
      option.textContent = nomination;
      nominationSelect.appendChild(option);
    });
  }
});

// Проверка участника и переход
checkButton.onclick = () => {
  const inputValue = searchField.value.trim();
  const selectedNomination = nominationSelect.value;

  if (!inputValue) {
    alert("Введите ФИО.");
    return;
  }

  if (!selectedNomination) {
    alert("Выберите номинацию.");
    return;
  }

  // Проверяем участника в базе
  const tableRef = ref(db, "tableData");
  get(tableRef).then((snapshot) => {
    const data = snapshot.val() || {};
    const participant = Object.values(data).find((p) => p.name === inputValue);

    if (participant) {
      // Переход на страницу голосования с передачей ФИО и номинации
      window.location.href = `vote.html?name=${encodeURIComponent(inputValue)}&nomination=${encodeURIComponent(selectedNomination)}`;
    } else {
      alert("Участник не найден.");
    }
  }).catch((error) => {
    console.error("Ошибка при проверке:", error);
    alert("Произошла ошибка. Попробуйте снова.");
  });
};
