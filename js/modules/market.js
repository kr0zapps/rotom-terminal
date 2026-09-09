// js/modules/market.js - PokéMMO Rotom Terminal GTL Market & Seed Profitability Module
import { formatMoney } from '../utils/format.js';
import { t, currentLang } from '../i18n.js';
import { 
    EXTRACTION_PROFILES, 
    DEFAULT_BERRY_PRICES, 
    DEFAULT_SEED_PRICES, 
    SEED_COLORS, 
    SEED_NAMES, 
    SEED_NAMES_EN,
    getSeedName, 
    getBerryName 
} from './berries.js';

// =========================================================================
// NOMBRES EXPLÍCITOS DE BAYAS PARA EVITAR DESFASES DE DICCIONARIO
// =========================================================================
export const BERRY_LABELS_ES = {
    cheri: 'Zreza (Cheri)',
    pecha: 'Meloc (Pecha)',
    rawst: 'Safre (Rawst)',
    chesto: 'Atania (Chesto)',
    aspear: 'Perasi (Aspear)',
    leppa: 'Zanama (Leppa)',
    lum: 'Ziuela (Lum)',
    sitrus: 'Zidra (Sitrus)',
    pomeg: 'Grana (Pomeg)',
    kelpsy: 'Algama (Kelpsy)',
    qualot: 'Ispero (Qualot)',
    hondew: 'Meluce (Hondew)',
    grepa: 'Uva (Grepa)',
    tamato: 'Tamate (Tamato)'
};

export const BERRY_LABELS_EN = {
    cheri: 'Cheri Berry',
    pecha: 'Pecha Berry',
    rawst: 'Rawst Berry',
    chesto: 'Chesto Berry',
    aspear: 'Aspear Berry',
    leppa: 'Leppa Berry',
    lum: 'Lum Berry',
    sitrus: 'Sitrus Berry',
    pomeg: 'Pomeg Berry',
    kelpsy: 'Kelpsy Berry',
    qualot: 'Qualot Berry',
    hondew: 'Hondew Berry',
    grepa: 'Grepa Berry',
    tamato: 'Tamato Berry'
};

export const BERRY_GROWTH_HOURS = {
    cheri: 16, pecha: 16, rawst: 16, chesto: 16, aspear: 16,
    leppa: 20,
    lum: 44, sitrus: 44,
    pomeg: 44, kelpsy: 44, qualot: 44, hondew: 44, grepa: 44, tamato: 44
};

export const BERRY_CATEGORIES = {
    basic: ['cheri', 'pecha', 'rawst', 'chesto', 'aspear'],
    popular: ['leppa', 'lum', 'sitrus'],
    ev: ['pomeg', 'kelpsy', 'qualot', 'hondew', 'grepa', 'tamato']
};

export function getBerryDisplayName(key) {
    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
    if (isEn && BERRY_LABELS_EN[key]) return BERRY_LABELS_EN[key];
    return BERRY_LABELS_ES[key] || (typeof getBerryName === 'function' ? getBerryName(key) : key);
}

// =========================================================================
// OPCIONES DE RECETAS DE REPLANTACIÓN (Selección de Semillas por Parcela)
// =========================================================================
export const RECIPE_OPTIONS = {
    cheri: [
        { id: 'cheri_3plain', name: '3x Semilla Picante (Estándar)', nameEn: '3x Plain Spicy Seed (Standard)', reqs: [{ id: 'picante', qty: 3 }] },
        { id: 'cheri_1very1plain', name: '1x Muy Picante + 1x Picante', nameEn: '1x Very Spicy + 1x Plain Spicy', reqs: [{ id: 'v_picante', qty: 1 }, { id: 'picante', qty: 1 }] }
    ],
    pecha: [
        { id: 'pecha_3plain', name: '3x Semilla Dulce (Estándar)', nameEn: '3x Plain Sweet Seed (Standard)', reqs: [{ id: 'dulce', qty: 3 }] },
        { id: 'pecha_1very1plain', name: '1x Muy Dulce + 1x Dulce', nameEn: '1x Very Sweet + 1x Plain Sweet', reqs: [{ id: 'v_dulce', qty: 1 }, { id: 'dulce', qty: 1 }] }
    ],
    rawst: [
        { id: 'rawst_3plain', name: '3x Semilla Amarga (Estándar)', nameEn: '3x Plain Bitter Seed (Standard)', reqs: [{ id: 'amarga', qty: 3 }] },
        { id: 'rawst_1very1plain', name: '1x Muy Amarga + 1x Amarga', nameEn: '1x Very Bitter + 1x Plain Bitter', reqs: [{ id: 'v_amarga', qty: 1 }, { id: 'amarga', qty: 1 }] }
    ],
    chesto: [
        { id: 'chesto_3plain', name: '3x Semilla Seca (Estándar)', nameEn: '3x Plain Dry Seed (Standard)', reqs: [{ id: 'seca', qty: 3 }] },
        { id: 'chesto_1very1plain', name: '1x Muy Seca + 1x Seca', nameEn: '1x Very Dry + 1x Plain Dry', reqs: [{ id: 'v_seca', qty: 1 }, { id: 'seca', qty: 1 }] }
    ],
    aspear: [
        { id: 'aspear_3plain', name: '3x Semilla Ácida (Estándar)', nameEn: '3x Plain Sour Seed (Standard)', reqs: [{ id: 'acida', qty: 3 }] },
        { id: 'aspear_1very1plain', name: '1x Muy Ácida + 1x Ácida', nameEn: '1x Very Sour + 1x Plain Sour', reqs: [{ id: 'v_acida', qty: 1 }, { id: 'acida', qty: 1 }] }
    ],
    leppa: [
        { id: 'leppa_std', name: '1x Muy Picante + 1x Dulce + 1x Amarga (Más común)', nameEn: '1x Very Spicy + 1x Sweet + 1x Bitter (Common)', reqs: [{ id: 'v_picante', qty: 1 }, { id: 'dulce', qty: 1 }, { id: 'amarga', qty: 1 }] },
        { id: 'leppa_sweet', name: '1x Muy Dulce + 1x Picante + 1x Amarga', nameEn: '1x Very Sweet + 1x Spicy + 1x Bitter', reqs: [{ id: 'v_dulce', qty: 1 }, { id: 'picante', qty: 1 }, { id: 'amarga', qty: 1 }] },
        { id: 'leppa_bitter', name: '1x Muy Amarga + 1x Picante + 1x Dulce', nameEn: '1x Very Bitter + 1x Spicy + 1x Sweet', reqs: [{ id: 'v_amarga', qty: 1 }, { id: 'picante', qty: 1 }, { id: 'dulce', qty: 1 }] }
    ],
    lum: [
        { id: 'lum_std', name: '1x Muy Seca + 1x Muy Picante + 1x Muy Dulce', nameEn: '1x Very Dry + 1x Very Spicy + 1x Very Sweet', reqs: [{ id: 'v_seca', qty: 1 }, { id: 'v_picante', qty: 1 }, { id: 'v_dulce', qty: 1 }] }
    ],
    sitrus: [
        { id: 'sitrus_std', name: '1x Muy Dulce + 1x Muy Amarga + 1x Muy Ácida', nameEn: '1x Very Sweet + 1x Very Bitter + 1x Very Sour', reqs: [{ id: 'v_dulce', qty: 1 }, { id: 'v_amarga', qty: 1 }, { id: 'v_acida', qty: 1 }] }
    ],
    pomeg: [
        { id: 'pomeg_spicy', name: '1x Muy Picante + 1x Picante + 1x Amarga', nameEn: '1x Very Spicy + 1x Spicy + 1x Bitter', reqs: [{ id: 'v_picante', qty: 1 }, { id: 'picante', qty: 1 }, { id: 'amarga', qty: 1 }] },
        { id: 'pomeg_bitter', name: '1x Muy Amarga + 1x Amarga + 1x Picante', nameEn: '1x Very Bitter + 1x Bitter + 1x Spicy', reqs: [{ id: 'v_amarga', qty: 1 }, { id: 'amarga', qty: 1 }, { id: 'picante', qty: 1 }] }
    ],
    kelpsy: [
        { id: 'kelpsy_dry', name: '1x Muy Seca + 1x Seca + 1x Ácida', nameEn: '1x Very Dry + 1x Dry + 1x Sour', reqs: [{ id: 'v_seca', qty: 1 }, { id: 'seca', qty: 1 }, { id: 'acida', qty: 1 }] },
        { id: 'kelpsy_sour', name: '1x Muy Ácida + 1x Ácida + 1x Seca', nameEn: '1x Very Sour + 1x Sour + 1x Dry', reqs: [{ id: 'v_acida', qty: 1 }, { id: 'acida', qty: 1 }, { id: 'seca', qty: 1 }] }
    ],
    qualot: [
        { id: 'qualot_sweet', name: '1x Muy Dulce + 1x Dulce + 1x Picante', nameEn: '1x Very Sweet + 1x Sweet + 1x Spicy', reqs: [{ id: 'v_dulce', qty: 1 }, { id: 'dulce', qty: 1 }, { id: 'picante', qty: 1 }] },
        { id: 'qualot_spicy', name: '1x Muy Picante + 1x Picante + 1x Dulce', nameEn: '1x Very Spicy + 1x Spicy + 1x Sweet', reqs: [{ id: 'v_picante', qty: 1 }, { id: 'picante', qty: 1 }, { id: 'dulce', qty: 1 }] }
    ],
    hondew: [
        { id: 'hondew_bitter', name: '1x Muy Amarga + 1x Amarga + 1x Seca', nameEn: '1x Very Bitter + 1x Bitter + 1x Dry', reqs: [{ id: 'v_amarga', qty: 1 }, { id: 'amarga', qty: 1 }, { id: 'seca', qty: 1 }] },
        { id: 'hondew_dry', name: '1x Muy Seca + 1x Seca + 1x Amarga', nameEn: '1x Very Dry + 1x Dry + 1x Bitter', reqs: [{ id: 'v_seca', qty: 1 }, { id: 'seca', qty: 1 }, { id: 'amarga', qty: 1 }] }
    ],
    grepa: [
        { id: 'grepa_sour', name: '1x Muy Ácida + 1x Ácida + 1x Dulce', nameEn: '1x Very Sour + 1x Sour + 1x Sweet', reqs: [{ id: 'v_acida', qty: 1 }, { id: 'acida', qty: 1 }, { id: 'dulce', qty: 1 }] },
        { id: 'grepa_sweet', name: '1x Muy Dulce + 1x Dulce + 1x Ácida', nameEn: '1x Very Sweet + 1x Sweet + 1x Sour', reqs: [{ id: 'v_dulce', qty: 1 }, { id: 'dulce', qty: 1 }, { id: 'acida', qty: 1 }] }
    ],
    tamato: [
        { id: 'tamato_spicy', name: '1x Muy Picante + 1x Picante + 1x Seca', nameEn: '1x Very Spicy + 1x Spicy + 1x Dry', reqs: [{ id: 'v_picante', qty: 1 }, { id: 'picante', qty: 1 }, { id: 'seca', qty: 1 }] },
        { id: 'tamato_dry', name: '1x Muy Seca + 1x Seca + 1x Picante', nameEn: '1x Very Dry + 1x Dry + 1x Spicy', reqs: [{ id: 'v_seca', qty: 1 }, { id: 'seca', qty: 1 }, { id: 'picante', qty: 1 }] }
    ]
};

const STORAGE_PREFS_KEY = 'pokemmo_market_unified_prefs';

// =========================================================================
// ESTADO ÚNICO GLOBAL EN MEMORIA (SINGLE SOURCE OF TRUTH)
// =========================================================================
let marketState = null;
let currentRankingSort = 'hourly'; // 'hourly' | 'total'
let currentPriceHubTab = 'berries'; // 'berries' | 'seeds'

