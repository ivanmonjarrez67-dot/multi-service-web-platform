document.addEventListener("DOMContentLoaded", function () {
  // Mostrar modal
  document.getElementById("addProductButton").onclick = function () {
    document.getElementById("addProductModal").style.display = "block";
  };

  // Cerrar modal
  document.querySelector(".close").onclick = function () {
    document.getElementById("addProductModal").style.display = "none";
  };



const themeToggle = document.getElementById('themeToggle');
const productGrid = document.getElementById('productGrid');

themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    // Tema claro
    productGrid.style.backgroundColor = "#f0f0f0"; // gris claro
    productGrid.style.color = "#000"; // texto oscuro
  } else {
    // Tema oscuro (original)
    productGrid.style.backgroundColor = "black"; // negro original
    productGrid.style.color = "#fff"; // texto blanco
  }
});

















// Elementos del DOM
const inputFile = document.getElementById("imagenProducto"); // Input tipo file
const inputUrl = document.getElementById("imageUrl");        // Input donde se guardará la URL para la DB
const previewImg = document.getElementById("previewImagen"); // Imagen de preview

// Escuchar cuando se selecciona un archivo
inputFile.addEventListener("change", () => {
  if (inputFile.files.length === 0) return; // No hay archivo seleccionado

  const file = inputFile.files[0];

  // Mostrar preview en la página
  previewImg.src = URL.createObjectURL(file);
  previewImg.style.display = "inline-block"; // Asegurarse que se vea

  // Crear FormData solo con la imagen
  const formData = new FormData();
  formData.append("imagenProducto", file);

  // Subir archivo al servlet
  fetch("http://localhost:8080/proyecto-web/GuardarProductoArchivo", {
    method: "POST",
    body: formData
  })
  .then(resp => {
    if (!resp.ok) 
      return resp.text().then(msg => { throw new Error(msg); }); // Manejo de errores
    return resp.text();
  })
  .then(data => {
    console.log("Archivo subido con éxito:", data);

    // Extraer solo el nombre del archivo de la respuesta
    const fileName = data.split(":")[1].trim();

    // Construir la URL completa apuntando al servlet MostrarImagen
    const imageUrl = "http://localhost:8080/proyecto-web/MostrarImagen?nombre=" + encodeURIComponent(fileName);

    // Guardar esta URL en el input que se usará para la DB
    inputUrl.value = imageUrl;

    console.log("URL lista para la DB:", inputUrl.value);
  })
  .catch(err => {
    console.error("Error al subir la imagen:", err);
    alert("Error al subir la imagen: " + err.message);
  });
});













// ✅ Función para cargar productos de la tienda desde MisProductosServlet
function cargarProductosMiTienda() {
  // ✅ Obtener el ID visible (por ejemplo: "ID de usuario: 23")
  const idDiv = document.getElementById("usuarioIdVisibleMitienda");
  if (!idDiv) {
    console.error("No se encontró el elemento con el ID visible del usuario.");
    return;
  }

  const idText = idDiv.textContent.trim();
  const usuarioId = idText.replace("ID de usuario:", "").trim();

  // ✅ Validación
  if (!usuarioId || isNaN(usuarioId)) {
    console.error("⚠️ ID de usuario inválido o no definido:", usuarioId);
    return;
  }

  // ✅ Hacer la solicitud al servlet con el usuario_id
  fetch(`/proyecto-web/MisProductosServlet?usuario_id=${usuarioId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Error al obtener productos (status ${res.status})`);
      }
      return res.json();
    })
    .then(productos => {
      const grid = document.getElementById("productGrid");
      if (!grid) {
        console.error("No se encontró el contenedor de productos (productGrid).");
        return;
      }

      grid.innerHTML = "";
      productoSeleccionado = null;

      if (!productos || productos.length === 0) {
        grid.innerHTML = '<p style="color:white;">No tienes productos registrados.</p>';
        return;
      }

      productos.forEach(producto => {
        const card = document.createElement("div");
        card.className = "producto";

        card.innerHTML = `
          <img src="${producto.imagen || ''}" alt="${producto.nombre || ''}" style="width:150px;height:150px;object-fit:cover;border-radius:8px;">
          <h3>${producto.nombre || ''} (ID: ${producto.id})</h3>
          <button class="more-info-btn"
            data-id="${producto.id}" 
            data-empresa="${producto.empresa || ''}"
            data-imagen="${producto.imagen || ''}"
            data-nombre="${producto.nombre || ''}"
            data-descripcion="${producto.descripcion || ''}"
            data-provincia="${producto.provincia || ''}"
            data-ciudad="${producto.ciudad || ''}"
            data-telefono="${producto.telefono || ''}"
            data-correo="${producto.correo || ''}"
            data-precio="${producto.precio || ''}"
            data-categoria="${producto.categoria || ''}">
            Más información
          </button>
        `;
        grid.appendChild(card);
      });
    })
    .catch(err => console.error("❌ Error al cargar productos de la tienda:", err));
}

























  const menuBtn = document.getElementById('menuBtn');
  const menuContent = document.getElementById('menuContent');

  if (menuBtn && menuContent) { // ✅ evita errores si no existen
    menuBtn.addEventListener('click', () => {
      menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
    });

    // Cerrar el menú si se hace clic fuera
    window.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !menuContent.contains(e.target)) {
        menuContent.style.display = 'none';
      }
    });

    
