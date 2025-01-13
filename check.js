import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPZfsVqCG1kbI8d2ev74gWeHnorpD2lkM",
  authDomain: "dynamictableproject.firebaseapp.com",
  projectId: "dynamictableproject",
  storageBucket: "dynamictableproject.firebasestorage.app",
  messagingSenderId: "833661205938",
  appId: "1:833661205938:web:fa757d8070329d2dc3c8ab",
  measurementId: "G-T419JQJQVP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Проверка данных
document.getElementById('checkButton').onclick = () => {
  const searchTerm = document.getElementById('searchField').value.trim();
  if (searchTerm) {
    const tableRef = ref(db, 'tableData');
    onValue(tableRef, (snapshot) => {
      const data = snapshot.val() || [];
      if (data.includes(searchTerm)) {
        window.location.href = 'https://opros.com';  // Перенаправление на сайт
      } else {
        alert('No match found');
      }
    });
  }
};
