// ====== FUNCIONALIDADES MODERNAS DA PÁGINA ======

// Hero Slider com transições automáticas
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.currentSlide = 0;
        this.init();
    }
    
    init() {
        if (this.slides.length > 1) {
            setInterval(() => {
                this.nextSlide();
            }, 8000); // Troca a cada 8 segundos
        }
    }
    
    nextSlide() {
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.slides[this.currentSlide].classList.add('active');
    }
}

// Header com efeito de scroll
class ModernHeader {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }
    
    init() {
        if (!this.header) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        });
    }
}

// Showcase Cards com interações
class ShowcaseInteractions {
    constructor() {
        this.cards = document.querySelectorAll('.showcase-card');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.filterProducts(category);
                this.scrollToProducts();
            });
        });
    }
    
    filterProducts(category) {
        console.log('🏷️ ShowcaseInteractions.filterProducts chamado para:', category);
        
        // Atualizar filtro ativo em TODOS os tipos de botões
        document.querySelectorAll('.filter-btn-modern, .filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Tentar encontrar o botão correto por categoria
        const targetBtn = document.querySelector(`[data-category="${category}"].filter-btn-modern`) || 
                          document.querySelector(`[data-category="${category}"].filter-btn`);
        if (targetBtn) {
            targetBtn.classList.add('active');
            console.log('✅ Botão ativado:', targetBtn);
        } else {
            console.warn('⚠️ Botão não encontrado para categoria:', category);
        }
        
        // Filtrar produtos (integração com o sistema existente)
        if (typeof window.renderProducts === 'function' && typeof window.currentCategory !== 'undefined') {
            console.log('📊 Aplicando filtro via renderProducts...');
            window.currentCategory = category;
            window.renderProducts();
        } else {
            console.warn('⚠️ Sistema de produtos não disponível ainda');
            // Fallback: rolar para a seção de produtos e mostrar mensagem
            this.scrollToProducts();
        }
    }
    
    scrollToProducts() {
        const productsSection = document.getElementById('produtos');
        if (productsSection) {
            productsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Animações de entrada
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, this.observerOptions);
        
        // Observar elementos que devem animar
        const animateElements = document.querySelectorAll('.section-title, .showcase-card, .product-card');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }
}

// Filtros modernos com melhor UX - Integração unificada
class ModernFilters {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.filterBtns = document.querySelectorAll('.filter-btn-modern');
        // Também gerenciar os filtros antigos para compatibilidade
        this.oldFilterBtns = document.querySelectorAll('.filter-btn');
        this.init();
    }
    
    init() {
        if (this.searchInput) {
            // Debounce para pesquisa
            let timeout;
            this.searchInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.handleSearch(e);
                }, 300);
            });
        }
        
        // Filtros de categoria modernos
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCategoryFilter(e);
            });
        });
        
        // Garantir compatibilidade com filtros antigos
        this.oldFilterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCategoryFilter(e);
            });
        });
    }
    
    handleSearch(e) {
        const searchValue = e.target.value;
        console.log('🔍 Pesquisando por:', searchValue);
        
        // Atualizar variável global
        if (typeof window.currentSearch !== 'undefined') {
            window.currentSearch = searchValue;
        }
        
        // Chamar função de renderização
        if (typeof window.renderProducts === 'function') {
            window.renderProducts();
        }
    }
    
    handleCategoryFilter(e) {
        e.preventDefault();
        
        const clickedBtn = e.target.closest('button') || e.target;
        const category = clickedBtn.dataset.category;
        
        console.log('📂 Filtrando categoria:', category);
        
        // Atualizar visual de TODOS os botões (modernos e antigos)
        document.querySelectorAll('.filter-btn-modern, .filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Ativar o botão clicado
        clickedBtn.classList.add('active');
        
        // Atualizar variáveis globais
        if (typeof window.currentCategory !== 'undefined') {
            window.currentCategory = category;
        }
        
        // Chamar função de renderização
        if (typeof window.renderProducts === 'function') {
            window.renderProducts();
        } else {
            console.warn('⚠️ Função renderProducts não encontrada');
        }
    }
}

// Armazenar instâncias globalmente para acesso
window.modernComponents = {};

