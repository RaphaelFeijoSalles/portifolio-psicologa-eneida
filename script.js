document.addEventListener("DOMContentLoaded", function() {

    // --- 1. LÓGICA DO BANNER DE EVENTO ---
    const banner = document.getElementById("event-banner");
    const closeBannerBtn = document.getElementById("close-banner");

    if (banner && closeBannerBtn) {
        // Mostra o banner após um pequeno delay
        setTimeout(() => {
            banner.classList.add("visible");
        }, 500);

        // Fecha o banner ao clicar no 'X'
        closeBannerBtn.addEventListener("click", () => {
            banner.classList.add("hidden");
        });

        // Fecha o banner ao clicar no link dele
        const bannerLink = banner.querySelector("a");
        if (bannerLink) {
            bannerLink.addEventListener("click", () => {
                banner.classList.add("hidden");
            });
        }
    }

    // --- 2. LÓGICA DO MENU HAMBÚRGUER ---
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (hamburger && navMenu) {
        // Abrir/Fechar com o clique no hambúrguer
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Fechar o menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                if (navMenu.classList.contains("active")) {
                    hamburger.classList.remove("active");
                    navMenu.classList.remove("active");
                }
            });
        });
    }

    // --- 3. LÓGICA DO SCROLLER DE DEPOIMENTOS ---
    const scroller = document.querySelector(".testimonial-scroller-inner");
    if (scroller) {
        const testimonials = Array.from(scroller.children);
        
        testimonials.forEach(item => {
            const duplicate = item.cloneNode(true);
            duplicate.setAttribute("aria-hidden", true); 
            scroller.appendChild(duplicate);
        });
    }

    // --- 4. LÓGICA DE NAVEGAÇÃO (SCROLL-SPY) ---
    // (Funciona apenas no index.html)
    if (document.getElementById("home")) {
        const sections = document.querySelectorAll("section[id]");
        const header = document.getElementById("main-header");

        function changeNavOnScroll() {
            let fromTop = window.scrollY;
            let bannerHeight = (banner && !banner.classList.contains("hidden")) ? banner.offsetHeight : 0;
            let totalOffset = header.offsetHeight + bannerHeight + 50;

            let currentSection = "";

            sections.forEach(section => {
                if (
                    section.offsetTop - totalOffset <= fromTop &&
                    section.offsetTop + section.offsetHeight - totalOffset > fromTop
                ) {
                   currentSection = section.getAttribute("id");
                }
            });

            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === ("#" + currentSection)) {
                    link.classList.add("active");
                }
            });
        }
        window.addEventListener("scroll", changeNavOnScroll);
    }

    // --- 5. LÓGICA DE SCROLL SUAVE ---
    // (Funciona em todas as páginas para links internos)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const header = document.getElementById("main-header");
                const banner = document.getElementById("event-banner");
                let bannerCurrentHeight = (banner && !banner.classList.contains("hidden")) ? banner.offsetHeight : 0;
                
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - header.offsetHeight - bannerCurrentHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});

/* =========================================
   Lógica do Google Forms no Iframe
   ========================================= */
let iframeLoadCount = 0;

function handleFormLoad() {
    iframeLoadCount++;
    
    // O primeiro load é quando a página carrega. O segundo é quando o form é enviado.
    if (iframeLoadCount > 1) {
        const iframe = document.getElementById('google-form-iframe');
        const successFeedback = document.getElementById('success-feedback');
        
        // Esconde o iframe
        iframe.style.display = 'none';
        
        // Mostra a mensagem de sucesso e o certinho
        successFeedback.style.display = 'flex';
        
        // Opcional: Rola a página suavemente até a mensagem para o usuário não ficar perdido no espaço em branco
        successFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Função para rolar direto para a área de pagamento quando clicar no botão novo
function scrollToPayment() {
    const paymentSection = document.querySelector('.investment-options');
    if(paymentSection) {
        paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/* =========================================
   Função para copiar o endereço
   ========================================= */
function copiarEndereco() {
    const enderecoTexto = document.getElementById('endereco-texto').innerText;
    const btnCopy = document.getElementById('btn-copy-endereco');

    // Novo SVG do Check (Mais reto, sólido e definitivo)
    const svgCheck = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
        </svg>
    `;

    navigator.clipboard.writeText(enderecoTexto).then(() => {
        // Salva o ícone original (quadrados vazados)
        const conteudoOriginal = btnCopy.innerHTML;
        
        // Adiciona a classe para ficar verde
        btnCopy.classList.add('copied');
        
        // Substitui pelo ícone de check mais robusto
        btnCopy.innerHTML = svgCheck;
        
        // Restaura o ícone original após 2 segundos
        setTimeout(() => {
            btnCopy.classList.remove('copied');
            btnCopy.innerHTML = conteudoOriginal;
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar o endereço: ', err);
    });
}