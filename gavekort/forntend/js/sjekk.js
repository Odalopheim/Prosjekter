const form = document.getElementById("check-form");
const resultBox = document.getElementById("check-result");
const numberInput = document.getElementById("gift-card-number");
const savedCardNumber = localStorage.getItem("sisteGavekortNummer");

if (savedCardNumber && !numberInput.value) {
  numberInput.value = savedCardNumber;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = Number(numberInput.value);

  if (!Number.isFinite(id) || id <= 0) {
    resultBox.textContent = "Skriv inn et gyldig gavekortnummer.";
    return;
  }

  resultBox.textContent = "Henter saldo...";

  try {
    const response = await fetch(`http://127.0.0.1:5000/gavekort/${id}`);

    if (!response.ok) {
      resultBox.textContent = "Fant ikke gavekortet.";
      return;
    }

    const data = await response.json();
    resultBox.innerHTML = `
      <strong>Saldo funnet</strong><br>
      Nummer: ${data.id}<br>
      Totalt beløp: ${data.belop}<br>
      Brukt: ${data.brukt}<br>
      Igjen: ${data.igjen}
    `;
  } catch (error) {
    resultBox.textContent = "Klarte ikke å koble til backend.";
  }
});