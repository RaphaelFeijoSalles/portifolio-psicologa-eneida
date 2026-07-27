# Eneida Feijó - Portfólio e Landing Pages

Projeto de portfólio profissional e plataforma de inscrição para eventos da psicóloga humanista Eneida Feijó. O foco está em organização modular, performance, responsividade e manutenção sustentável.

## 🌟 Visão Geral do Projeto

- Página inicial com informações institucionais, eventos realizados e chamada para a próxima imersão.
- Página de evento com formulário de inscrição nativo, validação em tempo real e integração com backend de pagamentos.
- Página de venda de livro físico, com endereço de entrega, consulta automática de CEP e opções de presente/autógrafo.
- Página de sucesso de inscrição com confirmação visual e botão de comprovante quando disponível.
- Banner de evento na homepage que desaparece suavemente ao clicar em "Reserve esse tempo para você" e permanece oculto durante a sessão.

## 🧱 Arquitetura e Padrões

- **HTML componentizado:** `header.html`, `footer.html` e `banner.html` são carregados dinamicamente via Fetch API para reduzir duplicação.
- **CSS modular:** `assets/css/main.css` importa arquivos de layout, componentes, páginas e utilitários.
- **JavaScript modular:** Componentes de venda reutilizáveis (`SalesHero`, `SalesBenefits`, `SalesFAQ` e `CheckoutFormBase`) e regras isoladas por responsabilidade.
- **Sessão de estado leve:** `sessionStorage` é usado para gerenciar o estado do banner na homepage.

## 🚀 Recursos Principais

- Navegação responsiva com menu mobile
- Layout moderno usando CSS Grid e Flexbox
- Formulário de evento com máscara de telefone e validação em tempo real
- Formulário de livro com busca no ViaCEP, link para busca de CEP dos Correios e observações de presente/autógrafo
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
  - `components/sales/` — componentes reutilizáveis das páginas de venda
  - `modules/` — controladores globais, consulta de CEP e preparação do pedido do livro
  - `pages/sales/` — composição da página de imersão e da página de livro
  - `utils/` — carregamento de componentes, clipboard, helpers
- `/components/` — `header.html`, `footer.html`, `banner.html`
- `/pages/` — `tardedeimersao3/index.html`, `livro/index.html`, `sucesso/index.html`, entre outras páginas de eventos
- `/api/` — backend PHP para catálogo de produtos, criação de checkout e webhook

## Configuração de Toggles

O site usa toggles booleanos para controlar elementos como banner e placeholder de eventos. Edite `assets/js/config.js` para alterar:

- `enableBanner`: true/false para exibir banner na homepage.
- `enableEventsPlaceholder`: true/false para mostrar placeholder em "Próximos Eventos".

Exemplo:
```javascript
export const config = {
    enableBanner: false,
    enableEventsPlaceholder: true,
};
```

## Configuração do livro

Copie `.env.example` para `.env` (ou acrescente as chaves ao `.env` já existente) e preencha os dados do produto antes de publicar a venda:

```dotenv
BOOK_TITLE="Título do livro"
BOOK_DESCRIPTION="Descrição enviada à operadora de pagamento"
BOOK_PRICE_CENTS=5990
```

O valor é informado em centavos. Enquanto `BOOK_PRICE_CENTS` não tiver um valor positivo, a página continua visível, mas o botão de pagamento fica desabilitado para evitar uma cobrança com preço incorreto.

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
- O formulário do livro envia o endereço estruturado e uma versão consolidada em `endereco_completo`; as opções selecionadas são incluídas em `observacao` no formato `[Presente, Autografado]`.
- O design foi refatorado para remover todo CSS inline e consolidar estilos em arquivos CSS específicos.

## 👤 Desenvolvedor

**Raphael Salles**

> Readme atualizado sempre para refletir a arquitetura atual do projeto.
