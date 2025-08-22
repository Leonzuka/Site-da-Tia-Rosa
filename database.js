// Configuração do banco de dados MySQL
const mysql = require('mysql2/promise');

// Pool de conexões para melhor performance
let pool = null;

function createPool() {
    if (!pool) {
        try {
            // Configuração de conexão - prioriza DATABASE_URL do Railway
            let config;
            
            if (process.env.DATABASE_URL) {
                console.log('📡 Usando DATABASE_URL do Railway');
                config = {
                    uri: process.env.DATABASE_URL,
                    connectionLimit: 10,
                    charset: 'utf8mb4',
                    timezone: '-03:00',
                    ssl: { rejectUnauthorized: false } // Railway sempre usa SSL
                };
            } else {
                // Fallback para variáveis individuais do Railway
                // Railway usa MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE
                console.log('📡 Usando variáveis individuais do Railway');
                const host = process.env.MYSQLHOST || process.env.MYSQL_HOST || process.env.DB_HOST;
                const port = process.env.MYSQLPORT || process.env.MYSQL_PORT || process.env.DB_PORT || '3306';
                const user = process.env.MYSQLUSER || process.env.MYSQL_USER || process.env.DB_USER || 'root';
                const password = process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '';
                const database = process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || process.env.DB_NAME || 'railway';
                
                console.log('Host:', host || 'NÃO DEFINIDO');
                console.log('Port:', port);
                console.log('User:', user);
                console.log('Database:', database);
                console.log('Password:', password ? '✅ DEFINIDA' : '❌ NÃO DEFINIDA');
                
                if (!host) {
                    throw new Error('❌ Nenhuma variável de host encontrada. Verifique MYSQLHOST, MYSQL_HOST ou DB_HOST no Railway.');
                }
                
                config = {
                    host: host,
                    port: parseInt(port),
                    user: user,
                    password: password,
                    database: database,
                    connectionLimit: 10,
                    charset: 'utf8mb4',
                    timezone: '-03:00',
                    ssl: process.env.NODE_ENV === 'production' ? { 
                        rejectUnauthorized: false,
                        minVersion: 'TLSv1.2'
                    } : false
                };
            }
            
            pool = mysql.createPool(config);
            
            console.log('✅ Pool de conexões MySQL criado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao criar pool de conexões:', error);
            throw error;
        }
    }
    return pool;
}

// Função para executar queries
async function query(sql, params = []) {
    let connection = null;
    try {
        connection = createPool();
        const [results] = await connection.execute(sql, params);
        return results;
    } catch (error) {
        console.error('❌ Erro na query:', error.message);
        console.error('Código do erro:', error.code);
        console.error('SQL:', sql);
        console.error('Params:', params);
        
        // Logs específicos para debug de conexão
        if (error.code === 'ECONNREFUSED') {
            console.error('🔌 Erro de conexão recusada - verificar:');
            console.error('- Variáveis de ambiente do banco de dados');
            console.error('- Status do banco de dados no Railway');
            console.error('- Configurações de rede/firewall');
        }
        
        throw error;
    }
}

// Função para testar conexão
async function testConnection() {
    try {
        console.log('🔍 Testando conexão com banco de dados...');
        
        // Log das variáveis de ambiente (sem mostrar senhas)
        console.log('Variables de ambiente disponíveis:');
        console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Definida' : '❌ Não definida');
        console.log('MYSQLHOST:', process.env.MYSQLHOST ? '✅ Definida' : '❌ Não definida');
        console.log('MYSQLPORT:', process.env.MYSQLPORT || '❌ Não definida');
        console.log('MYSQLUSER:', process.env.MYSQLUSER ? '✅ Definida' : '❌ Não definida');
        console.log('MYSQLDATABASE:', process.env.MYSQLDATABASE || '❌ Não definida');
        console.log('MYSQLPASSWORD:', process.env.MYSQLPASSWORD ? '✅ Definida' : '❌ Não definida');
        console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
        
        await query('SELECT 1 as test');
        console.log('✅ Conexão com MySQL testada com sucesso');
        return true;
    } catch (error) {
        console.error('❌ Erro ao testar conexão com MySQL:', error.message);
        console.error('Detalhes completos do erro:', error);
        return false;
    }
}

