// Gerenciamento de dados dos produtos
class ProductManager {
    constructor() {
        this.products = this.loadProducts();
        this.currentEditId = null;
    }

    // Carrega produtos do localStorage
    loadProducts() {
        const saved = localStorage.getItem('tiarosa_products');
        if (saved) {
            const products = JSON.parse(saved);
            // Migração automática: adiciona quantity se não existir
            const migratedProducts = products.map(product => ({
                ...product,
                quantity: product.quantity !== undefined ? product.quantity : 1
            }));
            
            // Salva produtos migrados se houve alteração
            if (products.some(p => p.quantity === undefined)) {
                localStorage.setItem('tiarosa_products', JSON.stringify(migratedProducts));
            }
            
            return migratedProducts;
        }
        
        // Produtos de exemplo para demonstração
        return [
            {
                id: 1,
                name: 'Rosa Vermelha de Seda',
                category: 'flores',
                price: 24.90,
                quantity: 15,
                description: 'Lindíssima rosa vermelha de seda premium, com pétalas realistas e haste flexível. Perfeita para decoração de ambientes ou arranjos especiais.',
                image: 'https://m.media-amazon.com/images/I/61I49qc6NeL._AC_SX679_.jpg'
            },
            {
                id: 2,
                name: 'Buquê de Rosas Brancas',
                category: 'flores',
                price: 45.00,
                quantity: 8,
                description: 'Elegante buquê com 12 rosas brancas de plástico, ideal para decoração de casamentos e eventos especiais.',
                image: 'https://www.floresonline.com.br/media/catalog/product/a/l/alta-1112-1.webp'
            },
            {
                id: 3,
                name: 'Lírio Amarelo de plástico',
                category: 'flores',
                price: 18.50,
                quantity: 22,
                description: 'Belo lírio amarelo de plástico com acabamento realista, perfeito para vasos e arranjos florais.',
                image: 'https://acdn-us.mitiendanube.com/stores/001/049/883/products/56vzaed-1f96a250ecbb4886fd16177962972208-1024-1024.webp'
            },
            {
                id: 4,
                name: 'Vela Branca',
                category: 'velas',
                price: 12.00,
                quantity: 35,
                description: 'Vela branca de cera natural branca, duração de 6 horas. Ideal para orações e momentos de reflexão.',
                image: 'https://cdn.awsli.com.br/2500x2500/1810/1810998/produto/85595519/e2d98e0774.jpg'
            },
            {
                id: 5,
                name: 'Kit 12 Velas Coloridas',
                category: 'velas',
                price: 35.00,
                description: 'Conjunto com 12 velas em cores variadas: branco, amarelo, azul e rosa. Perfeitas para novenas.',
                image: 'https://a-static.mlcdn.com.br/800x560/kit-12-velas-votivas-7-dias-coloridas-260-gr-cada-sete-raios-de-luz/lojaolist/olsj1h7hqsqyuu87/8ba267eb3df43e0af5704be08746337b.jpeg'
            },
            {
                id: 6,
                name: 'Vela de 7 Dias',
                category: 'velas',
                price: 28.90,
                description: 'Vela de vidro com duração de 7 dias, disponível em branco e outras cores. Ideal para promessas e orações prolongadas.',
                image: 'https://cdn.awsli.com.br/800x800/1132/1132374/produto/42615073/7-dias-santoscapa1-l452593vf3.jpg'
            },
            {
                id: 7,
                name: 'Quadro Arcanjo Miguel',
                category: 'quadros',
                price: 65.00,
                description: 'Quadro decorativo Arcanjo Miguel, moldura em madeira nobre, 30x40cm. Impressão em alta qualidade.',
                image: 'https://cdn.awsli.com.br/600x450/1981/1981658/produto/209841647637028ec08.jpg'
            },
            {
                id: 8,
                name: 'Quadro Nossa Senhora Aparecida',
                category: 'quadros',
                price: 58.00,
                description: 'Belo quadro de Nossa Senhora Aparecida com moldura dourada, 25x35cm.',
                image: 'https://cdn.awsli.com.br/2500x2500/1981/1981658/produto/154379545da493e5a9e.jpg'
            },
            {
                id: 9,
                name: 'Quadro Santa Ceia',
                category: 'quadros',
                price: 52.00,
                description: 'Quadro artístico da Santa Ceia, moldura em madeira escura, 20x30cm. Perfeito para salas e quartos.',
                image: 'https://cdnv2.moovin.com.br/sjo/imagens/produtos/det/captura-de-tela-2021-04-12-170958.png'
            },
            {
                id: 10,
                name: 'Terço de Nossa Senhora',
                category: 'utensilios',
                price: 75.00,
                description: 'Terço entalhado em madeira, representando Nossa Senhora.',
                image: 'https://static.casadamae.com.br/public/casadamae/imagens/produtos/terco-madeira-8mm-nossa-senhora-aparecida-entremeio-azul-8759.png'
            },
            {
                id: 11,
                name: 'Santinhos para oração',
                category: 'santinhos',
                price: 3.50,
                description: 'Santinhos papel plastificado, com oração no verso. Tamanho padrão.',
                image: 'https://img.irroba.com.br/filters:fill(fff):quality(80)/paludodi/catalog/api/paludodi_blingirr/651db10f22829.jpg'
            },
            {
                id: 12,
                name: 'Kit 10 Santinhos Variados',
                category: 'santinhos',
                price: 35.00,
                description: 'Conjunto com 10 santinhos de diversos santos: Nossa Senhora, Jesus, São José e outros. Ideal para distribuição.',
                image: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Kit+Santinhos'
            },
            {
                id: 13,
                name: 'Santinho Primeira Comunhão',
                category: 'santinhos',
                price: 4.20,
                description: 'Lindo santinho comemorativo de Primeira Comunhão, personalizável com foto e dados da criança.',
                image: 'https://via.placeholder.com/400x300/ec4899/ffffff?text=1a+Comunhao'
            },
            {
                id: 14,
                name: 'Arranjo de Flores Mistas',
                category: 'flores',
                price: 89.90,
                description: 'Belíssimo arranjo com flores mistas de plástico em vaso de cerâmica. Rosas, lírios e folhagens diversas.',
                image: 'https://cdn.iset.io/assets/46293/produtos/273/img_20161031_161504853_2.jpg'
            },
            {
                id: 15,
                name: 'Vela Aromática',
                category: 'velas',
                price: 22.50,
                description: 'Vela aromática com fragrância, em copo de vidro decorativo. Duração aproximada de 8 horas.',
                image: 'https://via.placeholder.com/400x300/f97316/ffffff?text=Vela+Aromatica'
            },
            {
                id: 16,
                name: 'Crucifixo de Madeira',
                category: 'artigos',
                price: 35.00,
                description: 'Belo crucifixo entalhado em madeira nobre, ideal para decoração de ambiente religioso.',
                image: 'https://static.lvartigosreligiosos.com.br/public/liriodovale/imagens/produtos/media/crucifixo-de-madeira-de-mao-17cm-11241.jpg'
            },
            {
                id: 17,
                name: 'Crucifixo de Metal',
                category: 'artigos',
                price: 28.90,
                description: 'Crucifixo em metal, ideal para chaveiro ou decoração.',
                image: 'https://www.lojade199online.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/2/3/23337.jpg'
            },
            {
                id: 18,
                name: 'Santos de Cerâmica',
                category: 'artigos',
                price: 45.00,
                description: 'Santo em cerâmica pintada à mão, perfeita para altar ou estante.',
                image: 'https://d1o6h00a1h5k7q.cloudfront.net/imagens/img_m/21434/10261841.jpg'
            },
            {
                id: 19,
                name: 'Santo de Gesso',
                category: 'artigos',
                price: 32.50,
                description: 'Estatueta de santo em gesso, ideal para decoração religiosa.',
                image: 'https://live.staticflickr.com/8266/8663496333_7214396858_b.jpg'
            },
            {
                id: 20,
                name: 'Copo de Vidro',
                category: 'utensilios',
                price: 8.90,
                description: 'Copo de vidro transparente, resistente e elegante para uso diário.',
                image: 'https://a-static.mlcdn.com.br/800x600/copo-vidro-quadrado-transparente-mesa-posta-320ml-10-unidade-praticasa/belahouse/7045-627/754b1bec518a8f742b0eab3c228cc1f7.jpeg'
            },
            {
                id: 21,
                name: 'Vasilha de Plástico',
                category: 'utensilios',
                price: 12.50,
                description: 'Vasilha de plástico com tampa, ideal para armazenamento de alimentos.',
                image: 'https://dcdn-us.mitiendanube.com/stores/002/233/102/products/240_7816_542-6a4cc75c9ef8ae77b617275528061400-1024-1024.jpg'
            },
            {
                id: 22,
                name: 'Vasilha de Vidro',
                category: 'utensilios',
                price: 18.90,
                description: 'Vasilha de vidro temperado com tampa hermética, perfeita para conservar alimentos.',
                image: 'https://panoverse-cdn.com.br/uzutilidades.img/produto/3767/pote-vidro-borossilicato-1-04l-3767-large.jpg'
            },
            {
                id: 23,
                name: 'Triturador',
                category: 'utensilios',
                price: 25.00,
                description: 'Triturador manual para temperos e ervas, prático e durável.',
                image: 'https://acdn-us.mitiendanube.com/stores/003/231/886/products/na007-vermelho3-481f2bcbf7b720e9ae17199458000982-1024-1024.png'
            },
            {
                id: 24,
                name: 'Jarra de Suco',
                category: 'utensilios',
                price: 22.90,
                description: 'Jarro de vidro com capacidade para 1L, ideal para servir sucos e bebidas.',
                image: 'https://images.tcdn.com.br/img/img_prod/1077325/jarra_de_vidro_com_ratam_25cm_12901_1_2a41e86b52df24799b347828a6172fa1.jpg'
            },
            {
                id: 25,
                name: 'Vaso de Flores Cerâmica',
                category: 'vasos',
                price: 35.90,
                description: 'Vaso de cerâmica decorativo, perfeito para flores naturais ou artificiais.',
                image: 'https://cf.shopee.com.br/file/e3b8e3bd19af3183d1c438cadc1be247'
            },
            {
                id: 26,
                name: 'Vaso de Flores Vidro',
                category: 'vasos',
                price: 28.50,
                description: 'Vaso de vidro transparente, elegante para qualquer ambiente.',
                image: 'https://http2.mlstatic.com/D_NQ_NP_611343-MLB76614544375_052024-O-vaso-de-plantas-para-mesa-de-jantar-vasinhos-de-flores-vidro.webp'
            },
            {
                id: 27,
                name: 'Planta de Cerejeira',
                category: 'flores',
                price: 685.99,
                description: 'Belíssima planta de cerejeira artificial de grande porte, perfeita para decoração sofisticada.',
                image: 'https://via.placeholder.com/400x300/ff69b4/ffffff?text=Cerejeira'
            },
            {
                id: 28,
                name: 'Orquídea',
                category: 'flores',
                price: 79.90,
                description: 'Orquídea artificial premium com vaso incluso, elegância e sofisticação.',
                image: 'https://via.placeholder.com/400x300/dda0dd/333333?text=Orquidea'
            },
            {
                id: 29,
                name: 'Rosa do Deserto',
                category: 'flores',
                price: 438.90,
                description: 'Rosa do Deserto artificial de alta qualidade, perfeita para ambientes modernos.',
                image: 'https://via.placeholder.com/400x300/f0e68c/333333?text=Rosa+Deserto'
            },
            {
                id: 30,
                name: 'Placa de Grama',
                category: 'flores',
                price: 34.90,
                description: 'Placa de grama artificial realista, ideal para decoração de jardins e ambientes.',
                image: 'https://images.tcdn.com.br/img/img_prod/499963/placa_de_grama_artificial_decorativa_folhas_40x60cm_45686_1_10f77dc5999e07c24e88b91896cd6208.png'
            },
            {
                id: 31,
                name: 'Vaso Decorativo',
                category: 'vasos',
                price: 145.60,
                description: 'Vaso decorativo em cerâmica com design moderno e acabamento premium.',
                image: 'https://lojaemporiocasa.cdn.magazord.com.br/img/2024/07/produto/1997/whatsapp-image-2024-07-10-at-17-44-17-1.jpeg?ims=fit-in/290x290/filters:fill(white)'
            },
            {
                id: 32,
                name: 'Vaso Decorativo Pequeno',
                category: 'vasos',
                price: 112.80,
                description: 'Vaso decorativo pequeno, perfeito para plantas pequenas e suculentas.',
                image: 'https://via.placeholder.com/400x300/d2691e/ffffff?text=Vaso+Pequeno'
            },
            {
                id: 33,
                name: 'Centro de Mesa Premium',
                category: 'vasos',
                price: 326.70,
                description: 'Elegante centro de mesa com flores artificiais premium e vaso decorativo.',
                image: 'https://a-static.mlcdn.com.br/800x560/arranjo-centro-de-mesa-misto-rosas-flores-vermelhas-e-vaso-la-caza-store/aebrands/8172/eeb161af31045f61e60a981f0b05f7a5.jpeg'
            },
            {
                id: 34,
                name: 'Centro de Mesa',
                category: 'vasos',
                price: 258.00,
                description: 'Centro de mesa decorativo com arranjo floral artificial, ideal para eventos.',
                image: 'https://cdn.leroymerlin.com.br/products/decoracao_sala_vaso_centro_de_mesa_branco_c__arranjo_flor_1571964819_4656_600x600.jpg'
            }
        ];
    }

