const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { testConnection, initializeTables, ProductDB } = require('./database');

// Carregar variáveis de ambiente
require('dotenv').config();

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static('.'));
app.use('/images', express.static('images'));

// Manter compatibilidade com imagens locais existentes
const imagesDir = path.join(__dirname, 'images', 'products');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Configuração do multer para Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB (Cloudinary suporta mais)
    },
    fileFilter: (req, file, cb) => {
        // Aceitar apenas imagens
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
        }
    }
});

// Rota para upload de imagem via Cloudinary
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'Nenhum arquivo enviado!' 
            });
        }

        // Gerar nome único para identificação
        const timestamp = Date.now();
        const originalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const publicId = `tia-rosa/produtos/produto_${timestamp}_${originalName.split('.')[0]}`;

        // Upload para Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    public_id: publicId,
                    folder: 'tia-rosa/produtos',
                    transformation: [
                        { width: 800, height: 600, crop: 'limit' },
                        { quality: 'auto:good' },
                        { format: 'auto' }
                    ],
                    eager: [
                        { width: 200, height: 200, crop: 'thumb', gravity: 'center' }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(req.file.buffer);
        });

        res.json({
            success: true,
            message: 'Imagem enviada com sucesso para Cloudinary!',
            imageUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            thumbnailUrl: uploadResult.eager[0].secure_url
        });

    } catch (error) {
        console.error('Erro no upload para Cloudinary:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor: ' + error.message
        });
    }
});

// Rota para listar imagens do Cloudinary
app.get('/api/images', async (req, res) => {
    try {
        // Listar imagens da pasta específica no Cloudinary
        const result = await cloudinary.search
            .expression('folder:tia-rosa/produtos')
            .sort_by([['created_at', 'desc']])
            .max_results(100)
            .execute();

        const images = result.resources.map(resource => ({
            publicId: resource.public_id,
            url: resource.secure_url,
            fileName: resource.public_id.split('/').pop(),
            uploadDate: resource.created_at,
            format: resource.format,
            bytes: resource.bytes
        }));

        res.json({
            success: true,
            images: images,
            total: result.total_count
        });
    } catch (error) {
        console.error('Erro ao listar imagens do Cloudinary:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar imagens: ' + error.message
        });
    }
});

// Rota para deletar imagem do Cloudinary
app.delete('/api/images/:publicId', async (req, res) => {
    try {
        const publicId = req.params.publicId;
        
        // Decodificar o publicId se necessário (pode vir com caracteres especiais)
        const decodedPublicId = decodeURIComponent(publicId);

        // Deletar do Cloudinary
        const result = await cloudinary.uploader.destroy(decodedPublicId);

        if (result.result === 'ok') {
            res.json({
                success: true,
                message: 'Imagem deletada com sucesso do Cloudinary!'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Imagem não encontrada no Cloudinary!'
            });
        }
    } catch (error) {
        console.error('Erro ao deletar imagem do Cloudinary:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar imagem: ' + error.message
        });
    }
});

// Rota para servir páginas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// ================== HEALTH CHECK ==================

// Endpoint de health check para Railway
app.get('/health', async (req, res) => {
    const status = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        port: PORT,
        services: {
            database: false,
            cloudinary: false
        },
        database_config: {
            has_database_url: !!process.env.DATABASE_URL,
            has_mysql_host: !!(process.env.MYSQL_HOST || process.env.DB_HOST),
            has_mysql_user: !!(process.env.MYSQL_USER || process.env.DB_USER),
            has_mysql_database: !!(process.env.MYSQL_DATABASE || process.env.DB_NAME)
        }
    };
    
    try {
        // Testar conexão com banco
        const dbOk = await testConnection();
        status.services.database = dbOk;
        
        // Verificar configuração do Cloudinary
        status.services.cloudinary = !!(
            process.env.CLOUDINARY_CLOUD_NAME && 
            process.env.CLOUDINARY_API_KEY && 
            process.env.CLOUDINARY_API_SECRET
        );
        
        // Status geral
        const allServicesOk = status.services.database && status.services.cloudinary;
        
        res.status(allServicesOk ? 200 : 503).json(status);
        
    } catch (error) {
        status.status = 'error';
        status.error = error.message;
        res.status(503).json(status);
    }
});

// Endpoint simples para verificar se o servidor está vivo
app.get('/ping', (req, res) => {
    res.json({ 
        message: 'pong', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ================== APIs DE PRODUTOS ==================

// Listar todos os produtos
app.get('/api/products', async (req, res) => {
    try {
        console.log('📦 Requisição para /api/products:', req.query);
        
        const { category, search } = req.query;
        let products;
        
        if (search) {
            console.log('🔍 Buscando produtos com termo:', search);
            products = await ProductDB.search(search);
        } else if (category && category !== 'todos') {
            console.log('📋 Buscando produtos da categoria:', category);
            products = await ProductDB.getByCategory(category);
        } else {
            console.log('📦 Buscando todos os produtos');
            products = await ProductDB.getAll();
        }
        
        console.log(`✅ Encontrados ${products.length} produtos`);
        
        res.json({
            success: true,
            products: products,
            total: products.length
        });
    } catch (error) {
        console.error('❌ Erro ao buscar produtos:', error.message);
        console.error('Código do erro:', error.code);
        console.error('Stack trace:', error.stack);
        
        // Diagnóstico específico para erros de conexão
        if (error.code === 'ECONNREFUSED') {
            console.error('🔌 Diagnóstico: Erro de conexão com banco de dados');
            console.error('   - Verificar se o MySQL está rodando no Railway');
            console.error('   - Confirmar variáveis de ambiente DATABASE_URL ou MYSQL_*');
            console.error('   - Verificar se o serviço de banco está ativo');
        }
        
        res.status(500).json({
            success: false,
            message: 'Erro ao conectar com banco de dados. Verifique os logs.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
            code: error.code
        });
    }
});

// Buscar produto por ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const product = await ProductDB.getById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }
        
        res.json({
            success: true,
            product: product
        });
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor: ' + error.message
        });
    }
});

