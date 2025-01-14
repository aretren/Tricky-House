import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
const tableDataRef = ref(db, "tableData"); // Участники с баллами

// Получаем имя участника из URL
const urlParams = new URLSearchParams(window.location.search);
const participantName = urlParams.get("name");

if (!participantName) {
  alert("Имя участника не передано. Возврат на главную.");
  window.location.href = "check.html";
}

// Отображаем приветственное сообщение
document.getElementById("welcomeMessage").textContent = `Добро пожаловать, ${participantName}! Вы можете проголосовать за одного конкурсанта.`;

// Функция для отображения списка конкурсантов
function displayContestants(data) {
  const list = document.getElementById("contestantList");
  list.innerHTML = ""; // Очищаем список

  Object.entries(data).forEach(([key, value]) => {
    const listItem = document.createElement("li");

    // Отображаем имя конкурсанта и текущие голоса
    const contestantName = document.createElement("span");
    contestantName.textContent = `${value.name} (Баллы: ${value.votes || 0})`;

    const voteButton = document.createElement("button");
    voteButton.textContent = "Проголосовать";
    voteButton.onclick = () => castVote(key, value.name);

    listItem.appendChild(contestantName);
    listItem.appendChild(voteButton);
    list.appendChild(listItem);
  });
}

// Функция для голосования
async function castVote(contestantKey, contestantName) {
  try {
    // Получаем данные голосующего участника
    const participantsSnapshot = await get(tableDataRef);
    const participants = participantsSnapshot.val();

    const votingParticipant = Object.values(participants).find(
      (p) => p.name === participantName
    );

    if (!votingParticipant) {
      alert("Вы не зарегистрированы.");
      return;
    }

    if (votingParticipant.score <= 0) {
      alert("У вас недостаточно баллов для голосования.");
      return;
    }

    // Получаем данные конкурсантов
    const contestantsSnapshot = await get(secondListRef);
    const contestants = contestantsSnapshot.val();

    if (!contestants[contestantKey]) {
      alert("Конкурсант не найден.");
      return;
    }

    // Увеличиваем количество голосов у конкурсанта
    const currentVotes = contestants[contestantKey].votes || 0;
    await update(ref(db, `secondTableData/${contestantKey}`), {
      votes: currentVotes + 1
    });

    // Уменьшаем балл у голосующего участника
    const participantKey = Object.keys(participants).find(
      (key) => participants[key].name === participantName
    );
    await update(ref(db, `tableData/${participantKey}`), {
      score: votingParticipant.score - 1
    });

    alert(`Вы успешно проголосовали за ${contestantName}!`);
    location.reload(); // Перезагружаем страницу, чтобы обновить голоса
  } catch (error) {
    console.error("Ошибка при голосовании:", error);
    alert("Произошла ошибка. Попробуйте снова.");
  }
}

// Загружаем список конкурсантов
get(secondListRef).then((snapshot) => {
  const data = snapshot.val();
  if (data) {
    displayContestants(data);
  } else {
    document.getElementById("contestantList").textContent = "Нет доступных конкурсантов для голосования.";
  }
});
