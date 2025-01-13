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
document.getElementById('checkButton').onclick = () => {
  const inputValue = document.getElementById('checkData').value.trim();
  
  if (inputValue) {
    // Загружаем данные из базы
    const tableRef = ref(db, 'tableData');
    get(tableRef).then((snapshot) => {
      const data = snapshot.val() || []; // Получаем данные или пустой массив
      if (data.includes(inputValue)) {
        // Если значение найдено, перенаправляем на страницу
        window.location.href = "https://opros.com";
      } else {
        // Если значение не найдено, показываем предупреждение
        alert("Данные не найдены в списке.");
      }
    }).catch((error) => {
      console.error("Ошибка при загрузке данных:", error);
      alert("Произошла ошибка при проверке данных. Попробуйте позже.");
    });
  } else {
    alert("Введите значение для проверки.");
  }
};
