/**
 * Classe de configuração central do sistema.
 * Implementada seguindo o padrão Static para garantir que os dados de
 * configuração sejam únicos e acessíveis globalmente sem instâncias.
 */
export class SystemConfig {
    // Propriedades estáticas obrigatórias com valores padrão
    static appName = "Task Management System";
    static version = "1.0.0";
    static environment = "development";
    /**
     * Define o ambiente do sistema (ex: 'production', 'development', 'test').
     * @param env - String representando o novo ambiente.
     */
    static setEnvironment(env) {
        SystemConfig.environment = env;
        console.log(`[SystemConfig] Environment updated to: ${SystemConfig.environment}`);
    }
    /**
     * Retorna um snapshot das informações principais da aplicação.
     * Útil para logs de erro ou exibição de metadados na UI.
     */
    static getInfo() {
        return {
            appName: SystemConfig.appName,
            version: SystemConfig.version,
            environment: SystemConfig.environment
        };
    }
}