export function getMarketState() {
    if (!marketState) {
        try {
            const saved = localStorage.getItem(STORAGE_PREFS_KEY);
            if (saved) {
                marketState = JSON.parse(saved);
            }
        } catch(e) {
            console.warn('Error reading market state', e);
        }

        if (!marketState || typeof marketState !== 'object') {
            marketState = {
                berry: 'chesto',
                inputMode: 'exact',
                exactBerries: 350,
                plots: 72,
                yield: 5.5,
                replantMode: false,
                recipeId: 'chesto_3plain',
                berryPrices: {},
                seedPrices: {},
                toolCost: 350,
                gtlFee: 5
            };
        }
    }

    // Migración automática única para sincronizar los precios reales del GTL capturados
    const CURRENT_MARKET_VERSION = '2026_09_07_live_gtl_v4';
    if (!marketState.version || marketState.version !== CURRENT_MARKET_VERSION) {
        marketState.berryPrices = { ...DEFAULT_BERRY_PRICES };
        marketState.seedPrices = { ...DEFAULT_SEED_PRICES };
        marketState.version = CURRENT_MARKET_VERSION;
        saveMarketState();
    } else {
        marketState.berryPrices = { ...DEFAULT_BERRY_PRICES, ...(marketState.berryPrices || {}) };
        marketState.seedPrices = { ...DEFAULT_SEED_PRICES, ...(marketState.seedPrices || {}) };
    }
    
    if (!marketState.berry) marketState.berry = 'chesto';
    if (!marketState.inputMode) marketState.inputMode = 'exact';
    if (typeof marketState.exactBerries === 'undefined') marketState.exactBerries = 350;
    if (!marketState.plots) marketState.plots = 72;
    if (!marketState.yield) marketState.yield = 5.5;
    if (typeof marketState.toolCost === 'undefined') marketState.toolCost = 350;
    if (typeof marketState.gtlFee === 'undefined') marketState.gtlFee = 5;
    if (typeof marketState.replantMode === 'undefined') marketState.replantMode = false;

    // Asegurar que recipeId sea válido para la baya seleccionada
    const validRecipes = RECIPE_OPTIONS[marketState.berry] || [];
    if (!validRecipes.some(r => r.id === marketState.recipeId)) {
        marketState.recipeId = validRecipes[0]?.id || 'none';
    }

    return marketState;
}

export function saveMarketState() {
    if (!marketState) return;
    try {
        localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(marketState));
    } catch(e) {
        console.warn('Error saving market state', e);
    }
}

