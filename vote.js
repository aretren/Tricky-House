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
const selectedNomination = urlParams.get("nomination");

if (!participantName || !selectedNomination) {
  alert("Отсутствуют данные для голосования.");
  window.location.href = "check.html";
}

// Отображение номинации
document.getElementById("nominationName").textContent = selectedNomination;

// DOM-элементы
const contestantList = document.getElementById("contestantList");

// Загрузка конкурсантов для выбранной номинации
const secondListRef = ref(db, "secondTableData");
onValue(secondListRef, (snapshot) => {
  const data = snapshot.val();
  contestantList.innerHTML = ""; // Очистка списка

  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (value.nominations && value.nominations.includes(selectedNomination)) {
        const listItem = document.createElement("li");

        const contestantName = document.createElement("span");
        contestantName.textContent = value.name;

        const voteButton = document.createElement("button");
        voteButton.textContent = "Проголосовать";
        voteButton.onclick = () => {
          alert(`Вы проголосовали за ${value.name} в номинации "${selectedNomination}"`);
        };

        listItem.appendChild(contestantName);
        listItem.appendChild(voteButton);
        contestantList.appendChild(listItem);
      }
    });
  } else {
    contestantList.innerHTML = "<li>Нет участников для этой номинации.</li>";
  }
});
