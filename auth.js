// Sistema de Autenticação para Garden Rosas Decor
class AuthManager {
    constructor() {
        this.sessionKey = 'tiarosa_admin_session';
        this.credentialsKey = 'tiarosa_admin_credentials';
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutos
        this.init();
    }

    // Inicializa o sistema de autenticação
    init() {
        // Cria credenciais padrão se não existirem
        if (!localStorage.getItem(this.credentialsKey)) {
            this.setupDefaultCredentials();
        }
        
        // Verifica se há sessão ativa
        this.checkSession();
        
        // Auto-logout por inatividade
        this.setupAutoLogout();
    }

    // Configura credenciais padrão (Rosinha/324470)
    setupDefaultCredentials() {
        const defaultCredentials = {
            username: 'Rosinha',
            passwordHash: this.hashPassword('324470'),
            createdAt: Date.now()
        };
        localStorage.setItem(this.credentialsKey, JSON.stringify(defaultCredentials));
    }

    // Hash simples para senha (em produção usar algo mais seguro)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Converte para 32bit int
        }
        return hash.toString();
    }

    // Realiza login
    login(username, password) {
        try {
            const credentials = JSON.parse(localStorage.getItem(this.credentialsKey));
            const passwordHash = this.hashPassword(password);

            if (credentials.username === username && credentials.passwordHash === passwordHash) {
                const session = {
                    isAuthenticated: true,
                    loginTime: Date.now(),
                    lastActivity: Date.now(),
                    username: username
                };
                
                localStorage.setItem(this.sessionKey, JSON.stringify(session));
                this.onLoginSuccess();
                return { success: true, message: 'Login realizado com sucesso!' };
            } else {
                return { success: false, message: 'Usuário ou senha incorretos!' };
            }
        } catch (error) {
            return { success: false, message: 'Erro interno. Tente novamente.' };
        }
    }

    // Realiza logout
    logout() {
        localStorage.removeItem(this.sessionKey);
        this.onLogoutSuccess();
    }

    // Verifica se está autenticado
    isAuthenticated() {
        const session = this.getSession();
        if (!session || !session.isAuthenticated) {
            return false;
        }

        // Verifica se a sessão não expirou
        const now = Date.now();
        const timeSinceLastActivity = now - session.lastActivity;
        
        if (timeSinceLastActivity > this.sessionTimeout) {
            this.logout();
            return false;
        }

        // Atualiza última atividade
        this.updateLastActivity();
        return true;
    }

    // Obtém dados da sessão
    getSession() {
        try {
            const session = localStorage.getItem(this.sessionKey);
            return session ? JSON.parse(session) : null;
        } catch (error) {
            return null;
        }
    }

    // Atualiza última atividade
    updateLastActivity() {
        const session = this.getSession();
        if (session) {
            session.lastActivity = Date.now();
            localStorage.setItem(this.sessionKey, JSON.stringify(session));
        }
    }

    // Verifica sessão existente
    checkSession() {
        if (this.isAuthenticated()) {
            const currentPage = window.location.pathname;
            if (currentPage.includes('admin.html') || currentPage.includes('dashboard')) {
                // Já está na página correta
                return;
            }
        }
    }

    // Configura auto-logout por inatividade
    setupAutoLogout() {
        // Monitora atividade do usuário
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        events.forEach(event => {
            document.addEventListener(event, () => {
                if (this.isAuthenticated()) {
                    this.updateLastActivity();
                }
            }, true);
        });

        // Verifica periodicamente se a sessão expirou
        setInterval(() => {
            if (this.getSession() && !this.isAuthenticated()) {
                this.showSessionExpiredMessage();
            }
        }, 60000); // Verifica a cada minuto
    }

    // Protege páginas administrativas
    requireAuth() {
        if (!this.isAuthenticated()) {
            this.redirectToLogin();
            return false;
        }
        return true;
    }

    // Redireciona para login
    redirectToLogin() {
        if (window.location.pathname.includes('admin.html')) {
            window.location.href = 'index.html';
        } else {
            this.showLoginModal();
        }
    }

    // Redireciona para admin após login
    redirectToAdmin() {
        window.location.href = 'admin.html';
    }

    // Eventos de callback
    onLoginSuccess() {
        document.dispatchEvent(new CustomEvent('adminLoginSuccess'));
    }

    onLogoutSuccess() {
        document.dispatchEvent(new CustomEvent('adminLogoutSuccess'));
    }

    // Mostra modal de login
    showLoginModal() {
        document.dispatchEvent(new CustomEvent('showLoginModal'));
    }

    // Mostra mensagem de sessão expirada
    showSessionExpiredMessage() {
        alert('Sua sessão expirou. Faça login novamente para continuar.');
        this.logout();
    }

    // Muda senha (para uso futuro)
    changePassword(currentPassword, newPassword) {
        try {
            const credentials = JSON.parse(localStorage.getItem(this.credentialsKey));
            const currentPasswordHash = this.hashPassword(currentPassword);

            if (credentials.passwordHash === currentPasswordHash) {
                credentials.passwordHash = this.hashPassword(newPassword);
                credentials.updatedAt = Date.now();
                localStorage.setItem(this.credentialsKey, JSON.stringify(credentials));
                return { success: true, message: 'Senha alterada com sucesso!' };
            } else {
                return { success: false, message: 'Senha atual incorreta!' };
            }
        } catch (error) {
            return { success: false, message: 'Erro ao alterar senha!' };
        }
    }

    // Obtém tempo restante da sessão
    getSessionTimeRemaining() {
        const session = this.getSession();
        if (!session) return 0;
        
        const now = Date.now();
        const timeSinceLastActivity = now - session.lastActivity;
        const timeRemaining = this.sessionTimeout - timeSinceLastActivity;
        
        return Math.max(0, timeRemaining);
    }

    // Formata tempo restante da sessão
    formatSessionTime(milliseconds) {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Instância global do gerenciador de autenticação
const authManager = new AuthManager();

// Função utilitária para verificar autenticação
function requireAuth() {
    return authManager.requireAuth();
}

// Função utilitária para logout
function adminLogout() {
    authManager.logout();
}