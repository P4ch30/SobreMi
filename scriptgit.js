const body = document.body;
const btnTheme = document.querySelector(".fa-moon");
const btnHamburger = document.querySelector(".fa-bars");
Chart.defaults.font.family = "'Poppins', sans-serif";

const addThemeClass = (bodyClass, btnClass) => {
  body.classList.add(bodyClass); // Añade la clase (light o dark) al body
  btnTheme.classList.add(btnClass); // Añade la clase al botón (para cambiar el ícono)
};

const getBodyTheme = localStorage.getItem("portfolio-theme");
const getBtnTheme = localStorage.getItem("portfolio-btn-theme");

// Al cargar la página, se aplica el tema guardado en el localStorage
addThemeClass(getBodyTheme, getBtnTheme);

const isDark = () => body.classList.contains("dark");

const setTheme = (bodyClass, btnClass) => {
  // Elimina las clases actuales antes de añadir las nuevas
  body.classList.remove(localStorage.getItem("portfolio-theme"));
  btnTheme.classList.remove(localStorage.getItem("portfolio-btn-theme"));

  // Añade las nuevas clases correspondientes al tema
  addThemeClass(bodyClass, btnClass);

  // Guarda las nuevas clases en el localStorage para persistencia
  localStorage.setItem("portfolio-theme", bodyClass);
  localStorage.setItem("portfolio-btn-theme", btnClass);

  // Actualizar gráficos con el nuevo color basado en el tema
  const currentCategory = getCurrentCategory();
  updateCharts(currentCategory);
};


// Alterna entre tema oscuro y claro
const toggleTheme = () =>
  isDark() ? setTheme("light", "fa-moon") : setTheme("dark", "fa-sun");

btnTheme.addEventListener("click", toggleTheme);

const displayList = () => {
  const navUl = document.querySelector(".nav__list");

  if (btnHamburger.classList.contains("fa-bars")) {
    btnHamburger.classList.remove("fa-bars");
    btnHamburger.classList.add("fa-times");
    navUl.classList.add("display-nav-list");
  } else {
    btnHamburger.classList.remove("fa-times");
    btnHamburger.classList.add("fa-bars");
    navUl.classList.remove("display-nav-list");
  }
};

btnHamburger.addEventListener("click", displayList);


const scrollUp = () => {
  const btnScrollTop = document.querySelector(".scroll-top");

  if (body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    btnScrollTop.style.display = "block";
  } else {
    btnScrollTop.style.display = "none";
  }
};

document.addEventListener("scroll", scrollUp);

// Animación de barras de progreso con IntersectionObserver
document.addEventListener("DOMContentLoaded", () => {
  const progressBars = document.querySelectorAll(".progress-bar");

  const animateBar = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const value = bar.getAttribute("data-progress");
        bar.style.width = value + "%"; // Se llena la barra con animación
        observer.unobserve(bar); // Dejar de observar una vez animada
      }
    });
  };

  const observer = new IntersectionObserver(animateBar, {
    threshold: 0.5, // Activa cuando el 50% del elemento es visible
  });

  progressBars.forEach(bar => observer.observe(bar));
});
  
 // Evento de scroll para reducir el tamaño de la barra de navegación horizontalmente
 window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");

  if (window.scrollY > 425) {
      navbar.classList.add("scrolled");
  } else {
      navbar.classList.remove("scrolled");
  }

  // Resetear el temporizador de inactividad cuando haya scroll
  clearTimeout(inactivityTimer);
  navbar.classList.remove("hidden");

  // Establecer el temporizador para ocultar la barra de navegación
  inactivityTimer = setTimeout(function() {
      navbar.classList.add("hidden");
  }, 3000); // 3000ms = 3 segundos de inactividad
});

// Variable para almacenar el temporizador de inactividad
let inactivityTimer;

// Si no hay desplazamiento durante un tiempo, ocultamos la barra
window.addEventListener("mousemove", resetInactivityTimer);
window.addEventListener("keydown", resetInactivityTimer);

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  document.getElementById("navbar").classList.remove("hidden");
  inactivityTimer = setTimeout(function() {
      document.getElementById("navbar").classList.add("hidden");
  }, 3000); // 3 segundos de inactividad

}








//-------------------------------------------------------
// Declaración de gráficos
let pieChart, barChart, bubbleChart;


// Obtener contextos de los canvas
const ctxPie = document.getElementById("chartPie").getContext("2d");
const ctxBar = document.getElementById("chartBar").getContext("2d");
const ctxBubble = document.getElementById("chartBubble").getContext("2d");

// Botones de categoría y elementos de habilidades
const categoryButtons = document.querySelectorAll(".category-btn");
const skillItems = document.querySelectorAll(".skills__list-item");


// Evento click para cambiar categoría
categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    categoryButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    const category = button.dataset.category;
    updateSkillList(category);
    updateCharts(category);
  });
});

// Mostrar/Ocultar habilidades según la categoría
function updateSkillList(category) {
  skillItems.forEach(item => {
    item.style.display =
      category === "All" || item.dataset.category === category
        ? "inline-block"
        : "none";
  });
}

