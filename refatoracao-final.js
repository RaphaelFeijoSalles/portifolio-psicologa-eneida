const fs = require('fs');
const path = require('path');

// 2. FUNÇÃO RECURSIVA PARA PEGAR TODOS OS ARQUIVOS
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    
    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });
    return arrayOfFiles;
}

const allFiles = getAllFiles(__dirname);

allFiles.forEach(filePath => {
    // Ignorar dependências, o git e este próprio script
    if (filePath.includes('node_modules') || filePath.includes('refatoracao-final.js') || filePath.includes('.git')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // ==========================================
    // SE FOR UM ARQUIVO HTML
    // ==========================================
    if (filePath.endsWith('.html')) {
        
        // 1. Remover a tag do initBase.js cruelmente
        const regexInitBase = /\s*<script\s+src="[^"]*initBase\.js"><\/script>\s*|<script\s+src="[^"]*initBase\.js"><\/script>\s*/g;
        content = content.replace(regexInitBase, '');

        // 2. Calcular a profundidade da pasta (ex: raiz = 0, pages/sucesso = 2)
        const relativeToRoot = path.relative(__dirname, filePath);
        const depth = relativeToRoot.split(path.sep).length - 1;
        const prefix = depth === 0 ? './' : '../'.repeat(depth);

        // 3. Arrumar links de assets (CSS, JS, Imagens)
        // Ele acha qualquer href ou src que aponte para assets e injeta o prefixo exato
        const regexAssets = /(href|src)="(?:\.\/|\.\.\/|\/)*assets\//g;
        content = content.replace(regexAssets, `$1="${prefix}assets/`);
    }

    // ==========================================
    // SE FOR O ARQUIVO MAIN.JS
    // ==========================================
    if (filePath.endsWith('main.js')) {
        
        // 1. Remover a importação do pathConfig
        const regexImportPathConfig = /import\s+\{\s*BASE_PATH\s*\}\s+from\s+['"]\.\/utils\/pathConfig\.js['"];?\s*/g;
        content = content.replace(regexImportPathConfig, '');

        // 2. Inserir a lógica nativa do import.meta.url se ainda não existir
        if (!content.includes('PROJECT_ROOT')) {
            const projectRootDecl = `\n// 🚀 Calcula a raiz do site baseada no próprio arquivo JS (Substitui initBase.js)\nconst PROJECT_ROOT = new URL('../../', import.meta.url).pathname;\n\n`;
            
            // Insere logo antes do CONFIG_SITE
            if (content.includes('const CONFIG_SITE')) {
                content = content.replace('const CONFIG_SITE', projectRootDecl + 'const CONFIG_SITE');
            }
        }

        // 3. Trocar a variável BASE_PATH por PROJECT_ROOT em todo o arquivo
        content = content.replace(/\$\{BASE_PATH\}/g, '${PROJECT_ROOT}');
    }

    // Salvar as alterações apenas se o arquivo tiver sido modificado
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`🔧 Ajustado perfeitamente: ${path.relative(__dirname, filePath)}`);
    }
});

console.log('\n🚀 Refatoração 100% concluída! As páginas estão conectadas, as URLs relativas estão perfeitas e os scripts velhos foram exterminados.');