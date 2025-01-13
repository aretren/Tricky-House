import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Ваши данные Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDPZfsVqCG1kbI8d2ev74gWeHnorpD2lkM",
  authDomain: "dynamictableproject.firebaseapp.com",
  databaseURL: "https://dynamictableproject-default-rtdb.asia-southeast1.firebasedatabase.app", // URL вашей Realtime Database
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
document.getElementById('checkButton').onclick = async () => {
  const inputValue = document.getElementById('checkData').value.trim(); // Считываем значение из поля

  if (inputValue) {
    try {
      // Загружаем данные из базы
      const tableRef = ref(db, 'tableData');
      const snapshot = await get(tableRef);

      if (snapshot.exists()) {
        const data = snapshot.val(); // Получаем данные
        const values = Object.values(data); // Преобразуем объект в массив значений

        if (values.includes(inputValue)) {
          // Если значение найдено, перенаправляем на страницу
          window.location.href = "https://vk.com/video-11254710_456241594?ysclid=m5v5kpfnnk179110829";
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
