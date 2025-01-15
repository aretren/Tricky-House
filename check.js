import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
const loginButton = document.getElementById("loginButton");

// Проверка имени участника
async function isNameValid(inputValue) {
  const participantsRef = ref(db, "tableData");
  const snapshot = await get(participantsRef);
  const participants = Object.values(snapshot.val() || []);

  const inputParts = inputValue.trim().toLowerCase().split(" ");
  if (inputParts.length !== 2) return false;

  return participants.some((participant) => {
    const nameParts = participant.name.toLowerCase().split(" ");
    return (
      (nameParts[0] === inputParts[0] && nameParts[1] === inputParts[1]) ||
      (nameParts[0] === inputParts[1] && nameParts[1] === inputParts[0])
    );
  });
}

// Обработка входа
loginButton.onclick = async () => {
  const inputValue = searchField.value.trim();
  if (!inputValue) {
    alert("Введите ваше ФИО.");
    return;
  }

  if (!(await isNameValid(inputValue))) {
    alert("Указанное имя не найдено. Проверьте ввод.");
    return;
  }

  // Переход на страницу голосования
  window.location.href = `vote.html?name=${encodeURIComponent(inputValue)}`;
};
