document.addEventListener('DOMContentLoaded', function () {
    const criteriaRadios = document.querySelectorAll('input[type="radio"]');
    const totalMarkInput = document.getElementById('total-mark');
    const groupSelect = document.getElementById('group');
    let groupPoster = document.getElementById('group-poster');
    const form = document.querySelector('form');

    criteriaRadios.forEach(radio => {
        radio.addEventListener('change', updateTotalMark);
    });

    groupSelect.addEventListener('change', updateGroupPoster);

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        sendDataToGoogleSheets();
    });

form.addEventListener('reset', function () {
// Enable all options in the group select dropdown
    const options = groupSelect.options;
    for (let i = 0; i < options.length; i++) {
        options[i].disabled = false;
    }

        // Reset gambar kepada gambar default
        groupPoster.src = 'gambar/default.png'; // Pastikan path ini betul
        groupPoster.style.display = 'block'; // Memastikan gambar dipaparkan
document.getElementById('submittedMarks').style.display = 'none';
 	// Clear only radio buttons and total mark
            clearSubmittedMark();



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


    function updateGroupPoster() {
        const selectedGroup = groupSelect.value;
        if (selectedGroup) {
            const imagePath = `gambar/${selectedGroup}`;
            const imageExtensions = ['jpg', 'png'];
            const pdfExtension = 'pdf';
            let found = false;

            // Reset groupPoster to its default state before loading new content
            groupPoster.src = '';
            groupPoster.style.display = 'none';

            // Function to handle image load success
            const handleImageLoad = function (src) {
                if (!found) {
                    found = true;
                    groupPoster.src = src;
                    groupPoster.style.display = 'block';
                    if (groupPoster.tagName.toLowerCase() !== 'img') {
                        groupPoster.outerHTML = `<img id="group-poster" src="${src}" alt="Poster for ${selectedGroup}">`;
                        groupPoster = document.getElementById('group-poster');
                    }
                }
            };


document.getElementById("scoringForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    // Calculate total mark based on all criteria
    let totalMark = 0;
    for (let i = 1; i <= 5; i++) {
        const selected = document.querySelector(`input[name="criteria${i}"]:checked`);
        if (selected) {
            totalMark += parseInt(selected.value);
        }
    }

    // Get selected group
    const groupSelect = document.getElementById("group");
    const selectedGroup = groupSelect.value;
    const selectedGroupText = groupSelect.options[groupSelect.selectedIndex].text;


    // Disable the selected group in the dropdown
    groupSelect.options[groupSelect.selectedIndex].disabled = true;


    
});







            // Check for image files
            for (const ext of imageExtensions) {
                const img = new Image();
                img.src = `${imagePath}.${ext}?${new Date().getTime()}`; // Cache busting
                img.onload = function () {
                    handleImageLoad(this.src);
                };
            }

            // Check for PDF file
            const pdfUrl = `${imagePath}.${pdfExtension}?${new Date().getTime()}`; // Cache busting
            fetch(pdfUrl)
                .then(response => {
                    if (response.ok && !found) {
                        found = true;
                        groupPoster.style.display = 'none';
                        if (groupPoster.tagName.toLowerCase() !== 'iframe') {
                            groupPoster.outerHTML = `<iframe id="group-poster" src="${pdfUrl}" width="100%" height="100%" frameborder="0"></iframe>`;
                            groupPoster = document.getElementById('group-poster');
                        } else {
                            groupPoster.src = pdfUrl;
                        }
                    }
                })
                .catch(() => {
                    if (!found) {
                        groupPoster.src = 'gambar/default.jpg';
                        groupPoster.style.display = 'block';
                        if (groupPoster.tagName.toLowerCase() !== 'img') {
                            groupPoster.outerHTML = `<img id="group-poster" src="gambar/default.jpg" alt="Default Poster">`;
                            groupPoster = document.getElementById('group-poster');
                        }
                    }
                });
        } else {
            groupPoster.src = 'gambar/default.jpg';
            groupPoster.style.display = 'block';
            if (groupPoster.tagName.toLowerCase() !== 'img') {
                groupPoster.outerHTML = `<img id="group-poster" src="gambar/default.jpg" alt="Default Poster">`;
                groupPoster = document.getElementById('group-poster');
            }
        }
    }



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
            // Clear only radio buttons and total mark
            clearRadioButtonsAndTotalMark();

            // Display success message
            alert('Data saved successfully!');
        }).catch(error => {
            console.error('Error:', error);
            alert('There was an error saving the data.');
        });
    }
});
