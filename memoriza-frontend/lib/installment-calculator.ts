/**
 * Utilitário para buscar opções de parcelamento do backend
 * que consulta a API real do Mercado Pago
 */

export interface InstallmentOption {
    installments: number;
    installmentAmount: number;
    totalAmount: number;
    hasInterest: boolean;
    recommendedMessage?: string;
}

export interface InstallmentsResponse {
    options: InstallmentOption[];
    bestOption: InstallmentOption | null;
}

const API_BASE_URL = "/api-proxy";

// Cache local para evitar chamadas repetidas
const installmentsCache = new Map<string, InstallmentsResponse>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora em ms

/**
 * Busca opções de parcelamento da API do backend
 */
export async function fetchInstallmentsFromAPI(
    price: number,
): Promise<InstallmentsResponse> {
    const roundedPrice = Math.round(price * 100) / 100;
    const cacheKey = `installments_${roundedPrice}`;

    // Verifica cache local
    const cached = installmentsCache.get(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/installments?amount=${roundedPrice}`,
        );

        if (!response.ok) {
            throw new Error("API error");
        }

        const data: InstallmentsResponse = await response.json();

        // Cacheia localmente
        installmentsCache.set(cacheKey, data);

        // Remove do cache após 1 hora
        setTimeout(() => {
            installmentsCache.delete(cacheKey);
        }, CACHE_DURATION);

        return data;
    } catch (error) {
        // Silently handle API errors and return fallback
        return getFallbackInstallments(roundedPrice);
    }
}

/**
 * Retorna a melhor opção de parcelamento formatada para exibição
 */
export function getBestInstallmentDisplay(
    installmentsResponse: InstallmentsResponse,
): {
    text: string;
    maxInstallments: number;
    installmentAmount: number;
    totalAmount: number;
    hasInterest: boolean;
} {
    const bestOption = installmentsResponse.bestOption;

    if (!bestOption) {
        return {
            text: "",
            maxInstallments: 1,
            installmentAmount: 0,
            totalAmount: 0,
            hasInterest: false,
        };
    }

    const formattedAmount = formatCurrency(bestOption.installmentAmount);

    let text: string;
    if (bestOption.hasInterest) {
        text = `ou ${bestOption.installments}x de ${formattedAmount} com juros`;
    } else {
        text = `ou ${bestOption.installments}x de ${formattedAmount} sem juros`;
    }

    return {
        text,
        maxInstallments: bestOption.installments,
        installmentAmount: bestOption.installmentAmount,
        totalAmount: bestOption.totalAmount,
        hasInterest: bestOption.hasInterest,
    };
}

/**
 * Fallback: cálculo local simplificado
 */
function getFallbackInstallments(amount: number): InstallmentsResponse {
    const options: InstallmentOption[] = [];

    let maxInstallments = 12;
    if (amount < 30) maxInstallments = 3;
    else if (amount < 100) maxInstallments = 6;
    else if (amount < 300) maxInstallments = 10;

    for (let i = 1; i <= maxInstallments; i++) {
        const hasInterest = i > 3;
        let installmentAmount: number;
        let totalAmount: number;

        if (hasInterest) {
            const rate = 0.05;
            const factor = Math.pow(1 + rate, i);
            installmentAmount = (amount * factor * rate) / (factor - 1);
            totalAmount = installmentAmount * i;
        } else {
            installmentAmount = amount / i;
            totalAmount = amount;
        }

        options.push({
            installments: i,
            installmentAmount: Math.round(installmentAmount * 100) / 100,
            totalAmount: Math.round(totalAmount * 100) / 100,
            hasInterest,
        });
    }

    return {
        options,
        bestOption: options[options.length - 1] || null,
    };
}

/**
 * Formata um valor numérico para moeda brasileira
 */
function formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}
