//Logger Global do Sistema.
export class SystemLogger {
    private static logs: string[] = [];

    /**
     * Adiciona uma mensagem ao log com um carimbo de data/hora (timestamp).
     * @param message - A mensagem a ser registada.
     */
    public static log(message: string): void {
        const timestamp = new Date().toLocaleString();
        const formattedMessage = `[${timestamp}] ${message}`;
        
        SystemLogger.logs.push(formattedMessage);
        
        console.log(formattedMessage);
    }

    /**
     * Retorna uma cópia de todos os logs registados.
     * @returns {string[]} Array de mensagens de log.
     */
    public static getLogs(): string[] {
        return [...SystemLogger.logs];
    }

    public static clear(): void {
        SystemLogger.logs = [];
        SystemLogger.log("Histórico de logs limpo.");
    }

    private constructor() {}
}