// Inicialização de todas as funcionalidades modernas
document.addEventListener('DOMContentLoaded', () => {
    // Garantir que as variáveis globais estejam inicializadas
    if (typeof window.currentCategory === 'undefined') {
        window.currentCategory = 'todos';
    }
    if (typeof window.currentSearch === 'undefined') {
        window.currentSearch = '';
    }
    
    console.log('🚀 Variáveis globais inicializadas:', {
        currentCategory: window.currentCategory,
        currentSearch: window.currentSearch
    });
    
    // Inicializar componentes que não dependem do sistema de produtos
    window.modernComponents.heroSlider = new HeroSlider();
    window.modernComponents.modernHeader = new ModernHeader();
    window.modernComponents.scrollAnimations = new ScrollAnimations();
    
    // Aguardar o sistema de produtos estar pronto antes de inicializar filtros
    let initAttempts = 0;
    const maxAttempts = 20; // Máximo 4 segundos tentando
    
    const initFilters = () => {
        initAttempts++;
        console.log(`🔄 Tentativa ${initAttempts}/${maxAttempts} de inicializar filtros...`);
        
        const hasRenderProducts = typeof window.renderProducts === 'function';
        const hasCurrentCategory = typeof window.currentCategory !== 'undefined';
        const hasProductManager = window.productManager && window.productManager.products;
        
        console.log('📊 Estado do sistema:', {
            renderProducts: hasRenderProducts,
            currentCategory: hasCurrentCategory,
            currentCategoryValue: window.currentCategory,
            productManager: !!hasProductManager
        });
        
        if (hasRenderProducts && hasCurrentCategory) {
            try {
                // Remover event listeners antigos para evitar conflitos
                const oldBtns = document.querySelectorAll('.filter-btn');
                oldBtns.forEach(btn => {
                    // Clonar o elemento para remover todos os event listeners
                    const newBtn = btn.cloneNode(true);
                    if (btn.parentNode) {
                        btn.parentNode.replaceChild(newBtn, btn);
                    }
                });
                
                // Inicializar componentes modernos
                window.modernComponents.showcaseInteractions = new ShowcaseInteractions();
                window.modernComponents.modernFilters = new ModernFilters();
                console.log('✅ Componentes modernos inicializados com sucesso!');
                
                // Teste rápido
                console.log('🧪 Testando filtro: window.currentCategory =', window.currentCategory);
                
            } catch (error) {
                console.error('❌ Erro ao inicializar componentes modernos:', error);
            }
        } else if (initAttempts < maxAttempts) {
            // Tentar novamente em 200ms se o sistema ainda não está pronto
            setTimeout(initFilters, 200);
        } else {
            console.error('❌ Falha ao inicializar filtros após', maxAttempts, 'tentativas');
        }
    };
    
    // Inicializar filtros após um pequeno delay
    setTimeout(initFilters, 500);
});

// Gerenciamento de dados dos produtos
class ProductManager {
    constructor() {
        this.products = [];
        this.currentEditId = null;
        this.cache = new Map();
        this.isLoading = false;
        this.lastSync = null;
        this.instanceId = Math.random().toString(36).substr(2, 9); // ID único para debug
        this.currentCategory = 'todos'; // Categoria atual
        console.log('🆕 ProductManager criado com ID:', this.instanceId);
        this.init();
    }

    async init() {
        // Limpar localStorage antigo uma única vez
        this.clearLegacyData();
        await this.loadProducts();
    }
    
    // Limpa dados antigos do localStorage (migração)
    clearLegacyData() {
        try {
            // Verificar se já foi executado
            const cleanupDone = localStorage.getItem('tiarosa_cleanup_done');
            if (cleanupDone) return;
            
            // Limpar chaves antigas do sistema anterior
            const legacyKeys = ['tiarosa_products', 'currentCategory', 'currentSearch'];
            let removed = 0;
            
            legacyKeys.forEach(key => {
                if (localStorage.getItem(key)) {
                    localStorage.removeItem(key);
                    removed++;
                }
            });
            
            if (removed > 0) {
                console.log(`🧹 Limpeza: ${removed} chaves antigas removidas do localStorage`);
            }
            
            // Marcar limpeza como concluída
            localStorage.setItem('tiarosa_cleanup_done', 'true');
            
        } catch (error) {
            console.warn('⚠️ Erro durante limpeza de dados legados:', error);
        }
    }

