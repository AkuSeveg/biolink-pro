/*
  ===============================================
  PUBLIC/BUILDER.JS - Core Logic BioLink SaaS
  White-Label Edition
  ===============================================
*/

// 1. STATE MANAGEMENT (Menyimpan data sementara)
let bioData = {
    name: 'Alex Carter',
    bio: 'Digital Creator & Tech Enthusiast',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    theme: 'theme-glass',
    links: [
        { id: Date.now(), title: 'Kunjungi Website Saya', url: 'https://example.com' },
        { id: Date.now() + 1, title: 'Follow Instagram', url: 'https://instagram.com' }
    ]
};

// 2. DOM ELEMENTS
const inputName = document.getElementById('input-name');
const inputBio = document.getElementById('input-bio');
const inputPhoto = document.getElementById('input-photo');
const inputTheme = document.getElementById('input-theme');
const linksContainer = document.getElementById('links-container');
const addLinkBtn = document.getElementById('add-link-btn');
const livePreview = document.getElementById('live-preview');
const exportBtn = document.getElementById('export-btn');

// 3. EVENT LISTENERS UNTUK LIVE UPDATE
inputName.addEventListener('input', (e) => { bioData.name = e.target.value; updatePreview(); });
inputBio.addEventListener('input', (e) => { bioData.bio = e.target.value; updatePreview(); });
inputPhoto.addEventListener('input', (e) => { bioData.photo = e.target.value; updatePreview(); });
inputTheme.addEventListener('change', (e) => { bioData.theme = e.target.value; updatePreview(); });

addLinkBtn.addEventListener('click', () => {
    bioData.links.push({ id: Date.now(), title: 'Link Baru', url: 'https://' });
    renderAdminLinks();
    updatePreview();
});

exportBtn.addEventListener('click', downloadFinalHTML);

// 4. RENDER LIST LINK DI PANEL ADMIN (KIRI)
function renderAdminLinks() {
    linksContainer.innerHTML = '';
    bioData.links.forEach((link, index) => {
        const card = document.createElement('div');
        card.className = 'link-item-card';
        card.innerHTML = `
            <button class="delete-link-btn" onclick="removeLink(${link.id})">
                <i class="ri-delete-bin-line"></i>
            </button>
            <div class="form-group">
                <label>Judul Tautan</label>
                <input type="text" value="${link.title}" oninput="updateLink(${link.id}, 'title', this.value)">
            </div>
            <div class="form-group" style="margin-bottom: 0;">
                <label>URL / Tautan</label>
                <input type="url" value="${link.url}" oninput="updateLink(${link.id}, 'url', this.value)">
            </div>
        `;
        linksContainer.appendChild(card);
    });
}

// Fungsi Update/Hapus Link dari array
window.updateLink = (id, field, value) => {
    const link = bioData.links.find(l => l.id === id);
    if (link) link[field] = value;
    updatePreview();
};

window.removeLink = (id) => {
    bioData.links = bioData.links.filter(l => l.id !== id);
    renderAdminLinks();
    updatePreview();
};

// 5. RENDER LIVE PREVIEW DI MOCKUP HP (KANAN)
function updatePreview() {
    // Generate HTML khusus untuk isi Mockup HP
    let linksHTML = bioData.links.map((link, index) => `
        <a href="${link.url}" target="_blank" class="biolink-btn animate-on-scroll" style="animation-delay: ${index * 0.1}s">
            ${link.title}
        </a>
    `).join('');

    livePreview.innerHTML = `
        <div class="preview-wrapper ${bioData.theme}">
            <img src="${bioData.photo}" alt="Profile" class="preview-photo">
            <h1 class="preview-name">${bioData.name}</h1>
            <!-- Efek Typewriter diterapkan pada Bio -->
            <div style="display: flex; justify-content: center; width: 100%;">
                <p class="preview-bio typewriter">${bioData.bio}</p>
            </div>
            <div class="preview-links">
                ${linksHTML}
            </div>
        </div>
    `;
}