// Função para inicializar tabelas
async function initializeTables() {
    try {
        // Criar tabela de produtos se não existir
        const createProductsTable = `
            CREATE TABLE IF NOT EXISTS products (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                category ENUM('flores','velas','quadros','santinhos','utensilios','artigos','vasos') NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                quantity INT DEFAULT 1,
                description TEXT,
                image VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_name (name)
            ) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `;
        
        await query(createProductsTable);
        console.log('✅ Tabela products criada/verificada com sucesso');
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao inicializar tabelas:', error);
        throw error;
    }
}

// Funções específicas para produtos
const ProductDB = {
    // Buscar todos os produtos
    async getAll() {
        const sql = `
            SELECT id, name, category, price, quantity, description, image, 
                   created_at, updated_at 
            FROM products 
            ORDER BY created_at DESC
        `;
        return await query(sql);
    },
    
    // Buscar produto por ID
    async getById(id) {
        const sql = `
            SELECT id, name, category, price, quantity, description, image, 
                   created_at, updated_at 
            FROM products 
            WHERE id = ?
        `;
        const results = await query(sql, [id]);
        return results[0] || null;
    },
    
    // Criar novo produto
    async create(productData) {
        const { name, category, price, quantity, description, image } = productData;
        const sql = `
            INSERT INTO products (name, category, price, quantity, description, image)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const result = await query(sql, [name, category, price, quantity || 1, description, image]);
        return await this.getById(result.insertId);
    },
    
    // Atualizar produto
    async update(id, productData) {
        const { name, category, price, quantity, description, image } = productData;
        const sql = `
            UPDATE products 
            SET name = ?, category = ?, price = ?, quantity = ?, description = ?, image = ?
            WHERE id = ?
        `;
        await query(sql, [name, category, price, quantity || 1, description, image, id]);
        return await this.getById(id);
    },
    
    // Deletar produto
    async delete(id) {
        const product = await this.getById(id);
        if (product) {
            const sql = 'DELETE FROM products WHERE id = ?';
            await query(sql, [id]);
        }
        return product;
    },
    
    // Buscar produtos por categoria
    async getByCategory(category) {
        const sql = `
            SELECT id, name, category, price, quantity, description, image, 
                   created_at, updated_at 
            FROM products 
            WHERE category = ?
            ORDER BY name
        `;
        return await query(sql, [category]);
    },
    
    // Buscar produtos por nome
    async search(searchTerm) {
        const sql = `
            SELECT id, name, category, price, quantity, description, image, 
                   created_at, updated_at 
            FROM products 
            WHERE name LIKE ? OR description LIKE ?
            ORDER BY name
        `;
        const searchPattern = `%${searchTerm}%`;
        return await query(sql, [searchPattern, searchPattern]);
    },
    
    // Atualizar preços em lote por categoria
    async bulkUpdatePrices(category, changeType, changeValue) {
        let sql;
        let params;
        
        if (changeType === 'percentage') {
            if (category === 'todas') {
                sql = `
                    UPDATE products 
                    SET price = ROUND(price * (1 + ? / 100), 2)
                `;
                params = [changeValue];
            } else {
                sql = `
                    UPDATE products 
                    SET price = ROUND(price * (1 + ? / 100), 2)
                    WHERE category = ?
                `;
                params = [changeValue, category];
            }
        } else if (changeType === 'fixed') {
            if (category === 'todas') {
                sql = `
                    UPDATE products 
                    SET price = GREATEST(0.01, price + ?)
                `;
                params = [changeValue];
            } else {
                sql = `
                    UPDATE products 
                    SET price = GREATEST(0.01, price + ?)
                    WHERE category = ?
                `;
                params = [changeValue, category];
            }
        } else {
            throw new Error('Tipo de alteração inválido');
        }
        
        const result = await query(sql, params);
        return result.affectedRows;
    }
};

module.exports = {
    query,
    testConnection,
    initializeTables,
    ProductDB
};