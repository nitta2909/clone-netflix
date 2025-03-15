document.addEventListener('DOMContentLoaded', function() {
    initMinhaLista();
    initPerfilUsuario();
    initMenuNavegacao();
    initBuscaAvancada();
    initCategoriasInterativas();
    initFilmesRecomendados();
    
    carregarDadosUsuario();
    
    console.log('Todas as funcionalidades foram inicializadas com sucesso!');
});

let minhaLista = [];

function initMinhaLista() {
    const listaArmazenada = localStorage.getItem('minhaLista');
    if (listaArmazenada) {
        minhaLista = JSON.parse(listaArmazenada);
        atualizarIconesMinhaLista();
    }
    
    const btnMinhaListaNav = document.querySelector('nav ul li a[href="#categorias"]');
    if (btnMinhaListaNav) {
        btnMinhaListaNav.addEventListener('click', function(e) {
            e.preventDefault();
            mostrarMinhaLista();
            
            document.querySelectorAll('nav ul li a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        });
    }
    
    const btnMinhaListaHero = document.querySelector('.hero-buttons .btn-secondary');
    if (btnMinhaListaHero) {
        btnMinhaListaHero.addEventListener('click', function(e) {
            e.preventDefault();
            
            const titulo = document.querySelector('.hero-title').textContent;
            const filmeDestaque = {
                id: 'hero-featured',
                titulo: titulo,
                poster: document.querySelector('.hero-background').src,
                descricao: document.querySelector('.hero-description').textContent
            };
            
            adicionarRemoverMinhaLista(filmeDestaque);
            
            const jaAdicionado = minhaLista.some(item => item.id === filmeDestaque.id);
            this.innerHTML = jaAdicionado ? 
                '✓ Na Minha Lista' : 
                '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2V14M2 8H14" stroke="white" stroke-width="2" stroke-linecap="round"/></svg> Minha Lista';
        });
    }
    
    document.querySelectorAll('.movie-card .movie-buttons .movie-btn:nth-child(2)').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const card = this.closest('.movie-card');
            const filme = {
                id: generateId(card.querySelector('.movie-title').textContent),
                titulo: card.querySelector('.movie-title').textContent,
                poster: card.querySelector('.movie-poster').src,
                descricao: card.querySelector('.movie-description').textContent
            };
            
            adicionarRemoverMinhaLista(filme);
            
            const jaAdicionado = minhaLista.some(item => item.id === filme.id);
            this.textContent = jaAdicionado ? '✓' : '+';
        });
    });
}

function adicionarRemoverMinhaLista(filme) {
    const index = minhaLista.findIndex(item => item.id === filme.id);
    
    if (index === -1) {
        minhaLista.push(filme);
        showToast(`"${filme.titulo}" foi adicionado à sua lista`);
    } else {
        minhaLista.splice(index, 1);
        showToast(`"${filme.titulo}" foi removido da sua lista`);
    }
    
    localStorage.setItem('minhaLista', JSON.stringify(minhaLista));
    
    atualizarIconesMinhaLista();
}

function atualizarIconesMinhaLista() {
    document.querySelectorAll('.movie-card').forEach(card => {
        const titulo = card.querySelector('.movie-title').textContent;
        const id = generateId(titulo);
        const btnAdicionar = card.querySelector('.movie-buttons .movie-btn:nth-child(2)');
        
        if (btnAdicionar) {
            const jaAdicionado = minhaLista.some(item => item.id === id);
            btnAdicionar.textContent = jaAdicionado ? '✓' : '+';
        }
    });
    
    const btnMinhaListaHero = document.querySelector('.hero-buttons .btn-secondary');
    if (btnMinhaListaHero) {
        const titulo = document.querySelector('.hero-title').textContent;
        const jaAdicionado = minhaLista.some(item => item.titulo.includes(titulo));
        
        btnMinhaListaHero.innerHTML = jaAdicionado ? 
            '✓ Na Minha Lista' : 
            '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2V14M2 8H14" stroke="white" stroke-width="2" stroke-linecap="round"/></svg> Minha Lista';
    }
    
    const contador = document.querySelector('.minha-lista-contador');
    if (contador && minhaLista.length > 0) {
        contador.textContent = minhaLista.length;
        contador.style.display = 'inline-block';
    } else if (contador) {
        contador.style.display = 'none';
    }
}