// 6. GENERATE FINAL HTML & DOWNLOAD
function downloadFinalHTML() {
    exportBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> MEMPROSES...';
    
    setTimeout(() => {
        const finalHTML = generateStandaloneHTML();
        const blob = new Blob([finalHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `biolink-${bioData.name.toLowerCase().replace(/\s+/g, '-')}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        exportBtn.innerHTML = '<i class="ri-download-cloud-2-line"></i> DOWNLOAD BIOLINK HTML';
    }, 1000); // Simulasi loading agar terkesan pro
}

// 7. TEMPLATE HTML FINAL YANG AKAN DIDOWNLOAD USER
function generateStandaloneHTML() {
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${bioData.name} | BioLink</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
        body { min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 3rem 1.5rem; }
        
        /* THEMES CSS */
        .theme-glass { background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%); color: #0f172a; }
        .theme-glass .biolink-btn { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.8); color: #0f172a; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .theme-glass .biolink-btn:hover { background: rgba(255, 255, 255, 0.9); transform: translateY(-3px); }
        
        .theme-dark { background: #0f172a; color: #f8fafc; }
        .theme-dark .biolink-btn { background: #1e293b; border: 1px solid #334155; color: #f8fafc; }
        .theme-dark .biolink-btn:hover { background: #334155; border-color: #3b82f6; transform: translateY(-3px); }
        
        .theme-clean { background: #ffffff; color: #0f172a; }
        .theme-clean .biolink-btn { background: #f8fafc; border: 1px solid #e2e8f0; color: #0f172a; }
        .theme-clean .biolink-btn:hover { background: #0f172a; color: #ffffff; transform: translateY(-3px); }

        /* BASE LAYOUT */
        .preview-wrapper { width: 100%; max-width: 400px; text-align: center; }
        .preview-photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 3px solid rgba(255,255,255,0.2); }
        .preview-name { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; }
        .preview-bio { font-size: 0.9rem; margin-bottom: 2rem; opacity: 0.8; }
        .preview-links { display: flex; flex-direction: column; gap: 1rem; }
        .biolink-btn { display: block; padding: 1rem; border-radius: 999px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; }
        
        /* ANIMATIONS DARI BUILDER */
        .typewriter {
            overflow: hidden; border-right: .15em solid currentColor; white-space: nowrap; margin: 0 auto; letter-spacing: .05em;
            animation: typing 4s steps(30, end) infinite, blink-caret .75s step-end infinite;
        }
        .animate-on-scroll { opacity: 0; animation: listEntrance 0.6s ease forwards; }
        
        @keyframes typing { 0%, 10%, 100% { width: 0; } 40%, 60% { width: 100%; } 90% { width: 0; } }
        @keyframes blink-caret { from, to { border-color: transparent; } 50% { border-color: currentColor; } }
        @keyframes listEntrance { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="${bioData.theme}">
    <div class="preview-wrapper">
        <img src="${bioData.photo}" alt="Profile" class="preview-photo animate-on-scroll" style="animation-delay: 0s;">
        <h1 class="preview-name animate-on-scroll" style="animation-delay: 0.1s;">${bioData.name}</h1>
        <div style="display: flex; justify-content: center; width: 100%;" class="animate-on-scroll" style="animation-delay: 0.2s;">
            <p class="preview-bio typewriter">${bioData.bio}</p>
        </div>
        <div class="preview-links">
            ${bioData.links.map((link, i) => `<a href="${link.url}" target="_blank" class="biolink-btn animate-on-scroll" style="animation-delay: ${0.3 + (i * 0.1)}s">${link.title}</a>`).join('')}
        </div>
        <div style="margin-top: 3rem; font-size: 0.7rem; opacity: 0.5; font-weight: 600; letter-spacing: 1px;">
            POWERED BY YOANZ SYSTEM
        </div>
    </div>
</body>
</html>`;
}

// 8. INISIALISASI PERTAMA KALI
renderAdminLinks();
updatePreview();
