# Garden Rosas Decor - Site com Upload de Imagens

Site para a loja de flores artificiais e artigos religiosos com sistema administrativo e upload de imagens.

## 📁 Estrutura do Projeto
```
Site-da-Tia-Rosa/
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

## 📱 Mobile-First
Todo o design foi pensado para mobile primeiro, incluindo:
- Interface de upload otimizada para celular
- Navegação touch-friendly
- Layout responsivo
- Formulários adaptados para mobile