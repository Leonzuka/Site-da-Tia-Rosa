# Guia de Diagnóstico - Railway Database Connection

## 🔍 Problema Atual
Erro `ECONNREFUSED` ao tentar conectar com o banco MySQL do Railway.

## 📋 Passos para Diagnóstico

### 1. Verificar Status dos Serviços no Railway
1. Acesse o dashboard do Railway
2. Verifique se o serviço MySQL está **ativo** (status verde)
3. Verifique se não há erros nos logs do MySQL

### 2. Verificar Variáveis de Ambiente
No dashboard do Railway, vá em **Variables** e confirme que existem:

**Opção A - DATABASE_URL (Recomendado):**
```
DATABASE_URL=mysql://usuario:senha@host:porta/database
```

**Opção B - Variáveis Individuais:**
```
MYSQL_HOST=<host_do_railway>
MYSQL_PORT=3306
MYSQL_USER=<usuario>
MYSQL_PASSWORD=<senha>
MYSQL_DATABASE=<nome_do_banco>
```

### 3. Testar Conexão
Acesse os endpoints de diagnóstico na sua aplicação:

**Health Check Completo:**
```
GET https://seu-app.railway.app/health
```

**Ping Simples:**
```
GET https://seu-app.railway.app/ping
```

### 4. Verificar Logs da Aplicação
No Railway, vá em **Deployments** > **View Logs** e procure por:
- `📡 Usando DATABASE_URL do Railway` ou `📡 Usando variáveis individuais do Railway`
- Status das variáveis de ambiente
- Mensagens de erro específicas

## 🔧 Soluções Comuns

### Se o MySQL não está ativo:
1. No Railway dashboard, vá em **Database**
2. Clique em **Restart** se necessário
3. Aguarde alguns minutos para inicialização

### Se as variáveis estão incorretas:
1. Delete as variáveis existentes
2. Adicione novamente a partir das configurações do MySQL no Railway
3. Faça um novo deploy

### Se usar DATABASE_URL:
O Railway geralmente fornece automaticamente. Formato:
```
mysql://usuario:senha@host:porta/railway
```

### Se usar variáveis individuais:
```
MYSQL_HOST=containers-us-west-xxx.railway.app
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=sua_senha_gerada
MYSQL_DATABASE=railway
```

## 🚀 Configurações Recomendadas para Produção

### Variáveis de Ambiente Essenciais:
```bash
# Database
DATABASE_URL=mysql://... (fornecido pelo Railway)

# Cloudinary
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# Ambiente
NODE_ENV=production
PORT=3000
```

### Configurações de Conexão Otimizadas:
- ✅ SSL habilitado para produção
- ✅ Pool de conexões limitado (10 conexões)
- ✅ Timeout configurado (60 segundos)
- ✅ Reconnect automático

## 📊 Monitoramento

### Logs Importantes:
```
✅ Pool de conexões MySQL criado com sucesso
✅ Conexão com MySQL testada com sucesso
✅ Tabela products criada/verificada com sucesso
```

### Sinais de Problema:
```
❌ Erro de conexão recusada
❌ ECONNREFUSED
❌ Banco de dados indisponível
```

## 🔄 Restart Rápido
Se tudo falhar:
1. No Railway dashboard: **Settings** > **Restart**
2. Aguarde o redeploy completo
3. Verifique logs novamente

## 📞 Comandos de Debug
```bash
# Testar conexão manualmente
curl https://seu-app.railway.app/health

# Ver status simples
curl https://seu-app.railway.app/ping

# Testar API de produtos
curl https://seu-app.railway.app/api/products
```