function mostrarMinhaLista() {
    if (minhaLista.length === 0) {
        alert("Sua lista está vazia. Adicione filmes e séries clicando no botão + nos cards.");
        return;
    }
    
    const modalHTML = `
    <div class="my-list-modal">
        <div class="my-list-content">
            <div class="my-list-header">
                <h2>Minha Lista</h2>
                <button class="close-my-list">✕</button>
            </div>
            <div class="my-list-grid">
                ${minhaLista.map(item => `
                    <div class="my-list-item" data-id="${item.id}">
                        <div class="my-list-poster">
                            <img src="${item.poster}" alt="${item.titulo}">
                            <div class="my-list-controls">
                                <button class="my-list-play">►</button>
                                <button class="my-list-remove">✕</button>
                            </div>
                        </div>
                        <h3>${item.titulo}</h3>
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
    `;
    
    if (!document.getElementById('my-list-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'my-list-styles';
        styleElement.textContent = `
            .my-list-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                z-index: 1001;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .my-list-content {
                width: 90%;
                max-width: 1200px;
                max-height: 90vh;
                background-color: #141414;
                border-radius: 8px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            .my-list-header {
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #333;
            }
            .my-list-header h2 {
                font-size: 1.8rem;
                color: #fff;
            }
            .close-my-list {
                background: none;
                border: none;
                color: #fff;
                font-size: 1.5rem;
                cursor: pointer;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            .close-my-list:hover {
                background-color: #E50914;
                transform: rotate(90deg);
            }
            .my-list-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 20px;
                padding: 20px;
                overflow-y: auto;
                max-height: calc(90vh - 80px);
            }
            .my-list-item {
                transition: transform 0.3s ease;
            }
            .my-list-item:hover {
                transform: scale(1.05);
            }
            .my-list-poster {
                position: relative;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 10px;
            }
            .my-list-poster img {
                width: 100%;
                height: 300px;
                object-fit: cover;
            }
            .my-list-controls {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                padding: 15px;
                background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
                display: flex;
                gap: 10px;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .my-list-poster:hover .my-list-controls {
                opacity: 1;
            }
            .my-list-controls button {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: none;
                background-color: rgba(255, 255, 255, 0.2);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .my-list-controls .my-list-play {
                background-color: #E50914;
            }
            .my-list-controls button:hover {
                transform: scale(1.1);
            }
            .my-list-item h3 {
                font-size: 1rem;
                margin-top: 5px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            @media (max-width: 768px) {
                .my-list-grid {
                    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                }
                .my-list-poster img {
                    height: 200px;
                }
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    document.body.appendChild(modalElement);
    
    const closeButton = document.querySelector('.close-my-list');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            document.querySelector('.my-list-modal').remove();
        });
    }
    
    document.querySelector('.my-list-modal').addEventListener('click', (e) => {
        if (e.target === document.querySelector('.my-list-modal')) {
            document.querySelector('.my-list-modal').remove();
        }
    });
    
    document.querySelectorAll('.my-list-play').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.closest('.my-list-item').dataset.id;
            const item = minhaLista.find(filme => filme.id === id);
            if (item) {
                alert(`Reproduzindo: ${item.titulo}`);
            }
        });
    });
    
    document.querySelectorAll('.my-list-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.closest('.my-list-item').dataset.id;
            const item = minhaLista.find(filme => filme.id === id);
            
            if (item) {
                adicionarRemoverMinhaLista(item);
                
                this.closest('.my-list-item').remove();
                
                if (minhaLista.length === 0) {
                    document.querySelector('.my-list-modal').remove();
                }
            }
        });
    });
}

let dadosUsuario = {
    nome: 'Usuário',
    avatar: 'img/profile.jpg',
    plano: 'Premium',
    preferencias: {
        generosFavoritos: ['Sci-Fi', 'Ação', 'Aventura'],
        assistirAutomaticamente: true,
        qualidadeVideo: 'HD'
    },
    historico: []
};

function initPerfilUsuario() {
    const perfilBtn = document.querySelector('.profile');
    if (perfilBtn) {
        perfilBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            perfilBtn.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!perfilBtn.contains(e.target)) {
                perfilBtn.classList.remove('active');
            }
        });
    }
    
    const perfilLink = document.querySelector('.profile-menu ul li:first-child a');
    if (perfilLink) {
        perfilLink.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarPerfilUsuario();
        });
    }
    
    const configLink = document.querySelector('.profile-menu ul li:nth-child(2) a');
    if (configLink) {
        configLink.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarConfiguracoes();
        });
    }
    
    const sairLink = document.querySelector('.profile-menu ul li:last-child a');
    if (sairLink) {
        sairLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Tem certeza que deseja sair?')) {
                showToast('Sessão encerrada com sucesso!');
            }
        });
    }
}