    // Carrega produtos da API
    async loadProducts() {
        if (this.isLoading) return this.products;
        
        this.isLoading = true;
        
        try {
            console.log(`📡 [${this.instanceId}] Carregando produtos da API...`);
            const response = await fetch('/api/products');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.products = data.products || [];
                this.lastSync = new Date().toISOString();
                
                // Cache local para fallback
                this.saveToCache();
                
                console.log(`✅ [${this.instanceId}] Produtos carregados da API:`, this.products.length, 'itens');
                
                // Disparar evento de produtos carregados para re-renderizar se necessário
                if (this.products.length > 0) {
                    window.dispatchEvent(new CustomEvent('productsLoaded', { 
                        detail: { products: this.products, count: this.products.length } 
                    }));
                }
                
                return this.products;
            } else {
                throw new Error(data.message || 'Resposta inválida da API');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar produtos da API:', error);
            
            // Fallback para cache local apenas se recente (últimas 24h)
            const cachedProducts = this.loadFromCache();
            const cacheTimestamp = localStorage.getItem('tiarosa_cache_timestamp');
            const isRecentCache = cacheTimestamp && 
                (Date.now() - new Date(cacheTimestamp).getTime()) < 24 * 60 * 60 * 1000;
            
            if (cachedProducts.length > 0 && isRecentCache) {
                console.log('🔄 Usando produtos do cache local (recente):', cachedProducts.length, 'itens');
                this.products = cachedProducts;
                return this.products;
            }
            
            // Se não há cache recente, manter array vazio e mostrar erro
            console.log('❌ Nenhum produto disponível - problema de conectividade');
            this.products = [];
            throw error; // Propagar erro para mostrar estado de erro
        } finally {
            this.isLoading = false;
        }
    }

    // Cache local para fallback
    saveToCache() {
        try {
            localStorage.setItem('tiarosa_products_cache', JSON.stringify(this.products));
            localStorage.setItem('tiarosa_cache_timestamp', this.lastSync);
        } catch (error) {
            console.warn('⚠️ Não foi possível salvar cache:', error);
        }
    }

    loadFromCache() {
        try {
            const cached = localStorage.getItem('tiarosa_products_cache');
            return cached ? JSON.parse(cached) : [];
        } catch (error) {
            console.warn('⚠️ Erro ao carregar cache:', error);
            return [];
        }
    }


    // Atualiza cache local após operações da API
    saveProducts() {
        this.saveToCache();
        console.log('✅ Cache local atualizado:', this.products.length, 'itens');
    }

    // Adiciona novo produto via API
    async addProduct(productData) {
        try {
            console.log('📤 Criando novo produto via API...');
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...productData,
                    price: parseFloat(productData.price),
                    quantity: parseInt(productData.quantity) || 1
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }

            // Atualizar cache local
            this.products.push(data.product);
            this.saveToCache();
            
            console.log('✅ Produto criado com sucesso:', data.product.name);
            return data.product;
            
        } catch (error) {
            console.error('❌ Erro ao criar produto:', error);
            throw error;
        }
    }

    // Atualiza produto existente via API
    async updateProduct(id, productData) {
        try {
            const oldProduct = this.products.find(p => p.id === id);
            if (!oldProduct) {
                throw new Error('Produto não encontrado no cache local');
            }
            
            console.log('🔄 Atualizando produto via API - ID:', id);
            console.log('📊 Preço anterior:', oldProduct.price, '→ Novo preço:', parseFloat(productData.price));
            
            const response = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...productData,
                    price: parseFloat(productData.price),
                    quantity: parseInt(productData.quantity) || 1
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }

            // Atualizar cache local
            const index = this.products.findIndex(p => p.id === id);
            if (index !== -1) {
                this.products[index] = data.product;
            }
            this.saveToCache();
            
            console.log('✅ Produto atualizado com sucesso:', data.product.name);
            console.log('✅ Preço confirmado no servidor:', data.product.price);
            return data.product;
            
        } catch (error) {
            console.error('❌ Erro ao atualizar produto:', error);
            throw error;
        }
    }

    // Remove produto via API
    async deleteProduct(id) {
        try {
            console.log('🗑️ Deletando produto via API - ID:', id);
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || `HTTP ${response.status}`);
            }

            // Remover do cache local
            const index = this.products.findIndex(p => p.id === id);
            if (index !== -1) {
                this.products.splice(index, 1);
            }
            this.saveToCache();
            
            console.log('✅ Produto deletado com sucesso:', data.product.name);
            return data.product;
            
        } catch (error) {
            console.error('❌ Erro ao deletar produto:', error);
            throw error;
        }
    }

    // Busca produtos
    searchProducts(query, category = 'todos') {
        let filtered = this.products;

        if (category !== 'todos') {
            filtered = filtered.filter(p => p.category === category);
        }

        if (query) {
            const lowerQuery = query.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery)
            );
        }

        return filtered;
    }

    // Obtém produto por ID
    getProduct(id) {
        return this.products.find(p => p.id === id);
    }
}

// Instância global do gerenciador (singleton)
let productManager;
if (window.productManager) {
    console.log('🔄 Usando ProductManager existente');
    productManager = window.productManager;
} else {
    console.log('🆕 Criando novo ProductManager');
    productManager = new ProductManager();
    window.productManager = productManager; // Disponibilizar globalmente
}

