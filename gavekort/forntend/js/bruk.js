const form = document.getElementById("use-form");
const resultBox = document.getElementById("use-result");
const numberInput = document.getElementById("gift-card-number");
const amountInput = document.getElementById("amount");
const savedCardNumber = localStorage.getItem("sisteGavekortNummer");

if (savedCardNumber && !numberInput.value) {
	numberInput.value = savedCardNumber;
}

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	const id = Number(numberInput.value);
	const belop = Number(amountInput.value);

	if (!Number.isFinite(id) || id <= 0) {
		resultBox.textContent = "Skriv inn et gyldig gavekortnummer.";
		return;
	}

	if (!Number.isFinite(belop) || belop <= 0) {
		resultBox.textContent = "Skriv inn et gyldig beløp.";
		return;
	}

	resultBox.textContent = "Bruker gavekort...";
	resultBox.classList.remove("result--success", "result--error");

	try {
		const response = await fetch(`http://127.0.0.1:5000/gavekort/${id}/bruk`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ belop })
		});

		const data = await response.json();

		if (!response.ok) {
			resultBox.classList.add("result--error");
			resultBox.textContent = data.error || "Kunne ikke bruke gavekortet.";
			return;
		}

		resultBox.classList.add("result--success");
		resultBox.innerHTML = `
			<strong>Gavekort brukt</strong><br>
			Nummer: ${data.id}<br>
			Brukt: ${data.brukt}<br>
			Igjen: ${data.igjen}
		`;
	} catch (error) {
		resultBox.classList.add("result--error");
		resultBox.textContent = "Klarte ikke å koble til backend.";
	}
});
