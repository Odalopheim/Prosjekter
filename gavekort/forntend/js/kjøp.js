const form = document.getElementById("purchase-form");
const resultBox = document.getElementById("purchase-result");
const savedCardKey = "sisteGavekortNummer";

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const belop = Number(document.getElementById("amount").value);

  if (!Number.isFinite(belop) || belop <= 0) {
    resultBox.textContent = "Skriv inn et gyldig beløp.";
    return;
  }

  resultBox.textContent = "Lagrer gavekort...";

  try {
    const response = await fetch("http://127.0.0.1:5000/gavekort", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ belop })
    });

    const data = await response.json();

    if (!response.ok) {
      resultBox.textContent = data.error || "Noe gikk galt da gavekortet skulle lagres.";
      return;
    }

    resultBox.innerHTML = `
      <strong>Gavekort lagret</strong><br>
      Nummer: ${data.id}<br>
      Beløp: ${data.belop}<br>
      Igjen: ${data.igjen}
    `;

    localStorage.setItem(savedCardKey, String(data.id));
    alert(`Gavekort lagret. Nummer: ${data.id}. Trykk OK for å fortsette.`);
  } catch (error) {
    resultBox.textContent = "Klarte ikke å koble til backend.";
  }
});

const savedCardNumber = localStorage.getItem(savedCardKey);
if (savedCardNumber) {
  resultBox.innerHTML = `
    <strong>Lagret nummer funnet</strong><br>
    Siste gavekortnummer: ${savedCardNumber}
  `;
}