// =========================================================================
// RENDERIZADO PRINCIPAL DE LA VISTA
// =========================================================================
export function renderMarketView() {
    const state = getMarketState();
    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

    return `
        <div id="view-market" class="hidden animate-fade-in space-y-6 pb-12">
            <!-- Header Táctico -->
            <div class="flex flex-wrap justify-between items-center pb-4 border-b-2 border-[#2B2B2B] dark:border-[#35352E] gap-4">
                <div class="flex items-center gap-3">
                    <div class="p-2.5 rounded-xl bg-[#EDE8DC] dark:bg-[#2E2E27] border-2 border-[#2B2B2B] dark:border-[#35352E] shadow-sm flex-shrink-0">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/coin-case.png" class="w-7 h-7 pokemon-sprite" alt="GTL">
                    </div>
                    <div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <h1 class="text-xl sm:text-2xl font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8]">
                                ${isEn ? 'GTL Market: Berries vs. Seeds' : 'Mercado GTL: Bayas vs. Semillas'}
                            </h1>
                            <span class="text-[11px] font-mono uppercase bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] px-2 py-0.5 rounded font-bold">
                                ${isEn ? 'Economic Decision Hub' : 'Simulador Económico'}
                            </span>
                        </div>
                        <p class="text-xs font-sans text-[#5F5A4D] dark:text-[#A8A594] mt-0.5">
                            ${isEn ? 'Audit all 14 crops, edit market prices, compare selling raw berries vs. crushing, and find the most profitable paths.' : 'Audita las 14 especies, edita los precios de bayas y semillas, compara venta cruda vs. triturar y descubre qué te deja más dinero neto.'}
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <button type="button" id="btnResetGTL" class="px-3 py-1.5 text-xs font-tech font-bold uppercase bg-[#EDE8DC] dark:bg-[#2E2E27] hover:border-[#FFC800] border border-[#2B2B2B] dark:border-[#35352E] text-[#5F5A4D] dark:text-[#A8A594] rounded-lg transition cursor-pointer shadow-sm">
                        ${isEn ? 'Reset Defaults' : 'Restablecer Valores'}
                    </button>
                    <button type="button" id="btnSaveGTL" class="px-3.5 py-1.5 text-xs font-tech font-bold uppercase bg-[#10B981] hover:bg-[#059669] text-white rounded-lg transition cursor-pointer shadow-sm flex items-center gap-1.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        <span>${isEn ? 'Save Prices' : 'Guardar Precios'}</span>
                    </button>
                </div>
            </div>

            <!-- Panel 0: RANKING GLOBAL DE RENTABILIDAD (TODAS LAS BAYAS) -->
            <section class="panel p-5 rounded-xl border-2 border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#242420] shadow-[2px_3px_0px_#2B2B2B] dark:shadow-[2px_3px_0px_#000]">
                <div class="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#2B2B2B]/20 dark:border-[#35352E] gap-3">
                    <div>
                        <h2 class="text-sm font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8] flex items-center gap-2">
                            <span class="w-3 h-3 rounded-full bg-[#EAB308]"></span>
                            <span>${isEn ? 'Global Berry Profitability Ranking' : 'Ranking Global de Rentabilidad de Bayas'}</span>
                        </h2>
                        <p class="text-[11px] font-sans text-[#5F5A4D] dark:text-[#A8A594] mt-0.5">
                            ${isEn ? 'Simultaneous audit of all 14 crops based on live GTL prices and replanting recipes.' : 'Evaluación simultánea de las 14 especies con los precios actuales del GTL y descuento de replanteo.'}
                        </p>
                    </div>

                    <!-- Botones de ordenamiento -->
                    <div class="flex items-center gap-1.5 bg-[#EDE8DC] dark:bg-[#1E1E1A] p-1 rounded-lg border border-[#2B2B2B]/30 dark:border-[#35352E]">
                        <button type="button" id="btnSortHourly" onclick="window.toggleRankingSort('hourly')" 
                            class="px-2.5 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer ${currentRankingSort === 'hourly' ? 'bg-[#10B981] text-white shadow-sm' : 'text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8]'}">
                            ${isEn ? 'Sort by $/Hour' : 'Por $/Hora'}
                        </button>
                        <button type="button" id="btnSortTotal" onclick="window.toggleRankingSort('total')" 
                            class="px-2.5 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer ${currentRankingSort === 'total' ? 'bg-[#10B981] text-white shadow-sm' : 'text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8]'}">
                            ${isEn ? 'Sort by Total $' : 'Por Ganancia Lote'}
                        </button>
                    </div>
                </div>

                <!-- Podio TOP 3 -->
                <div id="rankingPodiumContainer" class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                    <!-- Inyectado dinámicamente -->
                </div>

                <!-- Tabla Completa de las 14 Bayas -->
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs font-mono border-collapse">
                        <thead>
                            <tr class="bg-[#EDE8DC] dark:bg-[#1E1E1A] text-[#5F5A4D] dark:text-[#A8A594] border-b-2 border-[#2B2B2B] dark:border-[#35352E]">
                                <th class="p-2.5 font-bold uppercase tracking-wider text-center w-12">#</th>
                                <th class="p-2.5 font-bold uppercase tracking-wider">${isEn ? 'Berry & Cycle' : 'Baya y Ciclo'}</th>
                                <th class="p-2.5 font-bold uppercase tracking-wider text-right">${isEn ? 'GTL Price (Editable)' : 'Precio GTL (Editable)'}</th>
                                <th class="p-2.5 font-bold uppercase tracking-wider text-center">${isEn ? 'Best Strategy' : 'Mejor Camino'}</th>
                                <th class="p-2.5 font-bold uppercase tracking-wider text-right">${isEn ? 'Batch Net Profit' : 'Beneficio Lote'}</th>
                                <th class="p-2.5 font-bold uppercase tracking-wider text-right">${isEn ? 'Profit / Hour' : 'Rendimiento / Hora'}</th>
                                <th class="p-2.5 font-bold uppercase tracking-wider text-center">${isEn ? 'Action' : 'Acción'}</th>
                            </tr>
                        </thead>
                        <tbody id="rankingTableBody" class="divide-y divide-[#2B2B2B]/10 dark:divide-[#35352E]/50">
                            <!-- Filas inyectadas dinámicamente -->
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Panel NUEVO: EDITOR CENTRAL DE PRECIOS GTL (BAYAS Y SEMILLAS) -->
            <section id="centralPriceHubSection" class="panel p-5 rounded-xl border-2 border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#242420] shadow-[2px_3px_0px_#2B2B2B] dark:shadow-[2px_3px_0px_#000]">
                <div class="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#2B2B2B]/20 dark:border-[#35352E] gap-3">
                    <div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <h2 class="text-sm font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8] flex items-center gap-2">
                                <span class="w-3 h-3 rounded-full bg-[#10B981]"></span>
                                <span>${isEn ? 'Central GTL Price Editor' : 'Editor Central de Precios GTL'}</span>
                            </h2>
                            <span class="text-[10px] font-mono uppercase bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded font-bold border border-[#10B981]/40">
                                ${isEn ? '14 Berries + 10 Seeds' : '14 Bayas + 10 Semillas'}
                            </span>
                        </div>
                        <p class="text-[11px] font-sans text-[#5F5A4D] dark:text-[#A8A594] mt-0.5">
                            ${isEn ? 'Edit all market prices in one place. Changes instantly update the ranking and simulation.' : 'Modifica todos los precios del mercado desde un solo lugar. Cualquier cambio actualiza el ranking y el simulador de inmediato.'}
                        </p>
                    </div>

                    <!-- Selector de Sub-Pestaña del Hub -->
                    <div class="flex items-center gap-1.5 bg-[#EDE8DC] dark:bg-[#1E1E1A] p-1 rounded-lg border border-[#2B2B2B]/30 dark:border-[#35352E]">
                        <button type="button" id="btnHubTabBerries" onclick="window.switchPriceHubTab('berries')" 
                            class="px-3 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer ${currentPriceHubTab === 'berries' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8]'}">
                            ${isEn ? 'Berries (14)' : 'Bayas (14)'}
                        </button>
                        <button type="button" id="btnHubTabSeeds" onclick="window.switchPriceHubTab('seeds')" 
                            class="px-3 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer ${currentPriceHubTab === 'seeds' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8]'}">
                            ${isEn ? 'Seeds (10)' : 'Semillas (10)'}
                        </button>
                    </div>
                </div>

                <!-- Contenedor Dinámico del Hub -->
                <div id="priceHubContentContainer">
                    <!-- Inyectado dinámicamente según la pestaña activa -->
                </div>
            </section>

            <!-- Panel 1: Parámetros del Cultivo & Receta de Replantación -->
            <section id="simulatorConfigSection" class="panel p-5 rounded-xl border-2 border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#242420] shadow-[2px_3px_0px_#2B2B2B] dark:shadow-[2px_3px_0px_#000]">
                <div class="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#2B2B2B]/20 dark:border-[#35352E] gap-2">
                    <h2 class="text-xs font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8] flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
                        <span>${isEn ? 'Berry Decision Engine' : 'Simulador y Motor de Decisión de Bayas'}</span>
                    </h2>

                    <!-- Selector de Modo: Mochila (Exacto) vs Parcelas -->
                    <div class="flex items-center gap-1 bg-[#EDE8DC] dark:bg-[#1E1E1A] p-1 rounded-lg border border-[#2B2B2B]/30 dark:border-[#35352E]">
                        <button type="button" id="btnModeExact" onclick="window.setMarketInputMode('exact')" 
                            class="px-3 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer ${state.inputMode === 'exact' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8]'}">
                            ${isEn ? 'Bag Inventory (Exact)' : 'Tengo Bayas en Mochila'}
                        </button>
                        <button type="button" id="btnModePlots" onclick="window.setMarketInputMode('plots')" 
                            class="px-3 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer ${state.inputMode !== 'exact' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8]'}">
                            ${isEn ? 'Plots Farming' : 'Cultivo por Parcelas'}
                        </button>
                    </div>
                </div>

                <!-- CONTROLES COMUNES Y ESPECÍFICOS -->
                <div class="space-y-4">
                    <!-- Fila Principal de Entradas -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
                        <!-- Selector de Baya (Siempre visible) -->
                        <div class="lg:col-span-4">
                            <label class="block text-[12px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594] mb-1">
                                ${isEn ? 'Berry Species' : 'Especie de Baya'}
                            </label>
                            <select id="marketBerrySelect" class="w-full p-2.5 text-xs font-mono rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px] cursor-pointer">
                                <optgroup label="${isEn ? 'Basic 16h Status Berries' : 'Básicas (16h - Estados)'}">
                                    <option value="cheri" ${state.berry === 'cheri' ? 'selected' : ''}>Zreza (Cheri) - Picante (Spicy)</option>
                                    <option value="pecha" ${state.berry === 'pecha' ? 'selected' : ''}>Meloc (Pecha) - Dulce (Sweet)</option>
                                    <option value="rawst" ${state.berry === 'rawst' ? 'selected' : ''}>Safre (Rawst) - Amarga (Bitter)</option>
                                    <option value="chesto" ${state.berry === 'chesto' ? 'selected' : ''}>Atania (Chesto) - Seca (Dry)</option>
                                    <option value="aspear" ${state.berry === 'aspear' ? 'selected' : ''}>Perasi (Aspear) - Ácida (Sour)</option>
                                </optgroup>
                                <optgroup label="${isEn ? 'Popular / High Demand' : 'Más Populares / Alta Demanda'}">
                                    <option value="leppa" ${state.berry === 'leppa' ? 'selected' : ''}>Zanama (Leppa) - PP / 20h</option>
                                    <option value="lum" ${state.berry === 'lum' ? 'selected' : ''}>Ziuela (Lum) - Estados / 44h</option>
                                    <option value="sitrus" ${state.berry === 'sitrus' ? 'selected' : ''}>Zidra (Sitrus) - PS / 44h</option>
                                </optgroup>
                                <optgroup label="${isEn ? 'EV-Reducing (44h)' : 'Reductoras de EVs (44h)'}">
                                    <option value="pomeg" ${state.berry === 'pomeg' ? 'selected' : ''}>Grana (Pomeg) - HP</option>
                                    <option value="kelpsy" ${state.berry === 'kelpsy' ? 'selected' : ''}>Algama (Kelpsy) - Ataque</option>
                                    <option value="qualot" ${state.berry === 'qualot' ? 'selected' : ''}>Ispero (Qualot) - Defensa</option>
                                    <option value="hondew" ${state.berry === 'hondew' ? 'selected' : ''}>Meluce (Hondew) - Atq. Esp.</option>
                                    <option value="grepa" ${state.berry === 'grepa' ? 'selected' : ''}>Uva (Grepa) - Def. Esp.</option>
                                    <option value="tamato" ${state.berry === 'tamato' ? 'selected' : ''}>Tamate (Tamato) - Velocidad</option>
                                </optgroup>
                            </select>
                        </div>

                        <!-- SECCIÓN MODO EXACTO: Cantidad Exacta de Bayas -->
                        <div id="wrapperExactControls" class="${state.inputMode === 'exact' ? '' : 'hidden'} lg:col-span-5">
                            <div class="flex justify-between items-center mb-1">
                                <label class="text-[12px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594]">
                                    ${isEn ? 'Exact Berries in Bag' : 'Cantidad Exacta en Mochila'}
                                </label>
                                <span class="text-[11px] font-mono font-bold text-[#2563EB] dark:text-[#60A5FA]">
                                    ${isEn ? 'Inventory Audit' : 'Auditoría en Mano'}
                                </span>
                            </div>
                            <input type="number" id="marketExactBerriesInput" value="${state.exactBerries || 350}" min="1" max="999999" 
                                class="w-full p-2.5 text-sm font-mono font-black text-center rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border-2 border-[#2563EB] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 shadow-inner">
                        </div>

                        <!-- SECCIÓN MODO PARCELAS: Parcelas y Rendimiento -->
                        <div id="wrapperPlotsControls" class="${state.inputMode !== 'exact' ? '' : 'hidden'} lg:col-span-5 grid grid-cols-2 gap-2">
                            <div>
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-[11px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594]">
                                        ${isEn ? 'Plots' : 'Parcelas'}
                                    </label>
                                    <div class="flex gap-1">
                                        <button type="button" onclick="window.setMarketPlots(72)" class="text-[9px] font-tech font-bold uppercase px-1 py-0.2 rounded bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] border border-[#2B2B2B] dark:border-[#35352E] cursor-pointer">72</button>
                                        <button type="button" onclick="window.setMarketPlots(84)" class="text-[9px] font-tech font-bold uppercase px-1 py-0.2 rounded bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] border border-[#2B2B2B] dark:border-[#35352E] cursor-pointer">84</button>
                                        <button type="button" onclick="window.setMarketPlots(156)" class="text-[9px] font-tech font-bold uppercase px-1 py-0.2 rounded bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] border border-[#2B2B2B] dark:border-[#35352E] cursor-pointer">156</button>
                                    </div>
                                </div>
                                <input type="number" id="marketPlotsInput" value="${state.plots || 72}" min="1" max="2000" class="w-full p-2.5 text-xs font-mono font-bold text-center rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px]">
                            </div>
                            <div>
                                <label class="block text-[11px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594] mb-1">
                                    ${isEn ? 'Yield/Plot' : 'Rendimiento'}
                                </label>
                                <select id="marketYieldSelect" class="w-full p-2.5 text-xs font-mono rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px] cursor-pointer">
                                    <option value="4.0" ${state.yield == 4.0 ? 'selected' : ''}>4.0 u.</option>
                                    <option value="5.0" ${state.yield == 5.0 ? 'selected' : ''}>5.0 u.</option>
                                    <option value="5.5" ${state.yield == 5.5 ? 'selected' : ''}>5.5 u.</option>
                                    <option value="6.0" ${state.yield == 6.0 ? 'selected' : ''}>6.0 u.</option>
                                    <option value="7.0" ${state.yield == 7.0 ? 'selected' : ''}>7.0 u.</option>
                                </select>
                            </div>
                        </div>

                        <!-- Selector de Receta & Switch Replantación -->
                        <div class="lg:col-span-3">
                            <div class="flex items-center justify-between mb-1">
                                <label class="text-[12px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594]">
                                    ${isEn ? 'Replanting Recipe' : 'Receta Replantar'}
                                </label>
                                <label class="flex items-center gap-1 cursor-pointer select-none">
                                    <input type="checkbox" id="marketReplantSwitch" ${state.replantMode ? 'checked' : ''} class="w-3.5 h-3.5 accent-[#10B981] cursor-pointer">
                                    <span class="text-[10px] font-mono font-bold text-[#10B981]">
                                        ${isEn ? 'Replant' : 'Replantar'}
                                    </span>
                                </label>
                            </div>
                            <select id="marketRecipeSelect" class="w-full p-2.5 text-xs font-mono rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px] cursor-pointer">
                                <!-- Inyectado dinámicamente según la baya -->
                            </select>
                        </div>
                    </div>

                    <!-- Botones Rápidos de Cantidad en Modo Exacto -->
                    <div id="wrapperExactPresets" class="${state.inputMode === 'exact' ? '' : 'hidden'} flex items-center gap-1.5 flex-wrap pt-1">
                        <span class="text-[11px] font-mono text-[#5F5A4D] dark:text-[#A8A594] font-bold mr-1">
                            ${isEn ? 'Quick presets:' : 'Ajustes rápidos:'}
                        </span>
                        <button type="button" onclick="window.setExactBerries(50)" class="px-2 py-0.5 text-xs font-mono font-bold rounded bg-[#EDE8DC] dark:bg-[#2E2E27] hover:border-[#2563EB] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] cursor-pointer">50</button>
                        <button type="button" onclick="window.setExactBerries(100)" class="px-2 py-0.5 text-xs font-mono font-bold rounded bg-[#EDE8DC] dark:bg-[#2E2E27] hover:border-[#2563EB] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] cursor-pointer">100</button>
                        <button type="button" onclick="window.setExactBerries(250)" class="px-2 py-0.5 text-xs font-mono font-bold rounded bg-[#EDE8DC] dark:bg-[#2E2E27] hover:border-[#2563EB] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] cursor-pointer">250</button>
                        <button type="button" onclick="window.setExactBerries(350)" class="px-2 py-0.5 text-xs font-mono font-bold rounded bg-[#EDE8DC] dark:bg-[#2E2E27] hover:border-[#2563EB] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] cursor-pointer">350</button>
                        <button type="button" onclick="window.setExactBerries(500)" class="px-2 py-0.5 text-xs font-mono font-bold rounded bg-[#EDE8DC] dark:bg-[#2E2E27] hover:border-[#2563EB] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] cursor-pointer">500</button>
                        <button type="button" onclick="window.setExactBerries(1000)" class="px-2 py-0.5 text-xs font-mono font-bold rounded bg-[#EDE8DC] dark:bg-[#2E2E27] hover:border-[#2563EB] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] cursor-pointer">1,000</button>
                        <button type="button" onclick="window.addExactBerries(100)" class="px-2 py-0.5 text-xs font-mono font-bold rounded bg-[#2563EB]/15 hover:bg-[#2563EB]/30 border border-[#2563EB]/40 text-[#2563EB] dark:text-[#60A5FA] cursor-pointer">+100</button>
                        <button type="button" onclick="window.addExactBerries(500)" class="px-2 py-0.5 text-xs font-mono font-bold rounded bg-[#2563EB]/15 hover:bg-[#2563EB]/30 border border-[#2563EB]/40 text-[#2563EB] dark:text-[#60A5FA] cursor-pointer">+500</button>
                    </div>
                </div>

                <!-- CARD DE VEREDICTO INMEDIATO ("¿TRITURAR O VENDER?") -->
                <div id="quickVerdictCard" class="mt-4 p-4 rounded-xl border-2 transition-all">
                    <!-- Inyectado dinámicamente -->
                </div>

                <!-- Costos de Herramienta & Comisión GTL -->
                <div class="mt-4 pt-3 border-t border-[#2B2B2B]/20 dark:border-[#35352E] grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex items-center justify-between bg-[#EDE8DC]/50 dark:bg-[#1E1E1A] p-2.5 rounded-lg border border-[#2B2B2B]/20 dark:border-[#35352E]">
                        <span class="text-xs font-mono text-[#5F5A4D] dark:text-[#A8A594]">
                            ${isEn ? 'Harvesting Tool (NPC Shop)' : 'Herramienta de Extracción (Floristería NPC)'}:
                        </span>
                        <div class="flex items-center gap-1 font-mono font-bold text-xs">
                            <span>$</span>
                            <input type="number" id="marketToolCost" value="${state.toolCost || 350}" min="0" step="10" class="w-20 p-1 text-right rounded bg-[#EDE8DC] dark:bg-[#2E2E27] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8]">
                        </div>
                    </div>
                    <div class="flex items-center justify-between bg-[#EDE8DC]/50 dark:bg-[#1E1E1A] p-2.5 rounded-lg border border-[#2B2B2B]/20 dark:border-[#35352E]">
                        <span class="text-xs font-mono text-[#5F5A4D] dark:text-[#A8A594]">
                            ${isEn ? 'GTL Sales Commission' : 'Comisión de Venta en el GTL'}:
                        </span>
                        <div class="flex items-center gap-1 font-mono font-bold text-xs">
                            <input type="number" id="marketGtlFee" value="${state.gtlFee || 5}" min="0" max="20" step="1" class="w-16 p-1 text-right rounded bg-[#EDE8DC] dark:bg-[#2E2E27] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8]">
                            <span>%</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Panel 2: Precios de Mercado GTL para la Baya Actual en Detalle -->
            <section class="panel p-5 rounded-xl border-2 border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#242420] shadow-[2px_3px_0px_#2B2B2B] dark:shadow-[2px_3px_0px_#000]">
                <div class="flex items-center justify-between pb-3 mb-4 border-b border-[#2B2B2B]/20 dark:border-[#35352E]">
                    <div>
                        <h2 class="text-xs font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8] flex items-center gap-2">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
                            <span>${isEn ? 'Current Selection GTL Breakdown' : 'Precios de la Baya Seleccionada y sus Semillas'}</span>
                        </h2>
                    </div>
                    <span id="gtlPriceStatusMsg" class="text-[11px] font-mono text-[#10B981] font-bold"></span>
                </div>

                <div id="marketPricesContainer" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <!-- Inyectado dinámicamente -->
                </div>
            </section>

            <!-- Panel 3: Desglose de Trituración y Replantación -->
            <section class="panel p-5 rounded-xl border-2 border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#242420] shadow-[2px_3px_0px_#2B2B2B] dark:shadow-[2px_3px_0px_#000]">
                <div class="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#2B2B2B]/20 dark:border-[#35352E] gap-2">
                    <h2 class="text-xs font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8] flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span>
                        <span>${isEn ? 'Crushing Yield & Seed Balance' : 'Rendimiento de Trituración y Balance de Semillas'}</span>
                    </h2>
                    <div id="harvestSummaryBadge" class="text-xs font-mono font-bold text-[#1C1C17] dark:text-[#F4F1E8] bg-[#EDE8DC] dark:bg-[#1E1E1A] px-2.5 py-1 rounded-lg border border-[#2B2B2B]/20 dark:border-[#35352E]">
                        <!-- Total de bayas y herramientas -->
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs font-mono border-collapse">
                        <thead>
                            <tr class="bg-[#EDE8DC] dark:bg-[#1E1E1A] text-[#5F5A4D] dark:text-[#A8A594] border-b-2 border-[#2B2B2B] dark:border-[#35352E]">
                                <th class="p-2.5 font-bold uppercase tracking-wider">${isEn ? 'Seed Type' : 'Tipo de Semilla'}</th>
                                <th class="p-2.5 font-bold uppercase tracking-wider text-center">${isEn ? 'Drop Rate / Berry' : 'Ratio / Baya'}</th>
                                <th class="p-2.5 font-bold uppercase tracking-wider text-right">${isEn ? 'Crushed Yield' : 'Obtenidas'}</th>
                                <th class="p-2.5 font-bold uppercase tracking-wider text-right">${isEn ? 'Replant Reserve' : 'Reserva Replantar'}</th>
                                <th class="p-2.5 font-bold uppercase tracking-wider text-right">${isEn ? 'GTL Net Surplus' : 'Excedente Neto GTL'}</th>
                                <th class="p-2.5 font-bold uppercase tracking-wider text-right">${isEn ? 'GTL Value' : 'Valor Neto'}</th>
                            </tr>
                        </thead>
                        <tbody id="seedYieldTableBody" class="divide-y divide-[#2B2B2B]/10 dark:divide-[#35352E]/50">
                            <!-- Filas inyectadas dinámicamente -->
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Panel 4: Comparador de Rentabilidad & Veredicto Destacado -->
            <section class="space-y-4">
                <!-- Veredicto Visual Gigante -->
                <div id="marketVerdictBanner" class="p-5 sm:p-6 rounded-2xl border-3 shadow-lg transition-all">
                    <!-- Inyectado dinámicamente -->
                </div>

                <!-- Tarjetas Lado a Lado -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Opción A: Venta de Bayas Crudas -->
                    <div class="panel p-5 rounded-xl border-2 border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#242420] shadow-[2px_3px_0px_#2B2B2B] dark:shadow-[2px_3px_0px_#000] flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between pb-3 mb-4 border-b border-[#2B2B2B]/20 dark:border-[#35352E]">
                                <h3 class="text-sm font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8] flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-full bg-[#3B82F6]"></span>
                                    <span>${isEn ? 'Option A: Sell Raw Berries' : 'Opción A: Vender Bayas Crudas'}</span>
                                </h3>
                                <span class="text-[11px] font-mono text-[#5F5A4D] dark:text-[#A8A594]">${isEn ? 'No crushing required' : 'Sin triturar'}</span>
                            </div>

                            <div class="space-y-2.5 text-xs font-mono">
                                <div class="flex justify-between text-[#5F5A4D] dark:text-[#A8A594]">
                                    <span>${isEn ? 'Gross Berry Sales' : 'Venta Bruta de Bayas'}:</span>
                                    <span id="rawGrossText" class="font-bold text-[#1C1C17] dark:text-[#F4F1E8] tabular-nums">$0</span>
                                </div>
                                <div class="flex justify-between text-[#E63946]">
                                    <span>${isEn ? 'GTL Commission' : 'Comisión GTL'} (<span id="rawFeePctText">5</span>%):</span>
                                    <span id="rawFeeText" class="font-bold tabular-nums">-$0</span>
                                </div>
                                <div class="flex justify-between text-[#5F5A4D] dark:text-[#A8A594] pt-1 border-t border-[#2B2B2B]/10 dark:border-[#35352E]">
                                    <span>${isEn ? 'Net GTL Berry Revenue' : 'Ingreso Neto GTL Bayas'}:</span>
                                    <span id="rawNetGtlText" class="font-bold text-[#1C1C17] dark:text-[#F4F1E8] tabular-nums">$0</span>
                                </div>
                                <div id="rawReplantRow" class="flex justify-between text-[#B45309] dark:text-[#F59E0B]">
                                    <span>${isEn ? 'Replanting Seeds Buy Cost' : 'Costo Comprar Semillas Replantar'}:</span>
                                    <span id="rawReplantCostText" class="font-bold tabular-nums">-$0</span>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 pt-4 border-t-2 border-[#2B2B2B] dark:border-[#35352E] flex items-center justify-between bg-[#EDE8DC]/60 dark:bg-[#1E1E1A] p-3 rounded-xl">
                            <div>
                                <span class="block text-[11px] font-mono font-bold uppercase text-[#5F5A4D] dark:text-[#A8A594]">${isEn ? 'Net Final Profit' : 'Beneficio Neto Real'}</span>
                                <span class="text-[10px] text-[#5F5A4D] dark:text-[#A8A594]">${isEn ? 'After replanting next run' : 'Cubriendo siguiente siembra'}</span>
                            </div>
                            <span id="rawFinalProfitText" class="text-xl sm:text-2xl font-mono font-black tabular-nums text-[#3B82F6]">$0</span>
                        </div>
                    </div>

                    <!-- Opción B: Triturar y Vender Semillas -->
                    <div class="panel p-5 rounded-xl border-2 border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#242420] shadow-[2px_3px_0px_#2B2B2B] dark:shadow-[2px_3px_0px_#000] flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between pb-3 mb-4 border-b border-[#2B2B2B]/20 dark:border-[#35352E]">
                                <h3 class="text-sm font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8] flex items-center gap-2">
                                    <span class="w-3 h-3 rounded-full bg-[#10B981]"></span>
                                    <span>${isEn ? 'Option B: Crush & Sell Surplus Seeds' : 'Opción B: Triturar y Vender Excedente'}</span>
                                </h3>
                                <span class="text-[11px] font-mono text-[#10B981] font-bold">${isEn ? 'Seeds reserved free' : 'Replantación gratis'}</span>
                            </div>

                            <div class="space-y-2.5 text-xs font-mono">
                                <div class="flex justify-between text-[#5F5A4D] dark:text-[#A8A594]">
                                    <span>${isEn ? 'Surplus Seed Gross Sales' : 'Venta Bruta Semillas Sobrantes'}:</span>
                                    <span id="crushGrossText" class="font-bold text-[#1C1C17] dark:text-[#F4F1E8] tabular-nums">$0</span>
                                </div>
                                <div class="flex justify-between text-[#E63946]">
                                    <span>${isEn ? 'GTL Commission' : 'Comisión GTL'} (<span id="crushFeePctText">5</span>%):</span>
                                    <span id="crushFeeText" class="font-bold tabular-nums">-$0</span>
                                </div>
                                <div class="flex justify-between text-[#E63946]">
                                    <span>${isEn ? 'Harvesting Tools Cost' : 'Gasto Herramientas Extracción'}:</span>
                                    <span id="crushToolsCostText" class="font-bold tabular-nums">-$0</span>
                                </div>
                                <div id="crushDeficitRow" class="flex justify-between text-[#B45309] dark:text-[#F59E0B] hidden">
                                    <span>${isEn ? 'Deficit Seeds Buy Cost' : 'Comprar Semillas Faltantes'}:</span>
                                    <span id="crushDeficitCostText" class="font-bold tabular-nums">-$0</span>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 pt-4 border-t-2 border-[#2B2B2B] dark:border-[#35352E] flex items-center justify-between bg-[#EDE8DC]/60 dark:bg-[#1E1E1A] p-3 rounded-xl">
                            <div>
                                <span class="block text-[11px] font-mono font-bold uppercase text-[#5F5A4D] dark:text-[#A8A594]">${isEn ? 'Net Final Profit' : 'Beneficio Neto Real'}</span>
                                <span class="text-[10px] text-[#10B981] font-bold">${isEn ? 'Seeds already in pocket' : 'Semillas de replanteo aseguradas'}</span>
                            </div>
                            <span id="crushFinalProfitText" class="text-xl sm:text-2xl font-mono font-black tabular-nums text-[#10B981]">$0</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    `;
}

