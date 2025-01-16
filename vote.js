import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, onValue, get, update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
const participantRef = ref(db, "tableData");

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

    const listItem = document.createElement("div");
    listItem.className = "tab-list-item";
    listItem.appendChild(button);
    tabsContainer.appendChild(listItem);
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
      const filteredData = Object.entries(data).filter(([_, contestant]) =>
        contestant.nominations.includes(nomination)
      );

      filteredData.forEach(([key, contestant]) => {
        const listItem = document.createElement("li");

        const nameSpan = document.createElement("span");
        nameSpan.textContent = contestant.name;

        const voteButton = document.createElement("button");
        voteButton.textContent = "Проголосовать";
        voteButton.onclick = async () => {
          try {
            // Проверка участника
            const participantSnapshot = await get(participantRef);
            const participants = participantSnapshot.val();
            const participantEntry = Object.entries(participants).find(
              ([_, p]) => p.name === participantName
            );

            if (!participantEntry) {
              alert("Вы не зарегистрированы.");
              return;
            }

            const [participantKey, participantData] = participantEntry;
            const remainingVotes = participantData.votes[nomination] || 0;

            if (remainingVotes <= 0) {
              alert("У вас больше нет баллов для этой номинации.");
              return;
            }

            // Обновление голосов
            const currentVotes = contestant.votesByNomination[nomination] || 0;

            // Вычитание голоса у участника
            const updatedParticipantVotes = {
              ...participantData.votes,
              [nomination]: remainingVotes - 1
            };
            await update(ref(db, `tableData/${participantKey}`), {
              votes: updatedParticipantVotes
            });

            // Добавление голоса конкурсанту
            const updatedContestantVotes = {
              ...contestant.votesByNomination,
              [nomination]: currentVotes + 1
            };
            await update(ref(db, `secondTableData/${key}`), {
              votesByNomination: updatedContestantVotes
            });

            alert(`Вы успешно проголосовали за ${contestant.name} в номинации "${nomination}".`);
          } catch (error) {
            console.error("Ошибка голосования:", error);
            alert("Произошла ошибка. Попробуйте снова.");
          }
        };

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
