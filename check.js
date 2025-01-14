import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPZfsVqCG1kbI8d2ev74gWeHnorpD2lkM",
  authDomain: "dynamictableproject.firebaseapp.com",
  databaseURL: "https://dynamictableproject-default-rtdb.asia-southeast1.firebasedatabase.app", // Убедитесь, что адрес корректен
  projectId: "dynamictableproject",
  storageBucket: "dynamictableproject.firebasestorage.app",
  messagingSenderId: "833661205938",
  appId: "1:833661205938:web:fa757d8070329d2dc3c8ab",
  measurementId: "G-T419JQJQVP"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Обработка кнопки проверки
document.getElementById("checkButton").onclick = async () => {
  const inputValue = document.getElementById("checkData").value.trim();

  if (inputValue) {
    try {
      // Разделяем введённое значение на имя и фамилию
      const [firstPart, secondPart] = inputValue.split(" ");
      if (!firstPart || !secondPart) {
        alert("Введите данные в формате 'Имя Фамилия' или 'Фамилия Имя'.");
        return;
      }

      const tableRef = ref(db, "tableData");
      const snapshot = await get(tableRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const values = Object.values(data).map((entry) => entry.name); // Получаем только имена из базы

        // Формируем оба возможных варианта ввода
        const normalFormat = `${firstPart} ${secondPart}`;
        const reversedFormat = `${secondPart} ${firstPart}`;

        // Проверяем оба варианта
        const matchedName = values.find(
          (name) => name === normalFormat || name === reversedFormat
        );

        if (matchedName) {
          // Если совпадение найдено, перенаправляем с передачей имени в URL
          window.location.href = `vote.html?name=${encodeURIComponent(
            matchedName
          )}`;
        } else {
          alert("Данные не найдены в списке.");
        }
      } else {
        alert("Список пуст.");
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      alert("Произошла ошибка при проверке данных. Попробуйте позже.");
    }
  } else {
    alert("Введите значение для проверки.");
  }
};
