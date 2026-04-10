# Eneida Feijó - Portfólio e Landing Pages

Projeto de portfólio profissional e plataforma de inscrição para eventos da psicóloga humanista Eneida Feijó. O foco está em organização modular, performance, responsividade e manutenção sustentável.

## 🌟 Visão Geral do Projeto

- Página inicial com informações institucionais, eventos realizados e chamada para a próxima imersão.
- Página de evento com formulário de inscrição nativo, validação em tempo real e integração com backend de pagamentos.
- Página de sucesso de inscrição com confirmação visual e botão de comprovante quando disponível.
- Banner de evento na homepage que desaparece suavemente ao clicar em "Reserve esse tempo para você" e permanece oculto durante a sessão.

## 🧱 Arquitetura e Padrões

- **HTML componentizado:** `header.html`, `footer.html` e `banner.html` são carregados dinamicamente via Fetch API para reduzir duplicação.
- **CSS modular:** `assets/css/main.css` importa arquivos de layout, componentes, páginas e utilitários.
- **JavaScript modular:** Código dividido em módulos ES6 (`assets/js/modules` e `assets/js/utils`).
- **Sessão de estado leve:** `sessionStorage` é usado para gerenciar o estado do banner na homepage.

## 🚀 Recursos Principais

- Navegação responsiva com menu mobile
- Layout moderno usando CSS Grid e Flexbox
- Formulário de evento com máscara de telefone e validação em tempo real
- Checkout nativo via backend PHP (`/api/create-checkout.php`)
- Página de confirmação com botão dinâmico de comprovante
- Banner exclusivo da homepage que não reaparece após clique enquanto a aba estiver aberta

## 📁 Estrutura de Diretórios

- `/assets/css/`
  - `main.css` — orquestrador de imports
  - `base/` — variáveis globais, reset e utilitários
  - `layout/` — header, footer, banner
  - `components/` — botões, cards, formulários
  - `pages/` — estilos específicos de homepage, eventos e sucesso
- `/assets/js/`
  - `modules/` — `HeaderMenu`, `BannerController`, `EventPageController`, `FooterController`
  - `utils/` — carregamento de componentes, clipboard, helpers
- `/components/` — `header.html`, `footer.html`, `banner.html`
- `/pages/` — `tardedeimersao3/index.html`, `sucesso/index.html`, entre outras páginas de eventos
- `/api/` — backend PHP para criação de checkout e webhook

## 💻 Como Executar Localmente

Por usar módulos ES6 e carregamento assíncrono de componentes, o projeto deve ser executado em servidor local.

### Opção 1 — Live Server (recomendado)
1. Instale a extensão Live Server no VS Code.
2. Abra a raiz do projeto no VS Code.
3. Clique com o botão direito em `index.html` e escolha `Open with Live Server`.

### Opção 2 — Python HTTP Server
No terminal, execute:

```bash
cd /home/raphael/Documentos/program/projetos/portifolio-psicologa-eneida
python3 -m http.server 5500
```

Em seguida, abra `http://localhost:5500` no navegador.

## 🛠️ Tecnologias Utilizadas

- **HTML5**
- **CSS3** (Variables, Flexbox, Grid, responsividade)
- **JavaScript (Vanilla ES6)**
- **PHP** para backend de checkout
- **Fetch API** para templates e requisições assíncronas
- **sessionStorage** para estado de interface local

## 📝 Notas de Implementação

- O banner aparece apenas na homepage e é removido ao clicar no link interno.
- O formulário do evento utiliza validação de email, máscara de telefone e regras simples de consistência.
- O design foi refatorado para remover todo CSS inline e consolidar estilos em arquivos CSS específicos.

## 👤 Desenvolvedor

**Raphael Salles**

> Readme atualizado sempre para refletir a arquitetura atual do projeto.