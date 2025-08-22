const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

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
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`☁️ Imagens serão enviadas para Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`📁 Pasta local de fallback: ${imagesDir}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
});