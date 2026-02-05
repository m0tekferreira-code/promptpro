# PromptGen Pro - AI Automation Engineer

🚀 **Crie agentes inteligentes de WhatsApp em segundos** com IA generativa integrada.

Uma ferramenta profissional para gerar prompts estruturados para **Evolution API**, **Typebot** e **n8n**, com três modos de criação: Engenharia Reversa, Criação Mágica com IA, e Modo Manual.

![PromptGen Pro](https://img.shields.io/badge/React-18.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple) ![Google Gemini](https://img.shields.io/badge/AI-Gemini%202.0-orange)

## ✨ Funcionalidades

### 🎯 Três Modos de Criação

1. **Engenharia Reversa** 🔄
   - Cole prompts antigos ou textos desorganizados
   - Extração automática de dados estruturados
   - Suporte para JSON ou texto livre (com IA)

2. **Criação Mágica** ✨
   - Digite apenas o nicho (ex: "Pizzaria", "Dentista")
   - IA cria toda personalidade, regras e fluxo
   - Powered by Google Gemini 2.0 Flash

3. **Modo Manual** 🛠️
   - Controle total sobre cada detalhe
   - Wizard de 5 etapas intuitivo
   - Preview em tempo real

### 🎨 Interface Premium

- Design moderno com glassmorphism
- Animações suaves e micro-interações
- Totalmente responsivo (mobile, tablet, desktop)
- Tema claro profissional
- Tipografia Google Fonts (Inter + JetBrains Mono)

### 🤖 Integração com IA

- **Google Gemini 2.0 Flash API**
- Melhoramento automático de textos
- Geração inteligente de conteúdo
- Análise e extração de dados

### 📦 Export Estruturado

- JSON formatado para Evolution API
- Compatível com Typebot e n8n
- Cópia com um clique
- Estrutura padronizada

## 🚀 Como Usar

### Pré-requisitos

- Node.js 16+ instalado
- npm ou yarn

### Instalação

```bash
# Clone ou navegue até o diretório
cd c:\wamp64\www\promptpro

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo abrirá automaticamente em `http://localhost:3000`

> **Nota:** Esta aplicação usa Tailwind CSS via CDN para garantir compatibilidade máxima e facilitar o deploy. Não é necessário configurar PostCSS ou Tailwind localmente.

### Configuração da IA (Opcional mas Recomendado)

Para desbloquear os recursos de IA:

1. Clique em **"CONFIG IA"** no canto superior direito
2. Acesse [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Gere uma API Key gratuita
4. Cole a chave no campo e salve

**Recursos desbloqueados com API Key:**

- Criação Mágica por nicho
- Engenharia reversa de texto livre
- Botão "Melhorar" em cada campo

## 📖 Guia de Uso

### Modo 1: Engenharia Reversa

```
1. Cole seu prompt antigo no campo de texto
2. Clique em "Extrair Dados"
3. O sistema organiza tudo automaticamente
4. Ajuste conforme necessário
```

### Modo 2: Criação Mágica

```
1. Digite o nicho (ex: "Clínica Odontológica")
2. Clique em "Criar com IA"
3. Aguarde a geração (5-10 segundos)
4. Revise e personalize
```

### Modo 3: Manual

```
1. Clique em "Modo Manual"
2. Preencha o wizard de 5 etapas:
   - Identidade (nome, empresa, personalidade)
   - Contexto (sobre a empresa, estratégia)
   - Fluxo (jornada do cliente em 3 passos)
   - Regras (guardrails e ferramentas)
   - Finalizar (copiar JSON)
```

## 🏗️ Estrutura do Projeto

```
promptpro/
├── src/
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Entry point React
│   └── index.css        # Estilos globais
├── index.html           # HTML template
├── package.json         # Dependências
├── vite.config.js       # Configuração Vite
└── README.md           # Este arquivo
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📋 Formato do JSON Gerado

```json
{
  "agente": {
    "descricao": "System role do agente"
  },
  "informacoes_constantes": {
    "nome": "Nome do Bot",
    "empresa": "Nome da Empresa",
    "objetivo": "Função/Cargo",
    "personalidade": "Traços de personalidade",
    "estrategia_de_atendimento": "Estratégia macro",
    "sobre_empresa": "Resumo institucional"
  },
  "sequencia_de_atendimento": {
    "passo_1": { "descricao": "Abordagem inicial" },
    "passo_2": { "descricao": "Qualificação" },
    "passo_3": { "descricao": "Fechamento" }
  },
  "ferramentas_e_uso": {
    "ferramenta": "nome_do_webhook",
    "dados_cliente": { /* ... */ }
  },
  "regras_gerais": {
    "regra_1": "...",
    "regra_2": "...",
    "regra_3": "...",
    "regra_4": "..."
  }
}
```

## 🎯 Casos de Uso

- **Agências de Marketing**: Criar bots para múltiplos clientes rapidamente
- **Desenvolvedores**: Estruturar prompts para Evolution API/Typebot
- **Empresas**: Padronizar atendimento automatizado
- **Freelancers**: Acelerar entregas de automação

## 🛠️ Tecnologias

- **React 18.2** - Framework UI
- **Vite 5.0** - Build tool
- **Lucide React** - Ícones
- **Google Gemini 2.0** - IA Generativa
- **CSS Vanilla** - Estilização customizada

## 📝 Licença

Este projeto é de uso livre para fins educacionais e comerciais.

## 🤝 Suporte

Para dúvidas ou sugestões, consulte o **Guia Rápido** dentro do aplicativo (botão "COMO USAR").

---

**Desenvolvido com ❤️ para automatizar o futuro do atendimento**
