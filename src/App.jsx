import React, { useState } from 'react';
import { Clipboard, ArrowRight, ArrowLeft, Check, Terminal, User, Building, MessageSquare, Shield, Sparkles, Upload, FileJson, Zap, Settings, Key, HelpCircle, BookOpen, X } from 'lucide-react';

const App = () => {
    const [step, setStep] = useState(0);
    const [copied, setCopied] = useState(false);
    const [importText, setImportText] = useState("");
    const [nicheInput, setNicheInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const [apiKey, setApiKey] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [showQuickStart, setShowQuickStart] = useState(false);

    const [formData, setFormData] = useState({
        agenteDescricao: "Você é um agente de atendimento no WhatsApp que atua com profissionalismo e empatia.",
        nome: "Assistente",
        empresa: "Minha Empresa",
        objetivo: "Qualificação de Leads",
        personalidade: "Amigável e Objetivo",
        estrategia: "Responder o cliente e direcionar para o time comercial se houver interesse.",
        sobreEmpresa: "Somos líderes no mercado, oferecendo soluções inovadoras com foco na satisfação do cliente.",
        passo1: "Olá, sou o [Nome], assistente virtual. Tudo bem? Como posso ajudar você hoje?",
        passo2: "Gostaria de saber qual produto você tem interesse e qual sua urgência para a compra.",
        passo3: "Perfeito. Para prosseguir, poderia me informar seu nome completo e e-mail?",
        nomeFerramenta: "avisaComercial",
        regra1: "Evitar jargões técnicos complexos.",
        regra2: "Apenas encaminhar leads com dados completos.",
        regra3: "Manter tom cordial e paciente.",
        regra4: "Se pedir orçamento, informar prazo de 24h."
    });

    // --- FUNÇÕES DE LÓGICA ---

    const callGeminiAI = async (prompt) => {
        if (!apiKey) throw new Error("Sem API Key");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return text.replace(/```json/g, "").replace(/```/g, "").trim();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSmartImport = async () => {
        setIsProcessing(true);
        try {
            let data;
            if (apiKey) {
                const prompt = `Analise o texto e extraia para JSON plano (chaves: agenteDescricao, nome, empresa, objetivo, personalidade, estrategia, sobreEmpresa, passo1, passo2, passo3, nomeFerramenta, regra1, regra2, regra3, regra4). Invente se faltar. Texto: ${importText}`;
                const jsonString = await callGeminiAI(prompt);
                data = JSON.parse(jsonString);
            } else {
                const cleaned = importText.replace(/```json/g, "").replace(/```/g, "").trim();
                const firstBrace = cleaned.indexOf('{');
                const lastBrace = cleaned.lastIndexOf('}');
                if (firstBrace === -1) throw new Error("JSON inválido");
                const parsed = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
                data = {
                    agenteDescricao: parsed.agente?.descricao,
                    nome: parsed.informacoes_constantes?.nome,
                    empresa: parsed.informacoes_constantes?.empresa,
                    objetivo: parsed.informacoes_constantes?.objetivo,
                    personalidade: parsed.informacoes_constantes?.personalidade,
                    estrategia: parsed.informacoes_constantes?.estrategia_de_atendimento,
                    sobreEmpresa: parsed.informacoes_constantes?.sobre_empresa,
                    passo1: parsed.sequencia_de_atendimento?.passo_1?.descricao,
                    passo2: parsed.sequencia_de_atendimento?.passo_2?.descricao,
                    passo3: parsed.sequencia_de_atendimento?.passo_3?.descricao,
                    nomeFerramenta: parsed.ferramentas_e_uso?.ferramenta,
                    regra1: parsed.regras_gerais?.regra_1,
                    regra2: parsed.regras_gerais?.regra_2,
                    regra3: parsed.regras_gerais?.regra_3,
                    regra4: parsed.regras_gerais?.regra_4,
                };
            }
            setFormData(prev => ({ ...prev, ...Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null)) }));
            setStep(1);
        } catch (e) {
            alert(apiKey ? "Erro na IA. Verifique a chave." : "Erro na leitura. Formato inválido.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleNicheGenerate = async () => {
        setIsProcessing(true);
        try {
            if (apiKey) {
                const prompt = `Crie perfil agente JSON plano (mesmas chaves do anterior) para nicho: "${nicheInput}"`;
                const jsonString = await callGeminiAI(prompt);
                setFormData(prev => ({ ...prev, ...JSON.parse(jsonString) }));
                setStep(1);
            } else {
                setTimeout(() => {
                    setStep(1);
                    alert("Sem API Key. Usando modelo padrão. Configure a chave para gerar conteúdo real.");
                }, 800);
            }
        } catch (e) {
            alert("Erro ao gerar.");
        } finally {
            setIsProcessing(false);
        }
    };

    const magicEnhance = async (field, context) => {
        if (!apiKey) return alert("Configure a API Key para usar IA.");
        setIsProcessing(true);
        try {
            const newText = await callGeminiAI(`Melhore este texto para chatbot da empresa ${formData.empresa}. Contexto: ${context}. Texto atual: "${formData[field]}". Apenas o texto melhorado.`);
            setFormData(prev => ({ ...prev, [field]: newText }));
        } catch (e) { console.error(e); } finally { setIsProcessing(false); }
    };

    const generateJSON = () => {
        return JSON.stringify({
            "agente": { "descricao": formData.agenteDescricao },
            "informacoes_constantes": {
                "nome": formData.nome,
                "empresa": formData.empresa,
                "objetivo": formData.objetivo,
                "personalidade": formData.personalidade,
                "estrategia_de_atendimento": formData.estrategia,
                "sobre_empresa": formData.sobreEmpresa
            },
            "sequencia_de_atendimento": {
                "passo_1": { "descricao": formData.passo1 },
                "passo_2": { "descricao": formData.passo2 },
                "passo_3": { "descricao": formData.passo3 }
            },
            "ferramentas_e_uso": {
                "ferramenta": formData.nomeFerramenta,
                "dados_cliente": {
                    "nome": "NOME_DO_CLIENTE",
                    "email": "EMAIL_DO_CLIENTE",
                    "telefone": "{{ $item(\"0\").$node[\"Webhook Para receber Mensagens da API WPP evolution\"].json[\"body\"][\"data\"][\"key\"][\"remoteJid\"].replace(\"@s.whatsapp.net\", \"\") }}",
                    "interesse": "DESCRIÇÃO_RESUMIDA_DO_INTERESSE_DO_CLIENTE"
                }
            },
            "regras_gerais": {
                "regra_1": formData.regra1, "regra_2": formData.regra2, "regra_3": formData.regra3, "regra_4": formData.regra4
            }
        }, null, 2);
    };

    const copyToClipboard = () => {
        const text = generateJSON();
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) { alert("Erro ao copiar."); }
        document.body.removeChild(textArea);
    };

    const steps = [
        { id: 1, title: "Identidade", icon: User },
        { id: 2, title: "Contexto", icon: Building },
        { id: 3, title: "Fluxo", icon: MessageSquare },
        { id: 4, title: "Regras", icon: Shield },
        { id: 5, title: "Finalizar", icon: Terminal },
    ];

    // --- UI COMPONENTS ---

    const InputGroup = ({ label, name, placeholder, rows = 0, magicContext }) => (
        <div className="group">
            <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-slate-700 group-focus-within:text-indigo-600 transition-colors">
                    {label}
                </label>
                {apiKey && magicContext && (
                    <button
                        onClick={() => magicEnhance(name, magicContext)}
                        disabled={isProcessing}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md"
                    >
                        <Sparkles size={12} /> {isProcessing ? "Gerando..." : "Melhorar"}
                    </button>
                )}
            </div>
            {rows > 0 ? (
                <textarea
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    rows={rows}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-sm text-sm leading-relaxed"
                />
            ) : (
                <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm text-sm"
                />
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-20" style={{ fontFamily: '"Inter", sans-serif' }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-mono { font-family: 'JetBrains Mono', monospace !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

            {/* QUICK START MODAL */}
            {showQuickStart && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl ring-1 ring-slate-900/5 my-auto overflow-hidden scale-100 animate-in zoom-in-95 duration-200 relative">
                        <button
                            onClick={() => setShowQuickStart(false)}
                            className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
                        >
                            <X size={20} className="text-slate-600" />
                        </button>

                        <div className="p-6 md:p-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600">
                                    <BookOpen size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Guia Rápido</h2>
                                    <p className="text-sm text-slate-500">Aprenda a criar seus agentes em minutos.</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Section 1 */}
                                <section>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">1</span>
                                        O que é este sistema?
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        O <strong>PromptGen Pro</strong> é uma ferramenta desenhada para criar "cérebros" (prompts estruturados) para IAs de atendimento, como assistentes de WhatsApp. Ele gera um código JSON pronto para ser usado em plataformas de automação como <strong>Evolution API, Typebot e n8n</strong>.
                                    </p>
                                </section>

                                {/* Section 2 */}
                                <section>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-xs">2</span>
                                        Como configurar a IA (Obrigatório para automação)
                                    </h3>
                                    <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl space-y-3">
                                        <p className="text-sm text-slate-700">
                                            Para usar os recursos mágicos ("Criação Mágica" e "Melhorar Texto"), você precisa de uma chave gratuita do Google:
                                        </p>
                                        <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2 ml-2">
                                            <li>Clique no botão <strong>"Configurar IA"</strong> no topo da tela.</li>
                                            <li>Clique no link para gerar sua chave no <strong>Google AI Studio</strong>.</li>
                                            <li>Copie a chave gerada e cole no campo de configuração.</li>
                                            <li>Salve e pronto! Agora o sistema pensa por você.</li>
                                        </ol>
                                    </div>
                                </section>

                                {/* Section 3 */}
                                <section>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">3</span>
                                        Como criar seu Agente
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="border border-slate-200 p-4 rounded-xl hover:border-violet-300 transition-colors">
                                            <div className="flex items-center gap-2 mb-2 text-violet-600 font-bold text-sm">
                                                <Sparkles size={16} /> Criação Mágica
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                Basta digitar o nicho (ex: "Pizzaria", "Dentista") e a IA cria todas as regras, personalidade e perguntas sozinha. Requer a chave configurada.
                                            </p>
                                        </div>
                                        <div className="border border-slate-200 p-4 rounded-xl hover:border-blue-300 transition-colors">
                                            <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-sm">
                                                <FileJson size={16} /> Engenharia Reversa
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                Tem um prompt antigo ou bagunçado? Cole ele e o sistema extrai os dados, organizando tudo na estrutura nova automaticamente.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <div className="pt-4 border-t border-slate-100 flex justify-end">
                                    <button
                                        onClick={() => setShowQuickStart(false)}
                                        className="w-full md:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
                                    >
                                        Entendi, vamos começar!
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SETTINGS MODAL */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl ring-1 ring-slate-900/5 scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-6 text-indigo-600">
                            <div className="p-2.5 bg-indigo-50 rounded-xl">
                                <Key size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Configurar Inteligência</h3>
                        </div>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            Desbloqueie o poder da IA Generativa (Gemini 2.0) para criar prompts profissionais automaticamente.
                        </p>
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Google Gemini API Key</label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="Cole sua chave aqui..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-mono text-sm"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setShowSettings(false)} className="flex-1 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold transition-colors">Cancelar</button>
                            <button onClick={() => setShowSettings(false)} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95">Salvar</button>
                        </div>
                        <div className="mt-6 text-center">
                            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:text-indigo-700 font-medium hover:underline">
                                Não tem uma chave? Gere gratuitamente aqui &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
                <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setStep(0)}>
                        <div className="bg-indigo-600 p-2 md:p-2.5 rounded-xl text-white shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
                            <Zap size={20} fill="currentColor" className="text-white md:w-[22px] md:h-[22px]" />
                        </div>
                        <div>
                            <h1 className="font-bold text-base md:text-xl text-slate-900 tracking-tight">Prompt<span className="text-indigo-600">Gen</span> Pro</h1>
                            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 tracking-wider uppercase hidden sm:block">AI Automation Engineer</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <button
                            onClick={() => setShowQuickStart(true)}
                            className="flex items-center gap-2 text-[10px] md:text-xs font-bold px-3 py-2 md:px-4 md:py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-200 transition-all tracking-wide"
                        >
                            <HelpCircle size={14} /> <span className="hidden sm:inline">COMO USAR</span>
                        </button>

                        <button
                            onClick={() => setShowSettings(true)}
                            className={`flex items-center gap-2 text-[10px] md:text-xs font-bold px-3 py-2 md:px-4 md:py-2 rounded-full border transition-all tracking-wide ${apiKey ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300 hover:bg-white'}`}
                        >
                            <Settings size={14} />
                            {apiKey ? "IA ATIVA" : "CONFIG IA"}
                        </button>
                    </div>
                </div>
            </header>

            {/* STEP 0: DASHBOARD */}
            {step === 0 && (
                <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-10 md:mb-16 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 md:mb-6 tracking-tight leading-tight">
                            Crie Agentes Inteligentes <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">em Segundos</span>
                        </h2>
                        <p className="text-base md:text-lg text-slate-500 leading-relaxed mb-6 font-medium px-2">
                            Gere prompts estruturados para Evolution API, Typebot e n8n. Utilize nossa IA para engenharia reversa ou comece do zero.
                        </p>
                        <button
                            onClick={() => setShowQuickStart(true)}
                            className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition-all"
                        >
                            <BookOpen size={18} /> Ver Guia de Início Rápido
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {/* Card Import */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <FileJson size={24} className="md:w-7 md:h-7" />
                                </div>
                                <h3 className="font-bold text-lg md:text-xl text-slate-900 mb-2">Engenharia Reversa</h3>
                                <p className="text-sm text-slate-500 mb-6 leading-relaxed">Transforme prompts antigos ou textos desorganizados em uma estrutura perfeita.</p>

                                <div className="space-y-4">
                                    <textarea
                                        className="w-full h-24 md:h-28 p-4 bg-slate-50 rounded-xl border-0 text-xs font-mono focus:ring-2 focus:ring-blue-500/20 text-slate-600 resize-none transition-all placeholder:text-slate-300"
                                        placeholder={apiKey ? "Cole qualquer texto aqui..." : 'Cole o JSON aqui...'}
                                        value={importText}
                                        onChange={(e) => setImportText(e.target.value)}
                                    />
                                    <button
                                        onClick={handleSmartImport}
                                        disabled={!importText || isProcessing}
                                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex justify-center gap-2 items-center disabled:opacity-50 disabled:shadow-none text-sm md:text-base"
                                    >
                                        {isProcessing ? "Processando..." : <><Upload size={18} /> Extrair Dados</>}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card Create AI */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-violet-500/10 hover:border-violet-500/30 transition-all duration-300 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                            <div className="relative h-full flex flex-col">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <Sparkles size={24} className="md:w-7 md:h-7" />
                                </div>
                                <h3 className="font-bold text-lg md:text-xl text-slate-900 mb-2 tracking-tight">Criação Mágica</h3>
                                <p className="text-sm text-slate-500 mb-6 leading-relaxed">Digite o nicho do seu cliente e deixe a IA criar toda a personalidade e regras.</p>

                                <div className="mt-auto space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Nicho de Atuação</label>
                                        <input
                                            type="text"
                                            value={nicheInput}
                                            onChange={(e) => setNicheInput(e.target.value)}
                                            placeholder="Ex: Clínica de Estética"
                                            className="w-full px-4 py-3 bg-slate-50 rounded-xl border-0 focus:ring-2 focus:ring-violet-500/20 text-sm outline-none transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={handleNicheGenerate}
                                        disabled={!nicheInput || isProcessing}
                                        className="w-full py-3 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all flex justify-center gap-2 items-center disabled:opacity-50 disabled:shadow-none text-sm md:text-base"
                                    >
                                        {isProcessing ? "Gerando..." : <><Sparkles size={18} /> Criar com IA</>}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card Manual */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-500/10 hover:border-slate-500/30 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col" onClick={() => setStep(1)}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

                            <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <Terminal size={24} className="md:w-7 md:h-7" />
                            </div>
                            <h3 className="font-bold text-lg md:text-xl text-slate-900 mb-2 tracking-tight">Modo Manual</h3>
                            <p className="text-sm text-slate-500 mb-6 leading-relaxed">Controle total sobre cada detalhe. Ideal para ajustes finos em prompts existentes.</p>

                            <div className="mt-auto flex justify-center py-6 md:py-8">
                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300">
                                    <ArrowRight size={24} />
                                </div>
                            </div>
                            <p className="text-center text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-wider">Começar do Zero</p>
                        </div>

                    </div>
                </main>
            )}

            {/* WIZARD STEPS */}
            {step > 0 && (
                <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10">

                    {/* Progress Stepper - Mobile Scrollable */}
                    <div className="mb-6 md:mb-10 -mx-4 px-4 md:mx-0 overflow-x-auto pb-4 hide-scrollbar">
                        <div className="min-w-[400px] md:min-w-0 md:w-full relative flex justify-between px-2">
                            {/* Line Background */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full"></div>
                            {/* Active Line */}
                            <div className="absolute top-1/2 left-0 h-1 bg-indigo-600 -z-10 -translate-y-1/2 rounded-full transition-all duration-500 ease-out" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>

                            {steps.map((s) => {
                                const isActive = step >= s.id;
                                const isCurrent = step === s.id;
                                const Icon = s.icon;

                                return (
                                    <div key={s.id} className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => setStep(s.id)}>
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm relative z-10 ${isActive
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200'
                                                : 'bg-white border-slate-200 text-slate-300 group-hover:border-slate-300'
                                            } ${isCurrent ? 'ring-4 ring-indigo-100 scale-110' : ''}`}>
                                            {step > s.id ? <Check size={18} strokeWidth={3} className="md:w-5 md:h-5" /> : <Icon size={18} className="md:w-5 md:h-5" />}
                                        </div>
                                        <span className={`text-[10px] md:text-xs font-bold tracking-wider transition-colors uppercase ${isCurrent ? 'text-indigo-700' : isActive ? 'text-indigo-600' : 'text-slate-400'
                                            }`}>{s.title}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col xl:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-500">

                        {/* LEFT: FORM CONTENT */}
                        <div className="flex-1 w-full">
                            <div className="bg-white rounded-3xl p-5 md:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">

                                {/* Decoration */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>

                                {step === 1 && (
                                    <div className="space-y-6 relative">
                                        <div className="mb-6">
                                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Identidade do Agente</h2>
                                            <p className="text-sm text-slate-500">Quem está conversando com o seu cliente?</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputGroup label="Nome do Bot" name="nome" placeholder="Ex: Bia" />
                                            <InputGroup label="Empresa" name="empresa" placeholder="Ex: TechSolutions" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InputGroup label="Cargo/Função" name="objetivo" placeholder="Ex: SDR" />
                                            <InputGroup label="Personalidade" name="personalidade" placeholder="Ex: Educada e Direta" />
                                        </div>
                                        <InputGroup label="Prompt do Agente (System Role)" name="agenteDescricao" rows={4} magicContext="descrição comportamental e papel do agente" />
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6 relative">
                                        <div className="mb-6">
                                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Base de Conhecimento</h2>
                                            <p className="text-sm text-slate-500">O que o bot precisa saber sobre o negócio?</p>
                                        </div>
                                        <InputGroup label="Resumo da Empresa" name="sobreEmpresa" rows={6} placeholder="História, produtos, diferenciais..." magicContext="resumo institucional detalhado para base de conhecimento" />
                                        <InputGroup label="Estratégia Macro" name="estrategia" placeholder="Ex: Tirar dúvidas e agendar visita" />
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6 relative">
                                        <div className="mb-6">
                                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Jornada do Cliente</h2>
                                            <p className="text-sm text-slate-500">O roteiro ideal da conversa.</p>
                                        </div>

                                        {[1, 2, 3].map(num => (
                                            <div key={num} className="p-4 md:p-5 bg-slate-50/80 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">{num}</span>
                                                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                                                        {num === 1 ? "Abordagem" : num === 2 ? "Qualificação" : "Fechamento"}
                                                    </h4>
                                                </div>
                                                <InputGroup
                                                    name={`passo${num}`}
                                                    rows={2}
                                                    placeholder="O que o bot deve dizer/perguntar?"
                                                    magicContext={num === 1 ? "saudação inicial" : num === 2 ? "perguntas de qualificação" : "coleta de dados e encerramento"}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="space-y-6 relative">
                                        <div className="mb-6">
                                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Regras e Guardrails</h2>
                                            <p className="text-sm text-slate-500">Limites de segurança e ferramentas.</p>
                                        </div>

                                        <div className="p-4 md:p-5 bg-slate-900 text-slate-300 rounded-2xl mb-6">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Webhook Output Tool</label>
                                            <div className="flex items-center gap-3">
                                                <Terminal size={18} />
                                                <input
                                                    type="text"
                                                    name="nomeFerramenta"
                                                    value={formData.nomeFerramenta}
                                                    onChange={handleChange}
                                                    className="bg-transparent border-none focus:ring-0 text-white font-mono text-sm w-full p-0"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {[1, 2, 3, 4].map(num => (
                                                <div key={num} className="flex gap-3 items-center">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                                    <div className="flex-1">
                                                        <InputGroup name={`regra${num}`} placeholder={`Regra de ouro ${num}`} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {step === 5 && (
                                    <div className="h-full flex flex-col relative">
                                        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Prompt Pronto!</h2>
                                                <p className="text-slate-500 text-sm">JSON formatado para Evolution/Typebot.</p>
                                            </div>
                                            <button
                                                onClick={copyToClipboard}
                                                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 w-full md:w-auto ${copied ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'}`}
                                            >
                                                {copied ? <Check size={18} /> : <Clipboard size={18} />}
                                                {copied ? 'Copiado!' : 'Copiar JSON'}
                                            </button>
                                        </div>

                                        <div className="flex-1 bg-[#1E293B] rounded-2xl p-4 md:p-6 overflow-hidden border border-slate-700 relative group">
                                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="px-2 py-1 bg-white/10 rounded text-[10px] text-white backdrop-blur">JSON</div>
                                            </div>
                                            <div className="h-[300px] md:h-[400px] overflow-auto custom-scrollbar">
                                                <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed">
                                                    {generateJSON()}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Navigation Actions */}
                            <div className="flex justify-between items-center mt-6 md:mt-8 px-2">
                                {step > 1 ? (
                                    <button onClick={prevStep} className="text-slate-500 hover:text-indigo-600 font-semibold text-sm flex items-center gap-2 transition-colors px-4 py-2 rounded-lg hover:bg-indigo-50">
                                        <ArrowLeft size={16} /> Voltar
                                    </button>
                                ) : <div />}

                                {step < 5 ? (
                                    <button onClick={nextStep} className="bg-slate-900 hover:bg-slate-800 text-white px-6 md:px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-slate-200 transition-all hover:-translate-y-1 flex items-center gap-2">
                                        Próximo <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button onClick={() => setStep(0)} className="text-slate-500 hover:text-slate-800 font-semibold text-sm transition-colors px-4 py-2">
                                        Criar Novo Agente
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: PREVIEW CARD (Hidden on Mobile/Tablet) */}
                        <div className="w-80 hidden xl:block sticky top-32 animate-in fade-in slide-in-from-right-8 duration-700">
                            <div className="bg-white rounded-[2rem] p-6 shadow-2xl shadow-indigo-100 border border-slate-100 relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-200 rounded-b-xl"></div>
                                <div className="flex flex-col items-center mb-6 mt-2">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl mb-3 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white font-bold text-2xl">
                                        {formData.nome.charAt(0)}
                                    </div>
                                    <h3 className="font-bold text-slate-900 tracking-tight">{formData.nome}</h3>
                                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">Online agora</span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none text-xs text-slate-600 leading-relaxed border border-slate-100 font-medium">
                                        {formData.passo1 || "Olá! Como posso ajudar?"}
                                    </div>
                                    <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-none text-xs text-white leading-relaxed self-end shadow-md shadow-indigo-200 font-medium">
                                        Gostaria de saber mais sobre a empresa.
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none text-xs text-slate-600 leading-relaxed border border-slate-100 font-medium">
                                        {formData.passo2 || "Claro! Somos líderes de mercado..."}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4 text-center">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Preview do Bot</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