function mostrarAyuda() {
  alert('Puedes contactarnos via correo Monjarrez@gmail.com');
}
  }











// Procesar formulario
document.getElementById("addProductForm").onsubmit = function (event) {
  event.preventDefault();

  // ✅ Extraer el número del texto "ID de usuario: 23"
  const idText = document.getElementById("usuarioIdVisibleMitienda").textContent.trim();
  const usuarioId = idText.replace("ID de usuario:", "").trim(); // → "23"

  const name = document.getElementById("name").value.trim();
  const categoria = document.getElementById("categoria").value;
  const description = document.getElementById("description").value.trim();
  const price = document.getElementById("price").value.trim();
  const imageUrl = document.getElementById("imageUrl").value.trim();
  const empresa = document.getElementById("empresa").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const correo = document.getElementById("correoProducto").value.trim();
  const provincia = document.getElementById("provincia").value;
  const ciudad = document.getElementById("ciudad").value.trim();

  // ✅ Validación del ID
  if (!usuarioId || isNaN(usuarioId)) {
    alert("No se pudo obtener el ID del usuario. Vuelva a iniciar sesión o revise el campo.");
    return;
  }

  // Validaciones
  if (!empresa || empresa.length < 2) {
    alert("Por favor, ingrese un nombre válido para su empresa (mínimo 2 caracteres).");
    return;
  }

  if (!correo) {
    alert("Por favor, ingrese un correo electrónico válido.");
    return;
  }

  // Validación simple de correo
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!correoRegex.test(correo)) {
    alert("El correo ingresado no tiene un formato válido.");
    return;
  }

  if (!price || isNaN(price) || Number(price) <= 0) {
    alert("Por favor, ingrese un precio válido mayor que 0.");
    return;
  }

  // Log para depuración
  console.log("Correo a enviar:", correo);
  console.log("Usuario ID a enviar:", usuarioId);

  // ✅ Enviar también el usuario_id al servlet
  fetch("http://localhost:8080/proyecto-web/GuardarProducto", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      usuario_id: usuarioId, // 👈 ID extraído del campo visible
      nombre: name,
      categoria: categoria,
      descripcion: description,
      precio: price,
      imagen: imageUrl,
      empresa: empresa,
      telefono: telefono,
      correo: correo,
      provincia: provincia,
      ciudad: ciudad,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((msg) => {
          throw new Error("Error del servidor: " + msg);
        });
      }
      addProductToView(name, description, price, imageUrl, empresa, telefono, correo, provincia, ciudad);
      alert("Producto guardado con éxito.");
      document.getElementById("addProductModal").style.display = "none";
      document.getElementById("addProductForm").reset();
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error);
      alert("Error al conectar con el servidor: " + error.message);
    });
};







  // Agregar producto visualmente 
  function addProductToView(
    name,
    description,
    price,
    imageUrl,
    empresa,
    telefono,
    correo,
    provincia,
    ciudad
  ) {
    const productGrid = document.querySelector(".product-grid");

    const productCard = document.createElement("div");
    productCard.classList.add("producto");
    productCard.setAttribute("data-categoria", "todo");
    productCard.innerHTML = `
            <img src="${imageUrl}" alt="${name}" />
            <h3>${name}</h3>
            <p><strong>Empresa:</strong> ${empresa}</p>
            <p>${description}</p>
            <p><strong>Precio:</strong> ₡${price}</p>
           <button class="more-info-btn" 
      data-telefono="${telefono}" 
      data-correo="${correo}" 
      data-ubicacion="${provincia}, ${ciudad}">
      Más información
    </button>
        `;
    productGrid.appendChild(productCard);
  }









































