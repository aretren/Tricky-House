import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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

// DOM-элементы
const contestantList = document.getElementById("contestantList");

// Загрузка конкурсантов и голосование
const secondListRef = ref(db, "secondTableData");
const participantRef = ref(db, "tableData");

onValue(secondListRef, (snapshot) => {
  const data = snapshot.val();
  contestantList.innerHTML = ""; // Очистка списка

  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (value.nominations.includes(selectedNomination)) {
        const listItem = document.createElement("li");

        const contestantName = document.createElement("span");
        contestantName.textContent = value.name;

        const voteButton = document.createElement("button");
        voteButton.textContent = "Проголосовать";
        voteButton.onclick = async () => {
          try {
            // Вычитание голоса у участника
            const participantSnapshot = await get(participantRef);
            const participants = participantSnapshot.val();
            const participant = Object.entries(participants).find(
              ([_, p]) => p.name === participantName
            );

            if (!participant) {
              alert("Вы не зарегистрированы.");
              return;
            }

            const [participantKey, participantData] = participant;
            const remainingVotes = participantData.votes[selectedNomination] || 0;

            if (remainingVotes <= 0) {
              alert("У вас недостаточно голосов для этой номинации.");
              return;
            }

            // Обновление голосов участника и конкурсанта
            await update(ref(db, `tableData/${participantKey}/votes`), {
              [selectedNomination]: remainingVotes - 1
            });

            const currentVotes = value.votesByNomination[selectedNomination] || 0;
            await update(ref(db, `secondTableData/${key}/votesByNomination`), {
              [selectedNomination]: currentVotes + 1
            });

            alert(`Вы успешно проголосовали за ${value.name} в номинации "${selectedNomination}".`);
          } catch (error) {
            console.error("Ошибка голосования:", error);
            alert("Произошла ошибка. Попробуйте снова.");
          }
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
