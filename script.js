document.addEventListener('DOMContentLoaded', () => {
    const homepage = document.getElementById('homepage');
    const affirmationPage = document.getElementById('affirmation-page');
    const manageListsPage = document.getElementById('manage-lists-page');

    const startAffirmationButton = document.getElementById('start-affirmation');
    const manageListsButton = document.getElementById('manage-lists');
    const backToHomeButton = document.getElementById('back-to-home');
    const backToHomeButton2 = document.getElementById('back-to-home-2');

    // Show Homepage
    function showHomepage() {
        homepage.classList.remove('hidden');
        affirmationPage.classList.add('hidden');
        manageListsPage.classList.add('hidden');
    }

    // Show Affirmation Page
    function showAffirmationPage() {
        homepage.classList.add('hidden');
        affirmationPage.classList.remove('hidden');
        manageListsPage.classList.add('hidden');
    }

    // Show Manage Lists Page
    function showManageListsPage() {
        homepage.classList.add('hidden');
        affirmationPage.classList.add('hidden');
        manageListsPage.classList.remove('hidden');
    }

    // Event Listeners for Navigation
    startAffirmationButton.addEventListener('click', showAffirmationPage);
    manageListsButton.addEventListener('click', showManageListsPage);
    backToHomeButton.addEventListener('click', showHomepage);
    backToHomeButton2.addEventListener('click', showHomepage);

    // Load data from localStorage or initialize default data
    let lists = JSON.parse(localStorage.getItem('affirmationLists')) || {
        "default": [
            "Main confident aur strong hoon.",
            "Meri life mein anant possibilities hain.",
            "Main har din better ban raha hoon.",
            "Mujhe apne goals ko achieve karne ki shakti hai.",
            "Main apne aap se pyaar karta hoon."
        ]
    };

    let currentList = localStorage.getItem('currentList') || "default";
    let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;
    let count = parseInt(localStorage.getItem('count')) || 0;
    let maxCount = parseInt(localStorage.getItem('maxCount')) || 10;
    let totalRepeats = parseInt(localStorage.getItem('totalRepeats')) || 0;
    let dailyStreak = parseInt(localStorage.getItem('dailyStreak')) || 0;
    let lastStreakDate = localStorage.getItem('lastStreakDate') || null;

    const affirmationDisplay = document.getElementById('current-affirmation');
    const countButton = document.getElementById('count-button');
    const newAffirmationInput = document.getElementById('new-affirmation');
    const addAffirmationButton = document.getElementById('add-affirmation');
    const affirmationList = document.getElementById('affirmation-list');
    const maxCountInput = document.getElementById('max-count');
    const updateCountButton = document.getElementById('update-count');
    const totalRepeatsDisplay = document.getElementById('total-repeats');
    const dailyStreakDisplay = document.getElementById('daily-streak');
    const listSelect = document.getElementById('list-select');
    const listSelect2 = document.getElementById('list-select-2');
    const addListButton = document.getElementById('add-list');
    const deleteListButton = document.getElementById('delete-list');
    const feedbackMessage = document.getElementById('feedback-message');
    const feedbackText = document.getElementById('feedback-text');
    const feedbackMessage2 = document.getElementById('feedback-message-2');
    const feedbackText2 = document.getElementById('feedback-text-2');

    // Function to save data to localStorage
    function saveData() {
        localStorage.setItem('affirmationLists', JSON.stringify(lists));
        localStorage.setItem('currentList', currentList);
        localStorage.setItem('currentIndex', currentIndex);
        localStorage.setItem('count', count);
        localStorage.setItem('maxCount', maxCount);
        localStorage.setItem('totalRepeats', totalRepeats);
        localStorage.setItem('dailyStreak', dailyStreak);
        localStorage.setItem('lastStreakDate', lastStreakDate);
    }

    // Function to display current affirmation
    function displayAffirmation() {
        affirmationDisplay.textContent = lists[currentList][currentIndex];
        countButton.textContent = `Count: ${count}`;
    }

    // Function to move to the next affirmation
    function nextAffirmation() {
        if (currentIndex < lists[currentList].length - 1) {
            currentIndex++;
            count = 0;
            displayAffirmation();
            saveData(); // Save data after moving to the next affirmation
        } else {
            showFeedback("Badhai ho! Aapne saari affirmations complete kar li hain!", feedbackMessage, feedbackText);
        }
    }

    // Function to update daily streak
    function updateStreak() {
        const today = new Date().toDateString();
        if (lastStreakDate !== today) {
            dailyStreak++;
            lastStreakDate = today;
            dailyStreakDisplay.textContent = dailyStreak;
            saveData(); // Save data after updating streak
        }
    }

    // Event listener for count button
    countButton.addEventListener('click', () => {
        if (count < maxCount) {
            count++;
            totalRepeats++;
            totalRepeatsDisplay.textContent = totalRepeats;
            countButton.textContent = `Count: ${count}`;
            updateStreak(); // Update streak on each count
            saveData(); // Save data after updating count
        } else {
            nextAffirmation();
        }
    });

    // Event listener for update count button
    updateCountButton.addEventListener('click', () => {
        const newMaxCount = parseInt(maxCountInput.value);
        if (newMaxCount > 0) {
            maxCount = newMaxCount;
            showFeedback(`Repeat count updated to ${maxCount}`, feedbackMessage, feedbackText);
            saveData(); // Save data after updating max count
        } else {
            showFeedback("Please enter a valid number greater than 0.", feedbackMessage, feedbackText);
        }
    });

    // Function to show feedback message
    function showFeedback(message, container, textElement) {
        textElement.textContent = message;
        container.classList.remove('hidden');
        setTimeout(() => {
            container.classList.add('hidden');
        }, 3000); // Hide feedback message after 3 seconds
    }

    // Function to render the affirmation list
    function renderAffirmationList() {
        affirmationList.innerHTML = ''; // Clear the list
        lists[currentList].forEach((affirmation, index) => {
            const item = document.createElement('div');
            item.className = 'affirmation-item';
            item.setAttribute('data-index', index); // Add data-index attribute
            item.innerHTML = `
                <span>${affirmation}</span>
                <div>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            affirmationList.appendChild(item);
        });

        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.closest('.affirmation-item').getAttribute('data-index');
                editAffirmation(index);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.closest('.affirmation-item').getAttribute('data-index');
                deleteAffirmation(index);
            });
        });
    }

    // Function to add a new affirmation
    function addAffirmation() {
        const newAffirmation = newAffirmationInput.value.trim();
        if (newAffirmation) {
            lists[currentList].push(newAffirmation); // Add new affirmation to the current list
            newAffirmationInput.value = ''; // Clear input field
            renderAffirmationList(); // Update the list
            saveData(); // Save data after adding affirmation
            showFeedback("Affirmation successfully add ho gaya!", feedbackMessage2, feedbackText2);
        }
    }

    // Event listener for add affirmation button
    addAffirmationButton.addEventListener('click', addAffirmation);

    // Event listener for Enter key in add affirmation input
    newAffirmationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addAffirmation();
        }
    });

    // Function to delete an affirmation
    function deleteAffirmation(index) {
        lists[currentList].splice(index, 1); // Remove the affirmation
        renderAffirmationList(); // Update the list
        saveData(); // Save data after deleting affirmation
        showFeedback("Affirmation delete ho gaya!", feedbackMessage2, feedbackText2);
    }

    // Function to edit an affirmation
    function editAffirmation(index) {
        const item = document.querySelector(`.affirmation-item[data-index="${index}"]`);
        const span = item.querySelector('span');
        const currentText = span.textContent;

        // Create an input field for editing
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        span.replaceWith(input);

        // Create a save button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.className = 'btn-primary';
        item.querySelector('div').appendChild(saveButton);

        // Save the edited affirmation on button click
        saveButton.addEventListener('click', () => {
            saveEditedAffirmation(index, input);
        });

        // Save the edited affirmation on Enter key press
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEditedAffirmation(index, input);
            }
        });
    }

    // Function to save the edited affirmation
    function saveEditedAffirmation(index, input) {
        const updatedAffirmation = input.value.trim();
        if (updatedAffirmation) {
            lists[currentList][index] = updatedAffirmation; // Update the affirmation
            renderAffirmationList(); // Update the list
            saveData(); // Save data after editing affirmation
            showFeedback("Affirmation successfully edit ho gaya!", feedbackMessage2, feedbackText2);
        }
    }

    // Function to add a new list
    addListButton.addEventListener('click', () => {
        const newListName = prompt("Nayi list ka naam daalein:");
        if (newListName) {
            lists[newListName] = []; // Create a new empty list
            const option = document.createElement('option');
            option.value = newListName;
            option.textContent = newListName;
            listSelect.appendChild(option);
            listSelect2.appendChild(option.cloneNode(true));
            saveData(); // Save data after adding new list
            showFeedback(`List "${newListName}" successfully add ho gayi!`, feedbackMessage2, feedbackText2);
        }
    });

    // Function to delete the current list
    deleteListButton.addEventListener('click', () => {
        if (confirm("Kya aap is list ko delete karna chahte hain?")) {
            delete lists[currentList]; // Delete the current list
            currentList = "default"; // Switch to default list
            currentIndex = 0;
            count = 0;
            populateListSelect(); // Update list select options
            renderAffirmationList(); // Update the affirmation list
            saveData(); // Save data after deleting list
            showFeedback("List successfully delete ho gayi!", feedbackMessage2, feedbackText2);
        }
    });

    // Event listener for list selection
    listSelect.addEventListener('change', () => {
        currentList = listSelect.value;
        currentIndex = 0;
        count = 0;
        displayAffirmation();
        saveData(); // Save data after changing list
    });

    listSelect2.addEventListener('change', () => {
        currentList = listSelect2.value;
        renderAffirmationList();
        saveData(); // Save data after changing list
    });

    // Populate list select options
    function populateListSelect() {
        listSelect.innerHTML = ''; // Clear existing options
        listSelect2.innerHTML = ''; // Clear existing options
        Object.keys(lists).forEach(list => {
            const option = document.createElement('option');
            option.value = list;
            option.textContent = list;
            if (list === currentList) {
                option.selected = true;
            }
            listSelect.appendChild(option);
            listSelect2.appendChild(option.cloneNode(true));
        });
    }

    // Display the first affirmation on page load
    populateListSelect();
    displayAffirmation();
    renderAffirmationList(); // Render the initial list
});