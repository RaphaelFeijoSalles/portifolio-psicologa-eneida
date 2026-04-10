/* ==========================================================================
   GUIA DE USO - Classes CSS Utilitárias e Específicas
   ========================================================================== */

/*
IMPORTANTE: Este guia documenta todas as classes CSS disponíveis no projeto.
Use-as ao invés de adicionar estilos inline aos elementos HTML.

Estrutura dos Arquivos CSS:
├── base/
│   ├── variables.css (cores, tipografia, tamanhos padrão)
│   ├── reset.css (reset global, tipografia base)
│   └── utilities.css ← USE ESTAS CLASSES!
├── layout/
│   ├── header.css
│   ├── footer.css
│   └── banner.css
├── components/
│   ├── buttons.css
│   ├── cards.css
│   └── forms.css
├── pages/
│   ├── home.css
│   ├── eventos.css
│   └── success.css ← USE ESTAS CLASSES!
└── main.css (orquestrador - @imports todos acima)
*/

/* ==========================================================================
   1. ESPAÇAMENTO - Classes de Margin
   ========================================================================== */

/* Margin Top */
.mt-0 { margin-top: 0; }           /* Nenhum espaço */
.mt-1 { margin-top: 0.5rem; }      /* 8px */
.mt-2 { margin-top: 1rem; }        /* 16px */
.mt-3 { margin-top: 1.5rem; }      /* 24px */
.mt-4 { margin-top: 2rem; }        /* 32px */
.mt-5 { margin-top: 2.5rem; }      /* 40px */
.mt-6 { margin-top: 3rem; }        /* 48px */

/* Margin Bottom */
.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 2rem; }
.mb-5 { margin-bottom: 2.5rem; }
.mb-6 { margin-bottom: 3rem; }

/* Margin Center */
.mx-auto { margin-left: auto; margin-right: auto; }

/* Exemplo de uso:
   <h2 class="mt-4 mb-3">Título com espaço</h2>
*/

/* ==========================================================================
   2. ESPAÇAMENTO - Classes de Padding
   ========================================================================== */

.p-1 { padding: 0.5rem; }          /* 8px em todos os lados */
.p-2 { padding: 1rem; }            /* 16px em todos os lados */
.p-3 { padding: 1.5rem; }          /* 24px em todos os lados */
.p-4 { padding: 2rem; }            /* 32px em todos os lados */
.p-5 { padding: 2.5rem; }          /* 40px em todos os lados */
.p-6 { padding: 3rem; }            /* 48px em todos os lados */

/* Exemplo de uso:
   <div class="p-4 bg-base rounded-md">
     Caixa com padding
   </div>
*/

/* ==========================================================================
   3. LAYOUT - Flexbox
   ========================================================================== */

.flex { display: flex; }                    /* Container flexível */
.flex-column { flex-direction: column; }    /* Itens em coluna */
.flex-center { 
    display: flex; 
    align-items: center; 
    justify-content: center;                /* Centralizado vertical E horizontal */
}
.flex-between { 
    display: flex; 
    justify-content: space-between; 
    align-items: center;                    /* Itens nos extremos, centralizados */
}
.flex-wrap { flex-wrap: wrap; }             /* Quebra de linha */

/* Gap (espaço entre itens) */
.gap-1 { gap: 0.5rem; }
.gap-2 { gap: 1rem; }
.gap-3 { gap: 1.5rem; }
.gap-4 { gap: 2rem; }

.align-center { align-items: center; }
.justify-center { justify-content: center; }

/* Exemplo de uso:
   <div class="flex gap-3">
     <div>Item 1</div>
     <div>Item 2</div>
     <div>Item 3</div>
   </div>
*/

/* ==========================================================================
   4. LAYOUT - Grid
   ========================================================================== */

.grid { display: grid; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; }    /* 2 colunas */
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); } /* 3 colunas */
.grid-gap-2 { gap: 1.5rem; }
.grid-gap-3 { gap: 2rem; }

