const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static('.'));
app.use('/images', express.static('images'));

// Criar diretório de imagens se não existir
const imagesDir = path.join(__dirname, 'images', 'products');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Configuração do multer para upload
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
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

// Rota para upload de imagem
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'Nenhum arquivo enviado!' 
            });
        }

        // Gerar nome único para a imagem
        const timestamp = Date.now();
        const originalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `produto_${timestamp}_${originalName}`;
        const filePath = path.join(imagesDir, fileName);

        // Redimensionar e otimizar imagem com Sharp
        await sharp(req.file.buffer)
            .resize(800, 600, { 
                fit: 'inside',
                withoutEnlargement: true 
            })
            .jpeg({ 
                quality: 85,
                mozjpeg: true 
            })
            .toFile(filePath);

        // URL da imagem
        const imageUrl = `/images/products/${fileName}`;

        res.json({
            success: true,
            message: 'Imagem enviada com sucesso!',
            imageUrl: imageUrl,
            fileName: fileName
        });

    } catch (error) {
        console.error('Erro no upload:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno no servidor: ' + error.message
        });
    }
});

// Rota para listar imagens existentes
app.get('/api/images', (req, res) => {
    try {
        const files = fs.readdirSync(imagesDir);
        const images = files
            .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
            .map(file => ({
                fileName: file,
                url: `/images/products/${file}`,
                uploadDate: fs.statSync(path.join(imagesDir, file)).mtime
            }))
            .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

        res.json({
            success: true,
            images: images
        });
    } catch (error) {
        console.error('Erro ao listar imagens:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao listar imagens'
        });
    }
});

// Rota para deletar imagem
app.delete('/api/images/:fileName', (req, res) => {
    try {
        const fileName = req.params.fileName;
        const filePath = path.join(imagesDir, fileName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({
                success: true,
                message: 'Imagem deletada com sucesso!'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Imagem não encontrada!'
            });
        }
    } catch (error) {
        console.error('Erro ao deletar imagem:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar imagem'
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
    console.log(`📁 Imagens serão salvas em: ${imagesDir}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
});