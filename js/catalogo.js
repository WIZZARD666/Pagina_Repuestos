// ***************************************************************
// 1. DATA: Array de objetos (MANTENIDO)
// ***************************************************************
const products = [
    { id: 1, title: "FARO DELANTERO DERECHO", price: 85.99, imageUrl: "https://picsum.photos/id/1080/400/250" },
    { id: 2, title: "BUJÍA DE IRIDIO (4 UNIDADES)", price: 45.00, imageUrl: "https://picsum.photos/id/1025/400/250" },
    { id: 3, title: "DISCO DE FRENO VENTILADO", price: 62.50, imageUrl: "https://picsum.photos/id/40/400/250" },
    { id: 4, title: "FILTRO DE AIRE DE ALTO FLUJO", price: 35.75, imageUrl: "https://picsum.photos/id/237/400/250" },
    { id: 5, title: "BATERÍA DE ALTO RENDIMIENTO 12V", price: 120.00, imageUrl: "https://picsum.photos/id/30/400/250" },
    { id: 6, title: "ACEITE SINTÉTICO 5W-30 (GALÓN)", price: 55.90, imageUrl: "https://picsum.photos/id/450/400/250" },
    { id: 7, title: "BOMBA DE AGUA DE PRECISIÓN", price: 98.75, imageUrl: "https://picsum.photos/id/1043/400/250" },
    { id: 8, title: "PASTILLAS DE FRENO CERÁMICAS", price: 40.50, imageUrl: "https://picsum.photos/id/160/400/250" },
    { id: 9, title: "CORREA DE DISTRIBUCIÓN REFORZADA", price: 78.99, imageUrl: "https://picsum.photos/id/180/400/250" },
    { id: 10, title: "AMORTIGUADOR GAS REGULABLE", price: 110.00, imageUrl: "https://picsum.photos/id/300/400/250" },
    { id: 11, title: "SISTEMA DE ESCAPE DEPORTIVO", price: 350.50, imageUrl: "https://picsum.photos/id/420/400/250" },
    { id: 12, title: "NEUMÁTICO RADIAL DE VERANO", price: 95.00, imageUrl: "https://picsum.photos/id/45/400/250" },
    { id: 13, title: "CAJA DE VELOCIDADES MANUAL", price: 800.00, imageUrl: "https://picsum.photos/id/500/400/250" },
    { id: 14, title: "SENSOR DE OXÍGENO LAMBDA", price: 65.25, imageUrl: "https://picsum.photos/id/550/400/250" },
    { id: 15, title: "RADIADOR DE ALUMINIO COMPACTO", price: 150.00, imageUrl: "https://picsum.photos/id/600/400/250" },
    { id: 16, title: "LÍQUIDO DE FRENOS DOT 4", price: 18.50, imageUrl: "https://picsum.photos/id/650/400/250" },
    { id: 17, title: "ALTERNADOR DE ALTA POTENCIA", price: 210.00, imageUrl: "https://picsum.photos/id/700/400/250" },
    { id: 18, title: "EMBRAGUE CERÁMICO DE COMPETICIÓN", price: 420.00, imageUrl: "https://picsum.photos/id/750/400/250" },
    { id: 19, title: "MÓDULO DE ENCENDIDO ELECTRÓNICO", price: 88.00, imageUrl: "https://picsum.photos/id/800/400/250" },
    { id: 20, title: "KIT DE SUSPENSIÓN DEPORTIVA", price: 580.00, imageUrl: "https://picsum.photos/id/850/400/250" },
];

// ***************************************************************
// 2. CONFIGURACIÓN Y VARIABLES GLOBALES
// ***************************************************************
const PRODUCTS_PER_PAGE = 8;
let currentPage = 1;
let filteredProducts = products;

// *** Las funciones createProductCardHTML, debounce, attachContactEvents, ***
// *** renderProducts, renderPagination, y setupCatalogueSearch se mantienen iguales. ***

// ***************************************************************
// 3. FUNCIONES DE RENDERIZADO Y UTILIDAD (COPIAR LAS FUNCIONES AQUÍ)
// ***************************************************************

/**
 * Función para generar el HTML de una tarjeta de producto. (SIN CAMBIOS)
 */
function createProductCardHTML(product) {
    // ... (Tu función createProductCardHTML aquí) ...
    return `
        <div class="col">
            <div class="product-card" data-id="${product.id}"> 
                <div class="product-image-wrapper">
                    <div class="product-corner-logo">
                        <img src="../img/Logo.jpeg" alt="Logo LoorCars" class="img-fluid"> 
                    </div>
                    <img 
                        src="${product.imageUrl}" 
                        alt="${product.title}" 
                        class="product-image img-fluid" 
                    >
                </div>

                <h5 class="text-uppercase fw-bold text-truncate" style="font-size: 1rem" title="${product.title}">
                    ${product.title}
                </h5>
                <p class="fw-bold fs-5" style="color: var(--color-acento-claro);">$ ${product.price.toFixed(2).replace('.', ',')}</p>
                
                <button 
                    class="btn btn-contact-product fw-bold" 
                    data-product-id="${product.id}"
                    data-product-title="${product.title}" 
                    data-bs-toggle="modal" 
                    data-bs-target="#contactModal" 
                    style="background-color: var(--color-primario-cta); color: white; border: none;"
                >
                    CONSULTAR PRODUCTO
                </button>
            </div>
        </div>
    `;
}