/* Responsivo automaticamente em mobile (<992px) */

/* Exemplo de uso:
   <div class="grid grid-2 grid-gap-3">
     <div>Card 1</div>
     <div>Card 2</div>
   </div>
*/

/* ==========================================================================
   5. DIMENSÕES
   ========================================================================== */

.w-full { width: 100%; }

.max-w-sm { max-width: 350px; }    /* Small */
.max-w-md { max-width: 600px; }    /* Medium */
.max-w-lg { max-width: 800px; }    /* Large */
.max-w-xl { max-width: 1000px; }   /* XLarge */

.h-80 { height: 80px; }
.h-40 { height: 40px; }

/* Exemplo de uso:
   <div class="max-w-lg mx-auto">
     Conteúdo limitado a 800px
   </div>
*/

/* ==========================================================================
   6. CORES - Texto
   ========================================================================== */

.text-primary { color: var(--color-primary); }      /* Azul escuro */
.text-secondary { color: var(--color-secondary); }  /* Azul com transparência */
.text-dark { color: var(--color-text-dark); }       /* Cinza escuro */
.text-light { color: var(--color-text-light); }     /* Cinza claro */
.text-white { color: var(--color-base); }           /* Branco */

/* Alignment */
.text-center { text-align: center; }
.text-left { text-align: left; }

/* Exemplo de uso:
   <p class="text-secondary text-center">
     Texto cinza centralizado
   </p>
*/

/* ==========================================================================
   7. CORES - Background
   ========================================================================== */

.bg-primary { background-color: var(--color-primary); }      /* Azul escuro */
.bg-secondary { background-color: var(--color-secondary); }  /* Azul */
.bg-accent { background-color: var(--color-accent); }        /* Bege */
.bg-base { background-color: var(--color-base); }            /* Branco */
.bg-alt { background-color: var(--color-background-alt); }   /* Cinza très claro */

/* Exemplo de uso:
   <div class="bg-primary text-white p-4">
     Banner escuro com texto branco
   </div>
*/

/* ==========================================================================
   8. TIPOGRAFIA
   ========================================================================== */

.font-size-sm { font-size: 0.85rem; }   /* 14px */
.font-size-md { font-size: 1rem; }      /* 16px (padrão) */
.font-size-lg { font-size: 1.2rem; }    /* 19px */

.font-weight-bold { font-weight: 700; }
.font-weight-medium { font-weight: 500; }
.font-weight-light { font-weight: 300; }

/* Exemplo de uso:
   <p class="font-size-sm text-light">
     Texto pequeno em cinza claro
   </p>
*/

/* ==========================================================================
   9. BORDER & RADIUS
   ========================================================================== */

.rounded-sm { border-radius: 4px; }
.rounded-md { border-radius: 8px; }
.rounded-lg { border-radius: 12px; }
.rounded-full { border-radius: 50%; }      /* Círculo */

