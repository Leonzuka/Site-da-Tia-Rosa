# Garden Rosas Decor - Site com Upload de Imagens

Site para a loja de flores artificiais e artigos religiosos com sistema administrativo e upload de imagens.

## 🚀 Como Rodar Localmente

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar o Servidor
```bash
npm start
```

### 3. Acessar o Site
- **Site principal**: http://localhost:3000
- **Painel admin**: http://localhost:3000/admin

## 🔐 Login Administrativo
- **Usuário**: `Rosinha`
- **Senha**: `324470`

## 📁 Estrutura do Projeto
```
Site-da-Tia-Rosa/
├── images/products/          # Imagens dos produtos (criada automaticamente)
├── index.html               # Página principal
├── admin.html               # Painel administrativo
├── script.js                # Lógica do site principal
├── admin.js                 # Lógica do painel admin
├── auth.js                  # Sistema de autenticação
├── styles.css               # Estilos do site
├── admin.css                # Estilos do painel admin
├── server.js                # Servidor Node.js + Express
├── package.json             # Dependências
└── README.md                # Este arquivo
```

## 🖼️ Sistema de Upload
- Upload direto da galeria do celular
- Otimização automática (800x600px, JPEG 85%)
- Validação de arquivos (apenas imagens, máximo 5MB)
- Preview instantâneo
- Fallback para URLs externas

## 🚀 Deploy no Railway
1. Conectar repositório no Railway
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. Railway detecta automaticamente a porta

## 🛠️ APIs Disponíveis
- `POST /api/upload` - Upload de imagem
- `GET /api/images` - Listar imagens
- `DELETE /api/images/:fileName` - Deletar imagem

## 📱 Mobile-First
Todo o design foi pensado para mobile primeiro, incluindo:
- Interface de upload otimizada para celular
- Navegação touch-friendly
- Layout responsivo
- Formulários adaptados para mobile