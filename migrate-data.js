// Script para migrar dados do localStorage para MySQL
require('dotenv').config();
const { testConnection, initializeTables, ProductDB } = require('./database');

// Produtos padrão do sistema (caso localStorage esteja vazio)
const defaultProducts = [
    {
        name: 'Rosa Vermelha de Seda',
        category: 'flores',
        price: 24.90,
        quantity: 15,
        description: 'Lindíssima rosa vermelha de seda premium, com pétalas realistas e haste flexível. Perfeita para decoração de ambientes ou arranjos especiais.',
        image: 'https://m.media-amazon.com/images/I/61I49qc6NeL._AC_SX679_.jpg'
    },
    {
        name: 'Buquê de Rosas Brancas',
        category: 'flores',
        price: 45.00,
        quantity: 8,
        description: 'Elegante buquê com 12 rosas brancas de plástico, ideal para decoração de casamentos e eventos especiais.',
        image: 'https://www.floresonline.com.br/media/catalog/product/a/l/alta-1112-1.webp'
    },
    {
        name: 'Lírio Amarelo de plástico',
        category: 'flores',
        price: 18.50,
        quantity: 22,
        description: 'Belo lírio amarelo de plástico com acabamento realista, perfeito para vasos e arranjos florais.',
        image: 'https://acdn-us.mitiendanube.com/stores/001/049/883/products/56vzaed-1f96a250ecbb4886fd16177962972208-1024-1024.webp'
    },
    {
        name: 'Vela Branca',
        category: 'velas',
        price: 12.00,
        quantity: 35,
        description: 'Vela branca de cera natural branca, duração de 6 horas. Ideal para orações e momentos de reflexão.',
        image: 'https://cdn.awsli.com.br/2500x2500/1810/1810998/produto/85595519/e2d98e0774.jpg'
    },
    {
        name: 'Kit 12 Velas Coloridas',
        category: 'velas',
        price: 35.00,
        quantity: 12,
        description: 'Conjunto com 12 velas em cores variadas: branco, amarelo, azul e rosa. Perfeitas para novenas.',
        image: 'https://a-static.mlcdn.com.br/800x560/kit-12-velas-votivas-7-dias-coloridas-260-gr-cada-sete-raios-de-luz/lojaolist/olsj1h7hqsyuu87/8ba267eb3df43e0af5704be08746337b.jpeg'
    },
    {
        name: 'Vela de 7 Dias',
        category: 'velas',
        price: 28.90,
        quantity: 20,
        description: 'Vela de vidro com duração de 7 dias, disponível em branco e outras cores. Ideal para promessas e orações prolongadas.',
        image: 'https://cdn.awsli.com.br/800x800/1132/1132374/produto/42615073/7-dias-santoscapa1-l452593vf3.jpg'
    },
    {
        name: 'Quadro Arcanjo Miguel',
        category: 'quadros',
        price: 65.00,
        quantity: 5,
        description: 'Quadro decorativo Arcanjo Miguel, moldura em madeira nobre, 30x40cm. Impressão em alta qualidade.',
        image: 'https://cdn.awsli.com.br/600x450/1981/1981658/produto/209841647637028ec08.jpg'
    },
    {
        name: 'Quadro Nossa Senhora Aparecida',
        category: 'quadros',
        price: 58.00,
        quantity: 8,
        description: 'Belo quadro de Nossa Senhora Aparecida com moldura dourada, 25x35cm.',
        image: 'https://cdn.awsli.com.br/2500x2500/1981/1981658/produto/154379545da493e5a9e.jpg'
    },
    {
        name: 'Quadro Santa Ceia',
        category: 'quadros',
        price: 89.90,
        quantity: 3,
        description: 'Quadro clássico da Santa Ceia, moldura em madeira escura, 40x60cm. Arte sacra de alta qualidade.',
        image: 'https://cdn.awsli.com.br/2500x2500/1981/1981658/produto/43924157048ddd4e607.jpg'
    },
    {
        name: 'Santinho São José',
        category: 'santinhos',
        price: 2.50,
        quantity: 100,
        description: 'Santinho de São José, protetor das famílias. Papel couché com oração no verso.',
        image: 'https://www.catolicaparaiso.com.br/media/catalog/product/s/a/santinho-sao-jose-2.jpg'
    }
];

async function migrateData() {
    console.log('🚀 Iniciando migração de dados...');
    
    try {
        // Testar conexão
        console.log('📡 Testando conexão com MySQL...');
        const connectionOk = await testConnection();
        
        if (!connectionOk) {
            throw new Error('Não foi possível conectar ao banco de dados');
        }
        
        // Inicializar tabelas
        console.log('📋 Inicializando tabelas...');
        await initializeTables();
        
        // Verificar se já existem produtos no banco
        const existingProducts = await ProductDB.getAll();
        
        if (existingProducts.length > 0) {
            console.log(`⚠️ Banco já possui ${existingProducts.length} produtos.`);
            
            const readline = require('readline');
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            
            const answer = await new Promise(resolve => {
                rl.question('Deseja continuar com a migração? (s/N): ', resolve);
            });
            
            rl.close();
            
            if (answer.toLowerCase() !== 's' && answer.toLowerCase() !== 'sim') {
                console.log('❌ Migração cancelada pelo usuário.');
                return;
            }
        }
        
        // Migrar produtos padrão
        console.log('📦 Migrando produtos padrão...');
        let migratedCount = 0;
        
        for (const productData of defaultProducts) {
            try {
                // Verificar se produto já existe pelo nome
                const existing = existingProducts.find(p => p.name === productData.name);
                
                if (existing) {
                    console.log(`⏭️ Pulando "${productData.name}" - já existe`);
                    continue;
                }
                
                const newProduct = await ProductDB.create(productData);
                console.log(`✅ Migrado: ${newProduct.name} (ID: ${newProduct.id})`);
                migratedCount++;
                
            } catch (error) {
                console.error(`❌ Erro ao migrar "${productData.name}":`, error.message);
            }
        }
        
        console.log(`🎉 Migração concluída!`);
        console.log(`📊 Produtos migrados: ${migratedCount}`);
        console.log(`📊 Total no banco: ${(await ProductDB.getAll()).length}`);
        
        // Mostrar resumo por categoria
        console.log('\n📋 Resumo por categoria:');
        const categories = ['flores', 'velas', 'quadros', 'santinhos', 'utensilios', 'artigos', 'vasos'];
        
        for (const category of categories) {
            const categoryProducts = await ProductDB.getByCategory(category);
            console.log(`  ${category}: ${categoryProducts.length} produtos`);
        }
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erro na migração:', error);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    migrateData();
}

module.exports = { migrateData, defaultProducts };