// Elementos DOM
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilters = document.querySelectorAll('.filter-btn');
const productForm = document.getElementById('productForm');
const navLinks = document.querySelectorAll('.nav-link');

// Estado da aplicação - Variáveis globais
window.currentCategory = 'todos';
window.currentSearch = '';

// Inicialização
document.addEventListener('DOMContentLoaded', async function() {
    setupEventListeners();
    await initializeProducts();
    updateActiveSection();
    
    // Configuração do modal de login
    setupLoginModal();
    
    // Listener para re-renderizar quando produtos forem carregados por outra instância
    window.addEventListener('productsLoaded', function(event) {
        console.log('🔄 Evento productsLoaded recebido:', event.detail.count, 'produtos');
        if (productGrid && event.detail.count > 0) {
            console.log('🎨 Re-renderizando produtos após evento...');
            renderProducts();
        }
    });
});

// Inicialização de produtos
async function initializeProducts() {
    console.log('🔄 Iniciando carregamento de produtos...');
    
    // Mostrar loading se elemento existir
    if (productGrid) {
        console.log('✅ ProductGrid encontrado, mostrando loading...');
        showProductsLoading();
        
        try {
            // Aguardar carregamento dos produtos
            console.log('📡 Carregando produtos via ProductManager...');
            await productManager.loadProducts();
            console.log(`📦 [${productManager.instanceId}] Produtos carregados, quantidade:`, productManager.products.length);
            
            console.log('🎨 Renderizando produtos...');
            await renderProducts();
            console.log('✅ Produtos renderizados com sucesso!');
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            showProductsError();
        }
    } else {
        console.log('⚠️ ProductGrid não encontrado na página');
    }
}

// Configuração de event listeners
function setupEventListeners() {
    // Busca
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Filtros de categoria
    if (categoryFilters) {
        categoryFilters.forEach(btn => {
            btn.addEventListener('click', handleCategoryFilter);
        });
    }

    // Navegação
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavigation);
        });
    }

    // Scroll navigation
    window.addEventListener('scroll', updateActiveSection);
}

