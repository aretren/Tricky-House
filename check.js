import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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

// Проверка имени участника
function isNameValid(inputValue, participants) {
  const inputParts = inputValue.trim().toLowerCase().split(" ");
  if (inputParts.length !== 2) return false; // Убедимся, что введены два слова (имя и фамилия)

  return participants.some((participant) => {
    const nameParts = participant.name.toLowerCase().split(" ");
    return (
      (nameParts[0] === inputParts[0] && nameParts[1] === inputParts[1]) ||
      (nameParts[0] === inputParts[1] && nameParts[1] === inputParts[0])
    );
  });
}

// Загрузка участников и номинаций
const participantsRef = ref(db, "tableData");
const nominationRef = ref(db, "nominations");

onValue(nominationRef, async (snapshot) => {
  nominationButtons.innerHTML = ""; // Очищаем старые кнопки
  const data = snapshot.val();

  if (data) {
    // Получаем список участников
    const participantsSnapshot = await get(participantsRef);
    const participants = Object.values(participantsSnapshot.val() || []);

    Object.values(data).forEach((nomination) => {
      const button = document.createElement("button");
      button.textContent = `Войти в "${nomination}"`;
      button.onclick = () => {
        const inputValue = searchField.value.trim();
        if (!inputValue) {
          alert("Введите ваше ФИО.");
          return;
        }

        if (!isNameValid(inputValue, participants)) {
          alert("Указанное имя не найдено. Проверьте ввод.");
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
