/**
 * Classe de configuração central do sistema.
 * Implementada seguindo o padrão Static para garantir que os dados de 
 * configuração sejam únicos e acessíveis globalmente sem instâncias.
 */
export class SystemConfig {
    // Propriedades estáticas obrigatórias com valores padrão
    public static appName: string = "Task Management System";
    public static version: string = "1.0.0";
    public static environment: string = "development";

    /**
     * Define o ambiente do sistema (ex: 'production', 'development', 'test').
     * @param env - String representando o novo ambiente.
     */
    public static setEnvironment(env: string): void {
        SystemConfig.environment = env;
        // Mantemos um log interno para rastrear mudanças de configuração em tempo real
        console.log(`[SystemConfig] Environment updated to: ${SystemConfig.environment}`);
    }

    /**
     * Retorna um snapshot das informações principais da aplicação.
     * Útil para logs de erro ou exibição de metadados na UI.
     */
    public static getInfo(): { appName: string; version: string; environment: string } {
        return {
            appName: SystemConfig.appName,
            version: SystemConfig.version,
            environment: SystemConfig.environment
        };
    }

    // Nota: Não existe constructor aqui, pois a classe não deve ser instanciada.
}