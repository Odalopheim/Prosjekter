// Load categories and countries on page load
document.addEventListener('DOMContentLoaded', () => {
    loadKategorier();
    loadLand();
    loadRetter();
    
    // Show/hide form
    document.getElementById('showFormBtn').addEventListener('click', () => {
        document.getElementById('formSection').style.display = 'block';
        document.getElementById('showFormBtn').style.display = 'none';
        document.getElementById('chooseRandomBtn').style.display = 'none';
        document.getElementById('showStatsBtn').style.display = 'none';
        document.getElementById('randomSection').style.display = 'none';
    });
    
    document.getElementById('cancelBtn').addEventListener('click', () => {
        document.getElementById('formSection').style.display = 'none';
        document.getElementById('showFormBtn').style.display = 'inline-block';
        document.getElementById('chooseRandomBtn').style.display = 'inline-block';
        document.getElementById('showStatsBtn').style.display = 'inline-block';
        document.getElementById('foodForm').reset();
    });
    
    // Choose random food
    document.getElementById('chooseRandomBtn').addEventListener('click', async () => {
        await loadRandomRetter();
        document.getElementById('randomSection').style.display = 'block';
        document.getElementById('showFormBtn').style.display = 'none';
        document.getElementById('chooseRandomBtn').style.display = 'none';
        document.getElementById('showStatsBtn').style.display = 'none';
    });
    
    document.getElementById('closeRandomBtn').addEventListener('click', () => {
        document.getElementById('randomSection').style.display = 'none';
        document.getElementById('showFormBtn').style.display = 'inline-block';
        document.getElementById('chooseRandomBtn').style.display = 'inline-block';
        document.getElementById('showStatsBtn').style.display = 'inline-block';
    });
    
    // Show statistics
    document.getElementById('showStatsBtn').addEventListener('click', async () => {
        await loadStatistikk();
        document.getElementById('statsSection').style.display = 'block';
        document.getElementById('showFormBtn').style.display = 'none';
        document.getElementById('chooseRandomBtn').style.display = 'none';
        document.getElementById('showStatsBtn').style.display = 'none';
    });
    
    document.getElementById('closeStatsBtn').addEventListener('click', () => {
        document.getElementById('statsSection').style.display = 'none';
        document.getElementById('showFormBtn').style.display = 'inline-block';
        document.getElementById('chooseRandomBtn').style.display = 'inline-block';
        document.getElementById('showStatsBtn').style.display = 'inline-block';
    });
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
        
        if (retter.length === 0) {
            container.innerHTML = '<p class="no-data">Ingen retter registrert ennå.</p>';
            return;
        }
        
        retter.forEach(r => {
            const div = document.createElement('div');
            div.className = 'food-item';
            div.innerHTML = `
                <h3>${r.navn}</h3>
                <p><strong>Kategori:</strong> ${r.kategori || 'Ukjent'}</p>
                <p><strong>Land:</strong> ${r.land || 'Ukjent'}</p>
                <p><strong>Tid:</strong> ${r.tid ? r.tid + ' min' : 'Ikke oppgitt'}</p>
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
    const tid = parseInt(document.getElementById('tid').value);
    
    try {
        const response = await fetch('/api/retter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ navn, kategoriId, landId, tid })
        });
        
        if (response.ok) {
            document.getElementById('foodForm').reset();
            document.getElementById('formSection').style.display = 'none';
            document.getElementById('showFormBtn').style.display = 'inline-block';
            document.getElementById('chooseRandomBtn').style.display = 'inline-block';
            document.getElementById('showStatsBtn').style.display = 'inline-block';
            loadRetter();
        } else {
            alert('Feil ved lagring av rett');
        }
    } catch (error) {
        console.error('Nettverksfeil:', error);
        alert('Nettverksfeil - kunne ikke lagre rett');
    }
});

// Load and display 3 random dishes
async function loadRandomRetter() {
    try {
        const response = await fetch('/api/retter/random');
        const retter = await response.json();
        const container = document.getElementById('randomFoods');
        container.innerHTML = '';
        
        if (retter.length === 0) {
            container.innerHTML = '<p class="no-data">Ingen retter funnet. Legg til noen retter først!</p>';
            return;
        }
        
        retter.forEach(r => {
            const div = document.createElement('div');
            div.className = 'random-food-card';
            div.onclick = () => selectFood(r.rettId);
            div.innerHTML = `
                <h3>${r.navn}</h3>
                <p>🏷️ ${r.kategori || 'Ukjent'}</p>
                <p>🌍 ${r.land || 'Ukjent'}</p>
                <p>⏱️ ${r.tid ? r.tid + ' min' : 'Ikke oppgitt'}</p>
                <p class="click-hint">Klikk for å velge</p>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Feil ved innlasting av tilfeldige retter:', error);
    }
}

// Select a food and update the database
async function selectFood(rettId) {
    try {
        const response = await fetch(`/api/retter/${rettId}/velg`, {
            method: 'POST'
        });
        
        if (response.ok) {
            alert('Rett valgt! ✅');
            document.getElementById('randomSection').style.display = 'none';
            document.getElementById('showFormBtn').style.display = 'inline-block';
            document.getElementById('chooseRandomBtn').style.display = 'inline-block';
            document.getElementById('showStatsBtn').style.display = 'inline-block';
            loadRetter(); // Refresh the list to show updated count
        } else {
            alert('Feil ved valg av rett');
        }
    } catch (error) {
        console.error('Nettverksfeil:', error);
        alert('Nettverksfeil - kunne ikke velge rett');
    }
}

// Load and display statistics
async function loadStatistikk() {
    try {
        const response = await fetch('/api/statistikk');
        const retter = await response.json();
        const container = document.getElementById('statsContent');
        container.innerHTML = '';
        
        if (retter.length === 0) {
            container.innerHTML = '<p class="no-data">Ingen retter registrert ennå.</p>';
            return;
        }
        
        const statsTable = document.createElement('div');
        statsTable.className = 'stats-table';
        
        retter.forEach((r, index) => {
            const row = document.createElement('div');
            row.className = 'stats-row';
            
            let medal = '';
            if (index === 0) medal = '🥇';
            else if (index === 1) medal = '🥈';
            else if (index === 2) medal = '🥉';
            
            row.innerHTML = `
                <div class="stats-rank">${medal} ${index + 1}</div>
                <div class="stats-info">
                    <h3>${r.navn}</h3>
                    <p>${r.kategori || 'Ukjent'} • ${r.land || 'Ukjent'} • ${r.tid ? r.tid + ' min' : 'Tid ikke oppgitt'}</p>
                </div>
                <div class="stats-count">${r.gangerValgt} <span>valgt</span></div>
            `;
            
            statsTable.appendChild(row);
        });
        
        container.appendChild(statsTable);
    } catch (error) {
        console.error('Feil ved innlasting av statistikk:', error);
    }
}