.border-none { border: none; }
.border-subtle { border: 1px solid #eee; }         /* Muito suave */
.border-light { border: 1px solid #ccc; }         /* Leve */
.border-primary { border: 1px solid var(--color-primary); }

/* Exemplo de uso:
   <div class="border-subtle rounded-md p-4">
     Card com borda suave
   </div>
*/

/* ==========================================================================
   10. SOMBRA
   ========================================================================== */

.shadow-sm { box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
.shadow-md { box-shadow: var(--box-shadow); }   /* Padrão do projeto */
.shadow-lg { box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }

/* Exemplo de uso:
   <div class="shadow-md rounded-md p-4">
     Card com sombra
   </div>
*/

/* ==========================================================================
   11. INTERAÇÃO & VISIBILIDADE
   ========================================================================== */

.cursor-pointer { cursor: pointer; }
.cursor-not-allowed { cursor: not-allowed; }

.hidden { display: none !important; }
.visible { display: block; }

/* Exemplo de uso:
   <button class="cursor-pointer">Clique aqui</button>
   <element class="hidden">Invisível</element>
*/

/* ==========================================================================
   CLASSES ESPECÍFICAS - Página de Sucesso
   ========================================================================== */

.success-section { padding: 5rem 0; text-align: center; }
.success-container { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
.success-icon-circle { width: 80px; height: 80px; background-color: #2ecc71; border-radius: 50%; }
.success-title { font-size: 2.5rem; font-weight: 700; color: var(--color-primary); }
.success-subtitle { font-size: 1.1rem; color: var(--color-text-light); }
.success-description { font-size: 1rem; color: var(--color-text-light); max-width: 600px; }
.action-buttons { margin-top: 3rem; display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }

/* Exemplo de uso:
   <section class="success-section">
     <div class="success-container">
       <div class="success-icon-circle">✓</div>
       <h1 class="success-title">Pagamento Aprovado!</h1>
     </div>
   </section>
*/

/* ==========================================================================
   CLASSES ESPECÍFICAS - Formulário
   ========================================================================== */

.form-container { background: var(--color-base); padding: 3rem; border-radius: 8px; max-width: 800px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.form-section-title { font-size: 1.5rem; margin-bottom: 1.5rem; text-align: left; }
.form-section-info { margin-top: 2rem; background: var(--color-background-alt); padding: 1.5rem; border-radius: 8px; }
.form-options { display: flex; flex-direction: column; gap: 12px; }
.radio-option { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.custom-radio { width: 20px; height: 20px; margin: 0; cursor: pointer; }
.radio-label { font-size: 1rem; color: var(--color-text-dark); cursor: pointer; }
.checkout-actions { margin-top: 3rem; text-align: center; padding-top: 2rem; }
.investment-value { margin-bottom: 1.5rem; font-size: 1.2rem; color: var(--color-primary); }
.payment-info-box { background-color: #fdfaf3; border: 1px solid #e0d5b1; padding: 15px; border-radius: 8px; }

/* Responsivo automaticamente em mobile */

/* Exemplo de uso:
   <div class="form-container">
     <h3 class="form-section-title">Dados Pessoais</h3>
     <div class="form-grid">
       <div class="form-group">...</div>
       <div class="form-group">...</div>
     </div>
   </div>
*/

/* ==========================================================================
   DICAS & BOAS PRÁTICAS
   ========================================================================== */

/*
1. SEMPRE prefira classes utilitárias ao invés de styles inline
   ❌ Errado:   <div style="margin-top: 2rem; text-align: center;">
   ✅ Correto:  <div class="mt-4 text-center">

2. COMBINE classes para construir layouts complexos
   <div class="flex gap-3 flex-center p-4 bg-alt rounded-md shadow-md">
     Layout construído com utilidades
   </div>

3. USE grid-2 e flex para layouts responsivos
   - Automáticamente ficam 1 coluna em mobile
   - Sem necessidade de adicionar media queries

4. SEMPRE use cores variáveis (bg-primary, text-secondary, etc)
   - Facilita mudança de tema
   - Mantém consistência visual

5. Para margens/padding consistentes, prefira classes
   .mt-3, .mb-2, .p-4 → melhor que valores aleatórios

6. DOCUMENTAR novos estilos inline removidos
   - Adicionar classe correspondente em utilities.css ou arquivo específico
   - Atualizar este guia

---

Exemplo Completo - Card de Evento:
══════════════════════════════════════════════════════════════════

<div class="bg-base shadow-md rounded-md p-6 max-w-md mx-auto">
  <h3 class="text-primary font-size-lg font-weight-bold mb-3">
    3ª Tarde de Imersão
  </h3>
  
  <p class="text-light font-size-sm mb-4">
    Um convite para desacelerar e enraizar
  </p>
  
  <div class="flex gap-3 flex-wrap">
    <button class="btn-primary">
      Garantir minha vaga
    </button>
    <button class="btn-secondary">
      Saiba mais
    </button>
  </div>
</div>

════════════════════════════════════════════════════════════════════
*/
