/**
 * GlobalValidators - Validações globais reutilizáveis
 *
 * Classe utilitária com métodos estáticos para validações comuns
 * usadas em todo o sistema.
 */
export class GlobalValidators {
    /**
     * Valida se um email tem formato válido
     * @param email - String com o email a validar
     * @returns true se o email for válido, false caso contrário
     *
     * @example
     * GlobalValidators.isValidEmail("user@example.com") // true
     * GlobalValidators.isValidEmail("invalid-email") // false
     */
    static isValidEmail(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }
        // Regex básico para validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }
    /**
     * Verifica se um texto não está vazio (após remover espaços)
     * @param text - String a verificar
     * @returns true se o texto não estiver vazio, false caso contrário
     *
     * @example
     * GlobalValidators.isNonEmpty("Hello") // true
     * GlobalValidators.isNonEmpty("   ") // false
     * GlobalValidators.isNonEmpty("") // false
     */
    static isNonEmpty(text) {
        if (text === null || text === undefined) {
            return false;
        }
        if (typeof text !== 'string') {
            return false;
        }
        return text.trim().length > 0;
    }
    /**
     * Verifica se um número é positivo (maior que zero)
     * @param value - Número a verificar
     * @returns true se o número for positivo, false caso contrário
     *
     * @example
     * GlobalValidators.isPositiveNumber(10) // true
     * GlobalValidators.isPositiveNumber(0) // false
     * GlobalValidators.isPositiveNumber(-5) // false
     */
    static isPositiveNumber(value) {
        if (typeof value !== 'number') {
            return false;
        }
        if (isNaN(value) || !isFinite(value)) {
            return false;
        }
        return value > 0;
    }
    /**
     * Verifica se um texto tem um comprimento mínimo
     * @param text - String a verificar
     * @param size - Tamanho mínimo requerido
     * @returns true se o texto tiver pelo menos 'size' caracteres, false caso contrário
     *
     * @example
     * GlobalValidators.minLength("Hello", 3) // true
     * GlobalValidators.minLength("Hi", 3) // false
     * GlobalValidators.minLength("   Test   ", 4) // true (conta após trim)
     */
    static minLength(text, size) {
        if (text === null || text === undefined) {
            return false;
        }
        if (typeof text !== 'string') {
            return false;
        }
        if (typeof size !== 'number' || size < 0) {
            return false;
        }
        return text.trim().length >= size;
    }
    /**
     * MÉTODOS AUXILIARES OPCIONAIS (não obrigatórios mas úteis)
     */
    /**
     * Valida se uma string corresponde a um formato de telefone português
     * @param phone - Número de telefone
     * @returns true se for válido
     */
    static isValidPortuguesePhone(phone) {
        if (!phone || typeof phone !== 'string') {
            return false;
        }
        // Remove espaços, hífens, e parênteses
        const cleaned = phone.replace(/[\s\-()]/g, '');
        // Formatos: 9 dígitos (telemóvel) ou com código país +351
        const phoneRegex = /^(\+351)?[29]\d{8}$/;
        return phoneRegex.test(cleaned);
    }
    /**
     * Valida se um valor está dentro de um intervalo
     * @param value - Valor a verificar
     * @param min - Valor mínimo (inclusivo)
     * @param max - Valor máximo (inclusivo)
     * @returns true se estiver no intervalo
     */
    static isInRange(value, min, max) {
        if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
            return false;
        }
        if (isNaN(value) || isNaN(min) || isNaN(max)) {
            return false;
        }
        return value >= min && value <= max;
    }
    /**
     * Valida se uma data é futura
     * @param date - Data a verificar
     * @returns true se a data for no futuro
     */
    static isFutureDate(date) {
        if (!(date instanceof Date)) {
            return false;
        }
        if (isNaN(date.getTime())) {
            return false;
        }
        return date.getTime() > Date.now();
    }
    /**
     * Valida se uma string contém apenas letras e espaços
     * @param text - Texto a verificar
     * @returns true se contiver apenas letras
     */
    static isAlphabetic(text) {
        if (!text || typeof text !== 'string') {
            return false;
        }
        const alphaRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
        return alphaRegex.test(text.trim());
    }
    /**
     * Valida se uma string é alfanumérica
     * @param text - Texto a verificar
     * @returns true se for alfanumérico
     */
    static isAlphanumeric(text) {
        if (!text || typeof text !== 'string') {
            return false;
        }
        const alphanumericRegex = /^[a-zA-Z0-9À-ÿ\s]+$/;
        return alphanumericRegex.test(text.trim());
    }
}
