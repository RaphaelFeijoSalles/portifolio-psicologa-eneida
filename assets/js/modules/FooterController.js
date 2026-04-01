export class FooterController {
    init() {
        const p = document.querySelector('#copyright')
        if (!p) return

        const currentYear = new Date().getFullYear()
        p.innerHTML = `&copy; ${currentYear} Eneida Feijó. Todos os direitos reservados.`
    }
}