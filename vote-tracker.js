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
const secondListRef = ref(db, "secondTableData");

// DOM-элемент для списка конкурсантов
const contestantList = document.getElementById("contestantList");

// Функция для отображения шкал голосов
function displayContestants(data) {
  contestantList.innerHTML = ""; // Очищаем список перед обновлением

  const votesArray = Object.values(data).map((value) => value.votes || 0);
  const maxVotes = Math.max(...votesArray) || 1; // Максимальное количество голосов

  Object.entries(data).forEach(([key, value]) => {
    const listItem = document.createElement("li");

    // Имя конкурсанта
    const contestantName = document.createElement("span");
    contestantName.textContent = value.name;
    listItem.appendChild(contestantName);

    // Прогресс-бар контейнер
    const progressBarContainer = document.createElement("div");
    progressBarContainer.className = "progress-bar-container";

    // Прогресс-бар
    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";

    const votes = value.votes || 0;
    const relativeWidth = (votes / maxVotes) * 100; // Динамическая ширина в процентах
    progressBar.style.width = `${relativeWidth}%`;

    // Число голосов внутри прогресс-бара
    progressBar.textContent = votes;

    progressBarContainer.appendChild(progressBar);
    listItem.appendChild(progressBarContainer);

    contestantList.appendChild(listItem);
  });
}

// Динамическое обновление списка из Firebase
onValue(secondListRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    displayContestants(data);
  } else {
    contestantList.innerHTML = "<p>Нет данных для отображения.</p>";
  }
});
