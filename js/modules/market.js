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

function getMarketPrefs() {
    try {
        const saved = localStorage.getItem(STORAGE_PREFS_KEY);
        if (saved) return JSON.parse(saved);
    } catch(e) {}
    return {
        berry: 'cheri',
        plots: 72,
        yield: 5.5,
        replantMode: true,
        recipeId: 'cheri_3plain',
        berryPrices: { ...DEFAULT_BERRY_PRICES },
        seedPrices: { ...DEFAULT_SEED_PRICES },
        toolCost: 350,
        gtlFee: 5
    };
}

function saveMarketPrefs(prefs) {
    try {
        localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(prefs));
    } catch(e) {}
}

export function renderMarketView() {
    const prefs = getMarketPrefs();
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
                            ${isEn ? 'Compare selling raw berries vs. crushing into seeds, reserve replanting seeds per plot, and discover the most profitable path.' : 'Compara vender bayas crudas vs. triturar, descuenta las semillas para replantar y descubre qué opción te da más dinero neto en el GTL.'}
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

            <!-- Panel 1: Parámetros del Cultivo & Receta de Replantación -->
            <section class="panel p-5 rounded-xl border-2 border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#242420] shadow-[2px_3px_0px_#2B2B2B] dark:shadow-[2px_3px_0px_#000]">
                <div class="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#2B2B2B]/20 dark:border-[#35352E] gap-2">
                    <h2 class="text-xs font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8] flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#2563EB]"></span>
                        <span>${isEn ? 'Harvest & Replanting Parameters' : 'Parámetros de Cosecha y Replantación'}</span>
                    </h2>
                    
                    <!-- Switch Replantación -->
                    <label class="flex items-center gap-2 cursor-pointer select-none bg-[#EDE8DC] dark:bg-[#1E1E1A] px-2.5 py-1 rounded-lg border border-[#2B2B2B]/30 dark:border-[#35352E]">
                        <input type="checkbox" id="marketReplantSwitch" ${prefs.replantMode ? 'checked' : ''} class="w-4 h-4 accent-[#10B981] cursor-pointer">
                        <span class="text-xs font-mono font-bold text-[#1C1C17] dark:text-[#F4F1E8]">
                            ${isEn ? 'Reserve Seeds to Replant' : 'Descontar Semillas para Replantar'}
                        </span>
                    </label>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Selector de Baya -->
                    <div>
                        <label class="block text-[12px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594] mb-1">
                            ${isEn ? 'Berry Species' : 'Especie de Baya'}
                        </label>
                        <select id="marketBerrySelect" class="w-full p-2.5 text-xs font-mono rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px] cursor-pointer">
                            <optgroup label="${isEn ? 'Basic 16h Status Berries' : 'Básicas (16h - Estados)'}">
                                <option value="cheri" ${prefs.berry === 'cheri' ? 'selected' : ''}>Zreza (Cheri) - Picante (Spicy)</option>
                                <option value="pecha" ${prefs.berry === 'pecha' ? 'selected' : ''}>Meloc (Pecha) - Dulce (Sweet)</option>
                                <option value="rawst" ${prefs.berry === 'rawst' ? 'selected' : ''}>Safre (Rawst) - Amarga (Bitter)</option>
                                <option value="chesto" ${prefs.berry === 'chesto' ? 'selected' : ''}>Atania (Chesto) - Seca (Dry)</option>
                                <option value="aspear" ${prefs.berry === 'aspear' ? 'selected' : ''}>Perasi (Aspear) - Ácida (Sour)</option>
                            </optgroup>
                            <optgroup label="${isEn ? 'Popular / High Demand' : 'Más Populares / Alta Demanda'}">
                                <option value="leppa" ${prefs.berry === 'leppa' ? 'selected' : ''}>Zanama (Leppa) - PP / 20h</option>
                                <option value="lum" ${prefs.berry === 'lum' ? 'selected' : ''}>Ziuela (Lum) - Estados / 44h</option>
                                <option value="sitrus" ${prefs.berry === 'sitrus' ? 'selected' : ''}>Zidra (Sitrus) - PS / 44h</option>
                            </optgroup>
                            <optgroup label="${isEn ? 'EV-Reducing (44h)' : 'Reductoras de EVs (44h)'}">
                                <option value="pomeg" ${prefs.berry === 'pomeg' ? 'selected' : ''}>Grana (Pomeg) - HP</option>
                                <option value="kelpsy" ${prefs.berry === 'kelpsy' ? 'selected' : ''}>Algama (Kelpsy) - Ataque</option>
                                <option value="qualot" ${prefs.berry === 'qualot' ? 'selected' : ''}>Ispero (Qualot) - Defensa</option>
                                <option value="hondew" ${prefs.berry === 'hondew' ? 'selected' : ''}>Meluce (Hondew) - Atq. Esp.</option>
                                <option value="grepa" ${prefs.berry === 'grepa' ? 'selected' : ''}>Uva (Grepa) - Def. Esp.</option>
                                <option value="tamato" ${prefs.berry === 'tamato' ? 'selected' : ''}>Tamate (Tamato) - Velocidad</option>
                            </optgroup>
                        </select>
                    </div>

                    <!-- Parcelas con botones rápidos -->
                    <div>
                        <div class="flex justify-between items-center mb-1">
                            <label class="text-[12px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594]">
                                ${isEn ? 'Planted Plots' : 'Parcelas Sembradas'}
                            </label>
                            <div class="flex gap-1">
                                <button type="button" onclick="window.setMarketPlots(72)" class="text-[10px] font-tech font-bold uppercase px-1.5 py-0.5 rounded bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] hover:border-[#FFC800] border border-[#2B2B2B] dark:border-[#35352E] cursor-pointer">
                                    72
                                </button>
                                <button type="button" onclick="window.setMarketPlots(84)" class="text-[10px] font-tech font-bold uppercase px-1.5 py-0.5 rounded bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] hover:border-[#FFC800] border border-[#2B2B2B] dark:border-[#35352E] cursor-pointer">
                                    84 Hoenn
                                </button>
                                <button type="button" onclick="window.setMarketPlots(156)" class="text-[10px] font-tech font-bold uppercase px-1.5 py-0.5 rounded bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] hover:border-[#FFC800] border border-[#2B2B2B] dark:border-[#35352E] cursor-pointer">
                                    156 Teselia
                                </button>
                            </div>
                        </div>
                        <input type="number" id="marketPlotsInput" value="${prefs.plots || 72}" min="1" max="2000" class="w-full p-2.5 text-sm font-mono font-bold text-center rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px]">
                    </div>

                    <!-- Rendimiento por Parcela -->
                    <div>
                        <label class="block text-[12px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594] mb-1">
                            ${isEn ? 'Expected Yield (Berries/Plot)' : 'Rendimiento (Bayas/Parcela)'}
                        </label>
                        <select id="marketYieldSelect" class="w-full p-2.5 text-xs font-mono rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px] cursor-pointer">
                            <option value="4.0">4.0 bayas (${isEn ? 'Minimum' : 'Mínimo sin regar'})</option>
                            <option value="5.0">5.0 bayas (${isEn ? '1 watering' : 'Riego básico'})</option>
                            <option value="5.5" ${prefs.yield == 5.5 ? 'selected' : ''}>5.5 bayas (${isEn ? 'Normal hydrated' : 'Promedio normal'})</option>
                            <option value="6.0" ${prefs.yield == 6.0 ? 'selected' : ''}>6.0 bayas (${isEn ? 'Optimal' : 'Riego constante óptimo'})</option>
                            <option value="7.0">7.0 bayas (${isEn ? 'Perfect maximum' : 'Máximo perfecto'})</option>
                        </select>
                    </div>

                    <!-- Selector de Receta de Replantación -->
                    <div>
                        <label class="block text-[12px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594] mb-1">
                            ${isEn ? 'Replanting Recipe to Use' : 'Receta de Replantación a Usar'}
                        </label>
                        <select id="marketRecipeSelect" class="w-full p-2.5 text-xs font-mono rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px] cursor-pointer">
                            <!-- Inyectado dinámicamente según la baya -->
                        </select>
                    </div>
                </div>

                <!-- Costos de Herramienta & Comisión GTL -->
                <div class="mt-4 pt-3 border-t border-[#2B2B2B]/20 dark:border-[#35352E] grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex items-center justify-between bg-[#EDE8DC]/50 dark:bg-[#1E1E1A] p-2.5 rounded-lg border border-[#2B2B2B]/20 dark:border-[#35352E]">
                        <span class="text-xs font-mono text-[#5F5A4D] dark:text-[#A8A594]">
                            ${isEn ? 'Harvesting Tool (NPC Shop)' : 'Herramienta de Extracción (Floristería NPC)'}:
                        </span>
                        <div class="flex items-center gap-1 font-mono font-bold text-xs">
                            <span>$</span>
                            <input type="number" id="marketToolCost" value="${prefs.toolCost || 350}" min="0" step="10" class="w-20 p-1 text-right rounded bg-[#EDE8DC] dark:bg-[#2E2E27] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8]">
                        </div>
                    </div>
                    <div class="flex items-center justify-between bg-[#EDE8DC]/50 dark:bg-[#1E1E1A] p-2.5 rounded-lg border border-[#2B2B2B]/20 dark:border-[#35352E]">
                        <span class="text-xs font-mono text-[#5F5A4D] dark:text-[#A8A594]">
                            ${isEn ? 'GTL Sales Commission' : 'Comisión de Venta en el GTL'}:
                        </span>
                        <div class="flex items-center gap-1 font-mono font-bold text-xs">
                            <input type="number" id="marketGtlFee" value="${prefs.gtlFee || 5}" min="0" max="20" step="1" class="w-16 p-1 text-right rounded bg-[#EDE8DC] dark:bg-[#2E2E27] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8]">
                            <span>%</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Panel 2: Precios de Mercado GTL en Vivo (Editables) -->
            <section class="panel p-5 rounded-xl border-2 border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#242420] shadow-[2px_3px_0px_#2B2B2B] dark:shadow-[2px_3px_0px_#000]">
                <div class="flex items-center justify-between pb-3 mb-4 border-b border-[#2B2B2B]/20 dark:border-[#35352E]">
                    <h2 class="text-xs font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8] flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
                        <span>${isEn ? 'Current GTL Market Prices (Editable)' : 'Precios de Mercado en el GTL (Valores Editables)'}</span>
                    </h2>
                    <span id="gtlPriceStatusMsg" class="text-[11px] font-mono text-[#10B981] font-bold"></span>
                </div>

                <div id="marketPricesContainer" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <!-- Inyectado dinámicamente: Tarjeta de Precio de la Baya + Tarjetas de las Semillas asociadas -->
                </div>
            </section>

            <!-- Panel 3: Desglose de Trituración y Replantación ("¿Cuántas semillas me dan?") -->
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

            <!-- Panel 4: Comparador de Rentabilidad & Veredicto Destacado ("¿Cuál sale más a cuenta?") -->
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
// LÓGICA DE CONTROL Y CÁLCULOS EN TIEMPO REAL
// =========================================================================
export function initMarket() {
    const prefs = getMarketPrefs();

    // Actualizar dropdown de recetas para la baya inicial
    populateRecipeSelect(prefs.berry, prefs.recipeId);
    renderPriceCards(prefs.berry);

    // Eventos
    const berrySelect = document.getElementById('marketBerrySelect');
    if (berrySelect) {
        berrySelect.addEventListener('change', (e) => {
            const newBerry = e.target.value;
            prefs.berry = newBerry;
            populateRecipeSelect(newBerry);
            renderPriceCards(newBerry);
            saveMarketPrefs(prefs);
            updateSimulation();
        });
    }

    const recipeSelect = document.getElementById('marketRecipeSelect');
    if (recipeSelect) {
        recipeSelect.addEventListener('change', (e) => {
            prefs.recipeId = e.target.value;
            saveMarketPrefs(prefs);
            updateSimulation();
        });
    }

    const plotsInput = document.getElementById('marketPlotsInput');
    if (plotsInput) {
        plotsInput.addEventListener('input', (e) => {
            prefs.plots = parseInt(e.target.value) || 0;
            saveMarketPrefs(prefs);
            updateSimulation();
        });
    }

    const yieldSelect = document.getElementById('marketYieldSelect');
    if (yieldSelect) {
        yieldSelect.addEventListener('change', (e) => {
            prefs.yield = parseFloat(e.target.value) || 5.5;
            saveMarketPrefs(prefs);
            updateSimulation();
        });
    }

    const replantSwitch = document.getElementById('marketReplantSwitch');
    if (replantSwitch) {
        replantSwitch.addEventListener('change', (e) => {
            prefs.replantMode = e.target.checked;
            saveMarketPrefs(prefs);
            updateSimulation();
        });
    }

    const toolCostInput = document.getElementById('marketToolCost');
    if (toolCostInput) {
        toolCostInput.addEventListener('input', (e) => {
            prefs.toolCost = parseFloat(e.target.value) || 350;
            saveMarketPrefs(prefs);
            updateSimulation();
        });
    }

    const feeInput = document.getElementById('marketGtlFee');
    if (feeInput) {
        feeInput.addEventListener('input', (e) => {
            prefs.gtlFee = parseFloat(e.target.value) || 5;
            saveMarketPrefs(prefs);
            updateSimulation();
        });
    }

    const btnSave = document.getElementById('btnSaveGTL');
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            saveCurrentInputsToMemory();
            const msg = document.getElementById('gtlPriceStatusMsg');
            if (msg) {
                msg.innerText = typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Prices saved to memory!' : '¡Precios guardados en memoria!';
                setTimeout(() => { if (msg) msg.innerText = ''; }, 3000);
            }
        });
    }

    const btnReset = document.getElementById('btnResetGTL');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            prefs.berryPrices = { ...DEFAULT_BERRY_PRICES };
            prefs.seedPrices = { ...DEFAULT_SEED_PRICES };
            prefs.toolCost = 350;
            prefs.gtlFee = 5;
            saveMarketPrefs(prefs);
            renderPriceCards(prefs.berry);
            if (toolCostInput) toolCostInput.value = 350;
            if (feeInput) feeInput.value = 5;
            updateSimulation();
        });
    }

    window.setMarketPlots = (num) => {
        const pInput = document.getElementById('marketPlotsInput');
        if (pInput) {
            pInput.value = num;
            prefs.plots = num;
            saveMarketPrefs(prefs);
            updateSimulation();
        }
    };

    updateSimulation();
}

