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
            return JSON.parse(saved);
        }
        
        // Produtos de exemplo para demonstração
        return [
            {
                id: 1,
                name: 'Rosa Vermelha de Seda',
                category: 'flores',
                price: 24.90,
                description: 'Lindíssima rosa vermelha de seda premium, com pétalas realistas e haste flexível. Perfeita para decoração de ambientes ou arranjos especiais.',
                image: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Rosa+Vermelha'
            },
            {
                id: 2,
                name: 'Buquê de Rosas Brancas',
                category: 'flores',
                price: 45.00,
                description: 'Elegante buquê com 12 rosas brancas artificiais, ideal para decoração de casamentos e eventos especiais.',
                image: 'https://via.placeholder.com/400x300/f8f9fa/333333?text=Buque+Branco'
            },
            {
                id: 3,
                name: 'Lírio Amarelo Artificial',
                category: 'flores',
                price: 18.50,
                description: 'Belo lírio amarelo artificial com acabamento realista, perfeito para vasos e arranjos florais.',
                image: 'https://via.placeholder.com/400x300/fbbf24/333333?text=Lirio+Amarelo'
            },
            {
                id: 4,
                name: 'Vela Votiva Branca',
                category: 'velas',
                price: 12.00,
                description: 'Vela votiva de cera natural branca, duração de 6 horas. Ideal para orações e momentos de reflexão.',
                image: 'https://via.placeholder.com/400x300/f8f9fa/666666?text=Vela+Branca'
            },
            {
                id: 5,
                name: 'Kit 12 Velas Coloridas',
                category: 'velas',
                price: 35.00,
                description: 'Conjunto com 12 velas votivas em cores variadas: branco, amarelo, azul e rosa. Perfeitas para novenas.',
                image: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Kit+Velas'
            },
            {
                id: 6,
                name: 'Vela de 7 Dias',
                category: 'velas',
                price: 28.90,
                description: 'Vela de vidro com duração de 7 dias, disponível em branco e vermelho. Ideal para promessas e orações prolongadas.',
                image: 'https://via.placeholder.com/400x300/dc2626/ffffff?text=Vela+7+Dias'
            },
            {
                id: 7,
                name: 'Quadro Jesus Cristo',
                category: 'quadros',
                price: 65.00,
                description: 'Quadro decorativo do Sagrado Coração de Jesus, moldura em madeira nobre, 30x40cm. Impressão em alta qualidade.',
                image: 'https://via.placeholder.com/400x300/8b4a6b/ffffff?text=Jesus+Cristo'
            },
            {
                id: 8,
                name: 'Quadro Nossa Senhora Aparecida',
                category: 'quadros',
                price: 58.00,
                description: 'Belo quadro de Nossa Senhora Aparecida com moldura dourada, 25x35cm. Acabamento premium com vidro antirreflexo.',
                image: 'https://via.placeholder.com/400x300/1e40af/ffffff?text=N.Senhora'
            },
            {
                id: 9,
                name: 'Quadro São Francisco de Assis',
                category: 'quadros',
                price: 52.00,
                description: 'Quadro artístico de São Francisco de Assis, moldura em madeira escura, 20x30cm. Perfeito para salas e quartos.',
                image: 'https://via.placeholder.com/400x300/059669/ffffff?text=Sao+Francisco'
            },
            {
                id: 10,
                name: 'Terço de Nossa Senhora',
                category: 'quadros',
                price: 75.00,
                description: 'Quadro decorativo com terço entalhado em madeira, representando Nossa Senhora do Rosário, 35x45cm.',
                image: 'https://via.placeholder.com/400x300/7c3aed/ffffff?text=Terco+Quadro'
            },
            {
                id: 11,
                name: 'Santinho São José',
                category: 'santinhos',
                price: 3.50,
                description: 'Santinho de São José Operário em papel couché plastificado, com oração no verso. Tamanho padrão 6x10cm.',
                image: 'https://via.placeholder.com/400x300/a3a3a3/ffffff?text=Santinho+Sao+Jose'
            },
            {
                id: 12,
                name: 'Kit 50 Santinhos Variados',
                category: 'santinhos',
                price: 25.00,
                description: 'Conjunto com 50 santinhos de diversos santos: Nossa Senhora, Jesus, São José, Santa Rita e outros. Ideal para distribuição.',
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
                description: 'Belíssimo arranjo com flores mistas artificiais em vaso de cerâmica. Rosas, lírios e folhagens diversas.',
                image: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Arranjo+Flores'
            },
            {
                id: 15,
                name: 'Vela Aromática Vanilla',
                category: 'velas',
                price: 22.50,
                description: 'Vela aromática com fragrância de baunilha, em copo de vidro decorativo. Duração aproximada de 8 horas.',
                image: 'https://via.placeholder.com/400x300/f97316/ffffff?text=Vela+Aromatica'
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
            price: parseFloat(productData.price)
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
                price: parseFloat(productData.price)
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
    searchInput.addEventListener('input', handleSearch);

    // Filtros de categoria
    categoryFilters.forEach(btn => {
        btn.addEventListener('click', handleCategoryFilter);
    });

    // Navegação
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Formulário removido

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
        santinhos: 'fa-cross'
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
        santinhos: 'Santinhos'
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

// Eventos removidos - não há mais formulário

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