/**
 * Función para generar el HTML de un resultado de búsqueda (tarjeta pequeña). (SIN CAMBIOS)
 */
function createSearchResultHTML(product) {
    // ... (Tu función createSearchResultHTML aquí) ...
    return `
        <div class="col">
            <div class="d-flex align-items-center search-result-card">
                <img 
                    src="${product.imageUrl}" 
                    alt="${product.title}" 
                >
                <div>
                    <strong class="d-block text-truncate">${product.title}</strong>
                    <span style="color: var(--color-acento-claro);">$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    <button 
                        class="btn btn-sm btn-contact-product-modal ms-2" 
                        data-product-id="${product.id}"
                        data-product-title="${product.title}" 
                        data-bs-toggle="modal" 
                        data-bs-target="#contactModal" 
                        style="background-color: var(--color-primario-cta); color: white; border: none; font-size: 0.75rem;"
                    >
                        Contactar
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Utilidad para retrasar la ejecución de la búsqueda (Debounce)
let debounceTimeout;
function debounce(func, delay) {
    return function (...args) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// ***************************************************************
// 4. LÓGICA DE PAGINACIÓN Y RENDERIZADO DEL CATÁLOGO (SIN CAMBIOS)
// ***************************************************************

function renderProducts(productList, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const productsToRender = productList.slice(startIndex, endIndex);

    container.innerHTML = productsToRender.map(createProductCardHTML).join('');
    attachContactEvents(container);
}

function renderPagination(productList) {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(productList.length / PRODUCTS_PER_PAGE);
    let paginationHTML = '';

    // ... (Lógica de Botones Anterior/Siguiente/Números de Página - SIN CAMBIOS) ...

    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">Anterior</a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">Siguiente</a>
        </li>
    `;

    paginationContainer.innerHTML = paginationHTML;

    paginationContainer.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const newPage = parseInt(e.target.getAttribute('data-page'));
            
            if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
                currentPage = newPage;
                renderProducts(filteredProducts, 'full-catalogue-container');
                renderPagination(filteredProducts);
                document.getElementById('catalogoSearchInput').scrollIntoView({ behavior: 'smooth' }); // Scroll al inicio del catálogo
            }
        });
    });
}

function setupCatalogueSearch() {
    const input = document.getElementById('catalogoSearchInput');
    if (!input) return;

    input.addEventListener('input', debounce((e) => {
        const query = e.target.value.trim().toLowerCase();
        
        if (query) {
            filteredProducts = products.filter(p => p.title.toLowerCase().includes(query));
        } else {
            filteredProducts = products;
        }

        currentPage = 1;
        renderProducts(filteredProducts, 'full-catalogue-container');
        renderPagination(filteredProducts);
        
        if (filteredProducts.length === 0) {
            document.getElementById('full-catalogue-container').innerHTML = `
                <div class="col-12 text-center text-white-50 mt-5">
                    <p class="lead">No se encontraron productos que coincidan con "${e.target.value}".</p>
                </div>
            `;
        }
    }, 300));
}

// ***************************************************************
// 5. LÓGICA DEL DOM Y EVENTOS (SIN CAMBIOS)
// ***************************************************************
function attachContactEvents(container) {
    const modalTitleElement = document.getElementById('contactModalLabel');
    const whatsappLinkElement = document.getElementById('whatsapp-link');
    const modalProductIdElement = document.getElementById('modal-product-id');

    function handleContactClick(event) {
        const button = event.currentTarget;
        const productId = button.getAttribute('data-product-id');
        const productTitle = button.getAttribute('data-product-title');

        modalProductIdElement.textContent = productId;
        modalTitleElement.textContent = `¡Pregúntanos por el producto: ${productTitle}!`;

        const baseWhatsappUrl = "https://wa.me/56937538719?text="; 
        const message = `Hola, me interesa el producto: ${productTitle} (ID: ${productId}). ¿Podrían darme más información?`;
        whatsappLinkElement.href = baseWhatsappUrl + encodeURIComponent(message);
    }

    container.querySelectorAll('.btn-contact-product, .btn-contact-product-modal').forEach(button => {
        button.removeEventListener('click', handleContactClick);
        button.addEventListener('click', handleContactClick);
    });
}

// ***************************************************************
// 6. INICIALIZACIÓN DE LA PÁGINA DE CATÁLOGO (¡CLAVE!)
// ***************************************************************

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargamos los productos iniciales
    const catalogueContainer = document.getElementById('full-catalogue-container');
    if (catalogueContainer) {
        renderProducts(products, 'full-catalogue-container');
        renderPagination(products);
        setupCatalogueSearch();
    }
    
    // 2. Aquí iría la lógica del modal de búsqueda global si estuviera en este archivo.
    // Como lo quitamos, el código es más limpio.
});