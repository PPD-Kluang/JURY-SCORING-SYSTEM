document.addEventListener('DOMContentLoaded', function () {
    const criteriaRadios = document.querySelectorAll('input[type="radio"]');
    const totalMarkInput = document.getElementById('total-mark');
    const form = document.querySelector('form');
    const juryNameSelect = document.getElementById('jury-name');
    const groupSelect = document.getElementById('group');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        sendDataToGoogleSheets();
    });

    function updateTotalMark() {
        let totalMark = 0;
        for (let i = 1; i <= 10; i++) {
            const selectedRadio = document.querySelector(`input[name="criteria${i}"]:checked`);
            if (selectedRadio) {
                totalMark += parseInt(selectedRadio.value);
            }
        }
        totalMarkInput.value = totalMark;
    }

    criteriaRadios.forEach(radio => {
        radio.addEventListener('change', updateTotalMark);
    });

    function clearRadioButtonsAndTotalMark() {
        // Uncheck all radio buttons
        criteriaRadios.forEach(radio => {
            radio.checked = false;
        });

        // Clear total mark
        totalMarkInput.value = '';
    }

    function sendDataToGoogleSheets() {
        // Store the current values of Jury Name and Group
        const juryName = juryNameSelect.value;
        const groupName = groupSelect.value;
        const criteria = [];

        for (let i = 1; i <= 10; i++) {
            const selectedRadio = document.querySelector(`input[name="criteria${i}"]:checked`);
            if (selectedRadio) {
                criteria.push(parseInt(selectedRadio.value));
            } else {
                criteria.push(0);
            }
        }
        const totalMark = totalMarkInput.value;

        const data = {
            juryName,
            groupName,
            criteria,
            totalMark
        };

        fetch('https://script.google.com/macros/s/AKfycbxkhUFWs92wt3hvmJoq5Rm4bLE1C99VgKp7HKrJ4L89JHpwNgh18DpmOktG9POvGHit8g/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(() => {
            // Clear only radio buttons and total mark, but keep Jury Name and Group selections intact
            clearRadioButtonsAndTotalMark();

            // Ensure that Jury Name and Group selections remain unchanged after the form is submitted
            juryNameSelect.value = juryName;
            groupSelect.value = groupName;

            // Display success message
            alert('Data saved successfully!');
        }).catch(error => {
            console.error('Error:', error);
            alert('There was an error saving the data.');
        });
    }
});
