import { SystemConfig } from '../services/SystemConfig.js';
import { SystemLogger } from '../logs/SystemLogger.js';
import { BaseEntity } from '../models/BaseEntity.js';

// Configuração e manipulação dos modais de informação do sistema

export function setupSystemModals() {
    const btnSystemInfo = document.getElementById('btnSystemInfo');
    const btnViewLogs = document.getElementById('btnViewLogs');

    console.log('btnSystemInfo:', btnSystemInfo);
    console.log('btnViewLogs:', btnViewLogs);
    
    const systemInfoModal = document.getElementById('systemInfoModal') as HTMLDialogElement;
    const logsModal = document.getElementById('logsModal') as HTMLDialogElement;
    
    const btnCloseSystemInfo = document.getElementById('btnCloseSystemInfo');
    const btnCloseLogs = document.getElementById('btnCloseLogs');
    
    const btnSetEnv = document.getElementById('btnSetEnv');
    const envSelect = document.getElementById('envSelect') as HTMLSelectElement;
    
    const btnClearLogs = document.getElementById('btnClearLogs');
    const btnRefreshLogs = document.getElementById('btnRefreshLogs');

    // MODAL DE INFORMAÇÕES DO SISTEMA
    if (btnSystemInfo && systemInfoModal) {
        btnSystemInfo.addEventListener('click', () => {
            renderSystemInfo();
            systemInfoModal.showModal();
        });
    }

    if (btnCloseSystemInfo && systemInfoModal) {
        btnCloseSystemInfo.addEventListener('click', () => {
            systemInfoModal.close();
        });
    }

    if (btnSetEnv && envSelect) {
        btnSetEnv.addEventListener('click', () => {
            const newEnv = envSelect.value;
            SystemConfig.setEnvironment(newEnv);
            
            renderSystemInfo();
            
            alert(`✅ Ambiente alterado para: ${newEnv}`);
        });
    }

    // MODAL DE LOGS
    if (btnViewLogs && logsModal) {
        btnViewLogs.addEventListener('click', () => {
            renderLogs();
            logsModal.showModal();
        });
    }

    if (btnCloseLogs && logsModal) {
        btnCloseLogs.addEventListener('click', () => {
            logsModal.close();
        });
    }

    if (btnClearLogs) {
        btnClearLogs.addEventListener('click', () => {
            if (confirm('⚠️ Tem certeza que deseja limpar todos os logs?')) {
                SystemLogger.clear();
                renderLogs();
            }
        });
    }

    if (btnRefreshLogs) {
        btnRefreshLogs.addEventListener('click', () => {
            renderLogs();
        });
    }
}

// Renderiza as informações do sistema no modal
function renderSystemInfo() {
    const info = SystemConfig.getInfo();
    const totalEntities = BaseEntity.getTotalEntities();
    
    const appName = document.getElementById('appName');
    const appVersion = document.getElementById('appVersion');
    const appEnvironment = document.getElementById('appEnvironment');
    const totalEntitiesElem = document.getElementById('totalEntities');
    const envSelect = document.getElementById('envSelect') as HTMLSelectElement;
    
    if (appName) appName.textContent = info.appName;
    if (appVersion) appVersion.textContent = info.version;
    if (appEnvironment) {
        appEnvironment.textContent = info.environment;
        
        appEnvironment.style.padding = '4px 8px';
        appEnvironment.style.borderRadius = '4px';
        appEnvironment.style.fontWeight = 'bold';
        
        if (info.environment === 'production') {
            appEnvironment.style.backgroundColor = '#27ae60';
            appEnvironment.style.color = 'white';
        } else if (info.environment === 'development') {
            appEnvironment.style.backgroundColor = '#3498db';
            appEnvironment.style.color = 'white';
        } else {
            appEnvironment.style.backgroundColor = '#f39c12';
            appEnvironment.style.color = 'white';
        }
    }
    
    if (totalEntitiesElem) {
        totalEntitiesElem.textContent = totalEntities.toString();
        totalEntitiesElem.style.fontWeight = 'bold';
        totalEntitiesElem.style.color = '#3498db';
        totalEntitiesElem.style.fontSize = '1.2em';
    }
    
    if (envSelect) {
        envSelect.value = info.environment;
    }
}

// Renderiza os logs do sistema no modal
function renderLogs() {
    const logsContent = document.getElementById('logsContent');
    if (!logsContent) return;
    
    const logs = SystemLogger.getLogs();
    
    if (logs.length === 0) {
        logsContent.innerHTML = `
            <div class="logs-empty">
                <p>📭 Nenhum log registado.</p>
            </div>
        `;
        return;
    }
    
    const logsHtml = logs
        .slice()
        .reverse()
        .map((log, index) => {
            let logClass = 'log-entry';
            if (log.includes('[Regra Negócio]')) logClass += ' log-business';
            if (log.includes('[Stats]')) logClass += ' log-stats';
            if (log.includes('[Task]')) logClass += ' log-task';
            if (log.includes('[SystemConfig]')) logClass += ' log-config';
            if (log.includes('Bloqueio')) logClass += ' log-warning';
            
            return `<div class="${logClass}" data-index="${index}">${escapeHtml(log)}</div>`;
        })
        .join('');
    
    logsContent.innerHTML = `
        <div class="logs-summary">
            <strong>Total de registos:</strong> ${logs.length}
        </div>
        ${logsHtml}
    `;
}

// Escapa HTML para prevenir XSS
function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
