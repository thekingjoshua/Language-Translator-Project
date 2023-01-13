'use strict';
// selecting all needed elements
const selectEl = document.querySelectorAll('select'),
	fromText = document.querySelector('.from__text'),
	toText = document.querySelector('.to__text'),
	translateBtn = document.querySelector('button'),
	exchangeIcon = document.querySelector('.fa-exchange'),
	controlIcons = document.querySelectorAll('.control__icons');

(function () {
	// fetching the languages data
	fetch('language-codes sorted-lang.json')
		.then(resp => resp.json())
		.then(data => {
			for (const countryCode in data) {
				// console.log(data[countryCode]);
				let selected;
				selectEl.forEach((select, i) => {
					// setting 'English' to the 'translate from' default value
					if (i === 0 && countryCode === 'en') {
						selected = 'selected';
					} else if (i === 1 && countryCode === 'fr') {
						// setting 'French' to the 'translate to'  default value
						selected = 'selected';
					}
					// defining the HTML code to be appended
					let option = `<option value="${countryCode}"${selected}>${data[countryCode]}</option>`;
					select.insertAdjacentHTML('beforeend', option); // appending the HTML code
				});
			}
		});
	// exchange button functionality
	exchangeIcon.addEventListener('click', () => {
		// Switching the language text and the selected languages
              if (!fromText.value) return; // using guard clause if the input field is empty
		let tempText = fromText.value,
			tempLang = selectEl[0].value;
		fromText.value = toText.value;
		selectEl[0].value = selectEl[1].value;
		toText.value = tempText;
		selectEl[1].value = tempLang;
	});
	// translate button functionality
	translateBtn.addEventListener('click', () => {
		if (!fromText.value) return; // using guard clause if the input field is empty
		toText.textContent = 'Translating...';
             // toText.setAttribute('placeholder', 'Translating...');
		let text = fromText.value,
			translateFrom = selectEl[0].value,
			translateTo = selectEl[1].value;
		 let url = `https://api.mymemory.translated.net/get?q=${text}!&langpair=${translateFrom}|${translateTo}`
		// fetching the data
		fetch(url)
			.then(resp => resp.json())
			.then(data => {
				// console.log(data);
				toText.innerHTML = data.responseData.translatedText;
			});
	});
	// controls functionality
	controlIcons.forEach(icon => {
		icon.addEventListener('click', ({ target }) => {
			// console.log(target);
			if (target.classList.contains('fa-copy')) {
				if (target.id === 'from') {
					// if FROM copy icon is clicked
					fromText.select(); // selecting the value in the input field
					fromText.setSelectionRange(0, 99999); // selecting all the values
					navigator.clipboard.writeText(fromText.value);
				} else {
					// if TO copy icon is clicked
					toText.select(); // selecting the value in the input field
					toText.setSelectionRange(0, 99999); // selecting all the values
					navigator.clipboard.writeText(toText.value); // copying the current value to the current system clipboard
				}
			} else {
				if (target.classList.contains('fa-close')) {
					// if CLEAR button is clicked
					fromText.value = ''; // clearing the field value of the input
                                        toText.value = ''; // clearing the field value of the input
				} else {
					let utterance;
					// if the FROM speech button is clicked
					if (target.id === 'from') {
						utterance = new SpeechSynthesisUtterance(fromText.value);
						utterance.lang = selectEl[0].value; // setting the language to the selected value
					} else {
						utterance = new SpeechSynthesisUtterance(toText.value);
						utterance.lang = selectEl[1].value; // setting the language to the selected value
					}
					speechSynthesis.speak(utterance); // speaking the value
				}
			}
		});
	});
})();
