// ***************************************************************
// 1. DATA: Array de objetos con el Catálogo Completo (20 productos para paginación)
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
const PRODUCTS_PER_PAGE = 8; // Cantidad de productos por página en el catálogo
let currentPage = 1;
let filteredProducts = products; // El array sobre el cual se aplica la paginación

// ***************************************************************
// 3. FUNCIONES DE RENDERIZADO Y UTILIDAD
// ***************************************************************

/**
 * Función para generar el HTML de una tarjeta de producto.
 */
function createProductCardHTML(product) {
    return `
        <div class="col">
            <div class="product-card" data-id="${product.id}"> 
                <div class="product-image-wrapper">
                    <div class="product-corner-logo">
                        <img src="images/loorcars-logo-small.png" alt="Logo LoorCars" class="img-fluid"> 
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
 * Función para generar el HTML de un resultado de búsqueda (tarjeta pequeña).
 */
function createSearchResultHTML(product) {
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
// 4. LÓGICA DE PAGINACIÓN Y RENDERIZADO DEL CATÁLOGO
// ***************************************************************

/**
 * Función que renderiza los productos de la página actual.
 * @param {Array} productList - Lista de productos a mostrar.
 * @param {string} containerId - ID del contenedor (ej: 'full-catalogue-container').
 */
function renderProducts(productList, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Obtener los productos para la página actual
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const productsToRender = productList.slice(startIndex, endIndex);

    container.innerHTML = productsToRender.map(createProductCardHTML).join('');

    // Re-adjuntar eventos a los nuevos botones de contacto
    attachContactEvents(container);
}

/**
 * Función que genera y renderiza la paginación.
 * @param {Array} productList - Lista de productos filtrada/completa.
 */
function renderPagination(productList) {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(productList.length / PRODUCTS_PER_PAGE);
    let paginationHTML = '';

    // Botón Anterior
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">Anterior</a>
        </li>
    `;

    // Números de Página
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    // Botón Siguiente
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">Siguiente</a>
        </li>
    `;

    paginationContainer.innerHTML = paginationHTML;

    // Adjuntar Eventos de Clic a los Botones de Paginación
    paginationContainer.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const newPage = parseInt(e.target.getAttribute('data-page'));
            
            if (newPage > 0 && newPage <= totalPages && newPage !== currentPage) {
                currentPage = newPage;
                
                // Recargar productos de la nueva página y la paginación
                renderProducts(filteredProducts, 'full-catalogue-container');
                renderPagination(filteredProducts);

                // Opcional: Desplazar la vista al inicio de los productos
                document.getElementById('full-catalogue-container').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Lógica para manejar la búsqueda instantánea en el catálogo.
 */
function setupCatalogueSearch() {
    const input = document.getElementById('catalogoSearchInput');
    if (!input) return;

    input.addEventListener('input', debounce((e) => {
        const query = e.target.value.trim().toLowerCase();
        
        // 1. Filtrar productos
        if (query) {
            filteredProducts = products.filter(p => p.title.toLowerCase().includes(query));
        } else {
            filteredProducts = products;
        }

        // 2. Resetear a la primera página y renderizar
        currentPage = 1;
        renderProducts(filteredProducts, 'full-catalogue-container');
        renderPagination(filteredProducts);
        
        // Manejar caso de no resultados
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
// 5. LÓGICA DEL DOM Y EVENTOS
// ***************************************************************

/**
 * Adjunta eventos de contacto a todos los botones de consulta.
 * @param {HTMLElement} container - El contenedor donde buscar los botones.
 */
function attachContactEvents(container) {
    const modalTitleElement = document.getElementById('contactModalLabel');
    const whatsappLinkElement = document.getElementById('whatsapp-link');
    const modalProductIdElement = document.getElementById('modal-product-id');

    // Función para manejar el evento de clic en cualquier botón de "Consultar/Contactar"
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
        button.removeEventListener('click', handleContactClick); // Evitar duplicados
        button.addEventListener('click', handleContactClick);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // LÓGICA DE INICIO (INDEX.HTML)
    // ----------------------------------------------------
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        // En la página de inicio, mostramos solo los primeros 4 productos
        const featuredProducts = products.slice(0, 4);
        productsContainer.innerHTML = featuredProducts.map(createProductCardHTML).join('');
        attachContactEvents(productsContainer); // Adjuntar eventos
    }

    // ----------------------------------------------------
    // LÓGICA DEL CATÁLOGO (CATALOGO.HTML)
    // ----------------------------------------------------
    const catalogueContainer = document.getElementById('full-catalogue-container');
    if (catalogueContainer) {
        // En la página de catálogo, cargamos la paginación y la búsqueda
        renderProducts(products, 'full-catalogue-container');
        renderPagination(products);
        setupCatalogueSearch();
    }

    // ----------------------------------------------------
    // LÓGICA DEL MODAL DE BÚSQUEDA GLOBAL (REUTILIZADA)
    // ----------------------------------------------------
    const searchInput = document.getElementById('searchInput');
    const searchResultsContainer = document.getElementById('searchResults');
    const searchModalElement = document.getElementById('searchModal');
    const contactModalInstance = new bootstrap.Modal(document.getElementById('contactModal'));

    const performGlobalSearch = (query) => {
        const normalizedQuery = query.trim().toLowerCase();
        
        if (normalizedQuery.length < 2) {
            searchResultsContainer.innerHTML = `<p class="text-center text-white-50 mt-5">${normalizedQuery.length === 0 ? 'Empieza a escribir para ver los productos disponibles.' : 'Escribe al menos 2 letras para buscar.'}</p>`;
            return;
        }

        const filtered = products.filter(p => p.title.toLowerCase().includes(normalizedQuery));

        if (filtered.length === 0) {
            searchResultsContainer.innerHTML = `<p class="text-center text-white-50 mt-5">No se encontraron resultados para "${query}".</p>`;
        } else {
            searchResultsContainer.innerHTML = filtered.map(createSearchResultHTML).join('');

            // Adjuntar evento de clic a los nuevos botones de contacto
            searchResultsContainer.querySelectorAll('.btn-contact-product-modal').forEach(button => {
                button.addEventListener('click', (e) => {
                    const searchModalInstance = bootstrap.Modal.getInstance(searchModalElement);
                    if (searchModalInstance) {
                        searchModalInstance.hide();
                    }
                    // Abrir modal de contacto
                    attachContactEvents(searchResultsContainer); 
                    contactModalInstance.show();
                });
            });
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            performGlobalSearch(e.target.value);
        }, 300));
        
        searchModalElement.addEventListener('show.bs.modal', function () {
            searchInput.value = '';
            performGlobalSearch(''); // Limpiar resultados al abrir
            setTimeout(() => { searchInput.focus(); }, 100);
        });
    }
});