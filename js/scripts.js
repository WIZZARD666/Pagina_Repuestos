// ***************************************************************
// 1. DATA: Array de objetos con el doble de productos (8 en total)
// ***************************************************************
const products = [
    {
        id: 1,
        title: "FARO DELANTERO DERECHO",
        price: 85.99,
        imageUrl: "https://picsum.photos/id/1080/400/250"
    },
    {
        id: 2,
        title: "BUJÍA DE IRIDIO (4 UNIDADES)",
        price: 45.00,
        imageUrl: "https://picsum.photos/id/1025/400/250"
    },
    {
        id: 3,
        title: "DISCO DE FRENO VENTILADO",
        price: 62.50,
        imageUrl: "https://picsum.photos/id/40/400/250"
    },
    {
        id: 4,
        title: "FILTRO DE AIRE DE ALTO FLUJO",
        price: 35.75,
        imageUrl: "https://picsum.photos/id/237/400/250"
    },
    // ******* NUEVOS PRODUCTOS *******
    {
        id: 5,
        title: "BATERÍA DE ALTO RENDIMIENTO 12V",
        price: 120.00,
        imageUrl: "https://picsum.photos/id/30/400/250"
    },
    {
        id: 6,
        title: "ACEITE SINTÉTICO 5W-30 (GALÓN)",
        price: 55.90,
        imageUrl: "https://picsum.photos/id/450/400/250"
    },
    {
        id: 7,
        title: "BOMBA DE AGUA DE PRECISIÓN",
        price: 98.75,
        imageUrl: "https://picsum.photos/id/1043/400/250"
    },
    {
        id: 8,
        title: "PASTILLAS DE FRENO CERÁMICAS",
        price: 40.50,
        imageUrl: "https://picsum.photos/id/160/400/250"
    }
];

// ***************************************************************
// 2. FUNCIONES DE RENDERIZADO Y UTILIDAD
// ***************************************************************

/**
 * Función para generar el HTML de una tarjeta de producto (para la sección principal).
 * ✨ MODIFICADA para el hover de imagen y el ícono de corazón.
 */
function createProductCardHTML(product) {
    return `
        <div class="col">
            <div class="product-card" data-id="${product.id}"> 
                <div class="product-image-wrapper">
                    <div class="product-select-icon" data-product-id="${product.id}">
                        <img src="img/Logo.jpeg" alt="Logo de la marca" class="img-fluid">
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
 * (Sin cambios relevantes, solo ajustes de color para usar variables CSS)
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
// 3. LÓGICA DEL DOM Y EVENTOS
// ***************************************************************
document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    const cartCountElement = document.getElementById('cart-count');

    // Elementos del Modal de Contacto
    const modalTitleElement = document.getElementById('contactModalLabel');
    const whatsappLinkElement = document.getElementById('whatsapp-link');
    const instagramLinkElement = document.getElementById('instagram-link');
    const modalProductIdElement = document.getElementById('modal-product-id');
    const contactModal = new bootstrap.Modal(document.getElementById('contactModal')); 

    // Elementos del Modal de Búsqueda
    const searchInput = document.getElementById('searchInput');
    const searchResultsContainer = document.getElementById('searchResults');
    const searchModalElement = document.getElementById('searchModal');
    const initialSearchMessage = document.getElementById('initial-search-message');


    // Inicializar la vista principal
    productsContainer.innerHTML = products.map(createProductCardHTML).join('');
    cartCountElement.textContent = 0;
    cartCountElement.classList.add('d-none');


    // ----------------------------------------------------
    // Lógica del Modal de Contacto (Reutilizable)
    // ----------------------------------------------------

    // Función para manejar el evento de clic en cualquier botón de "Consultar/Contactar"
    function handleContactClick(event) {
        // Obtenemos los datos del botón
        const button = event.currentTarget;
        const productId = button.getAttribute('data-product-id');
        const productTitle = button.getAttribute('data-product-title');

        // 1. Rellenar ID en el modal
        modalProductIdElement.textContent = productId;
        // 2. Configurar el título del modal
        modalTitleElement.textContent = `¡Pregúntanos por el producto: ${productTitle}!`;

        // 3. Configurar el link de WhatsApp con el producto
        const baseWhatsappUrl = "https://wa.me/56937538719?text="; 
        const message = `Hola, me interesa el producto: ${productTitle} (ID: ${productId}). ¿Podrían darme más información?`;
        whatsappLinkElement.href = baseWhatsappUrl + encodeURIComponent(message);

        // 4. Configurar el link de Instagram (Solo como ejemplo, puedes quitarlo si no lo necesitas)
        const instagramUser = "loorbarragan"; 
        instagramLinkElement.href = `https://www.instagram.com/${instagramUser}/`;

        // Si el botón no abre el modal directamente (como en la búsqueda), lo abrimos:
        if (!button.getAttribute('data-bs-toggle')) {
            contactModal.show();
        }
    }

    // Adjuntar evento de clic a todos los botones "CONSULTAR PRODUCTO" en la vista principal
    productsContainer.querySelectorAll('.btn-contact-product').forEach(button => {
        button.addEventListener('click', handleContactClick);
    });
    
    // Ejecutar la configuración de favoritos para los productos cargados
    setupFavoriteIcons();


    // ----------------------------------------------------
    // Lógica del Modal de Búsqueda
    // ----------------------------------------------------

    // Función de búsqueda real (ejecutada después del debounce)
    const performSearch = (query) => {
        const normalizedQuery = query.trim().toLowerCase();

        if (normalizedQuery.length < 2) {
            searchResultsContainer.innerHTML = `<p class="text-center text-white-50 mt-5">${normalizedQuery.length === 0 ? 'Empieza a escribir para ver los productos disponibles.' : 'Escribe al menos 2 letras para buscar.'}</p>`;
            return;
        }

        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(normalizedQuery)
        );

        if (filteredProducts.length === 0) {
            searchResultsContainer.innerHTML = `<p class="text-center text-white-50 mt-5">No se encontraron resultados para "${query}".</p>`;
        } else {
            // Renderiza los resultados usando la función de tarjeta pequeña
            searchResultsContainer.innerHTML = filteredProducts.map(createSearchResultHTML).join('');

            // Adjuntar evento de clic a los nuevos botones de contacto dentro de los resultados
            searchResultsContainer.querySelectorAll('.btn-contact-product-modal').forEach(button => {
                button.addEventListener('click', (e) => {
                    // Cierra el modal de búsqueda primero
                    const searchModalInstance = bootstrap.Modal.getInstance(searchModalElement);
                    if (searchModalInstance) {
                        searchModalInstance.hide();
                    }
                    // Luego abre el modal de contacto rellenando los datos
                    handleContactClick(e);
                });
            });
        }
    };

    // Adjuntar la función de búsqueda con un retraso de 300ms al input
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            performSearch(e.target.value);
        }, 300));

        // Limpiar el input y los resultados cada vez que se abre el modal de búsqueda
        searchModalElement.addEventListener('show.bs.modal', function () {
            searchInput.value = '';
            searchResultsContainer.innerHTML = `<p class="text-center text-white-50 mt-5" id="initial-search-message">Empieza a escribir para ver los productos disponibles.</p>`;
            setTimeout(() => {
                searchInput.focus(); // Enfocar el input al abrir el modal
            }, 100);
        });
    }

});