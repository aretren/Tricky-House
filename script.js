document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("inputField");
    const addButton = document.getElementById("addButton");
    const tableBody = document.getElementById("tableBody");

    let data = JSON.parse(localStorage.getItem("tableData")) || []; // Загружаем данные из LocalStorage

    // Функция для сохранения данных в LocalStorage
    const saveToLocalStorage = () => {
        localStorage.setItem("tableData", JSON.stringify(data));
    };

    // Функция для отображения данных в таблице
    const renderTable = () => {
        tableBody.innerHTML = ""; // Очищаем таблицу
        data.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item}</td>
                <td><button class="deleteButton">Удалить</button></td>
            `;

            // Обработчик удаления строки
            const deleteButton = row.querySelector(".deleteButton");
            deleteButton.addEventListener("click", () => {
                data.splice(index, 1); // Удаляем элемент из массива
                saveToLocalStorage(); // Сохраняем изменения
                renderTable(); // Обновляем таблицу
            });

            tableBody.appendChild(row);
        });
    };

    // Обработчик добавления строки
    addButton.addEventListener("click", () => {
        const inputValue = inputField.value.trim();

        if (inputValue === "") {
            alert("Пожалуйста, введите значение!");
            return;
        }

        data.push(inputValue); // Добавляем значение в массив
        saveToLocalStorage(); // Сохраняем изменения
        renderTable(); // Обновляем таблицу

        inputField.value = ""; // Очищаем поле ввода
        inputField.focus(); // Ставим фокус на поле ввода
    });

    // Инициализация таблицы при загрузке страницы
    renderTable();
});