function mostrarPerfilUsuario() {
    const modalHTML = `
    <div class="profile-modal">
        <div class="profile-content">
            <div class="profile-header">
                <h2>Meu Perfil</h2>
                <button class="close-profile">✕</button>
            </div>
            <div class="profile-body">
                <div class="profile-avatar">
                    <img src="${dadosUsuario.avatar}" alt="Avatar">
                    <button class="change-avatar">Alterar</button>
                </div>
                <div class="profile-info">
                    <div class="profile-name">
                        <h3>${dadosUsuario.nome}</h3>
                        <button class="edit-name">✎</button>
                    </div>
                    <div class="profile-details">
                        <p><strong>Plano:</strong> ${dadosUsuario.plano}</p>
                        <p><strong>Gêneros favoritos:</strong> ${dadosUsuario.preferencias.generosFavoritos.join(', ')}</p>
                        <p><strong>Qualidade de vídeo:</strong> ${dadosUsuario.preferencias.qualidadeVideo}</p>
                    </div>
                    <div class="profile-actions">
                        <button class="btn btn-primary">Editar Preferências</button>
                        <button class="btn btn-secondary">Ver Histórico</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    
    if (!document.getElementById('profile-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'profile-styles';
        styleElement.textContent = `
            .profile-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                z-index: 1001;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .profile-content {
                width: 90%;
                max-width: 800px;
                background-color: #141414;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(229, 9, 20, 0.5);
            }
            .profile-header {
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #333;
            }
            .profile-header h2 {
                font-size: 1.8rem;
                color: #fff;
            }
            .close-profile {
                background: none;
                border: none;
                color: #fff;
                font-size: 1.5rem;
                cursor: pointer;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            .close-profile:hover {
                background-color: #E50914;
                transform: rotate(90deg);
            }
            .profile-body {
                padding: 30px;
                display: flex;
                gap: 30px;
            }
            .profile-avatar {
                position: relative;
                width: 150px;
                height: 150px;
                flex-shrink: 0;
            }
            .profile-avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px;
                border: 3px solid #E50914;
            }
            .change-avatar {
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #E50914;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.8rem;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .profile-avatar:hover .change-avatar {
                opacity: 1;
            }
            .profile-info {
                flex-grow: 1;
            }
            .profile-name {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 20px;
            }
            .profile-name h3 {
                font-size: 1.5rem;
                color: #fff;
            }
            .edit-name {
                background: none;
                border: none;
                color: #ccc;
                cursor: pointer;
                font-size: 1rem;
                transition: color 0.3s ease;
            }
            .edit-name:hover {
                color: #E50914;
            }
            .profile-details {
                margin-bottom: 30px;
            }
            .profile-details p {
                margin-bottom: 10px;
                color: #ccc;
            }
            .profile-details strong {
                color: #fff;
            }
            .profile-actions {
                display: flex;
                gap: 15px;
            }
            .profile-actions .btn {
                padding: 10px 20px;
            }
            @media (max-width: 768px) {
                .profile-body {
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                .profile-name {
                    justify-content: center;
                }
                .profile-actions {
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    document.body.appendChild(modalElement);
    
    const closeButton = document.querySelector('.close-profile');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            document.querySelector('.profile-modal').remove();
        });
    }
    
    document.querySelector('.profile-modal').addEventListener('click', (e) => {
        if (e.target === document.querySelector('.profile-modal')) {
            document.querySelector('.profile-modal').remove();
        }
    });
    
    const editNameBtn = document.querySelector('.edit-name');
    if (editNameBtn) {
        editNameBtn.addEventListener('click', () => {
            const novoNome = prompt('Digite seu nome:', dadosUsuario.nome);
            if (novoNome && novoNome.trim() !== '') {
                dadosUsuario.nome = novoNome.trim();
                document.querySelector('.profile-name h3').textContent = novoNome.trim();
                
                localStorage.setItem('dadosUsuario', JSON.stringify(dadosUsuario));
                showToast('Nome atualizado com sucesso!');
            }
        });
    }
    
    const changeAvatarBtn = document.querySelector('.change-avatar');
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', () => {
            alert('Em uma implementação real, aqui abriria um seletor de arquivo para escolher uma nova imagem de perfil.');
        });
    }
    
    const editPreferencesBtn = document.querySelector('.profile-actions .btn-primary');
    if (editPreferencesBtn) {
        editPreferencesBtn.addEventListener('click', () => {
            document.querySelector('.profile-modal').remove();
            mostrarConfiguracoes();
        });
    }
    
    const viewHistoryBtn = document.querySelector('.profile-actions .btn-secondary');
    if (viewHistoryBtn) {
        viewHistoryBtn.addEventListener('click', () => {
            alert('Em uma implementação real, aqui mostraria o histórico de filmes assistidos.');
        });
    }
}

