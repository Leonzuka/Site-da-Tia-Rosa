// Sistema Administrativo - Garden Rosas Decor
class AdminManager {
    constructor() {
        this.productManager = new ProductManager();
        this.currentEditId = null;
        this.init();
    }

    // Inicializa o sistema administrativo
    init() {
        // Verifica autenticação
        if (!requireAuth()) {
            return;
        }

        this.setupEventListeners();
        this.updateDashboard();
        this.updateSessionTimer();
        this.renderProductsList();
        this.updateCategoryOverview();
    }

    // Configura event listeners
    setupEventListeners() {
        // Formulário de produto
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => this.handleProductSubmit(e));
        }

        // Formulário de alteração de preços
        const bulkPriceForm = document.getElementById('bulkPriceForm');
        if (bulkPriceForm) {
            bulkPriceForm.addEventListener('submit', (e) => this.handleBulkPriceSubmit(e));
        }

        // Busca de produtos
        const searchInput = document.getElementById('adminSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleProductSearch(e));
        }

        // Filtro de categoria
        const categoryFilter = document.getElementById('adminCategoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => this.handleCategoryFilter(e));
        }

        // Fecha modais clicando fora
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('admin-modal')) {
                this.hideAllModals();
            }
        });

        // Tecla ESC para fechar modais
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });
    }

    // Atualiza o dashboard com estatísticas
    updateDashboard() {
        const products = this.productManager.products;
        
        // Total de produtos
        document.getElementById('totalProducts').textContent = products.length;
        
        // Total de itens (soma das quantidades)
        const totalItems = products.reduce((sum, p) => sum + (p.quantity || 1), 0);
        document.getElementById('totalItems').textContent = totalItems;
        
        // Valor total do estoque (preço × quantidade)
        const totalStockValue = products.reduce((sum, p) => sum + (p.price * (p.quantity || 1)), 0);
        document.getElementById('totalStockValue').textContent = this.formatPrice(totalStockValue);
    }

    // Atualiza timer da sessão
    updateSessionTimer() {
        const timerElement = document.getElementById('sessionTimer');
        if (!timerElement) return;

        const updateTimer = () => {
            const timeRemaining = authManager.getSessionTimeRemaining();
            const formattedTime = authManager.formatSessionTime(timeRemaining);
            timerElement.querySelector('span').textContent = formattedTime;
            
            // Alerta quando restam menos de 5 minutos
            if (timeRemaining < 5 * 60 * 1000 && timeRemaining > 0) {
                timerElement.style.background = 'rgba(229, 62, 62, 0.2)';
                timerElement.style.color = '#e53e3e';
            }
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // Atualiza visão geral das categorias
    updateCategoryOverview() {
        const categoryGrid = document.getElementById('categoryGrid');
        if (!categoryGrid) return;

        const categories = {
            flores: { name: 'Flores', icon: 'fa-seedling', count: 0 },
            velas: { name: 'Velas', icon: 'fa-fire', count: 0 },
            quadros: { name: 'Quadros', icon: 'fa-image', count: 0 },
            santinhos: { name: 'Santinhos', icon: 'fa-cross', count: 0 },
            utensilios: { name: 'Utensílios', icon: 'fa-utensils', count: 0 },
            artigos: { name: 'Artigos', icon: 'fa-church', count: 0 },
            vasos: { name: 'Vasos', icon: 'fa-wine-glass', count: 0 }
        };

        // Conta produtos por categoria
        this.productManager.products.forEach(product => {
            if (categories[product.category]) {
                categories[product.category].count++;
            }
        });

        // Renderiza cards das categorias
        categoryGrid.innerHTML = Object.entries(categories).map(([key, cat]) => `
            <div class="category-card" onclick="adminManager.filterByCategory('${key}')">
                <div class="category-icon">
                    <i class="fas ${cat.icon}"></i>
                </div>
                <div class="category-name">${cat.name}</div>
                <div class="category-count">${cat.count}</div>
            </div>
        `).join('');
    }

    // Filtra produtos por categoria
    filterByCategory(category) {
        const categoryFilter = document.getElementById('adminCategoryFilter');
        if (categoryFilter) {
            categoryFilter.value = category;
            this.renderProductsList(category);
        }
    }

    // Renderiza lista de produtos
    renderProductsList(filterCategory = null, searchQuery = '') {
        const productsList = document.getElementById('adminProductsList');
        if (!productsList) return;

        let products = this.productManager.products;

        // Aplica filtros
        if (filterCategory && filterCategory !== 'todos') {
            products = products.filter(p => p.category === filterCategory);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            products = products.filter(p => 
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // Ordena por nome
        products.sort((a, b) => a.name.localeCompare(b.name));

        if (products.length === 0) {
            productsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h3>Nenhum produto encontrado</h3>
                    <p>Tente ajustar os filtros ou adicionar novos produtos.</p>
                </div>
            `;
            return;
        }

        productsList.innerHTML = products.map(product => this.createAdminProductCard(product)).join('');
    }

    // Cria card de produto para o admin
    createAdminProductCard(product) {
        const categoryIcons = {
            flores: 'fa-seedling',
            velas: 'fa-fire',
            quadros: 'fa-image',
            santinhos: 'fa-cross',
            utensilios: 'fa-utensils',
            artigos: 'fa-church',
            vasos: 'fa-wine-glass'
        };

        const icon = categoryIcons[product.category] || 'fa-box';
        const imageContent = product.image 
            ? `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">`
            : '';

        return `
            <div class="admin-product-card" data-id="${product.id}">
                <div class="admin-product-image">
                    ${imageContent}
                    <i class="fas ${icon}" ${product.image ? 'style="display:none"' : ''}></i>
                </div>
                <div class="admin-product-info">
                    <div class="admin-product-name" title="${product.name}">${product.name}</div>
                    <div class="admin-product-meta">
                        <span class="admin-product-category">${this.getCategoryName(product.category)}</span>
                        <span class="admin-product-price">${this.formatPrice(product.price)}</span>
                        <span class="admin-product-quantity ${(product.quantity || 1) <= 5 ? 'low-stock' : ''}" title="Quantidade em estoque">
                            <i class="fas fa-cubes"></i> ${product.quantity || 1}
                        </span>
                    </div>
                </div>
                <div class="admin-product-actions">
                    <button class="admin-action-btn edit" onclick="adminManager.editProduct(${product.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="admin-action-btn delete" onclick="adminManager.deleteProduct(${product.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Manipuladores de eventos
    handleProductSearch(e) {
        const searchQuery = e.target.value;
        const categoryFilter = document.getElementById('adminCategoryFilter').value;
        this.renderProductsList(categoryFilter, searchQuery);
    }

    handleCategoryFilter(e) {
        const category = e.target.value;
        const searchQuery = document.getElementById('adminSearchInput').value;
        this.renderProductsList(category, searchQuery);
    }

    handleProductSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const productData = {
            name: formData.get('name').trim(),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            quantity: parseInt(formData.get('quantity')) || 1,
            description: formData.get('description').trim(),
            image: formData.get('image').trim() || null
        };

        // Validação
        if (!this.validateProductData(productData)) {
            return;
        }

        try {
            if (this.currentEditId) {
                // Atualizar produto existente
                this.productManager.updateProduct(this.currentEditId, productData);
                this.showMessage('Produto atualizado com sucesso!', 'success');
            } else {
                // Adicionar novo produto
                this.productManager.addProduct(productData);
                this.showMessage('Produto adicionado com sucesso!', 'success');
            }

            this.hideProductModal();
            this.updateDashboard();
            this.renderProductsList();
            this.updateCategoryOverview();
            this.updateLastModified();
            
        } catch (error) {
            this.showMessage('Erro ao salvar produto. Tente novamente.', 'error');
            console.error('Erro ao salvar produto:', error);
        }
    }

    handleBulkPriceSubmit(e) {
        e.preventDefault();
        
        const category = document.getElementById('bulkCategory').value;
        const changeType = document.getElementById('priceChangeType').value;
        const changeValue = parseFloat(document.getElementById('priceChangeValue').value);

        if (isNaN(changeValue)) {
            this.showMessage('Valor inválido!', 'error');
            return;
        }

        try {
            let updatedCount = 0;
            
            this.productManager.products.forEach(product => {
                if (category === 'todos' || product.category === category) {
                    if (changeType === 'percentage') {
                        product.price = product.price * (1 + changeValue / 100);
                    } else {
                        product.price = product.price + changeValue;
                    }
                    
                    // Garante que o preço não seja negativo
                    if (product.price < 0) {
                        product.price = 0;
                    }
                    
                    updatedCount++;
                }
            });

            this.productManager.saveProducts();
            this.hideBulkPriceModal();
            this.updateDashboard();
            this.renderProductsList();
            this.updateLastModified();
            
            this.showMessage(`${updatedCount} produtos atualizados com sucesso!`, 'success');
            
        } catch (error) {
            this.showMessage('Erro ao atualizar preços. Tente novamente.', 'error');
            console.error('Erro ao atualizar preços:', error);
        }
    }

    // Funções de produto
    editProduct(id) {
        const product = this.productManager.getProduct(id);
        if (!product) {
            this.showMessage('Produto não encontrado!', 'error');
            return;
        }

        this.currentEditId = id;
        
        // Preenche o formulário
        document.getElementById('editProductId').value = id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productQuantity').value = product.quantity || 1;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productImage').value = product.image || '';
        
        // Mostrar preview se há imagem
        if (product.image) {
            showImagePreview(product.image);
        }

        // Atualiza título do modal
        document.getElementById('productModalTitle').innerHTML = `
            <i class="fas fa-edit"></i>
            Editar Produto
        `;

        this.showProductModal();
    }

    deleteProduct(id) {
        const product = this.productManager.getProduct(id);
        if (!product) {
            this.showMessage('Produto não encontrado!', 'error');
            return;
        }

        if (confirm(`Tem certeza que deseja excluir "${product.name}"?`)) {
            try {
                this.productManager.deleteProduct(id);
                this.updateDashboard();
                this.renderProductsList();
                this.updateCategoryOverview();
                this.updateLastModified();
                this.showMessage('Produto excluído com sucesso!', 'success');
            } catch (error) {
                this.showMessage('Erro ao excluir produto. Tente novamente.', 'error');
                console.error('Erro ao excluir produto:', error);
            }
        }
    }

    // Funções de modal
    showProductModal() {
        const modal = document.getElementById('productModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            document.getElementById('productName').focus();
        }, 300);
    }

    hideProductModal() {
        const modal = document.getElementById('productModal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Reset form
        document.getElementById('productForm').reset();
        this.currentEditId = null;
        
        // Reset modal title
        document.getElementById('productModalTitle').innerHTML = `
            <i class="fas fa-plus"></i>
            Adicionar Produto
        `;
    }

    showBulkPriceModal() {
        const modal = document.getElementById('bulkPriceModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideBulkPriceModal() {
        const modal = document.getElementById('bulkPriceModal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Reset form
        document.getElementById('bulkPriceForm').reset();
    }

    hideAllModals() {
        this.hideProductModal();
        this.hideBulkPriceModal();
    }

    // Funções utilitárias
    validateProductData(data) {
        if (!data.name) {
            this.showMessage('Nome do produto é obrigatório!', 'error');
            return false;
        }
        
        if (!data.category) {
            this.showMessage('Categoria é obrigatória!', 'error');
            return false;
        }
        
        if (isNaN(data.price) || data.price < 0) {
            this.showMessage('Preço deve ser um valor válido!', 'error');
            return false;
        }
        
        if (!data.description) {
            this.showMessage('Descrição é obrigatória!', 'error');
            return false;
        }
        
        if (isNaN(data.quantity) || data.quantity < 0) {
            this.showMessage('Quantidade deve ser um valor válido!', 'error');
            return false;
        }

        return true;
    }

    getCategoryName(category) {
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

    formatPrice(price) {
        return `R$ ${price.toFixed(2).replace('.', ',')}`;
    }

    formatDate(date) {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    updateLastModified() {
        localStorage.setItem('tiarosa_last_update', Date.now().toString());
    }

    // Funções de backup e exportação
    exportData() {
        try {
            const data = {
                products: this.productManager.products,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json'
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `garden-rosas-products-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showMessage('Dados exportados com sucesso!', 'success');
        } catch (error) {
            this.showMessage('Erro ao exportar dados!', 'error');
            console.error('Erro ao exportar:', error);
        }
    }

    backupData() {
        try {
            const backup = {
                products: this.productManager.products,
                backupDate: new Date().toISOString()
            };

            localStorage.setItem('tiarosa_backup', JSON.stringify(backup));
            this.showMessage('Backup criado com sucesso!', 'success');
        } catch (error) {
            this.showMessage('Erro ao criar backup!', 'error');
            console.error('Erro ao criar backup:', error);
        }
    }

    // Sistema de mensagens
    showMessage(message, type = 'info') {
        // Remove mensagens anteriores
        const existingMessage = document.querySelector('.admin-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Cria nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `admin-message ${type}`;
        messageDiv.textContent = message;

        // Adiciona ao início do main
        const main = document.querySelector('.admin-main');
        const container = main.querySelector('.admin-container');
        container.insertBefore(messageDiv, container.firstChild);

        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Funções globais para uso nos eventos onclick do HTML
function showAddProductModal() {
    adminManager.showProductModal();
}

function hideProductModal() {
    adminManager.hideProductModal();
}

function showBulkPriceModal() {
    adminManager.showBulkPriceModal();
}

function hideBulkPriceModal() {
    adminManager.hideBulkPriceModal();
}

function exportData() {
    adminManager.exportData();
}

function backupData() {
    adminManager.backupData();
}

// Funções de Upload de Imagem
function triggerFileUpload() {
    document.getElementById('imageFile').click();
}

function toggleUrlInput() {
    const urlInput = document.getElementById('productImage');
    const preview = document.getElementById('imagePreview');
    
    if (urlInput.style.display === 'none') {
        urlInput.style.display = 'block';
        urlInput.focus();
        preview.style.display = 'none';
    } else {
        urlInput.style.display = 'none';
    }
}

async function handleFileUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
        adminManager.showMessage('Por favor, selecione apenas arquivos de imagem!', 'error');
        return;
    }
    
    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
        adminManager.showMessage('Imagem muito grande! Máximo 5MB.', 'error');
        return;
    }
    
    // Mostrar progresso
    showUploadProgress();
    
    try {
        // Criar FormData
        const formData = new FormData();
        formData.append('image', file);
        
        // Fazer upload
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        // Verificar se a resposta é OK
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Servidor não encontrado. Certifique-se de que o servidor Node.js está rodando.');
            } else {
                throw new Error(`Erro no servidor: ${response.status} ${response.statusText}`);
            }
        }
        
        // Tentar fazer parse do JSON
        let result;
        try {
            result = await response.json();
        } catch (jsonError) {
            throw new Error('Resposta inválida do servidor. Verifique se o servidor está funcionando corretamente.');
        }
        
        if (result.success) {
            // Atualizar campo hidden com URL da imagem
            document.getElementById('productImage').value = result.imageUrl;
            
            // Mostrar preview
            showImagePreview(result.imageUrl);
            
            // Esconder progresso
            hideUploadProgress();
            
            adminManager.showMessage('Imagem enviada com sucesso!', 'success');
        } else {
            throw new Error(result.message || 'Erro no upload');
        }
        
    } catch (error) {
        console.error('Erro no upload:', error);
        hideUploadProgress();
        adminManager.showMessage('Erro ao enviar imagem: ' + error.message, 'error');
    }
    
    // Limpar input
    input.value = '';
}

function showUploadProgress() {
    document.getElementById('uploadProgress').style.display = 'block';
    document.getElementById('imagePreview').style.display = 'none';
}

function hideUploadProgress() {
    document.getElementById('uploadProgress').style.display = 'none';
}

function showImagePreview(imageUrl) {
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    previewImg.src = imageUrl;
    preview.style.display = 'block';
    
    // Esconder input de URL
    document.getElementById('productImage').style.display = 'none';
}

function removeImage() {
    document.getElementById('productImage').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('previewImg').src = '';
}

// Instância global do gerenciador administrativo
let adminManager;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se está autenticado
    if (authManager.isAuthenticated()) {
        adminManager = new AdminManager();
    } else {
        // Redireciona para a página principal
        window.location.href = 'index.html';
    }
});

// Intercepta tentativas de sair da página para avisar sobre dados não salvos
window.addEventListener('beforeunload', function(e) {
    // Aqui você pode adicionar lógica para verificar se há alterações não salvas
    // Por exemplo, se algum modal estiver aberto
    const modalsOpen = document.querySelectorAll('.admin-modal.show').length > 0;
    if (modalsOpen) {
        e.preventDefault();
        e.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?';
        return e.returnValue;
    }
});