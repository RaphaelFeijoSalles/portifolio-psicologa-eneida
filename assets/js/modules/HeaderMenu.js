/**
 * Classe responsável pelo comportamento do Menu Mobile, 
 * Scroll-Spy (marcar link ativo) e Smooth Scroll (rolagem suave).
 */
export class HeaderMenu {
    constructor() {
        this.hamburger = document.getElementById("hamburger");
        this.navMenu = document.getElementById("nav-menu");
        this.navLinks = document.querySelectorAll(".nav-link");
        this.header = document.getElementById("app-header");
        this.banner = document.getElementById("event-banner");
        
        // Binds
        this.toggleMenu = this.toggleMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.smoothScroll = this.smoothScroll.bind(this);
    }

    init() {
        if (!this.hamburger || !this.navMenu) return;
        this.bindEvents();
        // Inicializa a marcação do menu ao carregar a página
        this.handleScroll();
    }

    bindEvents() {
        this.hamburger.addEventListener("click", this.toggleMenu);
        
        this.navLinks.forEach(link => {
            link.addEventListener("click", this.closeMenu);
            
            // Adiciona a rolagem suave aos links que são âncoras
            if (link.getAttribute("href").includes("#")) {
                link.addEventListener("click", this.smoothScroll);
            }
        });

        // Escuta o scroll da página para atualizar o link ativo
        window.addEventListener("scroll", this.handleScroll);
    }

    unbindEvents() {
        this.hamburger.removeEventListener("click", this.toggleMenu);
        window.removeEventListener("scroll", this.handleScroll);
    }

    toggleMenu() {
        this.hamburger.classList.toggle("active");
        this.navMenu.classList.toggle("active");
    }

    closeMenu() {
        if (this.navMenu.classList.contains("active")) {
            this.hamburger.classList.remove("active");
            this.navMenu.classList.remove("active");
        }
    }

    // Lógica para marcar o link do menu correspondente à seção atual
    handleScroll() {
        // Só executa se existirem seções na página (ex: home)
        const sections = document.querySelectorAll("main section[id]");
        if (sections.length === 0) return;

        let fromTop = window.scrollY;
        let bannerHeight = (this.banner && !this.banner.classList.contains("hidden")) ? this.banner.offsetHeight : 0;
        let headerHeight = this.header ? this.header.offsetHeight : 70;
        let totalOffset = headerHeight + bannerHeight + 50; // Margem de segurança

        let currentSection = "";

        sections.forEach(section => {
            if (
                section.offsetTop - totalOffset <= fromTop &&
                section.offsetTop + section.offsetHeight - totalOffset > fromTop
            ) {
                currentSection = section.getAttribute("id");
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove("active");
            if (currentSection && link.getAttribute("href").endsWith("#" + currentSection)) {
                link.classList.add("active");
            }
        });
    }

    // Lógica para rolagem suave compensando a altura do header e do banner dinâmico
    smoothScroll(e) {
        const linkHref = e.currentTarget.getAttribute("href");
        
        // Verifica se o link é para a própria página em que estamos
        const isIndexPage = window.location.pathname === "/" || window.location.pathname.endsWith("index.html");
        
        if (linkHref.startsWith("#") || (linkHref.startsWith("/index.html#") && isIndexPage)) {
            e.preventDefault();
            
            const targetId = linkHref.substring(linkHref.indexOf("#"));
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                let bannerHeight = (this.banner && !this.banner.classList.contains("hidden")) ? this.banner.offsetHeight : 0;
                let headerHeight = this.header ? this.header.offsetHeight : 70;
                
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerHeight - bannerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            } else if (linkHref.startsWith("/index.html#")) {
                // Se a seção não existe nesta página (ex: clicou em 'Home' estando na pág. do Evento)
                window.location.href = linkHref;
            }
        }
    }
}