function mostrarConfiguracoes() {
    const modalHTML = `
    <div class="settings-modal">
        <div class="settings-content">
            <div class="settings-header">
                <h2>Configurações</h2>
                <button class="close-settings">✕</button>
            </div>
            <div class="settings-body">
                <div class="settings-section">
                    <h3>Preferências de Reprodução</h3>
                    <div class="settings-option">
                        <label for="autoplay">
                            Reproduzir automaticamente o próximo episódio
                            <div class="toggle-switch">
                                <input type="checkbox" id="autoplay" ${dadosUsuario.preferencias.assistirAutomaticamente ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </div>
                        </label>
                    </div>
                    <div class="settings-option">
                        <label for="video-quality">Qualidade de vídeo</label>
                        <select id="video-quality">
                            <option value="SD" ${dadosUsuario.preferencias.qualidadeVideo === 'SD' ? 'selected' : ''}>SD</option>
                            <option value="HD" ${dadosUsuario.preferencias.qualidadeVideo === 'HD' ? 'selected' : ''}>HD</option>
                            <option value="UHD" ${dadosUsuario.preferencias.qualidadeVideo === 'UHD' ? 'selected' : ''}>4K UHD</option>
                        </select>
                    </div>
                </div>
                <div class="settings-section">
                    <h3>Gêneros Favoritos</h3>
                    <div class="genres-grid">
                        <div class="genre-checkbox">
                            <input type="checkbox" id="genre-action" ${dadosUsuario.preferencias.generosFavoritos.includes('Ação') ? 'checked' : ''}>
                            <label for="genre-action">Ação</label>
                        </div>
                        <div class="genre-checkbox">
                            <input type="checkbox" id="genre-scifi" ${dadosUsuario.preferencias.generosFavoritos.includes('Sci-Fi') ? 'checked' : ''}>
                            <label for="genre-scifi">Sci-Fi</label>
                        </div>
                        <div class="genre-checkbox">
                            <input type="checkbox" id="genre-comedy" ${dadosUsuario.preferencias.generosFavoritos.includes('Comédia') ? 'checked' : ''}>
                            <label for="genre-comedy">Comédia</label>
                        </div>
                        <div class="genre-checkbox">
                            <input type="checkbox" id="genre-drama" ${dadosUsuario.preferencias.generosFavoritos.includes('Drama') ? 'checked' : ''}>
                            <label for="genre-drama">Drama</label>
                        </div>
                        <div class="genre-checkbox">
                            <input type="checkbox" id="genre-horror" ${dadosUsuario.preferencias.generosFavoritos.includes('Terror') ? 'checked' : ''}>
                            <label for="genre-horror">Terror</label>
                        </div>
                        <div class="genre-checkbox">
                            <input type="checkbox" id="genre-adventure" ${dadosUsuario.preferencias.generosFavoritos.includes('Aventura') ? 'checked' : ''}>
                            <label for="genre-adventure">Aventura</label>
                        </div>
                    </div>
                </div>
                <div class="settings-section">
                    <h3>Conta</h3>
                    <div class="account-info">
                        <p><strong>Plano:</strong> ${dadosUsuario.plano}</p>
                        <p><strong>Email:</strong> usuario@example.com</p>
                        <button class="btn btn-secondary">Alterar Plano</button>
                    </div>
                </div>
                <div class="settings-actions">
                    <button class="btn btn-primary save-settings">Salvar Alterações</button>
                    <button class="btn btn-secondary cancel-settings">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    if (!document.getElementById('settings-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'settings-styles';
        styleElement.textContent = `
            .settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                z-index: 1001;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .settings-content {
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                background-color: #141414;
                border-radius: 8px;
                overflow: auto;
                box-shadow: 0 0 20px rgba(229, 9, 20, 0.5);
            }
            .settings-header {
                padding: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #333;
                position: sticky;
                top: 0;
                background-color: #141414;
                z-index: 2;
            }
            .settings-header h2 {
                font-size: 1.8rem;
                color: #fff;
            }
            .close-settings {
                background: none;
                border: none;
                color: #fff;
                font-size: 1.5rem;
                cursor: pointer;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            .close-settings:hover {
                background-color: #E50914;
                transform: rotate(90deg);
            }
            .settings-body {
                padding: 30px;
            }
            .settings-section {
                margin-bottom: 30px;
                border-bottom: 1px solid #333;
                padding-bottom: 20px;
            }
            .settings-section:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }
            .settings-section h3 {
                font-size: 1.3rem;
                margin-bottom: 15px;
                color: #E50914;
            }
            .settings-option {
                margin-bottom: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .settings-option label {
                display: flex;
                justify-content: space-between;
                width: 100%;
                align-items: center;
                color: #ccc;
            }
            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }
            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #333;
                transition: all 0.3s ease;
                border-radius: 24px;
            }
            .toggle-slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: all 0.3s ease;
                border-radius: 50%;
            }
            input:checked + .toggle-slider {
                background-color: #E50914;
            }
            input:checked + .toggle-slider:before {
                transform: translateX(26px);
            }
            select {
                background-color: #333;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
            }
            .genres-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 15px;
            }
            .genre-checkbox {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .genre-checkbox label {
                color: #ccc;
                cursor: pointer;
            }
            .account-info {
                color: #ccc;
            }
            .account-info p {
                margin-bottom: 10px;
            }
            .account-info .btn {
                margin-top: 15px;
            }
            .settings-actions {
                display: flex;
                justify-content: flex-end;
               gap: 15px;
               margin-top: 30px;
           }
           @media (max-width: 768px) {
               .settings-body {
                   padding: 20px;
               }
               .genres-grid {
                   grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
               }
               .settings-actions {
                   flex-direction: column;
               }
               .settings-actions .btn {
                   width: 100%;
               }
           }
       `;
       document.head.appendChild(styleElement);
   }
   
   const modalElement = document.createElement('div');
   modalElement.innerHTML = modalHTML;
   document.body.appendChild(modalElement);
   
   const closeButton = document.querySelector('.close-settings');
   if (closeButton) {
       closeButton.addEventListener('click', () => {
           document.querySelector('.settings-modal').remove();
       });
   }
   
   document.querySelector('.settings-modal').addEventListener('click', (e) => {
       if (e.target === document.querySelector('.settings-modal')) {
           document.querySelector('.settings-modal').remove();
       }
   });
   
   const saveButton = document.querySelector('.save-settings');
   if (saveButton) {
       saveButton.addEventListener('click', () => {
           const autoplay = document.getElementById('autoplay').checked;
           const videoQuality = document.getElementById('video-quality').value;
           
           const generos = [
               { id: 'genre-action', nome: 'Ação' },
               { id: 'genre-scifi', nome: 'Sci-Fi' },
               { id: 'genre-comedy', nome: 'Comédia' },
               { id: 'genre-drama', nome: 'Drama' },
               { id: 'genre-horror', nome: 'Terror' },
               { id: 'genre-adventure', nome: 'Aventura' }
           ];
           
           const generosSelecionados = generos
               .filter(genero => document.getElementById(genero.id).checked)
               .map(genero => genero.nome);
           
           dadosUsuario.preferencias = {
               ...dadosUsuario.preferencias,
               assistirAutomaticamente: autoplay,
               qualidadeVideo: videoQuality,
               generosFavoritos: generosSelecionados
           };
           
           localStorage.setItem('dadosUsuario', JSON.stringify(dadosUsuario));
           
           document.querySelector('.settings-modal').remove();
           
           showToast('Configurações salvas com sucesso!');
       });
   }
   
   const cancelButton = document.querySelector('.cancel-settings');
   if (cancelButton) {
       cancelButton.addEventListener('click', () => {
           document.querySelector('.settings-modal').remove();
       });
   }
}

function initMenuNavegacao() {
   const navLinks = document.querySelectorAll('nav ul li a');
   
   navLinks.forEach(link => {
       link.addEventListener('click', function(e) {
           navLinks.forEach(link => link.classList.remove('active'));
           
           this.classList.add('active');
           
           if (this.getAttribute('href').startsWith('#')) {
               e.preventDefault();
               const targetId = this.getAttribute('href');
               const targetElement = document.querySelector(targetId);
               
               if (targetElement) {
                   const headerHeight = document.querySelector('header').offsetHeight;
                   const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                   
                   window.scrollTo({
                       top: targetPosition,
                       behavior: 'smooth'
                   });
               }
           }
       });
   });
   
   const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
   const mobileMenu = document.querySelector('.mobile-menu');
   
   if (mobileMenuToggle && mobileMenu) {
       mobileMenuToggle.addEventListener('click', () => {
           mobileMenuToggle.classList.toggle('active');
           mobileMenu.classList.toggle('active');
       });
       
       const mobileLinks = document.querySelectorAll('.mobile-menu ul li a');
       
       mobileLinks.forEach(link => {
           link.addEventListener('click', function() {
               mobileMenuToggle.classList.remove('active');
               mobileMenu.classList.remove('active');
           });
       });
   }
   
   window.addEventListener('scroll', () => {
       const scrollPosition = window.scrollY;
       
       document.querySelectorAll('section, .movies-row').forEach(section => {
           if (section.id) {
               const sectionTop = section.offsetTop - 100;
               const sectionHeight = section.offsetHeight;
               
               if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                   navLinks.forEach(link => link.classList.remove('active'));
                   
                   const correspondingLink = document.querySelector(`nav ul li a[href="#${section.id}"]`);
                   if (correspondingLink) {
                       correspondingLink.classList.add('active');
                   }
               }
           }
       });
   });
}

function initBuscaAvancada() {
   const searchBox = document.querySelector('.search-box');
   const searchBtn = document.querySelector('.search-btn');
   const searchInput = searchBox ? searchBox.querySelector('input') : null;
   
   if (searchBox && searchBtn && searchInput) {
       searchBtn.addEventListener('click', (e) => {
           e.stopPropagation();
           searchBox.classList.toggle('active');
           
           if (searchBox.classList.contains('active')) {
               searchInput.focus();
           }
       });
       
       document.addEventListener('click', (e) => {
           if (searchBox.classList.contains('active') && !searchBox.contains(e.target)) {
               searchBox.classList.remove('active');
           }
       });
       
       searchInput.addEventListener('keyup', (e) => {
           if (e.key === 'Enter') {
               const searchTerm = searchInput.value.trim();
               if (searchTerm.length > 2) {
                   realizarBusca(searchTerm);
               } else {
                   showToast('Digite pelo menos 3 caracteres para buscar.');
               }
           }
       });
   }
}

function realizarBusca(termo) {
   const todosTitulos = [];
   
   const heroTitulo = document.querySelector('.hero-title');
   if (heroTitulo) {
       todosTitulos.push({
           id: 'hero-1',
           titulo: heroTitulo.textContent,
           tipo: 'destaque',
           elemento: document.querySelector('.hero')
       });
   }
   
   document.querySelectorAll('.movie-card').forEach((card, index) => {
       const tituloElement = card.querySelector('.movie-title');
       if (tituloElement) {
           todosTitulos.push({
               id: `card-${index}`,
               titulo: tituloElement.textContent,
               tipo: 'card',
               elemento: card
           });
       }
   });
   
   const resultados = todosTitulos.filter(item => 
       item.titulo.toLowerCase().includes(termo.toLowerCase())
   );
   
   mostrarResultadosBusca(termo, resultados);
}

function mostrarResultadosBusca(termo, resultados) {
   const modalHTML = `
   <div class="search-results-modal">
       <div class="search-results-content">
           <div class="search-results-header">
               <h2>Resultados para "${termo}"</h2>
               <button class="close-search-results">✕</button>
           </div>
           <div class="search-results-body">
               ${resultados.length === 0 ? 
                   '<div class="no-results">Nenhum resultado encontrado. Tente outros termos.</div>' : 
                   `<div class="results-count">${resultados.length} resultado(s) encontrado(s)</div>
                   <div class="results-grid">
                       ${resultados.map(item => `
                           <div class="search-result-item" data-id="${item.id}">
                               <div class="result-info">
                                   <h3>${item.titulo}</h3>
                                   <p class="result-type">${item.tipo === 'destaque' ? 'Destaque' : 'Filme/Série'}</p>
                               </div>
                               <button class="btn-view-result">Ver</button>
                           </div>
                       `).join('')}
                   </div>`
               }
           </div>
       </div>
   </div>
   `;
   
   if (!document.getElementById('search-results-styles')) {
       const styleElement = document.createElement('style');
       styleElement.id = 'search-results-styles';
       styleElement.textContent = `
           .search-results-modal {
               position: fixed;
               top: 0;
               left: 0;
               width: 100%;
               height: 100%;
               background-color: rgba(0, 0, 0, 0.9);
               z-index: 1001;
               display: flex;
               justify-content: center;
               align-items: center;
           }
           .search-results-content {
               width: 90%;
               max-width: 800px;
               max-height: 80vh;
               background-color: #141414;
               border-radius: 8px;
               overflow: hidden;
               box-shadow: 0 0 20px rgba(229, 9, 20, 0.5);
               display: flex;
               flex-direction: column;
           }
           .search-results-header {
               padding: 20px;
               display: flex;
               justify-content: space-between;
               align-items: center;
               border-bottom: 1px solid #333;
           }
           .search-results-header h2 {
               font-size: 1.5rem;
               color: #fff;
           }
           .close-search-results {
               background: none;
               border: none;
               color: #fff;
               font-size: 1.5rem;
               cursor: pointer;
               width: 30px;
               height: 30px;
               border-radius: 50%;
               display: flex;
               align-items: center;
               justify-content: center;
               transition: all 0.3s ease;
           }
           .close-search-results:hover {
               background-color: #E50914;
               transform: rotate(90deg);
           }
           .search-results-body {
               padding: 20px;
               overflow-y: auto;
           }
           .no-results, .results-count {
               text-align: center;
               color: #ccc;
               padding: 20px;
           }
           .results-grid {
               display: flex;
               flex-direction: column;
               gap: 10px;
           }
           .search-result-item {
               display: flex;
               justify-content: space-between;
               align-items: center;
               padding: 15px;
               border-radius: 4px;
               background-color: rgba(255, 255, 255, 0.05);
               transition: all 0.3s ease;
           }
           .search-result-item:hover {
               background-color: rgba(229, 9, 20, 0.1);
               transform: translateX(5px);
           }
           .result-info h3 {
               font-size: 1.1rem;
               margin-bottom: 5px;
           }
           .result-type {
               font-size: 0.8rem;
               color: #ccc;
           }
           .btn-view-result {
               background-color: #E50914;
               color: white;
               border: none;
               padding: 5px 15px;
               border-radius: 4px;
               cursor: pointer;
               transition: all 0.3s ease;
           }
           .btn-view-result:hover {
               background-color: #c00;
               transform: scale(1.05);
           }
       `;
       document.head.appendChild(styleElement);
   }
   
   const modalElement = document.createElement('div');
   modalElement.innerHTML = modalHTML;
   document.body.appendChild(modalElement);
   
   const closeButton = document.querySelector('.close-search-results');
   if (closeButton) {
       closeButton.addEventListener('click', () => {
           document.querySelector('.search-results-modal').remove();
       });
   }
   
   document.querySelector('.search-results-modal').addEventListener('click', (e) => {
       if (e.target === document.querySelector('.search-results-modal')) {
           document.querySelector('.search-results-modal').remove();
       }
   });
   
   document.querySelectorAll('.btn-view-result').forEach((btn, index) => {
       btn.addEventListener('click', () => {
           const resultado = resultados[index];
           
           document.querySelector('.search-results-modal').remove();
           
           if (resultado.elemento) {
               resultado.elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
               
               resultado.elemento.classList.add('highlight-search');
               setTimeout(() => {
                   resultado.elemento.classList.remove('highlight-search');
               }, 2000);
           }
       });
   });
   
   if (!document.getElementById('highlight-style')) {
       const highlightStyle = document.createElement('style');
       highlightStyle.id = 'highlight-style';
       highlightStyle.textContent = `
           @keyframes searchHighlight {
               0%, 100% { box-shadow: 0 0 0 rgba(229, 9, 20, 0); }
               50% { box-shadow: 0 0 30px rgba(229, 9, 20, 1); }
           }
           
           .highlight-search {
               animation: searchHighlight 1s ease-in-out;
               z-index: 100;
               position: relative;
           }
       `;
       document.head.appendChild(highlightStyle);
   }
}

function initCategoriasInterativas() {
   const categoriasCards = document.querySelectorAll('.category');
   
   categoriasCards.forEach(card => {
       card.addEventListener('click', function() {
           const categoriaTexto = this.querySelector('.category-title').textContent;
           filtrarPorCategoria(categoriaTexto);
       });
   });
}

function filtrarPorCategoria(categoria) {
   showToast(`Filtrando por categoria: ${categoria}`);
   
   const todosCards = document.querySelectorAll('.movie-card');
   
   todosCards.forEach(card => {
       card.style.opacity = '0.5';
       card.style.transform = 'scale(0.95)';
   });
   
   const totalCards = todosCards.length;
   const numeroResultados = Math.floor(Math.random() * (totalCards / 2)) + 2;
   
   for (let i = 0; i < numeroResultados; i++) {
       const indiceAleatorio = Math.floor(Math.random() * totalCards);
       const card = todosCards[indiceAleatorio];
       
       card.style.opacity = '1';
       card.style.transform = 'scale(1.05)';
   }
   
   document.querySelector('.section-title:nth-of-type(2)').textContent = `${categoria} (${numeroResultados} resultados)`;
   
   setTimeout(() => {
       todosCards.forEach(card => {
           card.style.opacity = '1';
           card.style.transform = 'scale(1)';
       });
       document.querySelector('.section-title:nth-of-type(2)').textContent = 'Populares na CosmicFlix';
   }, 5000);
}

function initFilmesRecomendados() {
   document.querySelectorAll('.movie-card').forEach(card => {
       const views = Math.floor(Math.random() * 900) + 100;
       const rating = (Math.random() * 2 + 3).toFixed(1);
       
       const viewsElement = document.createElement('div');
       viewsElement.className = 'movie-views';
       viewsElement.innerHTML = `
           <div class="views-count">${views}K</div>
           <div class="rating">★ ${rating}</div>
       `;
       
       card.appendChild(viewsElement);
   });
   
   if (!document.getElementById('views-style')) {
       const viewsStyle = document.createElement('style');
       viewsStyle.id = 'views-style';
       viewsStyle.textContent = `
           .movie-views {
               position: absolute;
               top: 10px;
               right: 10px;
               background-color: rgba(0, 0, 0, 0.7);
               border-radius: 4px;
               padding: 5px;
               font-size: 0.8rem;
               color: #ccc;
               z-index: 2;
               opacity: 0;
               transition: opacity 0.3s ease;
           }
           
           .movie-card:hover .movie-views {
               opacity: 1;
           }
           
           .views-count {
               margin-bottom: 2px;
           }
           
           .rating {
               color: #FFD700;
           }
       `;
       document.head.appendChild(viewsStyle);
   }
}

function showToast(message) {
   const existingToast = document.querySelector('.cosmic-toast');
   if (existingToast) {
       existingToast.remove();
   }
   
   const toast = document.createElement('div');
   toast.className = 'cosmic-toast';
   toast.textContent = message;
   
   document.body.appendChild(toast);
   
   if (!document.getElementById('toast-style')) {
       const toastStyle = document.createElement('style');
       toastStyle.id = 'toast-style';
       toastStyle.textContent = `
           .cosmic-toast {
               position: fixed;
               bottom: 20px;
               left: 50%;
               transform: translateX(-50%);
               background-color: rgba(229, 9, 20, 0.9);
               color: white;
               padding: 12px 24px;
               border-radius: 4px;
               z-index: 2000;
               box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
               animation: toastIn 0.3s ease, toastOut 0.3s ease 2.7s forwards;
           }
           
           @keyframes toastIn {
               from {
                   transform: translate(-50%, 100px);
                   opacity: 0;
               }
               to {
                   transform: translate(-50%, 0);
                   opacity: 1;
               }
           }
           
           @keyframes toastOut {
               from {
                   transform: translate(-50%, 0);
                   opacity: 1;
               }
               to {
                   transform: translate(-50%, 100px);
                   opacity: 0;
               }
           }
       `;
       document.head.appendChild(toastStyle);
   }
   
   setTimeout(() => {
       if (toast.parentNode) {
           toast.remove();
       }
   }, 3000);
}

function generateId(text) {
   return text
       .toLowerCase()
       .replace(/[^\w ]+/g, '')
       .replace(/ +/g, '-');
}

function carregarDadosUsuario() {
   const dadosArmazenados = localStorage.getItem('dadosUsuario');
   if (dadosArmazenados) {
       dadosUsuario = JSON.parse(dadosArmazenados);
   }
   
   const listaArmazenada = localStorage.getItem('minhaLista');
   if (listaArmazenada) {
       minhaLista = JSON.parse(listaArmazenada);
       atualizarIconesMinhaLista();
   }
}