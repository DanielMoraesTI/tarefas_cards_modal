export class HistoryLog {
    logs = [];
    addLog(message) {
        const timestamp = new Date().toLocaleString('pt-PT');
        const formattedMessage = `[${timestamp}] ${message}`;
        this.logs.push(formattedMessage);
        console.log(`%c📜 Log: ${formattedMessage}`, "color: #7f8c8d; font-style: italic;");
    }
    getLogs() {
        return [...this.logs];
    }
    clearLogs() {
        this.logs = [];
    }
}
export const auditLog = new HistoryLog();
