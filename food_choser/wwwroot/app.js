// Load categories and countries on page load
document.addEventListener('DOMContentLoaded', () => {
    loadKategorier();
    loadLand();
    loadRetter();
});

// Load categories
async function loadKategorier() {
    try {
        const response = await fetch('/api/kategorier');
        const kategorier = await response.json();
        const select = document.getElementById('kategori');
        kategorier.forEach(k => {
            const option = document.createElement('option');
            option.value = k.kategoriId;
            option.textContent = k.navn;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Feil ved innlasting av kategorier:', error);
    }
}

// Load countries
async function loadLand() {
    try {
        const response = await fetch('/api/land');
        const lands = await response.json();
        const select = document.getElementById('land');
        lands.forEach(l => {
            const option = document.createElement('option');
            option.value = l.landId;
            option.textContent = l.navn;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Feil ved innlasting av land:', error);
    }
}

// Load and display all dishes
async function loadRetter() {
    try {
        const response = await fetch('/api/retter');
        const retter = await response.json();
        const container = document.getElementById('foods');
        container.innerHTML = '';
        
        retter.forEach(r => {
            const div = document.createElement('div');
            div.className = 'food-item';
            div.innerHTML = `
                <h3>${r.navn}</h3>
                <p><strong>Kategori:</strong> ${r.kategori || 'Ukjent'}</p>
                <p><strong>Land:</strong> ${r.land || 'Ukjent'}</p>
                <p><strong>Valgt:</strong> ${r.gangerValgt} ganger</p>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Feil ved innlasting av retter:', error);
    }
}

// Handle form submission
document.getElementById('foodForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const navn = document.getElementById('foodName').value;
    const kategoriId = parseInt(document.getElementById('kategori').value);
    const landId = parseInt(document.getElementById('land').value);
    
    try {
        const response = await fetch('/api/retter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ navn, kategoriId, landId })
        });
        
        if (response.ok) {
            document.getElementById('foodForm').reset();
            loadRetter();
        } else {
            console.error('Feil ved lagring av rett');
        }
    } catch (error) {
        console.error('Nettverksfeil:', error);
    }
});