    // Salva produtos no localStorage
    saveProducts() {
        localStorage.setItem('tiarosa_products', JSON.stringify(this.products));
    }

    // Adiciona novo produto
    addProduct(productData) {
        const newProduct = {
            id: Date.now(),
            ...productData,
            price: parseFloat(productData.price),
            quantity: parseInt(productData.quantity) || 1
        };
        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    // Atualiza produto existente
    updateProduct(id, productData) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = {
                ...this.products[index],
                ...productData,
                price: parseFloat(productData.price),
                quantity: parseInt(productData.quantity) || 1
            };
            this.saveProducts();
            return this.products[index];
        }
        return null;
    }

    // Remove produto
    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            const deleted = this.products.splice(index, 1)[0];
            this.saveProducts();
            return deleted;
        }
        return null;
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

// Instância global do gerenciador
const productManager = new ProductManager();

// Elementos DOM
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilters = document.querySelectorAll('.filter-btn');
const productForm = document.getElementById('productForm');
const navLinks = document.querySelectorAll('.nav-link');

// Estado da aplicação
let currentCategory = 'todos';
let currentSearch = '';

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    renderProducts();
    updateActiveSection();
});

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
function renderProducts() {
    const products = productManager.searchProducts(currentSearch, currentCategory);
    
    if (products.length === 0) {
        productGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar sua busca ou filtros.</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = products.map(product => createProductCard(product)).join('');
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

    const whatsappMessage = encodeURIComponent(`Olá! Tenho interesse no produto: *${product.name}* - R$ ${product.price.toFixed(2).replace('.', ',')}`);

    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                ${imageContent}
                <i class="fas ${icon}" ${product.image ? 'style="display:none"' : ''}></i>
                <div class="product-badge">${getCategoryName(product.category)}</div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
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
function handleSearch(e) {
    currentSearch = e.target.value;
    renderProducts();
}

function handleCategoryFilter(e) {
    // Remove active de todos os botões
    categoryFilters.forEach(btn => btn.classList.remove('active'));
    // Adiciona active ao botão clicado
    e.target.classList.add('active');
    
    currentCategory = e.target.dataset.category;
    renderProducts();
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

// Event Listeners para o Modal de Login
document.addEventListener('DOMContentLoaded', function() {
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
});

// Utilitários
function formatPrice(price) {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
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