// Renderização de produtos
async function renderProducts() {
    console.log('🎨 RenderProducts chamada');
    
    // Verificar se o elemento existe (não existe na página admin)
    if (!productGrid) {
        console.log('⚠️ ProductGrid não existe, saindo...');
        return;
    }
    
    const products = productManager.searchProducts(window.currentSearch, window.currentCategory);
    console.log('📦 Produtos para renderizar:', products.length);
    console.log('🔍 Filtros atuais - Search:', window.currentSearch, 'Category:', window.currentCategory);
    
    if (products.length === 0) {
        console.log('⚠️ Nenhum produto encontrado, mostrando estado vazio');
        productGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar sua busca ou filtros.</p>
            </div>
        `;
        return;
    }

    console.log('✅ Renderizando', products.length, 'produtos...');
    const html = products.map(product => {
        console.log('Criando card para produto:', product.name, 'Preço:', product.price);
        return createProductCard(product);
    }).join('');
    
    productGrid.innerHTML = html;
    console.log('✅ HTML inserido no productGrid');
}

// Estados de carregamento
function showProductsLoading() {
    productGrid.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <h3>Carregando produtos...</h3>
            <p>Aguarde um momento</p>
        </div>
    `;
}

function showProductsError() {
    productGrid.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Erro ao carregar produtos</h3>
            <p>Tente recarregar a página</p>
            <button onclick="location.reload()" class="retry-btn">
                <i class="fas fa-redo"></i> Tentar novamente
            </button>
        </div>
    `;
}

// Criação de card de produto
function createProductCard(product) {
    const categoryIcons = {
        flores: 'fa-rose',
        velas: 'fa-candle-holder',
        quadros: 'fa-image',
        santinhos: 'fa-cross',
        utensilios: 'fa-utensils',
        artigos: 'fa-praying-hands',
        vasos: 'fa-seedling'
    };

    const icon = categoryIcons[product.category] || 'fa-box';
    const imageContent = product.image 
        ? `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">`
        : '';

    // Garantir que o preço seja um número
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    const formattedPrice = (price || 0).toFixed(2).replace('.', ',');
    
    const whatsappMessage = encodeURIComponent(`Olá! Tenho interesse no produto: *${product.name}* - R$ ${formattedPrice}`);

    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                ${imageContent}
                <i class="fas ${icon}" ${product.image ? 'style="display:none"' : ''}></i>
                <div class="product-badge">${getCategoryName(product.category)}</div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">R$ ${formattedPrice}</div>
                <p class="product-description">${product.description}</p>
                <a href="https://wa.me/558799275516?text=${whatsappMessage}" class="product-whatsapp" target="_blank">
                    <i class="fab fa-whatsapp"></i>
                    Chamar no WhatsApp
                </a>
            </div>
        </div>
    `;
}

// Obter nome da categoria
function getCategoryName(category) {
    const names = {
        flores: 'Flores',
        velas: 'Velas',
        quadros: 'Quadros',
        santinhos: 'Santinhos',
        utensilios: 'Utensílios',
        artigos: 'Artigos',
        vasos: 'Vasos'
    };
    return names[category] || category;
}

// Manipuladores de eventos
async function handleSearch(e) {
    window.currentSearch = e.target.value;
    await renderProducts();
}

async function handleCategoryFilter(e) {
    // Remove active de todos os botões
    categoryFilters.forEach(btn => btn.classList.remove('active'));
    // Adiciona active ao botão clicado
    e.target.classList.add('active');
    
    window.currentCategory = e.target.dataset.category;
    await renderProducts();
}

function handleNavigation(e) {
    e.preventDefault();
    
    // Remove active de todos os links
    navLinks.forEach(link => link.classList.remove('active'));
    // Adiciona active ao link clicado
    e.target.classList.add('active');
    
    const targetId = e.target.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 100; // Considera altura do header fixo
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Função de formulário removida - site apenas para demonstração

// Funções globais removidas - site apenas para demonstração

// Função removida - não há mais formulário

function scrollToProducts() {
    const productsSection = document.getElementById('produtos');
    productsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Atualiza navegação
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector('a[href="#produtos"]').classList.add('active');
}

// Atualiza seção ativa baseada no scroll
function updateActiveSection() {
    const sections = ['home', 'produtos', 'sobre', 'contato'];
    const scrollPos = window.scrollY + 150; // Offset para header fixo

    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);
        
        if (section && navLink) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}

// Sistema de Login Administrativo
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Foca no campo de usuário
    setTimeout(() => {
        document.getElementById('username').focus();
    }, 300);
}

function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Limpa o formulário
    document.getElementById('loginForm').reset();
    hideLoginError();
}

function togglePassword() {
    const passwordField = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        passwordField.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

function hideLoginError() {
    const errorDiv = document.getElementById('loginError');
    errorDiv.classList.remove('show');
}

// Configuração do Modal de Login
function setupLoginModal() {
    const loginForm = document.getElementById('loginForm');
    const loginModal = document.getElementById('loginModal');
    
    // Submissão do formulário de login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showLoginError('Por favor, preencha todos os campos!');
                return;
            }
            
            // Tenta fazer login
            const result = authManager.login(username, password);
            
            if (result.success) {
                hideLoginModal();
                // Redireciona para o admin
                window.location.href = 'admin.html';
            } else {
                showLoginError(result.message);
                // Limpa apenas a senha
                document.getElementById('password').value = '';
                document.getElementById('password').focus();
            }
        });
    }
    
    // Fecha modal clicando fora dele
    if (loginModal) {
        loginModal.addEventListener('click', function(e) {
            if (e.target === loginModal) {
                hideLoginModal();
            }
        });
    }
    
    // Fecha modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal.classList.contains('show')) {
            hideLoginModal();
        }
    });
    
    // Event listeners para eventos de autenticação
    document.addEventListener('showLoginModal', showLoginModal);
    
    document.addEventListener('adminLoginSuccess', function() {
        console.log('Login administrativo realizado com sucesso!');
    });
    
    document.addEventListener('adminLogoutSuccess', function() {
        console.log('Logout administrativo realizado com sucesso!');
        // Redireciona para a página principal se estiver na área admin
        if (window.location.pathname.includes('admin.html')) {
            window.location.href = 'index.html';
        }
    });
}

// Utilitários
function formatPrice(price) {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `R$ ${(numPrice || 0).toFixed(2).replace('.', ',')}`;
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name.trim()) errors.push('Nome é obrigatório');
    if (!data.category) errors.push('Categoria é obrigatória');
    if (!data.price || data.price <= 0) errors.push('Preço deve ser maior que zero');
    if (!data.description.trim()) errors.push('Descrição é obrigatória');
    
    return errors;
}

// Tratamento de erros de imagem
function handleImageError(img) {
    img.style.display = 'none';
    const iconElement = img.nextElementSibling;
    if (iconElement) {
        iconElement.style.display = 'flex';
    }
}