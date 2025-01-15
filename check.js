import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
const nominationButtons = document.getElementById("nominationButtons");

// Загрузка номинаций
const nominationRef = ref(db, "nominations");
onValue(nominationRef, (snapshot) => {
  nominationButtons.innerHTML = ""; // Очищаем старые кнопки
  const data = snapshot.val();

  if (data) {
    Object.values(data).forEach((nomination) => {
      const button = document.createElement("button");
      button.textContent = `Войти в "${nomination}"`;
      button.onclick = () => {
        const inputValue = searchField.value.trim();
        if (!inputValue) {
          alert("Введите ваше ФИО.");
          return;
        }
        // Переход на страницу голосования с передачей ФИО и номинации
        window.location.href = `vote.html?name=${encodeURIComponent(inputValue)}&nomination=${encodeURIComponent(nomination)}`;
      };
      nominationButtons.appendChild(button);
    });
  } else {
    nominationButtons.innerHTML = "<p>Нет доступных номинаций.</p>";
  }
});
