import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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

// Функция для проверки введённого значения
document.getElementById('checkButton').onclick = () => {
  const checkValue = document.getElementById('checkValue').value.trim();
  
  if (checkValue) {
    const tableRef = ref(db, 'tableData');
    onValue(tableRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.includes(checkValue)) {
        // Если введённое значение есть в базе данных, перенаправляем на сайт
        window.location.href = "https://opros.com"; // Перенаправление
      } else {
        alert('Нет совпадений с данными в базе.');
      }
    });
  } else {
    alert('Пожалуйста, введите значение для поиска.');
  }
};
