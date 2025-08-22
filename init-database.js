// Script para inicializar o banco de dados
require('dotenv').config();
const { testConnection, initializeTables } = require('./database');

async function initDatabase() {
    console.log('🚀 Iniciando configuração do banco de dados...');
    
    try {
        // Testar conexão
        console.log('📡 Testando conexão com MySQL...');
        const connectionOk = await testConnection();
        
        if (!connectionOk) {
            throw new Error('Não foi possível conectar ao banco de dados');
        }
        
        // Inicializar tabelas
        console.log('📋 Criando/verificando tabelas...');
        await initializeTables();
        
        console.log('✅ Banco de dados inicializado com sucesso!');
        console.log('🎉 Sistema pronto para uso');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erro ao inicializar banco de dados:', error);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    initDatabase();
}

module.exports = { initDatabase };