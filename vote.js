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

// Получение параметров URL
const urlParams = new URLSearchParams(window.location.search);
const participantName = urlParams.get("name");

if (!participantName) {
  alert("Отсутствуют данные для голосования.");
  window.location.href = "check.html";
}

// DOM-элементы
const tabsContainer = document.getElementById("tabsContainer");
const contestantList = document.getElementById("contestantList");

// Ссылки на данные
const nominationRef = ref(db, "nominations");
const secondListRef = ref(db, "secondTableData");

// Отображение вкладок
function displayTabs(nominations) {
  tabsContainer.innerHTML = ""; // Очистка вкладок

  nominations.forEach((nomination, index) => {
    const button = document.createElement("button");
    button.textContent = nomination;
    button.className = "tab-button";
    if (index === 0) button.classList.add("active");

    button.onclick = () => {
      document.querySelectorAll(".tab-button").forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      displayContestantsByNomination(nomination);
    };

    tabsContainer.appendChild(button);
  });

  if (nominations.length > 0) {
    displayContestantsByNomination(nominations[0]);
  }
}

// Отображение конкурсантов для выбранной номинации
function displayContestantsByNomination(nomination) {
  onValue(secondListRef, (snapshot) => {
    const data = snapshot.val();
    contestantList.innerHTML = ""; // Очистка списка

    if (data) {
      const filteredData = Object.values(data).filter((contestant) =>
        contestant.nominations.includes(nomination)
      );

      filteredData.forEach((contestant) => {
        const listItem = document.createElement("li");

        const nameSpan = document.createElement("span");
        nameSpan.textContent = contestant.name;

        const voteButton = document.createElement("button");
        voteButton.textContent = "Проголосовать";
        voteButton.onclick = () => alert(`Вы проголосовали за ${contestant.name} в номинации "${nomination}"`);

        listItem.appendChild(nameSpan);
        listItem.appendChild(voteButton);
        contestantList.appendChild(listItem);
      });
    } else {
      contestantList.innerHTML = "<p>Нет данных для отображения.</p>";
    }
  });
}

// Загрузка номинаций
onValue(nominationRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    displayTabs(Object.values(data));
  } else {
    tabsContainer.innerHTML = "<p>Нет доступных номинаций.</p>";
  }
});