// Función principal para actualizar gráficas
function updateCharts(category) {
  const filtered = Array.from(skillItems).filter(item =>
    category === "All" ? true : item.dataset.category === category
  );

  // Detectar si el tema es oscuro
  const isDark = document.body.classList.contains("dark");

  // Colores según tema
  const themeColors = {
    pie: isDark
      ? ["#0000ff", "#3232ff", "#5a5aff", "#7a7aff", "#9493ed", "#9e9dee"]
      : ["#2777b4", "#1f5f90", "#1b537d", "#133b5a", "#0f2f48", "#0b2336"],
    bar: isDark ? "#0000ff" : "#2777b4",
    bubble: isDark ? "#ff443a77 " : "#2777b46f",
    text: isDark ? "#ffffff" : "#0b2336",
    bg: isDark ? "#0e0e0e" : "#ffffff"
  };

  //-------------------------------------------------------  ["#5E5CE6", "#6e6ce8", "#7c7aea", "#8987ec", "#9493ed", "#9e9dee"]    
  // Pie Chart - distribución por categoría/subcategoría
  const pieData = {};
  if (category === "All") {
    skillItems.forEach(item => {
      const cat = item.dataset.category;
      pieData[cat] = (pieData[cat] || 0) + 1;
    });
  } else {
    filtered.forEach(item => {
      const sub = item.dataset.sub || item.dataset.category;
      pieData[sub] = (pieData[sub] || 0) + 1;
    });
  }

  const pieLabels = Object.keys(pieData);
  const pieValues = Object.values(pieData);

  if (pieChart) pieChart.destroy();
  pieChart = new Chart(ctxPie, {
    type: "pie",
    data: {
      labels: pieLabels,
      datasets: [{
        data: pieValues,
        backgroundColor: themeColors.pie,
        borderColor: themeColors.bg,  
        borderWidth: 2

      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: category === "All"
            ? "Distribución por Categoría"
            : "Distribución por Subcategoría",
          color: themeColors.text
        },
        legend: {
          position: "right",
          labels: {
            color: themeColors.text,
            font: { size: 14 }
          }
        }
      }
    }
  });
  ctxPie.canvas.parentNode.style.backgroundColor = themeColors.bg;

  //-------------------------------------------------------
  // Bar Chart - top 5 habilidades
  const topSkills = filtered
    .map(item => ({
      name: item.dataset.skill,
      level: parseInt(item.dataset.level)
    }))
    .sort((a, b) => b.level - a.level)
    .slice(0, 5);

  if (barChart) barChart.destroy();
  barChart = new Chart(ctxBar, {
    type: "bar",
    data: {
      labels: topSkills.map(s => s.name),
      datasets: [{
        label: "Nivel",
        data: topSkills.map(s => s.level),
        backgroundColor: themeColors.bar
      }]
    },
    options: {
      responsive: true,
      indexAxis: "y",
      plugins: {
        title: {
          display: true,
          text: "Top 5 Habilidades",
          color: themeColors.text
        },
        legend: {
          labels: {
            color: themeColors.text
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          ticks: { color: themeColors.text },
          grid: { color: isDark ? "#555" : "#ccc" }
        },
        y: {
          ticks: { color: themeColors.text },
          grid: { color: isDark ? "#555" : "#ccc" }
        }
      }
    }
  });
  ctxBar.canvas.parentNode.style.backgroundColor = themeColors.bg;

  //-------------------------------------------------------
  // Bubble Chart - visualización por nivel
  const bubbleData = filtered.map(item => ({
    x: Math.random() * 100,
    y: parseInt(item.dataset.level),
    r: parseInt(item.dataset.level) / 4 + 5,
    label: item.dataset.skill
  }));

  if (bubbleChart) bubbleChart.destroy();
  bubbleChart = new Chart(ctxBubble, {
    type: "bubble",
    data: {
      datasets: [{
        label: "Habilidades",
        data: bubbleData,
        backgroundColor: themeColors.bubble
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: context => context.raw.label + " (Nivel: " + context.raw.y + ")"
          }
        },
        title: {
          display: true,
          text: "Visualización de Habilidades por Nivel",
          color: themeColors.text
        },
        legend: {
          labels: {
            color: themeColors.text
          }
        }
      },
      scales: {
        x: {
          display: false,
          grid: { color: isDark ? "#555" : "#ccc" }
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: themeColors.text },
          grid: { color: isDark ? "#555" : "#ccc" }
        }
      }
    }
  });
  ctxBubble.canvas.parentNode.style.backgroundColor = themeColors.bg;
}








// Obtener categoría activa
function getCurrentCategory() {
  const activeButton = document.querySelector(".category-btn.active");
  return activeButton ? activeButton.dataset.category : "All";
}

// Escuchar cambios de clase en body (tema)
const observer = new MutationObserver(() => {
  const currentCategory = getCurrentCategory();
  updateCharts(currentCategory);
});

observer.observe(document.body, {
  attributes: true,
  attributeFilter: ["class"]
});

// Inicializar con todas las habilidades
updateSkillList("All");
updateCharts("All");

// Animación del carrusel
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".skills-carousel");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        carousel.classList.add("shake-animation");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  observer.observe(carousel);
});

