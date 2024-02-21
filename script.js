document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('toolForm');
    const userInput = document.getElementById('userInput');
    const outputDiv = document.getElementById('output');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const task = document.getElementById('taskSelect').value;
        const text = userInput.value;
        const language = document.getElementById('languageSelect').value; // Make sure you have a select element with id="languageSelect"


        // Make sure this URL matches the route provided in your backend server
        fetch('http://localhost:3000/api/perform-task', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text, task: task, language: language })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            outputDiv.textContent = data.result;
        })
        .catch(error => {
            outputDiv.textContent = 'Error: ' + error.message;
        });
    });
    languageButton.addEventListener('click', function() {
        const language = languageSelect.value;
        const text = document.getElementById('userInput').value;
        // Perform the action for the selected language
        // You will need to implement the logic for what happens when the language-specific button is clicked
        console.log('Language selected:', language);
        console.log('Text to process:', text);
        // Here you would typically make a fetch call to your API with the language and text data
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');

    dropdownToggle.addEventListener('click', function() {
        // Toggle the 'active' class on the dropdown menu
        dropdownMenu.classList.toggle('active');
    });
});
