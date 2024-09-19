document.addEventListener('DOMContentLoaded', function () {
    const criteriaRadios = document.querySelectorAll('input[type="radio"]');
    const totalMarkInput = document.getElementById('total-mark');
    const form = document.querySelector('form');
    
    // Add event listener for the reset button
    const resetButton = form.querySelector('button[type="reset"]');
    resetButton.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent the form from doing a full reset

        // Uncheck all radio buttons (criteria)
        criteriaRadios.forEach(radio => {
            radio.checked = false;
        });

        // Clear the total mark
        totalMarkInput.value = '';

        // Keep the Jury Name and Group selections intact
    });

    criteriaRadios.forEach(radio => {
        radio.addEventListener('change', updateTotalMark);
    });

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

    function sendDataToGoogleSheets() {
        const juryName = document.getElementById('jury-name').value;
        const groupName = document.getElementById('group').value;
        const criteria = [];
        for (let i = 1; i <= 10; i++) {
            const selectedRadio = document.querySelector(`input[name="criteria${i}"]:checked`);
            if (selectedRadio) {
                criteria.push(parseInt(selectedRadio.value));
            } else {
                criteria.push(0);
            }
        }
        const totalMark = document.getElementById('total-mark').value;

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
        }).then(response => {
            if (response.ok) {
                alert('Data saved successfully!');
            } else {
                alert('Data saved successfully!');
            }

            // Clear radio button selections after submission
            criteriaRadios.forEach(radio => {
                radio.checked = false;
            });

            // Clear total mark after submission
            totalMarkInput.value = '';

        }).catch(error => {
            console.error('Error:', error);
        });
    }
});