// Mostrar productos al cargar la página
fetch("/proyecto-web/api/productos")
  .then((response) => response.json())
  .then((productos) => {
    const grid = document.getElementById("productGrid");
    grid.innerHTML = "";

    productos.forEach((producto) => {
      const card = document.createElement("div");
      card.className = "producto";
      card.setAttribute("data-categoria", producto.nombre.toLowerCase());
      card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" style="width:150px;height:150px;">
        <h3>${producto.nombre}</h3>
       
        <button class="more-info-btn"
          data-empresa="${producto.empresa}"
          data-imagen="${producto.imagen}"
          data-nombre="${producto.nombre}"
          data-descripcion="${producto.descripcion}"
          data-provincia="${producto.provincia}"
          data-ciudad="${producto.ciudad}"
          data-telefono="${producto.telefono}"
          data-correo="${producto.correo}"
          data-precio="${producto.precio}"
        >
          Más información
        </button>
      `;
      grid.appendChild(card);
    });
  })
  .catch((error) => {
    console.error("Error al cargar productos:", error);
  });

// ---------------------------
// Panel lateral: abrir / cerrar
// ---------------------------
(function () {
  const modal = document.getElementById("infoModal");
  const overlay = document.getElementById("sideOverlay");

  function openPanel() {
    if (!modal || !overlay) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    overlay.classList.add("visible");
    overlay.setAttribute("aria-hidden", "false");
    // No bloquea scroll del body
  }

  function closePanel() {
    if (!modal || !overlay) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    overlay.classList.remove("visible");
    overlay.setAttribute("aria-hidden", "true");
  }

  // Delegación: abrir con cualquier botón .more-info-btn (ya lo usas en las cards)
  document.addEventListener("click", function (e) {
    const target = e.target;
    if (target.classList && target.classList.contains("more-info-btn")) {
      const empresa = target.dataset.empresa || "Empresa no disponible";
      const imagen = target.dataset.imagen || "";
      const nombre = target.dataset.nombre || "";
      const descripcion = target.dataset.descripcion || "";
      const provincia = target.dataset.provincia || "";
      const ciudad = target.dataset.ciudad || "";
      const telefono = target.dataset.telefono || "—";
      const correo = target.dataset.correo || "—";
      const precio = target.dataset.precio || "—";

      let imagenHtml = imagen
        ? `<img src="${imagen}" alt="Imagen de empresa" style="width:100%; margin:10px 0; border-radius:8px;">`
        : "";

      document.getElementById("infoModalContent").innerHTML = `
        <button class="close-info" aria-label="Cerrar">&times;</button>
        <h2>${empresa}</h2>
        ${imagenHtml}
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Descripción:</strong> ${descripcion}</p>
        <h3>Ubicación</h3>
        <p>${provincia}, ${ciudad}</p>
        <h3>Contacto</h3>
        <p>📞 ${telefono}<br>✉️ ${correo}</p>
        <p><strong>Precio:</strong> ₡${precio}</p>
      `;

      // Listener para cerrar con la X
      const closeBtn = document.querySelector("#infoModalContent .close-info");
      if (closeBtn) closeBtn.addEventListener("click", closePanel);

      openPanel();
    }
  });

  if (overlay) overlay.addEventListener("click", closePanel);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePanel();
  });

  // Evitar que los clics dentro del contenido cierren el panel
  const content = document.getElementById("infoModalContent");
  if (content) {
    content.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }
})();



    

  // Efecto parallax en imagen de bienvenida
  window.addEventListener("scroll", function () {
    const image = document.querySelector(".welcome-image");
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (image) {
      image.style.transform = `translateY(${scrollTop * 0.3}px)`;
    }
  });






// --- Búsqueda de productos ---
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("search");
const provinciaInput = document.getElementById("provincia");
const ciudadInput = document.getElementById("ciudad");

function buscarProductos() {
  const query = searchInput.value.trim();
  const provincia = provinciaInput.value.trim();
  const ciudad = ciudadInput.value.trim();

  let url = `/proyecto-web/api/busqueda-productos?`;
  const params = [];
  if (query) params.push(`q=${encodeURIComponent(query)}`);
  if (provincia) params.push(`provincia=${encodeURIComponent(provincia)}`);
  if (ciudad) params.push(`ciudad=${encodeURIComponent(ciudad)}`);
  url += params.join("&");

  fetch(url)
    .then((response) => response.json())
    .then((productos) => {
      const grid = document.getElementById("productGrid");
      grid.innerHTML = "";

      if (productos.length === 0) {
        grid.innerHTML = "<p style='color: white;'>No se encontraron productos.</p>";
        return;
      }

      productos.forEach((producto) => {
        const card = document.createElement("div");
        card.className = "producto";
        card.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}" style="width:150px;height:150px;">
          <h3>${producto.nombre}</h3>
          <button class="more-info-btn"
            data-empresa="${producto.empresa || ''}"
            data-imagen="${producto.imagen || ''}"
            data-nombre="${producto.nombre || ''}"
            data-descripcion="${producto.descripcion || ''}"
            data-provincia="${producto.provincia || ''}"
            data-ciudad="${producto.ciudad || ''}"
            data-telefono="${producto.telefono || ''}"
            data-correo="${producto.correo || ''}"
            data-precio="${producto.precio || ''}"
          >
            Más información
          </button>
        `;
        grid.appendChild(card);
      });
    })
    .catch((error) => console.error("Error al buscar productos:", error));
}

if (searchButton) {
  searchButton.addEventListener("click", buscarProductos);
}

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    buscarProductos();
  }
});

provinciaInput.addEventListener("change", buscarProductos);
ciudadInput.addEventListener("input", buscarProductos);


// --- Eventos de búsqueda ---
searchButton.addEventListener("click", buscarProductos);

// Ejecutar búsqueda al presionar Enter en el input
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    buscarProductos();
  }
});

// Ejecutar búsqueda al cambiar provincia o ciudad
provinciaInput.addEventListener("change", buscarProductos);
ciudadInput.addEventListener("input", buscarProductos);

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchButton.click();
    }
  });















// Capturar clics en filtros de categoría
let filtroPrincipal = null;
let categoriaSeleccionada = null;

document.querySelectorAll(".main").forEach((btn) => {
  btn.addEventListener("click", () => {
    filtroPrincipal = btn.dataset.main;
    document.querySelectorAll(".main").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    cargarProductos();
  });
});

document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    categoriaSeleccionada = btn.dataset.category;
    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    cargarProductos();

    // 🔹 Solo abrir modal si es "Mi tienda"
    if (categoriaSeleccionada === "Mi tienda") {
      document.getElementById("miTiendaModal").style.display = "block";
    } else {
      // 🔹 Ocultar botón si cambia de categoría
      document.getElementById("accionesTienda").style.display = "none";
    }
  });
});

