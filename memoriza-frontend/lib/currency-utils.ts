/**
 * Utilitários para formatação de valores monetários no padrão brasileiro (BRL)
 */

/**
 * Formata um valor string para o padrão brasileiro de moeda
 * @param value - String contendo números (pode conter caracteres não numéricos que serão removidos)
 * @returns String formatada no padrão brasileiro (ex: "199,90")
 * 
 * @example
 * formatCurrencyBRL("19990") // "199,90"
 * formatCurrencyBRL("199.90") // "199,90"
 */
export const formatCurrencyBRL = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "")

    if (!numbers) return ""

    // Converte para número e divide por 100 para ter os centavos
    const amount = parseFloat(numbers) / 100

    // Formata no padrão brasileiro
    return amount.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

/**
 * Converte um valor formatado em BRL para string numérica com ponto decimal
 * @param formatted - String formatada no padrão brasileiro (ex: "199,90")
 * @returns String numérica com ponto decimal (ex: "199.90")
 * 
 * @example
 * parseCurrencyBRL("199,90") // "199.90"
 * parseCurrencyBRL("1.999,90") // "1999.90"
 */
export const parseCurrencyBRL = (formatted: string): string => {
    // Remove tudo que não é número
    const numbers = formatted.replace(/\D/g, "")

    if (!numbers) return ""

    // Converte para número e divide por 100
    const amount = parseFloat(numbers) / 100

    // Retorna como string com ponto decimal para o backend
    return amount.toFixed(2)
}

/**
 * Formata um número para exibição no padrão brasileiro
 * @param value - Número a ser formatado
 * @returns String formatada no padrão brasileiro (ex: "199,90")
 * 
 * @example
 * formatNumberBRL(199.90) // "199,90"
 * formatNumberBRL(1999.90) // "1.999,90"
 */
export const formatNumberBRL = (value: number): string => {
    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}