// =========================================================================
// INICIALIZACIÓN Y EVENT LISTENERS REACTIVOS
// =========================================================================
export function initMarket() {
    const state = getMarketState();

    // Sincronizar dropdowns iniciales
    const berrySelect = document.getElementById('marketBerrySelect');
    if (berrySelect) {
        berrySelect.value = state.berry;
    }

    populateRecipeSelect(state.berry, state.recipeId);
    renderPriceCards(state.berry);
    renderPriceHubUI();

    // Eventos
    if (berrySelect) {
        berrySelect.addEventListener('change', (e) => {
            const newBerry = e.target.value;
            state.berry = newBerry;

            // Al cambiar de baya, actualizar receta por defecto
            const recipeOpts = RECIPE_OPTIONS[newBerry] || [];
            const hasValidRecipe = recipeOpts.some(r => r.id === state.recipeId);
            if (!hasValidRecipe && recipeOpts.length > 0) {
                state.recipeId = recipeOpts[0].id;
            }

            saveMarketState();
            populateRecipeSelect(newBerry, state.recipeId);
            renderPriceCards(newBerry);
            updateSimulation();
        });
    }

    const recipeSelect = document.getElementById('marketRecipeSelect');
    if (recipeSelect) {
        recipeSelect.addEventListener('change', (e) => {
            state.recipeId = e.target.value;
            saveMarketState();
            updateSimulation();
        });
    }

    const exactInput = document.getElementById('marketExactBerriesInput');
    if (exactInput) {
        exactInput.addEventListener('input', (e) => {
            state.exactBerries = parseInt(e.target.value) || 0;
            saveMarketState();
            updateSimulation();
        });
    }

    const plotsInput = document.getElementById('marketPlotsInput');
    if (plotsInput) {
        plotsInput.addEventListener('input', (e) => {
            state.plots = parseInt(e.target.value) || 0;
            saveMarketState();
            updateSimulation();
        });
    }

    const yieldSelect = document.getElementById('marketYieldSelect');
    if (yieldSelect) {
        yieldSelect.addEventListener('change', (e) => {
            state.yield = parseFloat(e.target.value) || 5.5;
            saveMarketState();
            updateSimulation();
        });
    }

    const replantSwitch = document.getElementById('marketReplantSwitch');
    if (replantSwitch) {
        replantSwitch.addEventListener('change', (e) => {
            state.replantMode = e.target.checked;
            saveMarketState();
            updateSimulation();
        });
    }

    const toolCostInput = document.getElementById('marketToolCost');
    if (toolCostInput) {
        toolCostInput.addEventListener('input', (e) => {
            state.toolCost = parseFloat(e.target.value) || 350;
            saveMarketState();
            updateSimulation();
        });
    }

    const feeInput = document.getElementById('marketGtlFee');
    if (feeInput) {
        feeInput.addEventListener('input', (e) => {
            state.gtlFee = parseFloat(e.target.value) || 5;
            saveMarketState();
            updateSimulation();
        });
    }

    const btnSave = document.getElementById('btnSaveGTL');
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            saveCurrentInputsToMemory();
            const msg = document.getElementById('gtlPriceStatusMsg');
            if (msg) {
                msg.innerText = typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Prices saved!' : '¡Precios guardados!';
                setTimeout(() => { if (msg) msg.innerText = ''; }, 3000);
            }
        });
    }

    const btnReset = document.getElementById('btnResetGTL');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            resetMarketPrices();
        });
    }

    window.setMarketInputMode = (mode) => {
        state.inputMode = mode;
        saveMarketState();

        const btnExact = document.getElementById('btnModeExact');
        const btnPlots = document.getElementById('btnModePlots');
        const wrapExact = document.getElementById('wrapperExactControls');
        const wrapExactPresets = document.getElementById('wrapperExactPresets');
        const wrapPlots = document.getElementById('wrapperPlotsControls');

        if (btnExact && btnPlots) {
            if (mode === 'exact') {
                btnExact.className = 'px-3 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer bg-[#2563EB] text-white shadow-sm';
                btnPlots.className = 'px-3 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8]';
            } else {
                btnPlots.className = 'px-3 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer bg-[#2563EB] text-white shadow-sm';
                btnExact.className = 'px-3 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8]';
            }
        }

        if (wrapExact) wrapExact.classList.toggle('hidden', mode !== 'exact');
        if (wrapExactPresets) wrapExactPresets.classList.toggle('hidden', mode !== 'exact');
        if (wrapPlots) wrapPlots.classList.toggle('hidden', mode === 'exact');

        updateSimulation();
    };

    window.setExactBerries = (num) => {
        const input = document.getElementById('marketExactBerriesInput');
        if (input) input.value = num;
        state.exactBerries = num;
        saveMarketState();
        updateSimulation();
    };

    window.addExactBerries = (delta) => {
        const current = parseInt(state.exactBerries) || 0;
        const nextVal = Math.max(1, current + delta);
        window.setExactBerries(nextVal);
    };

    window.setMarketPlots = (num) => {
        const pInput = document.getElementById('marketPlotsInput');
        if (pInput) pInput.value = num;
        state.plots = num;
        saveMarketState();
        updateSimulation();
    };

    window.toggleRankingSort = (sortMode) => {
        currentRankingSort = sortMode;
        const btnHourly = document.getElementById('btnSortHourly');
        const btnTotal = document.getElementById('btnSortTotal');
        if (btnHourly && btnTotal) {
            if (sortMode === 'hourly') {
                btnHourly.className = 'px-2.5 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer bg-[#10B981] text-white shadow-sm';
                btnTotal.className = 'px-2.5 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8]';
            } else {
                btnTotal.className = 'px-2.5 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer bg-[#10B981] text-white shadow-sm';
                btnHourly.className = 'px-2.5 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8]';
            }
        }
        renderGlobalRankingUI();
    };

    window.loadBerryIntoSimulator = (berryKey) => {
        const state = getMarketState();
        state.berry = berryKey;

        const recipeOpts = RECIPE_OPTIONS[berryKey] || [];
        if (recipeOpts.length > 0) {
            state.recipeId = recipeOpts[0].id;
        }

        saveMarketState();

        const berrySelect = document.getElementById('marketBerrySelect');
        if (berrySelect) berrySelect.value = berryKey;

        populateRecipeSelect(berryKey, state.recipeId);
        renderPriceCards(berryKey);
        updateSimulation();

        // Scroll suave al simulador detallado
        const simSection = document.getElementById('simulatorConfigSection');
        if (simSection) {
            simSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    window.switchPriceHubTab = (tabName) => {
        currentPriceHubTab = tabName;
        const btnBerries = document.getElementById('btnHubTabBerries');
        const btnSeeds = document.getElementById('btnHubTabSeeds');
        if (btnBerries && btnSeeds) {
            if (tabName === 'berries') {
                btnBerries.className = 'px-3 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer bg-[#2563EB] text-white shadow-sm';
                btnSeeds.className = 'px-3 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8]';
            } else {
                btnSeeds.className = 'px-3 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer bg-[#2563EB] text-white shadow-sm';
                btnBerries.className = 'px-3 py-1 rounded text-xs font-tech font-bold uppercase transition cursor-pointer text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8]';
            }
        }
        renderPriceHubUI();
    };

    window.updateHubBerryPrice = (berryKey, val) => {
        const p = Math.max(0, parseInt(val) || 0);
        const state = getMarketState();
        state.berryPrices[berryKey] = p;
        saveMarketState();

        // Si es la baya activa en el simulador, sincronizar su input
        if (state.berry === berryKey) {
            const bInput = document.getElementById('priceBerryInput');
            if (bInput && document.activeElement !== bInput) {
                bInput.value = p;
            }
        }

        // Sincronizar input en la tabla del ranking si existe
        const rankInp = document.getElementById(`rank-berry-price-${berryKey}`);
        if (rankInp && document.activeElement !== rankInp) {
            rankInp.value = p;
        }

        updateSimulation();
    };

    window.updateHubSeedPrice = (seedId, val) => {
        const p = Math.max(0, parseInt(val) || 0);
        const state = getMarketState();
        state.seedPrices[seedId] = p;
        saveMarketState();

        // Sincronizar tarjeta detallada si está visible
        const sInput = document.querySelector(`.seed-price-input[data-seedid="${seedId}"]`);
        if (sInput && document.activeElement !== sInput) {
            sInput.value = p;
        }

        updateSimulation();
    };

    window.updateRankingBerryPrice = (berryKey, val) => {
        window.updateHubBerryPrice(berryKey, val);
        
        // Sincronizar input del hub si está abierto
        const hubInp = document.getElementById(`hub-berry-${berryKey}`);
        if (hubInp && document.activeElement !== hubInp) {
            hubInp.value = Math.max(0, parseInt(val) || 0);
        }
    };

    updateSimulation();
}

export function populateRecipeSelect(berryKey, selectedId = null) {
    const recipeSelect = document.getElementById('marketRecipeSelect');
    if (!recipeSelect) return;

    const options = RECIPE_OPTIONS[berryKey] || [];
    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

    if (options.length === 0) {
        recipeSelect.innerHTML = `<option value="none">${isEn ? 'No standard recipe' : 'Sin receta estándar'}</option>`;
        return;
    }

    recipeSelect.innerHTML = options.map((opt, idx) => {
        const label = isEn && opt.nameEn ? opt.nameEn : opt.name;
        const isSelected = selectedId ? opt.id === selectedId : idx === 0;
        return `<option value="${opt.id}" ${isSelected ? 'selected' : ''}>${label}</option>`;
    }).join('');
}

export function renderPriceCards(berryKey) {
    const container = document.getElementById('marketPricesContainer');
    if (!container) return;

    const state = getMarketState();
    const profile = EXTRACTION_PROFILES[berryKey] || {};
    const recipeOpts = RECIPE_OPTIONS[berryKey] || [];
    
    // Todas las semillas asociadas (drops de extracción + ingredientes de recetas de esta baya)
    const seedIds = new Set(Object.keys(profile));
    recipeOpts.forEach(rec => {
        rec.reqs.forEach(rq => seedIds.add(rq.id));
    });

    const berryPrice = state.berryPrices[berryKey] ?? DEFAULT_BERRY_PRICES[berryKey] ?? 1000;
    const berryName = getBerryDisplayName(berryKey);

    let html = `
        <!-- Tarjeta Precio Baya -->
        <div class="bg-[#EDE8DC] dark:bg-[#2E2E27] p-3 rounded-xl border-2 border-[#2B2B2B] dark:border-[#35352E] shadow-sm flex flex-col justify-between">
            <div class="flex items-center gap-2 mb-2">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${berryKey}-berry.png" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cheri-berry.png'" class="w-6 h-6 pokemon-sprite" alt="${berryName}">
                <span class="text-xs font-mono font-bold text-[#1C1C17] dark:text-[#F4F1E8] truncate" title="${berryName}">
                    ${berryName}
                </span>
            </div>
            <div class="flex items-center gap-1.5">
                <span class="text-xs font-mono font-bold text-[#5F5A4D] dark:text-[#A8A594]">$</span>
                <input type="number" id="priceBerryInput" value="${berryPrice}" min="1" step="10" 
                    class="w-full p-2 text-xs font-mono font-bold text-right rounded-lg bg-[#FAF8F2] dark:bg-[#1A1A16] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] focus:border-[#FFC800] outline-none">
            </div>
        </div>
    `;

    // Tarjetas para cada semilla asociada
    seedIds.forEach(seedId => {
        const seedPrice = state.seedPrices[seedId] ?? DEFAULT_SEED_PRICES[seedId] ?? 750;
        const seedName = getSeedName(seedId);
        const colorClass = SEED_COLORS[seedId] || 'text-[#1C1C17] dark:text-[#F4F1E8]';

        html += `
            <div class="bg-[#EDE8DC]/70 dark:bg-[#20201C] p-3 rounded-xl border border-[#2B2B2B]/40 dark:border-[#35352E] shadow-sm flex flex-col justify-between">
                <div class="flex items-center gap-2 mb-2">
                    <span class="w-3 h-3 rounded-full border border-[#2B2B2B] bg-gradient-to-br from-white to-gray-400"></span>
                    <span class="text-xs font-mono font-bold ${colorClass} truncate" title="${seedName}">
                        ${seedName}
                    </span>
                </div>
                <div class="flex items-center gap-1.5">
                    <span class="text-xs font-mono font-bold text-[#5F5A4D] dark:text-[#A8A594]">$</span>
                    <input type="number" data-seedid="${seedId}" value="${seedPrice}" min="1" step="10" 
                        class="seed-price-input w-full p-2 text-xs font-mono font-bold text-right rounded-lg bg-[#FAF8F2] dark:bg-[#1A1A16] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] focus:border-[#FFC800] outline-none">
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Vincular inputs reactivamente
    const bInput = document.getElementById('priceBerryInput');
    if (bInput) {
        bInput.addEventListener('input', (e) => {
            const val = parseInt(e.target.value) || 0;
            state.berryPrices[berryKey] = val;
            saveMarketState();
            
            // Sincronizar input del hub
            const hubInp = document.getElementById(`hub-berry-${berryKey}`);
            if (hubInp && document.activeElement !== hubInp) {
                hubInp.value = val;
            }
            // Sincronizar input de la tabla
            const rankInp = document.getElementById(`rank-berry-price-${berryKey}`);
            if (rankInp && document.activeElement !== rankInp) {
                rankInp.value = val;
            }

            updateSimulation();
        });
    }

    container.querySelectorAll('.seed-price-input').forEach(inp => {
        inp.addEventListener('input', (e) => {
            const sId = e.target.getAttribute('data-seedid');
            const val = parseInt(e.target.value) || 0;
            state.seedPrices[sId] = val;
            saveMarketState();

            // Sincronizar input del hub
            const hubInp = document.getElementById(`hub-seed-${sId}`);
            if (hubInp && document.activeElement !== hubInp) {
                hubInp.value = val;
            }

            updateSimulation();
        });
    });
}

// =========================================================================
// RENDERIZADO DEL EDITOR CENTRAL DE PRECIOS (HUB)
// =========================================================================
export function renderPriceHubUI() {
    const container = document.getElementById('priceHubContentContainer');
    if (!container) return;

    const state = getMarketState();
    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

    if (currentPriceHubTab === 'berries') {
        let html = `
            <div class="space-y-4 animate-fade-in">
        `;

        // Secciones por categorías
        const categories = [
            { key: 'basic', label: isEn ? 'Basic 16h Status Berries' : 'Bayas Básicas (16h - Curan Estados)', color: 'border-l-4 border-l-[#2563EB]' },
            { key: 'popular', label: isEn ? 'High Demand & Utility Berries' : 'Bayas Más Populares y Utilidad (PP y Curación)', color: 'border-l-4 border-l-[#10B981]' },
            { key: 'ev', label: isEn ? 'EV-Reducing Berries (44h)' : 'Bayas Reductoras de EVs (44h)', color: 'border-l-4 border-l-[#8B5CF6]' }
        ];

        categories.forEach(cat => {
            html += `
                <div class="bg-[#EDE8DC]/40 dark:bg-[#1E1E1A] p-3.5 rounded-xl border border-[#2B2B2B]/20 dark:border-[#35352E]">
                    <h3 class="text-xs font-tech font-bold uppercase tracking-wider text-[#5F5A4D] dark:text-[#A8A594] mb-3 ${cat.color} pl-2">
                        ${cat.label}
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            `;

            BERRY_CATEGORIES[cat.key].forEach(berryKey => {
                const price = state.berryPrices[berryKey] ?? DEFAULT_BERRY_PRICES[berryKey] ?? 1000;
                const name = getBerryDisplayName(berryKey);
                const hours = BERRY_GROWTH_HOURS[berryKey] || 16;
                const isSelected = state.berry === berryKey;

                html += `
                    <div class="bg-[#FAF8F2] dark:bg-[#20201C] p-3 rounded-xl border-2 ${isSelected ? 'border-[#FFC800] shadow-[0_0_8px_rgba(255,200,0,0.3)]' : 'border-[#2B2B2B]/30 dark:border-[#35352E]'} shadow-sm flex flex-col justify-between transition">
                        <div class="flex items-center justify-between gap-1 mb-2">
                            <div class="flex items-center gap-1.5 truncate">
                                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${berryKey}-berry.png" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cheri-berry.png'" class="w-6 h-6 pokemon-sprite flex-shrink-0" alt="">
                                <span class="text-xs font-mono font-bold text-[#1C1C17] dark:text-[#F4F1E8] truncate" title="${name}">
                                    ${name}
                                </span>
                            </div>
                            <span class="text-[10px] font-mono text-[#5F5A4D] dark:text-[#A8A594] bg-[#EDE8DC] dark:bg-[#1E1E1A] px-1 rounded flex-shrink-0">
                                ${hours}h
                            </span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="text-xs font-mono font-bold text-[#5F5A4D] dark:text-[#A8A594]">$</span>
                            <input type="number" id="hub-berry-${berryKey}" value="${price}" min="1" step="10" 
                                oninput="window.updateHubBerryPrice('${berryKey}', this.value)"
                                class="w-full p-1.5 text-xs font-mono font-bold text-right rounded-lg bg-[#EDE8DC] dark:bg-[#1A1A16] border border-[#2B2B2B]/40 dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] focus:border-[#FFC800] outline-none">
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    } else {
        // Tab de Semillas (10 semillas de extracción)
        const simpleSeeds = ['picante', 'dulce', 'seca', 'amarga', 'acida'];
        const verySeeds = ['v_picante', 'v_dulce', 'v_seca', 'v_amarga', 'v_acida'];

        let html = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in">
                <!-- Columna 1: Semillas Simples (1 punto) -->
                <div class="bg-[#EDE8DC]/40 dark:bg-[#1E1E1A] p-3.5 rounded-xl border border-[#2B2B2B]/20 dark:border-[#35352E]">
                    <h3 class="text-xs font-tech font-bold uppercase tracking-wider text-[#5F5A4D] dark:text-[#A8A594] mb-3 border-l-4 border-l-[#10B981] pl-2">
                        ${isEn ? 'Plain Seeds (1 Point)' : 'Semillas Simples (1 Punto)'}
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        `;

        simpleSeeds.forEach(sId => {
            const price = state.seedPrices[sId] ?? DEFAULT_SEED_PRICES[sId] ?? 750;
            const name = getSeedName(sId);
            const colorClass = SEED_COLORS[sId] || 'text-[#1C1C17] dark:text-[#F4F1E8]';

            html += `
                <div class="bg-[#FAF8F2] dark:bg-[#20201C] p-2.5 rounded-xl border border-[#2B2B2B]/30 dark:border-[#35352E] shadow-sm flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2 truncate">
                        <span class="w-3 h-3 rounded-full border border-[#2B2B2B] bg-gradient-to-br from-white to-gray-400 flex-shrink-0"></span>
                        <span class="text-xs font-mono font-bold ${colorClass} truncate" title="${name}">
                            ${name}
                        </span>
                    </div>
                    <div class="flex items-center gap-1 flex-shrink-0 w-28">
                        <span class="text-xs font-mono font-bold text-[#5F5A4D] dark:text-[#A8A594]">$</span>
                        <input type="number" id="hub-seed-${sId}" value="${price}" min="1" step="10" 
                            oninput="window.updateHubSeedPrice('${sId}', this.value)"
                            class="w-full p-1.5 text-xs font-mono font-bold text-right rounded-lg bg-[#EDE8DC] dark:bg-[#1A1A16] border border-[#2B2B2B]/40 dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] focus:border-[#FFC800] outline-none">
                    </div>
                </div>
            `;
        });

        html += `
                    </div>
                </div>

                <!-- Columna 2: Semillas Muy (2 puntos) -->
                <div class="bg-[#EDE8DC]/40 dark:bg-[#1E1E1A] p-3.5 rounded-xl border border-[#2B2B2B]/20 dark:border-[#35352E]">
                    <h3 class="text-xs font-tech font-bold uppercase tracking-wider text-[#5F5A4D] dark:text-[#A8A594] mb-3 border-l-4 border-l-[#8B5CF6] pl-2">
                        ${isEn ? 'Very Seeds (2 Points / High Value)' : 'Semillas Muy (2 Puntos / Alto Valor)'}
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        `;

        verySeeds.forEach(sId => {
            const price = state.seedPrices[sId] ?? DEFAULT_SEED_PRICES[sId] ?? 1750;
            const name = getSeedName(sId);
            const colorClass = SEED_COLORS[sId] || 'text-[#1C1C17] dark:text-[#F4F1E8]';

            html += `
                <div class="bg-[#FAF8F2] dark:bg-[#20201C] p-2.5 rounded-xl border border-[#2B2B2B]/30 dark:border-[#35352E] shadow-sm flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2 truncate">
                        <span class="w-3 h-3 rounded-full border border-[#2B2B2B] bg-gradient-to-br from-white to-gray-400 flex-shrink-0"></span>
                        <span class="text-xs font-mono font-bold ${colorClass} truncate" title="${name}">
                            ${name}
                        </span>
                    </div>
                    <div class="flex items-center gap-1 flex-shrink-0 w-28">
                        <span class="text-xs font-mono font-bold text-[#5F5A4D] dark:text-[#A8A594]">$</span>
                        <input type="number" id="hub-seed-${sId}" value="${price}" min="1" step="10" 
                            oninput="window.updateHubSeedPrice('${sId}', this.value)"
                            class="w-full p-1.5 text-xs font-mono font-bold text-right rounded-lg bg-[#EDE8DC] dark:bg-[#1A1A16] border border-[#2B2B2B]/40 dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] focus:border-[#FFC800] outline-none">
                    </div>
                </div>
            `;
        });

        html += `
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }
}

export function saveCurrentInputsToMemory() {
    const state = getMarketState();
    const bInput = document.getElementById('priceBerryInput');
    if (bInput && state.berry) {
        state.berryPrices[state.berry] = parseInt(bInput.value) || DEFAULT_BERRY_PRICES[state.berry] || 1000;
    }
    document.querySelectorAll('.seed-price-input').forEach(inp => {
        const sId = inp.getAttribute('data-seedid');
        if (sId) {
            state.seedPrices[sId] = parseInt(inp.value) || DEFAULT_SEED_PRICES[sId] || 750;
        }
    });
    saveMarketState();
}

export function resetMarketPrices() {
    const state = getMarketState();
    state.berryPrices = { ...DEFAULT_BERRY_PRICES };
    state.seedPrices = { ...DEFAULT_SEED_PRICES };
    state.toolCost = 350;
    state.gtlFee = 5;
    saveMarketState();

    const toolCostInput = document.getElementById('marketToolCost');
    if (toolCostInput) toolCostInput.value = 350;

    const feeInput = document.getElementById('marketGtlFee');
    if (feeInput) feeInput.value = 5;

    renderPriceCards(state.berry);
    renderPriceHubUI();
    updateSimulation();
}

// =========================================================================
// CÁLCULO DEL RANKING GLOBAL DE RENTABILIDAD
// =========================================================================
export function computeGlobalRanking() {
    const state = getMarketState();
    const isExact = state.inputMode === 'exact';
    const plots = Math.max(1, state.plots || 72);
    const yieldVal = state.yield || 5.5;
    const replantMode = state.replantMode !== false;
    const toolCost = typeof state.toolCost !== 'undefined' ? state.toolCost : 350;
    const feePct = typeof state.gtlFee !== 'undefined' ? state.gtlFee : 5;
    const feeFactor = (100 - feePct) / 100;
    const totalBerries = isExact ? Math.max(1, state.exactBerries || 350) : Math.round(plots * yieldVal);

    const ranking = [];

    for (const [berryKey, hours] of Object.entries(BERRY_GROWTH_HOURS)) {
        const berryPrice = state.berryPrices[berryKey] ?? DEFAULT_BERRY_PRICES[berryKey] ?? 1000;
        const profile = EXTRACTION_PROFILES[berryKey] || {};
        const recipes = RECIPE_OPTIONS[berryKey] || [];

        // 1. Beneficio Venta Cruda
        const rawGross = totalBerries * berryPrice;
        const rawNetGtl = rawGross * feeFactor;
        let minReplantCost = Infinity;
        if (replantMode) {
            for (const r of recipes) {
                let cost = 0;
                for (const req of r.reqs) {
                    const sPrice = state.seedPrices[req.id] ?? DEFAULT_SEED_PRICES[req.id] ?? 750;
                    cost += req.qty * plots * sPrice;
                }
                if (cost < minReplantCost) minReplantCost = cost;
            }
        }
        if (minReplantCost === Infinity || !replantMode) minReplantCost = 0;
        const rawProfit = rawNetGtl - (replantMode ? minReplantCost : 0);

        // 2. Beneficio Trituración (Evaluar todas las recetas, elegir la más rentable)
        let bestCrushProfit = -Infinity;
        let bestRecipeId = null;

        for (const r of recipes) {
            const replantNeeds = {};
            if (replantMode) {
                for (const req of r.reqs) replantNeeds[req.id] = req.qty * plots;
            }

            let surplusGross = 0;
            let deficitCost = 0;
            const allIds = new Set([...Object.keys(profile), ...Object.keys(replantNeeds)]);

            for (const sId of allIds) {
                const produced = totalBerries * (profile[sId] || 0);
                const needed = replantNeeds[sId] || 0;
                const sPrice = state.seedPrices[sId] ?? DEFAULT_SEED_PRICES[sId] ?? 750;

                if (produced >= needed) {
                    surplusGross += (produced - needed) * sPrice;
                } else {
                    deficitCost += (needed - produced) * sPrice;
                }
            }

            const toolsExpense = totalBerries * toolCost;
            const surplusNetGtl = surplusGross * feeFactor;
            const crushProfit = surplusNetGtl - toolsExpense - deficitCost;

            if (crushProfit > bestCrushProfit) {
                bestCrushProfit = crushProfit;
                bestRecipeId = r.id;
            }
        }

        if (bestCrushProfit === -Infinity) bestCrushProfit = -999999;

        const isCrushBetter = bestCrushProfit > rawProfit;
        const bestProfit = isCrushBetter ? bestCrushProfit : rawProfit;
        const strategy = isCrushBetter ? 'crush' : 'raw';
        const profitPerHour = bestProfit / hours;
        const profitPerDay = profitPerHour * 24;

        ranking.push({
            berryKey,
            displayName: getBerryDisplayName(berryKey),
            hours,
            berryPrice,
            rawProfit: Math.round(rawProfit),
            crushProfit: Math.round(bestCrushProfit),
            bestProfit: Math.round(bestProfit),
            strategy,
            bestRecipeId,
            profitPerHour: Math.round(profitPerHour),
            profitPerDay: Math.round(profitPerDay)
        });
    }

    if (currentRankingSort === 'hourly') {
        ranking.sort((a, b) => b.profitPerHour - a.profitPerHour);
    } else {
        ranking.sort((a, b) => b.bestProfit - a.bestProfit);
    }

    return ranking;
}

export function renderGlobalRankingUI() {
    const tableBody = document.getElementById('rankingTableBody');
    const podiumContainer = document.getElementById('rankingPodiumContainer');
    if (!tableBody) return;

    const ranking = computeGlobalRanking();
    const state = getMarketState();
    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

    // 1. Podio TOP 3
    if (podiumContainer && ranking.length >= 3) {
        const top3 = ranking.slice(0, 3);
        const medals = [
            { pos: '1', border: 'border-[#EAB308]', bg: 'bg-[#EAB308]/10', tag: 'ORO / TOP 1', tagEn: 'GOLD / TOP 1', text: 'text-[#EAB308]' },
            { pos: '2', border: 'border-[#94A3B8]', bg: 'bg-[#94A3B8]/10', tag: 'PLATA / TOP 2', tagEn: 'SILVER / TOP 2', text: 'text-[#94A3B8]' },
            { pos: '3', border: 'border-[#D97706]', bg: 'bg-[#D97706]/10', tag: 'BRONCE / TOP 3', tagEn: 'BRONZE / TOP 3', text: 'text-[#D97706]' }
        ];

        let podiumHtml = '';
        top3.forEach((item, idx) => {
            const m = medals[idx];
            podiumHtml += `
                <div class="p-3.5 rounded-xl border-2 ${m.border} ${m.bg} shadow-sm flex items-center justify-between transition hover:scale-[1.01]">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg bg-[#FAF8F2] dark:bg-[#1A1A16] border border-[#2B2B2B]/30 dark:border-[#35352E] flex items-center justify-center flex-shrink-0 shadow-inner">
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.berryKey}-berry.png" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cheri-berry.png'" class="w-7 h-7 pokemon-sprite" alt="${item.displayName}">
                        </div>
                        <div>
                            <span class="text-[10px] font-mono font-black uppercase ${m.text}">${isEn ? m.tagEn : m.tag}</span>
                            <h4 class="text-xs font-mono font-bold text-[#1C1C17] dark:text-[#F4F1E8] truncate">${item.displayName}</h4>
                            <div class="flex items-center gap-1.5 mt-0.5">
                                <span class="text-[10px] font-mono px-1.5 py-0.2 rounded ${item.strategy === 'crush' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#3B82F6]/20 text-[#3B82F6]'} font-bold uppercase">
                                    ${item.strategy === 'crush' ? (isEn ? 'CRUSH' : 'TRITURAR') : (isEn ? 'RAW' : 'CRUDA')}
                                </span>
                                <span class="text-[10px] font-mono text-[#5F5A4D] dark:text-[#A8A594]">${item.hours}h</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <span class="text-sm sm:text-base font-mono font-black ${item.profitPerHour >= 0 ? 'text-[#10B981]' : 'text-[#E63946]'} block tabular-nums">
                            ${item.profitPerHour >= 0 ? '+' : ''}${formatMoney(item.profitPerHour)}/h
                        </span>
                        <span class="text-[10px] font-mono text-[#5F5A4D] dark:text-[#A8A594] block tabular-nums">
                            ${formatMoney(item.bestProfit)} ${isEn ? 'batch' : 'lote'}
                        </span>
                    </div>
                </div>
            `;
        });
        podiumContainer.innerHTML = podiumHtml;
    }

    // 2. Filas de la Tabla Completa con Inputs Editables Directos
    let tableHtml = '';
    ranking.forEach((item, idx) => {
        const isSelected = state.berry === item.berryKey;
        tableHtml += `
            <tr class="hover:bg-[#EDE8DC]/50 dark:hover:bg-[#20201C]/80 transition-colors ${isSelected ? 'bg-[#FFC800]/10 border-l-4 border-l-[#FFC800]' : ''}">
                <td class="p-2.5 text-center font-bold text-[#5F5A4D] dark:text-[#A8A594]">
                    #${idx + 1}
                </td>
                <td class="p-2.5">
                    <div class="flex items-center gap-2">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.berryKey}-berry.png" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cheri-berry.png'" class="w-5 h-5 pokemon-sprite" alt="">
                        <span class="font-bold text-[#1C1C17] dark:text-[#F4F1E8]">${item.displayName}</span>
                        <span class="text-[10px] font-mono bg-[#EDE8DC] dark:bg-[#1E1E1A] text-[#5F5A4D] dark:text-[#A8A594] px-1.5 py-0.5 rounded border border-[#2B2B2B]/20 dark:border-[#35352E]">
                            ${item.hours}h
                        </span>
                    </div>
                </td>
                <td class="p-2.5 text-right">
                    <div class="inline-flex items-center gap-1 bg-[#FAF8F2] dark:bg-[#1A1A16] border border-[#2B2B2B]/30 dark:border-[#35352E] rounded-lg px-2 py-1 focus-within:border-[#FFC800] transition shadow-inner">
                        <span class="text-xs font-mono text-[#5F5A4D] dark:text-[#A8A594] font-bold">$</span>
                        <input type="number" id="rank-berry-price-${item.berryKey}" value="${item.berryPrice}" min="1" step="10" 
                            oninput="window.updateRankingBerryPrice('${item.berryKey}', this.value)"
                            class="w-20 text-right font-mono font-bold text-xs bg-transparent text-[#1C1C17] dark:text-[#F4F1E8] outline-none">
                    </div>
                </td>
                <td class="p-2.5 text-center">
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${item.strategy === 'crush' ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40' : 'bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40'}">
                        ${item.strategy === 'crush' ? (isEn ? 'CRUSH SEEDS' : 'TRITURAR') : (isEn ? 'SELL RAW' : 'VENTA CRUDA')}
                    </span>
                </td>
                <td class="p-2.5 text-right font-bold tabular-nums ${item.bestProfit >= 0 ? 'text-[#1C1C17] dark:text-[#F4F1E8]' : 'text-[#E63946]'}">
                    ${item.bestProfit >= 0 ? '' : '-'}${formatMoney(Math.abs(item.bestProfit))}
                </td>
                <td class="p-2.5 text-right font-black tabular-nums ${item.profitPerHour >= 0 ? 'text-[#10B981]' : 'text-[#E63946]'}">
                    ${item.profitPerHour >= 0 ? '+' : '-'}${formatMoney(Math.abs(item.profitPerHour))}/h
                    <span class="block text-[10px] font-normal text-[#5F5A4D] dark:text-[#A8A594]">
                        (${formatMoney(item.profitPerDay)}/${isEn ? 'day' : 'día'})
                    </span>
                </td>
                <td class="p-2.5 text-center">
                    <button type="button" onclick="window.loadBerryIntoSimulator('${item.berryKey}')" 
                        class="px-2.5 py-1 text-[11px] font-tech font-bold uppercase rounded bg-[#EDE8DC] dark:bg-[#2E2E27] hover:bg-[#FFC800] hover:text-[#1C1C17] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] transition cursor-pointer shadow-sm">
                        ${isEn ? 'Simulate' : 'Simular'}
                    </button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = tableHtml;
}

// =========================================================================
// MOTOR DE SIMULACIÓN Y CÁLCULO FINANCIERO
// =========================================================================
export function updateSimulation() {
    const state = getMarketState();
    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

    // Sincronizar con el valor visual del selector de bayas si existe en DOM
    const berrySelect = document.getElementById('marketBerrySelect');
    if (berrySelect && berrySelect.value) {
        state.berry = berrySelect.value;
    }

    const recipeSelect = document.getElementById('marketRecipeSelect');
    if (recipeSelect && recipeSelect.value && recipeSelect.value !== 'none') {
        state.recipeId = recipeSelect.value;
    }

    const isExact = state.inputMode === 'exact';
    const berryKey = state.berry || 'chesto';
    const plots = Math.max(1, state.plots || 72);
    const yieldVal = state.yield || 5.5;
    const replantMode = state.replantMode !== false;
    const toolCost = typeof state.toolCost !== 'undefined' ? state.toolCost : 350;
    const feePct = typeof state.gtlFee !== 'undefined' ? state.gtlFee : 5;
    const feeFactor = (100 - feePct) / 100;

    const totalBerries = isExact ? Math.max(1, state.exactBerries || 350) : Math.round(plots * yieldVal);
    const profile = EXTRACTION_PROFILES[berryKey] || {};
    const recipeOpts = RECIPE_OPTIONS[berryKey] || [];
    const chosenRecipe = recipeOpts.find(r => r.id === state.recipeId) || recipeOpts[0];

    // Semillas requeridas para replantar
    const replantNeeds = {};
    if (replantMode && chosenRecipe) {
        chosenRecipe.reqs.forEach(req => {
            replantNeeds[req.id] = req.qty * plots;
        });
    }

    // Semillas producidas por trituración
    const crushedSeeds = {};
    Object.keys(profile).forEach(seedId => {
        crushedSeeds[seedId] = totalBerries * profile[seedId];
    });

    const relevantSeedIds = new Set([...Object.keys(profile), ...Object.keys(replantNeeds)]);
    const surplusSeeds = {};
    const deficitSeeds = {};
    let surplusGrossVal = 0;
    let deficitCost = 0;
    let replantBuyCost = 0;

    // Actualizar badge de cosecha total
    const summaryBadge = document.getElementById('harvestSummaryBadge');
    if (summaryBadge) {
        summaryBadge.innerHTML = `
            <span>${totalBerries.toLocaleString()} ${isEn ? (isExact ? 'berries in bag' : 'berries harvested') : (isExact ? 'bayas en mochila' : 'bayas cosechadas')}</span>
            <span class="text-[#5F5A4D] dark:text-[#A8A594] mx-1.5">&bull;</span>
            <span class="text-[#B45309] dark:text-[#F59E0B]">${totalBerries.toLocaleString()} ${isEn ? 'tools' : 'herramientas'} ($${(totalBerries * toolCost).toLocaleString()})</span>
        `;
    }

    // Llenar tabla de semillas
    const tableBody = document.getElementById('seedYieldTableBody');
    let tableHtml = '';

    relevantSeedIds.forEach(seedId => {
        const produced = crushedSeeds[seedId] || 0;
        const needed = replantNeeds[seedId] || 0;
        const seedPrice = state.seedPrices[seedId] ?? DEFAULT_SEED_PRICES[seedId] ?? 750;
        const seedName = getSeedName(seedId);
        const colorClass = SEED_COLORS[seedId] || '';
        const dropRatePct = ((profile[seedId] || 0) * 100).toFixed(0);

        replantBuyCost += needed * seedPrice;

        let surplus = 0;
        let deficit = 0;

        if (produced >= needed) {
            surplus = produced - needed;
            surplusSeeds[seedId] = surplus;
            surplusGrossVal += surplus * seedPrice;
        } else {
            deficit = needed - produced;
            deficitSeeds[seedId] = deficit;
            deficitCost += deficit * seedPrice;
        }

        const netVal = surplus * seedPrice * feeFactor;

        tableHtml += `
            <tr class="hover:bg-[#EDE8DC]/40 dark:hover:bg-[#20201C]/60 transition-colors">
                <td class="p-2.5 font-bold ${colorClass}">
                    ${seedName}
                </td>
                <td class="p-2.5 text-center text-[#5F5A4D] dark:text-[#A8A594]">
                    ${profile[seedId] ? `${dropRatePct}%` : '<span class="text-xs text-os-muted">-</span>'}
                </td>
                <td class="p-2.5 text-right font-bold text-[#1C1C17] dark:text-[#F4F1E8] tabular-nums">
                    ${produced.toFixed(1)} u.
                </td>
                <td class="p-2.5 text-right tabular-nums ${needed > 0 ? 'text-[#B45309] dark:text-[#F59E0B] font-bold' : 'text-[#5F5A4D] dark:text-[#A8A594]'}">
                    ${needed > 0 ? `-${needed.toLocaleString()} u.` : '0'}
                </td>
                <td class="p-2.5 text-right tabular-nums font-bold">
                    ${deficit > 0 
                        ? `<span class="text-[#E63946]">Faltan ${deficit.toFixed(1)} u.</span>` 
                        : `<span class="text-[#10B981]">+${surplus.toFixed(1)} u.</span>`}
                </td>
                <td class="p-2.5 text-right font-bold tabular-nums text-[#1C1C17] dark:text-[#F4F1E8]">
                    ${netVal > 0 ? formatMoney(Math.round(netVal)) : '$0'}
                </td>
            </tr>
        `;
    });

    if (tableBody) tableBody.innerHTML = tableHtml;

    // =========================================================================
    // CÁLCULO DE RESULTADOS FINALES Y COMPARATIVA DETALLADA
    // =========================================================================
    const berryPrice = state.berryPrices[berryKey] ?? DEFAULT_BERRY_PRICES[berryKey] ?? 1000;

    // Opción A: Venta Cruda
    const rawGross = totalBerries * berryPrice;
    const rawFee = rawGross * (feePct / 100);
    const rawNetGtl = rawGross - rawFee;
    const rawFinalProfit = rawNetGtl - (replantMode ? replantBuyCost : 0);

    // Opción B: Trituración & Venta de Excedentes
    const toolsExpense = totalBerries * toolCost;
    const surplusFee = surplusGrossVal * (feePct / 100);
    const surplusNetGtl = surplusGrossVal - surplusFee;
    const crushFinalProfit = surplusNetGtl - toolsExpense - deficitCost;

    // Actualizar Textos Opción A
    const rawGrossEl = document.getElementById('rawGrossText');
    const rawFeePctEl = document.getElementById('rawFeePctText');
    const rawFeeEl = document.getElementById('rawFeeText');
    const rawNetGtlEl = document.getElementById('rawNetGtlText');
    const rawReplantCostEl = document.getElementById('rawReplantCostText');
    const rawReplantRow = document.getElementById('rawReplantRow');
    const rawFinalProfitEl = document.getElementById('rawFinalProfitText');

    if (rawGrossEl) rawGrossEl.innerText = formatMoney(Math.round(rawGross));
    if (rawFeePctEl) rawFeePctEl.innerText = feePct;
    if (rawFeeEl) rawFeeEl.innerText = `-${formatMoney(Math.round(rawFee))}`;
    if (rawNetGtlEl) rawNetGtlEl.innerText = formatMoney(Math.round(rawNetGtl));
    if (rawReplantCostEl) rawReplantCostEl.innerText = `-${formatMoney(Math.round(replantBuyCost))}`;
    if (rawReplantRow) {
        if (replantMode && replantBuyCost > 0) rawReplantRow.classList.remove('hidden');
        else rawReplantRow.classList.add('hidden');
    }
    if (rawFinalProfitEl) rawFinalProfitEl.innerText = formatMoney(Math.round(rawFinalProfit));

    // Actualizar Textos Opción B
    const crushGrossEl = document.getElementById('crushGrossText');
    const crushFeePctEl = document.getElementById('crushFeePctText');
    const crushFeeEl = document.getElementById('crushFeeText');
    const crushToolsCostEl = document.getElementById('crushToolsCostText');
    const crushDeficitCostEl = document.getElementById('crushDeficitCostText');
    const crushDeficitRow = document.getElementById('crushDeficitRow');
    const crushFinalProfitEl = document.getElementById('crushFinalProfitText');

    if (crushGrossEl) crushGrossEl.innerText = formatMoney(Math.round(surplusGrossVal));
    if (crushFeePctEl) crushFeePctEl.innerText = feePct;
    if (crushFeeEl) crushFeeEl.innerText = `-${formatMoney(Math.round(surplusFee))}`;
    if (crushToolsCostEl) crushToolsCostEl.innerText = `-${formatMoney(Math.round(toolsExpense))}`;
    if (crushDeficitCostEl) crushDeficitCostEl.innerText = `-${formatMoney(Math.round(deficitCost))}`;
    if (crushDeficitRow) {
        if (deficitCost > 0) crushDeficitRow.classList.remove('hidden');
        else crushDeficitRow.classList.add('hidden');
    }
    if (crushFinalProfitEl) crushFinalProfitEl.innerText = formatMoney(Math.round(crushFinalProfit));

    // =========================================================================
    // VEREDICTOS TÁCTICOS (TARJETA RÁPIDA EN PANEL 1 + BANNER GIGANTE EN PANEL 4)
    // =========================================================================
    const diff = crushFinalProfit - rawFinalProfit;
    const absDiff = Math.abs(diff);
    const diffPct = rawFinalProfit > 0 ? ((absDiff / rawFinalProfit) * 100).toFixed(1) : 0;
    const diffPerBerry = (absDiff / totalBerries).toFixed(0);
    const isCrushBetter = diff > 0;

    // 1. Tarjeta Rápida de Veredicto Inmediato en Panel 1
    const quickCard = document.getElementById('quickVerdictCard');
    if (quickCard) {
        if (isCrushBetter) {
            quickCard.className = 'mt-4 p-4 rounded-xl border-2 border-[#10B981] bg-[#10B981]/15 dark:bg-[#064E3B]/40 shadow-md transition-all';
            quickCard.innerHTML = `
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div class="flex items-start gap-3">
                        <div class="p-2 rounded-lg bg-[#10B981] text-white flex-shrink-0 mt-0.5 shadow-sm">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                        </div>
                        <div>
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-[#10B981] text-white">
                                    ${isEn ? 'TACTICAL VERDICT' : 'VEREDICTO INMEDIATO'}
                                </span>
                                <span class="text-xs sm:text-sm font-tech font-black uppercase text-[#059669] dark:text-[#34D399]">
                                    ${isEn ? 'MORE PROFITABLE TO CRUSH SEEDS' : 'CONVIENE TRITURAR Y VENDER SEMILLAS'}
                                </span>
                            </div>
                            <p class="text-xs font-sans text-[#1C1C17] dark:text-[#E5E7EB] mt-1">
                                ${isEn
                                    ? `For <strong>${totalBerries.toLocaleString()} berries</strong>: crushing nets <strong>+${formatMoney(Math.round(absDiff))} more</strong> (+${diffPct}%, +$${diffPerBerry}/berry) than selling raw.`
                                    : `Para tus <strong>${totalBerries.toLocaleString()} bayas</strong>: triturarlas te da <strong>+${formatMoney(Math.round(absDiff))} más de ganancia limpia</strong> (+${diffPct}%, +$${diffPerBerry} por baya) que venderlas crudas.`
                                }
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 md:flex-col md:items-end justify-between border-t md:border-t-0 pt-2 md:pt-0 border-[#10B981]/30">
                        <div class="text-left md:text-right">
                            <span class="text-[10px] font-mono text-[#5F5A4D] dark:text-[#A8A594] uppercase block">${isEn ? 'Net Crushing Edge' : 'Ventaja Neta Triturar'}</span>
                            <span class="text-lg sm:text-xl font-mono font-black text-[#10B981] tabular-nums">+${formatMoney(Math.round(absDiff))}</span>
                        </div>
                        <div class="text-[11px] font-mono tabular-nums text-[#5F5A4D] dark:text-[#A8A594]">
                            <span>${isEn ? 'Crush Net' : 'Triturar'}: <strong class="text-[#10B981]">${formatMoney(Math.round(crushFinalProfit))}</strong></span>
                            <span class="mx-1">|</span>
                            <span>${isEn ? 'Raw Net' : 'Cruda'}: <strong class="text-[#3B82F6]">${formatMoney(Math.round(rawFinalProfit))}</strong></span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            quickCard.className = 'mt-4 p-4 rounded-xl border-2 border-[#3B82F6] bg-[#3B82F6]/15 dark:bg-[#1E3A8A]/40 shadow-md transition-all';
            quickCard.innerHTML = `
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div class="flex items-start gap-3">
                        <div class="p-2 rounded-lg bg-[#3B82F6] text-white flex-shrink-0 mt-0.5 shadow-sm">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div>
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-[#3B82F6] text-white">
                                    ${isEn ? 'TACTICAL VERDICT' : 'VEREDICTO INMEDIATO'}
                                </span>
                                <span class="text-xs sm:text-sm font-tech font-black uppercase text-[#2563EB] dark:text-[#60A5FA]">
                                    ${isEn ? 'MORE PROFITABLE TO SELL RAW BERRIES' : 'CONVIENE VENDER LAS BAYAS CRUDAS'}
                                </span>
                            </div>
                            <p class="text-xs font-sans text-[#1C1C17] dark:text-[#E5E7EB] mt-1">
                                ${isEn
                                    ? `For <strong>${totalBerries.toLocaleString()} berries</strong>: selling raw nets <strong>+${formatMoney(Math.round(absDiff))} more</strong> (+${diffPct}%) than crushing. Seed prices do not offset the $350 tool expense.`
                                    : `Para tus <strong>${totalBerries.toLocaleString()} bayas</strong>: venderlas crudas te deja <strong>+${formatMoney(Math.round(absDiff))} más</strong> (+${diffPct}%) que triturar. Los precios de las semillas no compensan los $350 de herramienta por baya.`
                                }
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 md:flex-col md:items-end justify-between border-t md:border-t-0 pt-2 md:pt-0 border-[#3B82F6]/30">
                        <div class="text-left md:text-right">
                            <span class="text-[10px] font-mono text-[#5F5A4D] dark:text-[#A8A594] uppercase block">${isEn ? 'Net Raw Edge' : 'Ventaja Venta Cruda'}</span>
                            <span class="text-lg sm:text-xl font-mono font-black text-[#3B82F6] tabular-nums">+${formatMoney(Math.round(absDiff))}</span>
                        </div>
                        <div class="text-[11px] font-mono tabular-nums text-[#5F5A4D] dark:text-[#A8A594]">
                            <span>${isEn ? 'Raw Net' : 'Cruda'}: <strong class="text-[#3B82F6]">${formatMoney(Math.round(rawFinalProfit))}</strong></span>
                            <span class="mx-1">|</span>
                            <span>${isEn ? 'Crush Net' : 'Triturar'}: <strong class="text-[#10B981]">${formatMoney(Math.round(crushFinalProfit))}</strong></span>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // 2. Banner Grande de Veredicto en Panel 4
    const banner = document.getElementById('marketVerdictBanner');
    if (banner) {
        if (isCrushBetter) {
            banner.className = 'p-5 sm:p-6 rounded-2xl border-2 border-[#10B981] bg-[#10B981]/15 dark:bg-[#064E3B]/40 shadow-lg text-[#1C1C17] dark:text-[#F4F1E8] transition-all';
            banner.innerHTML = `
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex items-start gap-3.5">
                        <div class="p-2.5 rounded-xl bg-[#10B981] text-white flex-shrink-0 shadow-sm mt-0.5">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                        </div>
                        <div>
                            <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#059669] dark:text-[#34D399] block mb-0.5">
                                ${isEn ? 'TACTICAL AUDIT: CRUSHING IS MORE PROFITABLE' : 'AUDITORÍA TÁCTICA: MÁS A CUENTA TRITURAR'}
                            </span>
                            <h4 class="text-lg sm:text-xl font-tech font-extrabold uppercase text-[#1C1C17] dark:text-[#F4F1E8]">
                                ${isEn ? 'CRUSH BERRIES AND SELL SURPLUS SEEDS' : 'TRITURA LAS BAYAS Y VENDE LAS SEMILLAS'}
                            </h4>
                            <p class="text-xs font-sans text-[#5F5A4D] dark:text-[#D1D5DB] mt-1 max-w-2xl leading-relaxed">
                                ${isEn
                                    ? `Crushing nets you <strong>+${formatMoney(Math.round(absDiff))} more</strong> (+${diffPct}%) than selling raw berries. ${replantMode ? `You secure your replanting seeds for all ${plots} plots and sell surplus on the GTL.` : 'All seeds produced are sold directly as surplus on the GTL.'}`
                                    : `Triturar te deja <strong>+${formatMoney(Math.round(absDiff))} más de ganancia limpia</strong> (+${diffPct}%) respecto a vender la baya cruda (+${diffPerBerry}$ por baya). ${replantMode ? `Además tus semillas para replantar las ${plots} parcelas quedan 100% aseguradas en tu inventario.` : 'Todas las semillas obtenidas se liquidan directamente en el GTL.'}`
                                }
                            </p>
                        </div>
                    </div>

                    <div class="bg-[#FAF8F2] dark:bg-[#242420] border-2 border-[#10B981] p-3.5 rounded-xl text-right flex-shrink-0 shadow-sm">
                        <span class="text-[11px] font-mono text-[#5F5A4D] dark:text-[#A8A594] uppercase font-bold block">${isEn ? 'Extra Net Advantage' : 'Ganancia Extra Neta'}</span>
                        <span class="text-2xl sm:text-3xl font-mono font-black text-[#10B981] tabular-nums">+${formatMoney(Math.round(absDiff))}</span>
                    </div>
                </div>
            `;
        } else {
            banner.className = 'p-5 sm:p-6 rounded-2xl border-2 border-[#3B82F6] bg-[#3B82F6]/15 dark:bg-[#1E3A8A]/40 shadow-lg text-[#1C1C17] dark:text-[#F4F1E8] transition-all';
            banner.innerHTML = `
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex items-start gap-3.5">
                        <div class="p-2.5 rounded-xl bg-[#3B82F6] text-white flex-shrink-0 shadow-sm mt-0.5">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div>
                            <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] block mb-0.5">
                                ${isEn ? 'TACTICAL AUDIT: RAW SALE IS MORE PROFITABLE' : 'AUDITORÍA TÁCTICA: MÁS A CUENTA VENDER CRUDA'}
                            </span>
                            <h4 class="text-lg sm:text-xl font-tech font-extrabold uppercase text-[#1C1C17] dark:text-[#F4F1E8]">
                                ${isEn ? 'SELL RAW BERRIES DIRECTLY ON GTL' : 'VENDE LAS BAYAS CRUDAS DIRECTAMENTE EN EL GTL'}
                            </h4>
                            <p class="text-xs font-sans text-[#5F5A4D] dark:text-[#D1D5DB] mt-1 max-w-2xl leading-relaxed">
                                ${isEn
                                    ? `Selling raw berries nets you <strong>+${formatMoney(Math.round(absDiff))} more</strong> (+${diffPct}%) than crushing. The $350 tool expense and current seed market prices make raw sale more profitable.`
                                    : `Vender las bayas crudas te deja <strong>+${formatMoney(Math.round(absDiff))} más</strong> (+${diffPct}%) que triturar. El gasto de herramientas ($350 c/u) y los precios actuales de las semillas no compensan la trituración para este lote.`
                                }
                            </p>
                        </div>
                    </div>

                    <div class="bg-[#FAF8F2] dark:bg-[#242420] border-2 border-[#3B82F6] p-3.5 rounded-xl text-right flex-shrink-0 shadow-sm">
                        <span class="text-[11px] font-mono text-[#5F5A4D] dark:text-[#A8A594] uppercase font-bold block">${isEn ? 'Raw Berry Advantage' : 'Ventaja Venta Cruda'}</span>
                        <span class="text-2xl sm:text-3xl font-mono font-black text-[#3B82F6] tabular-nums">+${formatMoney(Math.round(absDiff))}</span>
                    </div>
                </div>
            `;
        }
    }

    // =========================================================================
    // ACTUALIZAR EL RANKING GLOBAL DE RENTABILIDAD
    // =========================================================================
    renderGlobalRankingUI();
}