function cargarProductos() {
  const params = new URLSearchParams();
  if (filtroPrincipal) params.append("filtro", filtroPrincipal);
  if (categoriaSeleccionada) params.append("categoria", categoriaSeleccionada);

  fetch(`/proyecto-web/api/productos-filtrados?${params.toString()}`)
    .then((response) => response.json())
    .then((productos) => {
      const grid = document.getElementById("productGrid");
      grid.innerHTML = "";

      if (productos.length === 0) {
        grid.innerHTML = '<p style="color:white;">No se encontraron productos..</p>';
        return;
      }

      productos.forEach((producto) => {
        const card = document.createElement("div");
        card.className = "producto";
        card.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}" style="width:150px;height:150px;">
          <h3>${producto.nombre}</h3>
          <button class="more-info-btn"
            data-empresa="${producto.empresa || ''}"
            data-imagen="${producto.imagen || ''}"
            data-nombre="${producto.nombre || ''}"
            data-descripcion="${producto.descripcion || ''}"
            data-provincia="${producto.provincia || ''}"
            data-ciudad="${producto.ciudad || ''}"
            data-telefono="${producto.telefono || ''}"
            data-correo="${producto.correo || ''}"
            data-precio="${producto.precio || ''}"
          >
            Más información
          </button>
        `;
        grid.appendChild(card);
      });
    })
    .catch((error) => console.error("Error al cargar productos filtrados:", error));
}

// Cerrar modal
document.getElementById("cerrarMiTiendaModal").addEventListener("click", () => {
  document.getElementById("miTiendaModal").style.display = "none";
  document.getElementById("accionesTienda").style.display = "none"; // 🔹 Ocultar botón al cerrar
});

// Manejo del formulario (login)
document.getElementById("miTiendaForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const cedula = document.getElementById("miTiendaCedula").value;
  const password = document.getElementById("miTiendaPassword").value;
  const errorMsg = document.getElementById("errorMsgMiTienda");
  errorMsg.style.display = "none";

  fetch("/proyecto-web/api/mi-tienda-login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `cedula=${encodeURIComponent(cedula)}&password=${encodeURIComponent(password)}`
  })
  .then(response => {
    if (response.ok) {
      document.getElementById("miTiendaModal").style.display = "none";

      // ✅ Mostrar botón SOLO después del login exitoso
      document.getElementById("accionesTienda").style.display = "block";

      // Cargar productos del vendedor
      cargarProductosMiTienda(cedula);
    } else {
      return response.text().then(text => {
        errorMsg.textContent = text || "Credenciales inválidas";
        errorMsg.style.display = "block";
      });
    }
  })
  .catch(err => {
    console.error("Error:", err);
    errorMsg.textContent = "Error en la conexión";
    errorMsg.style.display = "block";
  });
});







































































let productoSeleccionado = null;

// Seleccionar producto al hacer clic
document.getElementById("productGrid").addEventListener("click", (e) => {
  const card = e.target.closest(".producto");
  if (!card) return;

  // Deseleccionar anterior
  document.querySelectorAll(".producto").forEach(p => p.classList.remove("selected"));

  // Seleccionar actual
  card.classList.add("selected");

  // Guardar atributos del producto usando el ID
  const btn = card.querySelector(".more-info-btn");
  productoSeleccionado = {
    id: btn.dataset.id,   // 🔹 ahora usamos ID
    nombre: btn.dataset.nombre,
    descripcion: btn.dataset.descripcion
    // resto de atributos opcionales si los necesitas
  };
});

// Botón Eliminar Producto
document.getElementById("deleteProductButton").addEventListener("click", () => {
  if (!productoSeleccionado) {
    alert("Seleccione un producto para eliminar.");
    return;
  }

  if (!confirm(`¿Desea eliminar el producto "${productoSeleccionado.nombre}" con descripción "${productoSeleccionado.descripcion}"?`)) {
    return;
  }

  // Llamada a la API usando solo el ID
  fetch("http://localhost:8080/proyecto-web/EliminarProducto", {
    method: "POST", // usamos POST para mantener compatibilidad con tu servlet
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      id: productoSeleccionado.id
    })
  })
  .then(response => {
    if (response.ok) {
      alert("Producto eliminado con éxito.");
      // recargar productos usando la cédula guardada en el input
      const cedula = document.getElementById("miTiendaCedula").value;
      cargarProductosMiTienda(cedula);
      productoSeleccionado = null;
    } else {
      alert("No se pudo eliminar el producto.");
    }
  })
  .catch(err => console.error("Error en la eliminación:", err));
});



  document.addEventListener("click", function (e) {
    // Mostrar información al hacer clic en el botón
    if (e.target.classList.contains("more-info-btn")) {
      const telefono = e.target.dataset.telefono;
      const correo = e.target.dataset.correo;
      const ubicacion = e.target.dataset.ubicacion;
      const empresa = e.target.dataset.empresa;

      document.getElementById(
        "infoEmpresa"
      ).innerHTML = `<strong>🏢 Empresa:</strong> ${empresa}`;
      document.getElementById("infoContacto").innerHTML = `
    <strong>📞 Teléfono:</strong> ${telefono}<br>
    <strong>📧 Correo:</strong> ${correo}<br>
    <strong>📍 Ubicación:</strong> ${ubicacion}
  `;
      document.getElementById("infoModal").style.display = "block";
    }

    // Cerrar si se hace clic en la X o fuera del contenido
    if (
      e.target.classList.contains("close-info") ||
      (e.target.id === "infoModal" && !e.target.closest(".modal-content"))
    ) {
      document.getElementById("infoModal").style.display = "none";
    }

    let offsetX, offsetY;
    const modalContent = document.getElementById("infoModalContent");

    modalContent.addEventListener("mousedown", function (e) {
      offsetX = e.clientX - modalContent.offsetLeft;
      offsetY = e.clientY - modalContent.offsetTop;

      function onMouseMove(e) {
        modalContent.style.left = e.clientX - offsetX + "px";
        modalContent.style.top = e.clientY - offsetY + "px";
      }

      function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  });




























// --- Depuración: ver qué elementos se encontraron
console.log("DEBUG roles:", {
  rolesContainer: document.getElementById("rolesContainer"),
  btnVendedor: document.getElementById("btnVendedor"),
  btnComprador: document.getElementById("btnComprador"),
  volverRolesBtn: document.getElementById("volverRolesBtn"),
  registroVendedorUnificado: document.getElementById("registroVendedorUnificado"),
  formularioComprador: document.getElementById("formularioComprador"),
  pasoUsuario: document.getElementById("pasoUsuario"),
  btnAtrasVendedor: document.getElementById("btnAtrasVendedor"),
  btnAtrasComprador: document.getElementById("btnAtrasComprador")
});

// --- Variables principales
const rolesContainer = document.getElementById("rolesContainer");
const formularioComprador = document.getElementById("formularioComprador");
const registroVendedorUnificado = document.getElementById("registroVendedorUnificado");
const usuarioIdVisible = document.getElementById("usuarioIdVisible");
const contenidoVendedorRegistrado = document.getElementById("contenidoVendedorRegistrado");

const pasoUsuario = document.getElementById("pasoUsuario");
const pasoSolicitud = document.getElementById("pasoSolicitud");
const pasoSuscripcion = document.getElementById("pasoSuscripcion");

const btnVendedor = document.getElementById("btnVendedor");
const btnComprador = document.getElementById("btnComprador");
const volverRolesBtn = document.getElementById("volverRolesBtn");
const btnAtrasVendedor = document.getElementById("btnAtrasVendedor");
const btnAtrasComprador = document.getElementById("btnAtrasComprador");

const btnSiguienteUsuario = document.getElementById("btnSiguienteUsuario");
const btnSiguienteSolicitud = document.getElementById("btnSiguienteSolicitud");
const btnAtrasSolicitud = document.getElementById("btnAtrasSolicitud");
const btnAtrasSuscripcion = document.getElementById("btnAtrasSuscripcion");

let usuarioId = null;

// --- Funciones reutilizables
function openVendedorFlow() {
  console.log("openVendedorFlow");
  rolesContainer.style.display = "none";
  registroVendedorUnificado.style.display = "block";
  pasoUsuario.style.display = "block";
}

function openCompradorFlow() {
  console.log("openCompradorFlow");
  rolesContainer.style.display = "none";
  formularioComprador.style.display = "block";
}

function closeRegistroModal() {
  console.log("closeRegistroModal");
  const registroModal = document.getElementById("registroModal");
  if (registroModal) registroModal.style.display = "none";
  const loginModal = document.getElementById("loginModal");
  if (loginModal) loginModal.style.display = "block"; // ✅ Mostrar login al cerrar registro
}

function backFromVendedor() {
  console.log("backFromVendedor");
  registroVendedorUnificado.style.display = "none";
  rolesContainer.style.display = "block";
}

function backFromComprador() {
  console.log("backFromComprador");
  formularioComprador.style.display = "none";
  rolesContainer.style.display = "block";
}

// --- Eventos principales
btnVendedor?.addEventListener("click", openVendedorFlow);
btnComprador?.addEventListener("click", openCompradorFlow);
volverRolesBtn?.addEventListener("click", closeRegistroModal);
btnAtrasVendedor?.addEventListener("click", backFromVendedor);
btnAtrasComprador?.addEventListener("click", backFromComprador);
btnAtrasSolicitud?.addEventListener("click", backFromSolicitud);
btnAtrasSuscripcion?.addEventListener("click", backFromSuscripcion);


volverRolesBtn?.addEventListener("click", () => {
  console.log("volverRolesBtn → ir al login");
  
  // Cerrar el modal de registro
  const registroModal = document.getElementById("registroModal");
  if (registroModal) registroModal.style.display = "none";
  
  // Asegurar que todos los subformularios se oculten
  rolesContainer.style.display = "none";
  registroVendedorUnificado.style.display = "none";
  formularioComprador.style.display = "none";
  
  // Abrir el modal de login
  const loginModal = document.getElementById("loginModal");
  if (loginModal) {
    loginModal.style.display = "block";
  } else {
    console.warn("⚠️ No se encontró el loginModal en el DOM");
  }
});

function backFromSolicitud() {
  console.log("Volviendo de solicitud a usuario...");
  pasoSolicitud.style.display = "none";
  pasoUsuario.style.display = "block";
}

function backFromSuscripcion() {
  console.log("Volviendo de suscripción a solicitud...");
  pasoSuscripcion.style.display = "none";
  pasoSolicitud.style.display = "block";
}










// -----------------------
// PASO 1 → Registro usuario vendedor
// -----------------------
btnSiguienteUsuario?.addEventListener("click", async () => {
  const nombre = document.getElementById("nombreV").value;
  const correo = document.getElementById("correoV").value;
  const contraseña = document.getElementById("contraseñaV").value;
  if (!nombre || !correo || !contraseña) return alert("Complete todos los campos.");

  try {
    const formData = new URLSearchParams({ nombre, correo, contraseña });
    const res = await fetch("/proyecto-web/registroVendedor", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });

    const data = await res.json();
    usuarioId = data.usuarioId;
    usuarioIdVisible.textContent = "ID de usuario: " + usuarioId;

    pasoUsuario.style.display = "none";
    pasoSolicitud.style.display = "block";
  } catch (err) {
    console.error(err);
    alert("Error al guardar usuario");
  }
});

// -----------------------
// PASO 2 → Solicitud vendedor
// -----------------------
btnSiguienteSolicitud?.addEventListener("click", async () => {
  const provincia = pasoSolicitud.querySelector("[name=provincia]").value;
  const canton = pasoSolicitud.querySelector("[name=canton]").value;
  const descripcion = pasoSolicitud.querySelector("[name=descripcion]").value;
  const precio_promedio = pasoSolicitud.querySelector("[name=precio_promedio]").value;
  const telefono = pasoSolicitud.querySelector("[name=telefono]").value;

  if (!provincia || !canton || !descripcion) return alert("Complete todos los campos.");

  const usuarioIdFromDiv = parseInt(usuarioIdVisible.textContent.replace("ID de usuario: ", "").trim());
  if (!usuarioIdFromDiv) return alert("Usuario no registrado.");

  try {
    const solicitudData = new URLSearchParams({
      provincia,
      canton,
      descripcion,
      precio_promedio,
      telefono,
      usuario_id: usuarioIdFromDiv
    });

    await fetch("/proyecto-web/guardarSolicitud", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: solicitudData.toString()
    });

    // 🔥 Ocultar modales que interfieran
    document.getElementById("loginModal").style.display = "none";
    rolesContainer.style.display = "none";
    pasoUsuario.style.display = "none";
    pasoSolicitud.style.display = "none";
    pasoSuscripcion.style.display = "block";
  } catch (err) {
    console.error(err);
    alert("Error al guardar solicitud");
  }
});
// -----------------------
// REGISTRO COMPRADOR (versión corregida)
// -----------------------
const registroFormComprador = document.getElementById("registroFormComprador");

registroFormComprador?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombreC").value;
  const correo = document.getElementById("correoC").value;
  const contraseña = document.getElementById("contraseñaC").value;

  if (!nombre || !correo || !contraseña) {
    alert("Complete todos los campos.");
    return;
  }

  try {
    const formData = new URLSearchParams({ nombre, correo, contraseña });
    const res = await fetch("/proyecto-web/registroComprador", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString()
    });

    if (!res.ok) {
      const msg = await res.text();
      alert(res.status === 409 ? msg : "Error al registrar comprador: " + msg);
      return;
    }

    const usuarioId = await res.text();
    if (!usuarioId || parseInt(usuarioId) <= 0)
      throw new Error("No se pudo registrar el usuario");

    usuarioIdVisible.textContent = "ID de usuario: " + usuarioId;
    alert("¡Comprador registrado con éxito! ID: " + usuarioId);

    // 🔥 Cerrar todos los modales y mostrar el contenido principal
    ["registroModal", "loginModal", "formularioComprador", "rolesContainer",
     "pasoUsuario", "pasoSolicitud", "pasoSuscripcion"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });

    // ✅ Mostrar contenido principal o contenedor visible tras registro
    const contenidoPrincipal =
      document.getElementById("contenidoCompradorRegistrado") ||
      document.getElementById("contenidoPrincipal") ||
      document.getElementById("contenidoVendedorRegistrado");

    if (contenidoPrincipal) {
      contenidoPrincipal.style.display = "block";
    } else {
      console.warn("⚠️ No se encontró contenedor de contenido principal");
    }

  } catch (err) {
    console.error(err);
    alert("Error al conectar con el servidor: " + err.message);
  }
});






























































// ==========================
// Variables modales y botones (igual que antes)
// ==========================
const loginModal = document.getElementById("loginModal");
const modalVendedor = document.getElementById("modalVendedor");
const modalComprador = document.getElementById("modalComprador");
const registroModal = document.getElementById("registroModal");

const cancelarBtn = document.getElementById("cancelarBtn");
const continuarBtn = document.getElementById("continuarBtn");
const registrarseBtn = document.getElementById("registrarseBtn");

const btnInvitado = document.querySelector(".role-btn.invitado");

const btnVolverVendedor = modalVendedor?.querySelector(".volver-btn");
const btnVolverComprador = modalComprador?.querySelector(".volver-btn");
const volverRegistroBtn = registroModal?.querySelector(".volver-btn");

// Elemento donde guardamos el id (pequeño/oculto)

const usuarioIdVisibleEl = document.getElementById("usuarioIdVisible");

// Guardar ID (lo hace visible y en sessionStorage)
function setUsuarioId(id) {
  if(!id) return;
  if(usuarioIdVisibleEl) {
    usuarioIdVisibleEl.textContent = id;
    usuarioIdVisibleEl.style.display = "block"; // aunque muy pequeño y transparente
  }
  sessionStorage.setItem("usuarioId", String(id));
}

// Obtener ID (desde el div o sessionStorage)
function getUsuarioId() {
  const fromEl = usuarioIdVisibleEl?.textContent?.trim();
  if(fromEl && /^\d+$/.test(fromEl)) return fromEl;
  const fromSession = sessionStorage.getItem("usuarioId");
  if(fromSession && /^\d+$/.test(fromSession)) return fromSession;
  return null;
}












// ==========================
// Funciones generales
// ==========================
function showModal(modal) { if(modal){ modal.style.display = "flex"; document.body.classList.add("modal-open"); } }
function hideModal(modal) { if(modal){ modal.style.display = "none"; document.body.classList.remove("modal-open"); } }
function ocultarTodo() {
  ["contenidoInvitado","contenidoCompradorRegistrado","contenidoVendedorRegistrado"].forEach(id=>{
    const el = document.getElementById(id); if(el) el.style.display="none";
  });
}
function cancelarFormulario(idFormulario, idForm) {
  if(confirm("¿Desea borrar la información escrita?")) {
    document.getElementById(idForm)?.reset();
    const f = document.getElementById(idFormulario);
    if(f) f.style.display = "none";
    document.getElementById("rolesContainer")?.style.setProperty("display","flex");
  }
}



// ==========================
// Mostrar login al cargar (solo si NO hay usuarioIdVisible con número válido)
// ==========================
window.addEventListener("DOMContentLoaded", () => {
  const usuarioIdVisible = document.getElementById("usuarioIdVisible");
  const texto = usuarioIdVisible?.textContent?.trim() || "";

  // Verifica si el texto contiene un número (ID válido)
  const tieneId = /\d+/.test(texto);

  // Si NO hay ID, muestra el login
  if (!tieneId && loginModal) {
    loginModal.style.display = "flex";
  } else {
    // Si hay ID, NO reinicia el flujo ni toca el modal actual
    console.log("Usuario activo detectado, no se muestra login.");
  }
});














// ==========================
// Login: botones (igual que antes)
// ==========================
cancelarBtn?.addEventListener("click", () => hideModal(loginModal));
continuarBtn?.addEventListener("click", () => { alert("Has continuado con tu selección"); hideModal(loginModal); });

// ==========================
// Registro general / abrir modal registro (igual)
// ==========================
registrarseBtn?.addEventListener("click", () => {
  hideModal(loginModal);
  showModal(registroModal);
  document.getElementById("formularioComprador")?.style.setProperty("display","none");
  document.getElementById("rolesContainer")?.style.setProperty("display","flex");
});

volverRegistroBtn?.addEventListener("click", () => {
  hideModal(registroModal);
  showModal(loginModal);
  document.getElementById("formularioComprador")?.style.setProperty("display","none");
  document.getElementById("rolesContainer")?.style.setProperty("display","flex");
});

// ==========================
// Selección de rol (mantener comportamiento original)
// ==========================
btnVendedor?.addEventListener("click", () => { hideModal(loginModal); showModal(modalVendedor); });
btnComprador?.addEventListener("click", () => { hideModal(loginModal); showModal(modalComprador); });
btnInvitado?.addEventListener("click", () => { ocultarTodo(); hideModal(loginModal); document.getElementById("contenidoInvitado")?.style.setProperty("display","block"); actualizarMiTienda("invitado"); });

btnVolverVendedor?.addEventListener("click", () => { hideModal(modalVendedor); showModal(loginModal); });
btnVolverComprador?.addEventListener("click", () => { hideModal(modalComprador); showModal(loginModal); });









// ==========================
// Cancelar formularios (mantén todo igual)
// ==========================
document.getElementById("btnCancelar")?.addEventListener("click",()=>cancelarFormulario("formularioComprador","registroForm"));
document.getElementById("btnCancelarVendedor")?.addEventListener("click",()=>cancelarFormulario("formularioVendedor","registroFormVendedor"));
document.getElementById("btnCancelarSolicitud")?.addEventListener("click",()=>cancelarFormulario("formularioSolicitud","solicitudForm"));
document.getElementById("btnCancelarSuscripcion")?.addEventListener("click",()=>cancelarFormulario("formularioSuscripcion","suscripcionForm"));

// ==========================
// Botones paso a paso vendedor (mantén comportamiento)
// ==========================
document.getElementById("btnVendedor")?.addEventListener("click",()=>avanzarFlujo("rolesContainer","formularioVendedor"));
document.getElementById("btnSiguienteSolicitud")?.addEventListener("click",()=>avanzarFlujo("formularioVendedor","formularioSolicitud"));
document.getElementById("btnSiguienteSuscripcion")?.addEventListener("click",()=>avanzarFlujo("formularioSolicitud","formularioSuscripcion"));
document.getElementById("btnComprador")?.addEventListener("click",()=>avanzarFlujo("rolesContainer","formularioComprador"));

// ==========================
// Helpers para usuarioId
// ==========================
function setUsuarioId(id) {
  if(!id) return;
  // guardamos visible (pero tiny) y en sessionStorage
  if(usuarioIdVisibleEl) {
    usuarioIdVisibleEl.textContent = id;
    usuarioIdVisibleEl.style.display = "block"; // ya lo definiste muy pequeño/transparent
  }
  sessionStorage.setItem("usuarioId", String(id));
}

function getUsuarioId() {
  // priorizar el elemento visible, si no fallback a sessionStorage
  const fromEl = usuarioIdVisibleEl?.textContent?.trim();
  if(fromEl && /^\d+$/.test(fromEl)) return fromEl;
  const fromSession = sessionStorage.getItem("usuarioId");
  if(fromSession && /^\d+$/.test(fromSession)) return fromSession;
  return null;
}














































// 🔹 Bloquear "Mi tienda" según tipo de usuario
function actualizarMiTienda(usuario) {
  const miTiendaBtn = document.querySelector('.filter[data-category="Mi tienda"]');
  if (!miTiendaBtn) return;

  if (usuario === "vendedor" || usuario === "vendedor-recién-registrado") {
    miTiendaBtn.disabled = false;
    miTiendaBtn.style.opacity = 1;
  } else {
    miTiendaBtn.disabled = true;
    miTiendaBtn.style.opacity = 0.5;
  }
}

// 🔹 Acceder Vendedor (LOGIN, sin bienvenida)
document.getElementById("btnAccederVendedor")?.addEventListener("click", function () {
  const cedula = document.getElementById("cedulaVendedor").value;
  const contraseña = document.getElementById("passwordVendedor").value;

  fetch("LoginVendedorServlet", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `cedula=${encodeURIComponent(cedula)}&contraseña=${encodeURIComponent(contraseña)}`
  })
  .then(response => {
    if (response.ok) {
      alert("Inicio de sesión exitoso");
      ocultarTodo();
      document.getElementById("modalVendedor")?.style.setProperty("display", "none");
      // ❌ quitamos la bienvenida de vendedor registrado
      actualizarMiTienda("vendedor");
    } else {
      return response.text().then(text => { throw new Error(text); });
    }
  })
  .catch(error => { alert(error.message); });
});





  



// 🔹 Acceder Comprador (LOGIN, sin bienvenida)
document.getElementById("btnAccederComprador")?.addEventListener("click", function () {
  const correo = document.getElementById("correoComprador").value;
  const contraseña = document.getElementById("passwordComprador").value;

  fetch("LoginCompradorServlet", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `correo=${encodeURIComponent(correo)}&contraseña=${encodeURIComponent(contraseña)}`
  })
  .then(response => {
    if (response.ok) {
      alert("Inicio de sesión exitoso");
      ocultarTodo();
      document.getElementById("modalComprador")?.style.setProperty("display", "none");
      document.getElementById("contenidoCompradorActivo").style.display = "block";
      actualizarMiTienda("comprador");  // 🔹 Ahora sí se bloquea correctamente
    } else {
      return response.text().then(text => { throw new Error(text); });
    }
  })
  .catch(error => { alert(error.message); });
});



// Control método de pago paginaComprador
const metodoPago = document.getElementById('metodoPago');
const tarjetaCampos = document.getElementById('tarjetaCampos');
const numeroSimpe = document.getElementById('numeroSimpe');
const depositoCampos = document.getElementById('depositoCampos'); // ✅ nuevo
const contenedor = document.getElementById('contenedorPagoExtra');

metodoPago.addEventListener('change', function () {
  // Ocultamos todos primero
  tarjetaCampos.classList.add('oculto');
  numeroSimpe.classList.add('oculto');
  depositoCampos.classList.add('oculto'); // ✅ ocultar depósito también

  contenedor.style.height = contenedor.scrollHeight + 'px';

  setTimeout(() => {
    let nuevoContenido;

    if (this.value === 'tarjeta') {
      tarjetaCampos.classList.remove('oculto');
      nuevoContenido = tarjetaCampos;
    } else if (this.value === 'simpe') {
      numeroSimpe.classList.remove('oculto');
      nuevoContenido = numeroSimpe;
    } else if (this.value === 'deposito') { // ✅ depósito
      depositoCampos.classList.remove('oculto');
      nuevoContenido = depositoCampos;
    }

    setTimeout(() => {
      const nuevaAltura = nuevoContenido ? nuevoContenido.scrollHeight + 20 : 0;
      contenedor.style.height = nuevaAltura + 'px';
    }, 50);
  }, 50);
});

// Mostrar características según suscripción
const radiosSuscripcion = document.querySelectorAll('input[name="suscripcion"]');
const divBasica = document.getElementById('caracteristicasBasica');
const divAvanzada = document.getElementById('caracteristicasAvanzada');

radiosSuscripcion.forEach(radio => {
  radio.addEventListener('change', function () {
    if (this.value === 'Básica') {
      divBasica.style.display = 'block';
      divAvanzada.style.display = 'none';
    } else if (this.value === 'Avanzada') {
      divBasica.style.display = 'none';
      divAvanzada.style.display = 'block';
    }
  });
});

// Submit formulario solicitud
document.getElementById('solicitudForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(this);

  fetch('/proyecto-web/guardarSolicitud', {
    method: 'POST',
    body: formData
  })
  .then(resp => {
    if (!resp.ok) throw resp;
    return resp.text();
  })
  .then(data => alert(data))
  .catch(async err => {
    const msg = await err.text();
    alert('Error: ' + msg);
  });
});









































});
