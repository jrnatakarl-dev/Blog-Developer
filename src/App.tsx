import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Code2, Github, Linkedin, Mail, Menu, MoveUpRight, X, Braces, Layers3, Workflow, Send, Check, Copy } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { profile, projects, skills } from "./config";

function CodeAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = 0, height = 0, frame = 0;
    let lines: { x:number; y:number; speed:number; text:string; alpha:number; size:number }[] = [];
    const snippets = ["const solution = await build();","if (problem) rethink(problem);","function create(value) {","return clarity + precision;","<System intent='human' />","while (learning) evolve();","git commit -m 'make it matter'","const idea = transform(input);","export default possibility;","API.connect(ideas, people);"];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth; height = canvas.clientHeight;
      canvas.width = width*dpr; canvas.height = height*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      lines = Array.from({length: Math.max(10, Math.floor(width/155))}, (_,i) => ({
        x: (i/Math.max(1,Math.floor(width/155)))*width + Math.random()*80,
        y: Math.random()*height, speed: .12+Math.random()*.26,
        text: snippets[Math.floor(Math.random()*snippets.length)],
        alpha: .12+Math.random()*.25, size: 9+Math.random()*2
      }));
    };
    resize();
    const draw = () => {
      ctx.clearRect(0,0,width,height);
      for (const l of lines) {
        l.y += l.speed * (reduced ? 0 : 1);
        if (l.y > height+40) { l.y=-30; l.x=Math.random()*width; l.text=snippets[Math.floor(Math.random()*snippets.length)]; }
        ctx.font = `${l.size}px "DM Mono", monospace`;
        ctx.fillStyle = `rgba(190,255,139,${l.alpha})`;
        ctx.fillText(l.text,l.x,l.y);
        ctx.beginPath(); ctx.moveTo(l.x-12,l.y+5); ctx.lineTo(l.x-4,l.y+5);
        ctx.strokeStyle = `rgba(190,255,139,${l.alpha*.6})`; ctx.stroke();
      }
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize",resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize",resize); };
  }, [reduced]);
  return <canvas ref={canvasRef} className="code-canvas" aria-hidden="true" />;
}

function Reveal({ children, className="" }: {children:React.ReactNode; className?:string}) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced?false:{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.16}} transition={{duration:.7,ease:[.2,.7,.2,1]}}>{children}</motion.div>;
}

