export class HistoryLog {
    private logs: string[] = [];

    addLog(message: string): void {
        const timestamp = new Date().toLocaleString('pt-PT');
        const formattedMessage = `[${timestamp}] ${message}`;
        this.logs.push(formattedMessage);
        
        console.log(`%c📜 Log: ${formattedMessage}`, "color: #7f8c8d; font-style: italic;");
    }

    getLogs(): string[] {
        return [...this.logs];
    }

    clearLogs(): void {
        this.logs = [];
    }
}

export const auditLog = new HistoryLog();