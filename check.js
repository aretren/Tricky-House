document.addEventListener("DOMContentLoaded", () => {
    const checkField = document.getElementById("checkField");
    const checkButton = document.getElementById("checkButton");
    const message = document.getElementById("message");

    // Получаем данные из LocalStorage
    const data = JSON.parse(localStorage.getItem("tableData")) || [];

    checkButton.addEventListener("click", () => {
        const inputValue = checkField.value.trim();

        if (inputValue === "") {
            message.textContent = "Пожалуйста, введите значение!";
            message.style.color = "red";
            return;
        }

        // Проверяем наличие значения в массиве
        if (data.includes(inputValue)) {
            window.location.href = "https://opros.com"; // Перенаправляем на указанный сайт
        } else {
            message.textContent = "Совпадений не найдено.";
            message.style.color = "red";
        }
    });
});