export default function App() {
  const [menuOpen,setMenuOpen] = useState(false);
  const [copied,setCopied] = useState(false);
  const [form,setForm] = useState({name:"",email:"",message:""});
  const [formError,setFormError] = useState("");
  const [sent,setSent] = useState(false);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-magnetic]");
    const handlers: (()=>void)[] = [];
    nodes.forEach(node => {
      const move = (e:MouseEvent) => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const r=node.getBoundingClientRect();
        node.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.06}px, ${(e.clientY-r.top-r.height/2)*.06}px)`;
      };
      const leave = () => { node.style.transform="translate(0,0)"; };
      node.addEventListener("mousemove",move); node.addEventListener("mouseleave",leave);
      handlers.push(()=>{node.removeEventListener("mousemove",move);node.removeEventListener("mouseleave",leave);});
    });
    return ()=>handlers.forEach(fn=>fn());
  },[]);

  const closeMenu = () => setMenuOpen(false);
  const emailConfigured = Boolean(profile.email.trim());
  const whatsappUrl = profile.whatsapp ? `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent("Olá, Daniel! Quero conversar sobre um projeto.")}` : "";
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent("Vamos construir algo extraordinário")}`;

  const submit = (e:React.FormEvent) => {
    e.preventDefault(); setFormError(""); setSent(false);
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || form.message.trim().length<10) {
      setFormError("Preencha seu nome, um e-mail válido e uma mensagem com pelo menos 10 caracteres."); return;
    }
    if (!emailConfigured) { setFormError("Configure seu endereço de e-mail em src/config.ts antes de receber mensagens."); return; }
    const body = `Nome: ${form.name}\nE-mail: ${form.email}\n\n${form.message}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent("Contato pelo portfólio")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  const copyEmail = async () => {
    if (!profile.email) { setFormError("Adicione seu e-mail em src/config.ts."); return; }
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); window.setTimeout(()=>setCopied(false),1800); } catch { window.location.href=mailto; }
  };

  const nav = [{label:"Manifesto",href:"#manifesto"},{label:"Especialidades",href:"#especialidades"},{label:"Projetos",href:"#projetos"},{label:"Processo",href:"#processo"}];

  return <div className="site-shell">
    <header className="topbar">
      <a className="wordmark" href="#inicio" aria-label="Daniel Júnior, início">D<span>J</span><i>®</i></a>
      <nav className="desktop-nav" aria-label="Navegação principal">{nav.map(n=><a key={n.href} href={n.href}>{n.label}</a>)}</nav>
      <a className="nav-contact" href="#contato">Vamos conversar <ArrowUpRight size={15}/></a>
      <button className="menu-toggle" aria-label={menuOpen?"Fechar menu":"Abrir menu"} aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button>
    </header>
    {menuOpen && <nav className="mobile-menu">{nav.map(n=><a key={n.href} href={n.href} onClick={closeMenu}>{n.label}<ArrowUpRight size={17}/></a>)}<a href="#contato" onClick={closeMenu}>Contato<ArrowUpRight size={17}/></a></nav>}

    <main>
      <section className="hero" id="inicio">
        <CodeAtmosphere />
        <div className="hero-grid"></div>
        <div className="hero-topline"><span><b className="status-dot"></b> DISPONÍVEL PARA NOVOS DESAFIOS</span><span className="mono">NITERÓI, BR — 2026</span></div>
        <div className="hero-content">
          <p className="eyebrow"><span className="eyebrow-line"></span> PORTFÓLIO / DESENVOLVIMENTO DE SISTEMAS</p>
          <h1>Ideias ganham<br/><em>forma.</em> Sistemas<br/>ganham <span className="outline-word">sentido.</span></h1>
          <div className="hero-bottom">
            <p className="hero-copy">{profile.description}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contato" data-magnetic>Vamos construir algo extraordinário <ArrowUpRight size={17}/></a>
              <a className="text-link" href="#projetos">Explorar projetos <ArrowDown size={15}/></a>
            </div>
          </div>
        </div>
        <div className="hero-index"><span>01 / 05</span><span className="index-rule"></span><span>SCROLL PARA EXPLORAR</span></div>
        <div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div>
      </section>

      <section className="ticker" aria-label="Áreas de atuação"><div className="ticker-track"><span>IDEIA</span><b>✳</b><span>ESTRATÉGIA</span><b>✳</b><span>ENGENHARIA</span><b>✳</b><span>EXPERIÊNCIA</span><b>✳</b><span>EVOLUÇÃO</span><b>✳</b><span>IDEIA</span><b>✳</b><span>ESTRATÉGIA</span><b>✳</b><span>ENGENHARIA</span><b>✳</b><span>EXPERIÊNCIA</span><b>✳</b><span>EVOLUÇÃO</span><b>✳</b></div></section>

      <section className="section manifesto" id="manifesto">
        <div className="section-kicker"><span>01 — MANIFESTO</span><span>O QUE ME MOVE</span></div>
        <div className="manifesto-layout">
          <Reveal><h2>Não escrevo código<br/>por escrever. <span>Construo<br/>para fazer acontecer.</span></h2></Reveal>
          <Reveal className="manifesto-aside"><div className="asterisk">✳</div><p className="lead">Tecnologia só tem valor quando resolve algo de verdade.</p><p>Meu ponto de partida é a pergunta certa. Entender o contexto, encontrar o que realmente precisa mudar e transformar essa necessidade em uma solução clara, funcional e preparada para evoluir.</p><p>Aprender faz parte do processo. Questionar também. Cada projeto é uma oportunidade de pensar melhor, construir com precisão e entregar algo que tenha propósito.</p><span className="signature">Daniel Júnior<span>®</span></span></Reveal>
        </div>
      </section>

      <section className="section capabilities" id="especialidades">
        <div className="section-kicker"><span>02 — CAIXA DE FERRAMENTAS</span><span>CONHECIMENTO EM CONSTRUÇÃO</span></div>
        <div className="section-heading"><Reveal><h2>Curiosidade com<br/><span>método.</span></h2></Reveal><p>Ferramentas são meios. O que importa é saber por que, quando e como usá-las.</p></div>
        <div className="skills-layout">
          <div className="skills-intro"><div className="big-number">01<span>—</span></div><h3>Base técnica<br/>em evolução</h3><p>Uma visão honesta do meu momento de desenvolvimento. As tecnologias abaixo representam estudos e prática em andamento — não uma lista inflada de promessas.</p><div className="skills-stamp"><Code2 size={18}/><span>ALWAYS<br/>LEARNING</span></div></div>
          <div className="skills-list">{skills.map((group,i)=><Reveal key={group.group} className="skill-group"><div className="skill-group-head"><span>0{i+1}</span><h3>{group.group}</h3><span className="skill-count">{String(group.items.length).padStart(2,"0")} ITENS</span></div><div className="skill-tags">{group.items.map(item=><span className="skill-tag" key={item}>{item}<ArrowUpRight size={13}/></span>)}</div></Reveal>)}</div>
        </div>
      </section>

      <section className="section projects" id="projetos">
        <div className="section-kicker"><span>03 — SELEÇÃO DE TRABALHOS</span><span>FEITO PARA FUNCIONAR</span></div>
        <div className="section-heading project-heading"><Reveal><h2>Menos promessa.<br/><span>Mais entrega.</span></h2></Reveal><p>Projetos reais, problemas concretos e decisões técnicas explicadas com clareza.</p></div>
        {projects.length ? <div className="project-grid">{projects.map(p=><article className="project-card" key={p.number}><div className="project-visual"><span className="project-number">{p.number}</span><div className="project-art"><Braces size={62} strokeWidth={.8}/><span>{p.name}</span></div><span className="project-type">{p.type}</span></div><div className="project-info"><h3>{p.name}</h3><p>{p.description}</p><div className="project-detail"><b>O PROBLEMA</b><p>{p.problem}</p><b>A SOLUÇÃO</b><p>{p.solution}</p></div><div className="project-stack">{p.stack.map(s=><span key={s}>{s}</span>)}</div><div className="project-links">{p.demo&&<a href={p.demo} target="_blank" rel="noreferrer">Ver demonstração <ArrowUpRight size={15}/></a>}{p.source&&<a href={p.source} target="_blank" rel="noreferrer">Código-fonte <Github size={15}/></a>}</div></div></article>)}</div> : <div className="empty-projects"><div className="empty-symbol"><Layers3 size={32}/><span>+</span></div><div><span className="mono tiny">ESPAÇO RESERVADO PARA O PRÓXIMO CAPÍTULO</span><h3>O próximo projeto<br/><em>pode começar aqui.</em></h3><p>Esta vitrine está pronta para receber seus trabalhos. Cada projeto será apresentado pelo problema que resolve, pelas decisões tomadas e pelo que foi construído.</p><a href="#contato" className="text-link">Tem uma ideia? Vamos conversar <ArrowUpRight size={15}/></a></div><span className="empty-index">PROJECT<br/>001—∞</span></div>}
      </section>

      <section className="process" id="processo">
        <div className="section process-inner">
          <div className="section-kicker"><span>04 — MÉTODO</span><span>DA PERGUNTA À ENTREGA</span></div>
          <div className="section-heading"><Reveal><h2>O processo também<br/>faz parte da <span>solução.</span></h2></Reveal><p>Um bom resultado não acontece por acaso. Ele nasce de decisões bem pensadas em cada etapa.</p></div>
          <div className="process-steps">
            {[
              ["01","Escuta","Entender o cenário, as pessoas e o problema antes de escolher qualquer tecnologia.",Workflow],
              ["02","Estratégia","Definir prioridades, requisitos e o caminho mais coerente para a solução.",Braces],
              ["03","Construção","Desenvolver com organização, clareza e atenção aos detalhes que fazem diferença.",Code2],
              ["04","Validação","Testar, ajustar e verificar se o que foi construído resolve a necessidade inicial.",Check],
              ["05","Evolução","Entregar com visão de continuidade: manutenção, melhorias e próximos passos.",ArrowUpRight]
            ].map(([n,title,desc,Icon])=>{const I=Icon as typeof Code2;return <Reveal key={n as string} className="process-step"><div className="step-top"><span>{n as string}</span><I size={21}/></div><h3>{title as string}</h3><p>{desc as string}</p><div className="step-line"></div></Reveal>})}
          </div>
        </div>
      </section>

      <section className="section contact" id="contato">
        <div className="section-kicker"><span>05 — PRÓXIMO MOVIMENTO</span><span>ABERTO A BOAS IDEIAS</span></div>
        <div className="contact-head"><Reveal><p className="eyebrow"><span className="eyebrow-line"></span> VAMOS TIRAR DO PAPEL?</p><h2>Seu próximo projeto<br/>merece mais do que<br/><em>uma solução comum.</em></h2></Reveal><div className="contact-aside"><div className="contact-orbit">✳</div><p>Se existe um problema que merece ser resolvido ou uma ideia que precisa ganhar forma, podemos começar por uma conversa.</p>{whatsappUrl?<a className="button button-primary" href={whatsappUrl} target="_blank" rel="noreferrer">Conversar pelo WhatsApp <ArrowUpRight size={17}/></a>:<span className="config-note">Configure seu WhatsApp em src/config.ts para ativar o atalho.</span>}</div></div>
        <div className="contact-bottom">
          <form className="contact-form" onSubmit={submit}>
            <div className="form-title"><span>CONTE UM POUCO SOBRE SUA IDEIA</span><Send size={17}/></div>
            <label>Seu nome<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Como podemos chamar você?" autoComplete="name" required/></label>
            <label>Seu e-mail<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="voce@email.com" autoComplete="email" required/></label>
            <label>O que você tem em mente?<textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Descreva brevemente seu projeto..." rows={3} required/></label>
            {formError&&<p className="form-feedback error" role="alert">{formError}</p>}{sent&&<p className="form-feedback success" role="status">Seu aplicativo de e-mail deve abrir com a mensagem pronta.</p>}
            <button className="button button-primary form-submit" type="submit">Preparar mensagem <ArrowUpRight size={17}/></button>
            <p className="form-disclaimer">Ao enviar, seu aplicativo de e-mail será aberto. Nenhum dado é armazenado neste site.</p>
          </form>
          <div className="contact-links">
            <div><span className="mono tiny">CANAIS DIRETOS</span><h3>Uma boa conversa<br/>muda tudo.</h3></div>
            <button className="direct-link" onClick={copyEmail}><span><Mail size={18}/>E-mail</span><span>{profile.email||"Adicionar endereço"} {copied?<Check size={15}/>:<Copy size={14}/>}</span></button>
            {profile.github&&<a className="direct-link" href={profile.github} target="_blank" rel="noreferrer"><span><Github size={18}/>GitHub</span><ArrowUpRight size={16}/></a>}
            {profile.linkedin&&<a className="direct-link" href={profile.linkedin} target="_blank" rel="noreferrer"><span><Linkedin size={18}/>LinkedIn</span><ArrowUpRight size={16}/></a>}
            {!profile.github&&!profile.linkedin&&<p className="config-note">Adicione seus perfis de GitHub e LinkedIn em src/config.ts.</p>}
          </div>
        </div>
      </section>
    </main>
    <footer className="footer"><a className="wordmark footer-mark" href="#inicio">D<span>J</span><i>®</i></a><span>FEITO COM INTENÇÃO. CONSTRUÍDO PARA EVOLUIR.</span><a href="#inicio">VOLTAR AO TOPO ↑</a><span>© {new Date().getFullYear()} DANIEL JÚNIOR</span></footer>
  </div>;
}