function populateRecipeSelect(berryKey, selectedId = null) {
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

function renderPriceCards(berryKey) {
    const container = document.getElementById('marketPricesContainer');
    if (!container) return;

    const prefs = getMarketPrefs();
    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
    const profile = EXTRACTION_PROFILES[berryKey] || {};
    const recipeOpts = RECIPE_OPTIONS[berryKey] || [];
    
    // Obtener todas las semillas relevantes (las que produce al triturar + las que pide cualquier receta)
    const seedIds = new Set(Object.keys(profile));
    recipeOpts.forEach(rec => {
        rec.reqs.forEach(rq => seedIds.add(rq.id));
    });

    const berryPrice = prefs.berryPrices?.[berryKey] ?? DEFAULT_BERRY_PRICES[berryKey] ?? 1000;
    const berryName = getBerryName(berryKey);

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
        const seedPrice = prefs.seedPrices?.[seedId] ?? DEFAULT_SEED_PRICES[seedId] ?? 750;
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

    // Vincular inputs a la simulación inmediata
    const bInput = document.getElementById('priceBerryInput');
    if (bInput) {
        bInput.addEventListener('input', (e) => {
            const p = parseInt(e.target.value) || 0;
            prefs.berryPrices = prefs.berryPrices || {};
            prefs.berryPrices[berryKey] = p;
            saveMarketPrefs(prefs);
            updateSimulation();
        });
    }

    container.querySelectorAll('.seed-price-input').forEach(inp => {
        inp.addEventListener('input', (e) => {
            const sId = e.target.getAttribute('data-seedid');
            const p = parseInt(e.target.value) || 0;
            prefs.seedPrices = prefs.seedPrices || {};
            prefs.seedPrices[sId] = p;
            saveMarketPrefs(prefs);
            updateSimulation();
        });
    });
}

function saveCurrentInputsToMemory() {
    const prefs = getMarketPrefs();
    const bInput = document.getElementById('priceBerryInput');
    if (bInput && prefs.berry) {
        prefs.berryPrices = prefs.berryPrices || {};
        prefs.berryPrices[prefs.berry] = parseInt(bInput.value) || DEFAULT_BERRY_PRICES[prefs.berry];
    }
    document.querySelectorAll('.seed-price-input').forEach(inp => {
        const sId = inp.getAttribute('data-seedid');
        prefs.seedPrices = prefs.seedPrices || {};
        prefs.seedPrices[sId] = parseInt(inp.value) || DEFAULT_SEED_PRICES[sId];
    });
    saveMarketPrefs(prefs);
}

function updateSimulation() {
    const prefs = getMarketPrefs();
    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';

    const berryKey = prefs.berry || 'cheri';
    const plots = Math.max(1, prefs.plots || 72);
    const yieldVal = prefs.yield || 5.5;
    const replantMode = prefs.replantMode !== false;
    const toolCost = prefs.toolCost || 350;
    const feePct = prefs.gtlFee || 5;
    const feeFactor = (100 - feePct) / 100;

    const totalBerries = Math.round(plots * yieldVal);
    const profile = EXTRACTION_PROFILES[berryKey] || {};
    const recipeOpts = RECIPE_OPTIONS[berryKey] || [];
    const chosenRecipe = recipeOpts.find(r => r.id === prefs.recipeId) || recipeOpts[0];

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
            <span>${totalBerries.toLocaleString()} ${isEn ? 'berries harvested' : 'bayas cosechadas'}</span>
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
        const seedPrice = prefs.seedPrices?.[seedId] ?? DEFAULT_SEED_PRICES[seedId] ?? 750;
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
    // CÁLCULO DE RESULTADOS FINALES Y COMPARATIVA
    // =========================================================================
    const berryPrice = prefs.berryPrices?.[berryKey] ?? DEFAULT_BERRY_PRICES[berryKey] ?? 1000;

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

    // Actualizar Tarjeta Opción A
    const rawGrossEl = document.getElementById('rawGrossText');
    const rawFeePctEl = document.getElementById('rawFeePctText');
    const rawFeeEl = document.getElementById('rawFeeText');
    const rawNetGtlEl = document.getElementById('rawNetGtlText');
    const rawReplantCostEl = document.getElementById('rawReplantCostText');
    const rawReplantRow = document.getElementById('rawReplantRow');
    const rawFinalProfitEl = document.getElementById('rawFinalProfitText');

    if (rawGrossEl) rawGrossEl.innerText = formatMoney(rawGross);
    if (rawFeePctEl) rawFeePctEl.innerText = feePct;
    if (rawFeeEl) rawFeeEl.innerText = `-${formatMoney(Math.round(rawFee))}`;
    if (rawNetGtlEl) rawNetGtlEl.innerText = formatMoney(Math.round(rawNetGtl));
    if (rawReplantCostEl) rawReplantCostEl.innerText = `-${formatMoney(Math.round(replantBuyCost))}`;
    if (rawReplantRow) {
        if (!replantMode) rawReplantRow.classList.add('hidden');
        else rawReplantRow.classList.remove('hidden');
    }
    if (rawFinalProfitEl) rawFinalProfitEl.innerText = formatMoney(Math.round(rawFinalProfit));

    // Actualizar Tarjeta Opción B
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
    // VEREDICTO DINÁMICO TÁCTICO
    // =========================================================================
    const banner = document.getElementById('marketVerdictBanner');
    if (!banner) return;

    const diff = crushFinalProfit - rawFinalProfit;
    const absDiff = Math.abs(diff);
    const diffPct = rawFinalProfit > 0 ? ((absDiff / rawFinalProfit) * 100).toFixed(1) : 0;
    const diffPerBerry = (absDiff / totalBerries).toFixed(0);

    if (diff > 0) {
        // Conviene Triturar
        banner.className = 'p-5 sm:p-6 rounded-2xl border-2 border-[#10B981] bg-[#10B981]/15 dark:bg-[#064E3B]/40 shadow-lg text-[#1C1C17] dark:text-[#F4F1E8] transition-all';
        banner.innerHTML = `
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-start gap-3.5">
                    <div class="p-2.5 rounded-xl bg-[#10B981] text-white flex-shrink-0 shadow-sm mt-0.5">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                    </div>
                    <div>
                        <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#059669] dark:text-[#34D399] block mb-0.5">
                            ${isEn ? 'TACTICAL VERDICT: MORE PROFITABLE TO CRUSH' : 'VEREDICTO TÁCTICO: MÁS A CUENTA TRITURAR'}
                        </span>
                        <h4 class="text-lg sm:text-xl font-tech font-extrabold uppercase text-[#1C1C17] dark:text-[#F4F1E8]">
                            ${isEn ? 'CRUSH BERRIES AND SELL SURPLUS SEEDS' : 'TRITURA LAS BAYAS Y VENDE LAS SEMILLAS'}
                        </h4>
                        <p class="text-xs font-sans text-[#5F5A4D] dark:text-[#D1D5DB] mt-1 max-w-2xl leading-relaxed">
                            ${isEn
                                ? `Crushing nets you <strong>+${formatMoney(Math.round(absDiff))} more</strong> (+${diffPct}%) than selling raw berries. You secure your replanting seeds for all ${plots} plots and sell surplus on the GTL.`
                                : `Triturar te deja <strong>+${formatMoney(Math.round(absDiff))} más de ganancia limpia</strong> (+${diffPct}%) respecto a vender la baya cruda (+${diffPerBerry}$ por baya). Además tus semillas para replantar las ${plots} parcelas quedan 100% aseguradas en tu inventario.`
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
        // Conviene Vender Baya Cruda
        banner.className = 'p-5 sm:p-6 rounded-2xl border-2 border-[#3B82F6] bg-[#3B82F6]/15 dark:bg-[#1E3A8A]/40 shadow-lg text-[#1C1C17] dark:text-[#F4F1E8] transition-all';
        banner.innerHTML = `
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex items-start gap-3.5">
                    <div class="p-2.5 rounded-xl bg-[#3B82F6] text-white flex-shrink-0 shadow-sm mt-0.5">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div>
                        <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] block mb-0.5">
                            ${isEn ? 'TACTICAL VERDICT: MORE PROFITABLE TO SELL RAW' : 'VEREDICTO TÁCTICO: MÁS A CUENTA VENDER CRUDA'}
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
