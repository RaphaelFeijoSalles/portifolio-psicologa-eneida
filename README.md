# Eneida Feijó - Portfólio e Landing Pages

Portfólio profissional e plataforma de inscrição para eventos da psicóloga humanista Eneida Feijó. Projeto focado em performance, design responsivo e arquitetura modular de alta manutenibilidade.

## 🏗️ Arquitetura e Padrões (Refatoração)

O projeto utiliza uma arquitetura baseada em **Componentização e Modularidade Vanilla**:

- **HTML Injection:** O cabeçalho (`header.html`) e o rodapé (`footer.html`) são arquivos isolados, carregados de forma assíncrona (Fetch API) para facilitar a manutenção e evitar duplicação em múltiplas páginas.
- **CSS Modular:** O CSS está fragmentado no diretório `/assets/css/` utilizando `@import` para orquestrar os estilos de layout, base e componentes.
- **JavaScript ES6+ Modules:** A lógica foi dividida usando o padrão POO (Programação Orientada a Objetos). Classes com métodos declarativos (`bindEvents` e `unbindEvents`) garantem um controle rigoroso do ciclo de vida dos eventos no DOM.

## 🚀 Como Executar Localmente

Devido ao uso de **ES6 Modules** (`<script type="module">`) e chamadas de **Fetch API** locais para o HTML, o projeto **precisa ser rodado em um servidor local** (não funcionará abrindo o `index.html` diretamente no navegador devido à política de CORS).

**Recomendação (VS Code):**
1. Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
2. Clique com o botão direito no `index.html` na raiz do projeto.
3. Selecione `Open with Live Server`.

## 📁 Estrutura de Diretórios
- `/assets/css/` - Estilos fragmentados (Variáveis, Layout, UI Components).
- `/assets/js/` - Lógica modularizada.
  - `/modules/` - Classes controladoras (Menu, Eventos).
  - `/utils/` - Funções helpers puras.
- `/components/` - Fragmentos de HTML (Header e Footer).
- `/pages/` - Páginas secundárias (Eventos passados, Sucesso de pagamento).

## 🛠️ Tecnologias
- **HTML5 & CSS3** (CSS Variables, Flexbox, Grid, CSS Modules pattern)
- **JavaScript (Vanilla ES6)** (Async/Await, Classes, Modules)
- Integração iFrame (Google Forms) e Stripe (Checkout)

✒️ **Desenvolvido por:** Raphael Salles