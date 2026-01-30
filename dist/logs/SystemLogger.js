//Logger Global do Sistema.
export class SystemLogger {
    static logs = [];
    /**
     * Adiciona uma mensagem ao log com um carimbo de data/hora (timestamp).
     * @param message - A mensagem a ser registada.
     */
    static log(message) {
        const timestamp = new Date().toLocaleString();
        const formattedMessage = `[${timestamp}] ${message}`;
        SystemLogger.logs.push(formattedMessage);
        console.log(formattedMessage);
    }
    /**
     * Retorna uma cópia de todos os logs registados.
     * @returns {string[]} Array de mensagens de log.
     */
    static getLogs() {
        return [...SystemLogger.logs];
    }
    static clear() {
        SystemLogger.logs = [];
        SystemLogger.log("Histórico de logs limpo.");
    }
    constructor() { }
}