// Criar novo produto
app.post('/api/products', async (req, res) => {
    try {
        const { name, category, price, quantity, description, image } = req.body;
        
        // Validações
        if (!name || !category || !price) {
            return res.status(400).json({
                success: false,
                message: 'Nome, categoria e preço são obrigatórios'
            });
        }
        
        const productData = {
            name: name.trim(),
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity) || 1,
            description: description ? description.trim() : null,
            image: image ? image.trim() : null
        };
        
        const newProduct = await ProductDB.create(productData);
        
        res.status(201).json({
            success: true,
            message: 'Produto criado com sucesso',
            product: newProduct
        });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor: ' + error.message
        });
    }
});

// Atualizar produto
app.put('/api/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, category, price, quantity, description, image } = req.body;
        
        // Verificar se produto existe
        const existingProduct = await ProductDB.getById(id);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }
        
        // Validações
        if (!name || !category || !price) {
            return res.status(400).json({
                success: false,
                message: 'Nome, categoria e preço são obrigatórios'
            });
        }
        
        const productData = {
            name: name.trim(),
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity) || 1,
            description: description ? description.trim() : null,
            image: image ? image.trim() : null
        };
        
        const updatedProduct = await ProductDB.update(id, productData);
        
        res.json({
            success: true,
            message: 'Produto atualizado com sucesso',
            product: updatedProduct
        });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor: ' + error.message
        });
    }
});

// Deletar produto
app.delete('/api/products/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deletedProduct = await ProductDB.delete(id);
        
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Produto não encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Produto deletado com sucesso',
            product: deletedProduct
        });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor: ' + error.message
        });
    }
});

// Alteração em lote de preços
app.post('/api/products/bulk-price', async (req, res) => {
    try {
        const { category, changeType, changeValue } = req.body;
        
        // Validações
        if (!category || !changeType || changeValue === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Categoria, tipo de alteração e valor são obrigatórios'
            });
        }
        
        if (!['percentage', 'fixed'].includes(changeType)) {
            return res.status(400).json({
                success: false,
                message: 'Tipo de alteração deve ser "percentage" ou "fixed"'
            });
        }
        
        const value = parseFloat(changeValue);
        if (isNaN(value)) {
            return res.status(400).json({
                success: false,
                message: 'Valor deve ser um número válido'
            });
        }
        
        const affectedRows = await ProductDB.bulkUpdatePrices(category, changeType, value);
        
        res.json({
            success: true,
            message: `${affectedRows} produtos atualizados com sucesso`,
            affectedRows: affectedRows
        });
    } catch (error) {
        console.error('Erro na alteração em lote:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor: ' + error.message
        });
    }
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Arquivo muito grande! Máximo 5MB.'
            });
        }
    }
    
    res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
    });
});

// Iniciar servidor
async function startServer() {
    try {
        console.log('🚀 Iniciando servidor Garden Rosas Decor...');
        console.log('🌍 Ambiente:', process.env.NODE_ENV || 'development');
        console.log('🔧 Porta:', PORT);
        
        // Verificar variáveis de ambiente essenciais
        console.log('\n📋 Verificando configurações:');
        console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅' : '❌');
        console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY ? '✅' : '❌');
        console.log('Cloudinary API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅' : '❌');
        
        // Testar conexão com banco de dados
        console.log('\n📡 Testando conexão com MySQL...');
        const dbOk = await testConnection();
        
        if (dbOk) {
            // Inicializar tabelas
            console.log('📋 Inicializando tabelas...');
            await initializeTables();
            console.log('✅ Banco de dados pronto!');
        } else {
            console.log('⚠️ ATENÇÃO: Banco de dados indisponível!');
            console.log('   - APIs de produtos não funcionarão');
            console.log('   - Verifique as variáveis de ambiente do Railway');
            console.log('   - Confirme se o banco MySQL está ativo no Railway');
        }
        
        // Iniciar servidor
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log('\n🎉 Servidor iniciado com sucesso!');
            console.log(`🚀 Rodando na porta: ${PORT}`);
            console.log(`☁️ Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME || 'Não configurado'}`);
            console.log(`🗄️ Banco de dados: ${dbOk ? '✅ Conectado' : '❌ Desconectado'}`);
            console.log(`📁 Imagens locais: ${imagesDir}`);
            
            if (process.env.NODE_ENV === 'production') {
                console.log(`🌐 URL de produção disponível`);
            } else {
                console.log(`🌐 Desenvolvimento: http://localhost:${PORT}`);
            }
            
            console.log('\n📝 Logs em tempo real:');
        });
        
        // Graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n🛑 Recebido SIGINT. Fechando servidor...');
            server.close(() => {
                console.log('✅ Servidor fechado com sucesso');
                process.exit(0);
            });
        });
        
        process.on('SIGTERM', () => {
            console.log('\n🛑 Recebido SIGTERM. Fechando servidor...');
            server.close(() => {
                console.log('✅ Servidor fechado com sucesso');
                process.exit(0);
            });
        });
        
    } catch (error) {
        console.error('❌ ERRO CRÍTICO ao iniciar servidor:', error);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

startServer();