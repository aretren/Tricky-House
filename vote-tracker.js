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

// Ссылки на базу данных
const secondListRef = ref(db, "secondTableData");
const nominationRef = ref(db, "nominations");

// DOM-элементы
const tabsContainer = document.getElementById("tabsContainer");
const contestantList = document.getElementById("contestantList");

// Функция для отображения вкладок
function displayTabs(nominations) {
  tabsContainer.innerHTML = ""; // Очистка вкладок

  nominations.forEach((nomination, index) => {
    const tabButton = document.createElement("button");
    tabButton.textContent = nomination;
    tabButton.className = "tab-button";
    if (index === 0) tabButton.classList.add("active"); // Установить первую вкладку активной

    tabButton.onclick = () => {
      // Убрать активный класс со всех вкладок
      document.querySelectorAll(".tab-button").forEach((btn) => btn.classList.remove("active"));
      tabButton.classList.add("active"); // Установить активной текущую вкладку
      displayContestantsByNomination(nomination);
    };

    tabsContainer.appendChild(tabButton);
  });

  // Показать данные для первой вкладки по умолчанию
  if (nominations.length > 0) {
    displayContestantsByNomination(nominations[0]);
  }
}

// Функция для отображения конкурсантов по номинации
function displayContestantsByNomination(nomination) {
  onValue(secondListRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const filteredData = Object.values(data).filter((contestant) =>
        contestant.nominations.includes(nomination)
      );

      displayContestants(filteredData, nomination);
    } else {
      contestantList.innerHTML = "<p>Нет данных для отображения.</p>";
    }
  });
}

// Функция для отображения конкурсантов
function displayContestants(data, nomination) {
  contestantList.innerHTML = ""; // Очищаем список перед обновлением

  const votesArray = data.map((value) => value.votesByNomination[nomination] || 0);
  const maxVotes = Math.max(...votesArray) || 1; // Максимальное количество голосов

  data.forEach((value) => {
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

    const votes = value.votesByNomination[nomination] || 0;
    const relativeWidth = (votes / maxVotes) * 100; // Динамическая ширина в процентах
    progressBar.style.width = `${relativeWidth}%`;

    // Число голосов внутри прогресс-бара
    progressBar.textContent = votes;

    progressBarContainer.appendChild(progressBar);
    listItem.appendChild(progressBarContainer);

    contestantList.appendChild(listItem);
  });
}

// Загрузка списка номинаций
onValue(nominationRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    const nominations = Object.values(data);
    displayTabs(nominations);
  } else {
    tabsContainer.innerHTML = "<p>Нет доступных номинаций.</p>";
  }
});
