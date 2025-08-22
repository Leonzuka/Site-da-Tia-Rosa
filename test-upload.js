const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Teste simples de upload
async function testUpload() {
    try {
        console.log('🔧 Testando configuração do Cloudinary...');
        console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
        console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Configurado' : '❌ Não encontrado');
        console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Configurado' : '❌ Não encontrado');
        
        const pingResult = await cloudinary.api.ping();
        console.log('📶 Ping Cloudinary:', pingResult.status);
        
        // Simular um buffer de imagem pequeno para teste
        const testBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
        
        console.log('📤 Testando upload...');
        
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    public_id: 'test-upload-' + Date.now(),
                    folder: 'tia-rosa/produtos',
                    transformation: [
                        { width: 800, height: 600, crop: 'limit' },
                        { quality: 'auto:good' },
                        { format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) {
                        console.log('❌ Erro no upload:', error);
                        reject(error);
                    } else {
                        console.log('✅ Upload bem-sucedido:', result.public_id);
                        resolve(result);
                    }
                }
            ).end(testBuffer);
        });
        
        console.log('🎉 Teste concluído com sucesso!');
        console.log('URL da imagem:', uploadResult.secure_url);
        
    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
        if (error.http_code) {
            console.error('Código HTTP:', error.http_code);
        }
    }
}

testUpload();