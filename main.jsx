import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase.js'

/* ─── Municípios ─────────────────────────────────────────────────────────── */
const MUNICIPIOS = [
  "ADAMANTINA","ADOLFO","AGUAÍ","AGUAS DA PRATA","AGUAS DE LINDOIA","AGUAS DE SANTA BARBARA",
  "AGUAS DE SAO PEDRO","AGUDOS","ALAMBARI","ALFREDO MARCONDES","ALTAIR","ALTINOPOLIS",
  "ALTO ALEGRE","ALUMINIO","ALVARES FLORENCE","ALVARES MACHADO","ALVARO DE CARVALHO",
  "ALVINLANDIA","AMERICANA","AMÉRICO BRASILIENSE","AMERICO DE CAMPOS","AMPARO","ANALANDIA",
  "ANDRADINA","ANGATUBA","ANHEMBI","ANHUMAS","APARECIDA","APARECIDA D'OESTE","APIAI",
  "ARAÇARIGUAMA","ARAÇATUBA","ARAÇOIABA DA SERRA","ARAMINA","ARANDU","ARAPEI","ARARAQUARA",
  "ARARAS","ARCO-IRIS","AREALVA","AREIAS","AREIOPOLIS","ARIRANHA","ARTUR NOGUEIRA","ARUJÁ",
  "ASPASIA","ASSIS","ATIBAIA","AURIFLAMA","AVAI","AVANHANDAVA","AVARE","BADY BASSITT",
  "BALBINOS","BALSAMO","BANANAL","BARAO DE ANTONINA","BARBOSA","BARIRI","BARRA BONITA",
  "BARRA DO CHAPEU","BARRA DO TURVO","BARRETOS","BARRINHA","BARUERI","BASTOS","BATATAIS",
  "BAURU","BEBEDOURO","BENTO DE ABREU","BERNARDINO DE CAMPOS","BERTIOGA","BILAC","BIRIGUI",
  "BIRITIBA-MIRIM","BOA ESPERANCA DO SUL","BOCAINA","BOFETE","BOITUVA","BOM JESUS DOS PERDÕES",
  "BOM SUCESSO DE ITARARÉ","BORA","BORACEIA","BORBOREMA","BOREBI","BOTUCATU",
  "BRAGANÇA PAULISTA","BRAUNA","BREJO ALEGRE","BRODOWSKI","BROTAS","BURI","BURITAMA",
  "BURITIZAL","CABRALIA PAULISTA","CABREÚVA","CAÇAPAVA","CACHOEIRA PAULISTA","CACONDE",
  "CAFELANDIA","CAIABU","CAIEIRAS","CAIUA","CAJAMAR","CAJATI","CAJOBI","CAJURU",
  "CAMPINA DO MONTE ALEGRE","CAMPINAS","CAMPO LIMPO PAULISTA","CAMPOS DO JORDÃO",
  "CAMPOS NOVOS PAULISTA","CANANEIA","CANAS","CÂNDIDO MOTA","CANDIDO RODRIGUES","CANITAR",
  "CAPÃO BONITO","CAPELA DO ALTO","CAPIVARI","CARAGUATATUBA","CARAPICUÍBA","CARDOSO",
  "CASA BRANCA","CASSIA DOS COQUEIROS","CASTILHO","CATANDUVA","CATIGUA","CEDRAL",
  "CERQUEIRA CESAR","CERQUILHO","CESARIO LANGE","CHARQUEADA","CHAVANTES","CLEMENTINA",
  "COLINA","COLOMBIA","CONCHAL","CONCHAS","CORDEIRÓPOLIS","COROADOS","CORONEL MACEDO",
  "CORUMBATAÍ","COSMÓPOLIS","COSMORAMA","COTIA","CRAVINHOS","CRISTAIS PAULISTA","CRUZALIA",
  "CRUZEIRO","CUBATÃO","CUNHA","DESCALVADO","DIADEMA","DIRCE REIS","DIVINOLANDIA",
  "DOBRADA","DOIS CORREGOS","DOLCINOPOLIS","DOURADO","DRACENA","DUARTINA","DUMONT",
  "ECHAPORA","ELDORADO","ELIAS FAUSTO","ELISIÁRIO","EMBAUBA","EMBU DAS ARTES","EMBU-GUACU",
  "EMILIANOPOLIS","ENGENHEIRO COELHO","ESPÍRITO SANTO DO PINHAL","ESPIRITO SANTO DO TURVO",
  "ESTIVA GERBI","ESTRELA DO NORTE","ESTRELA D'OESTE","EUCLIDES DA CUNHA PAULISTA",
  "FARTURA","FERNANDO PRESTES","FERNANDÓPOLIS","FERNAO","FERRAZ DE VASCONCELOS",
  "FLORA RICA","FLOREAL","FLORIDA PAULISTA","FLORINEA","FRANCA","FRANCISCO MORATO",
  "FRANCO DA ROCHA","GABRIEL MONTEIRO","GALIA","GARÇA","GASTAO VIDIGAL","GAVIÃO PEIXOTO",
  "GENERAL SALGADO","GETULINA","GLICÉRIO","GUAICARA","GUAIMBE","GUAIRA","GUAPIAÇU",
  "GUAPIARA","GUARÁ","GUARACAI","GUARACI","GUARANI D'OESTE","GUARANTA","GUARARAPES",
  "GUARAREMA","GUARATINGUETA","GUAREÍ","GUARIBA","GUARUJÁ","GUARULHOS","GUATAPARA",
  "GUZOLANDIA","HERCULANDIA","HOLAMBRA","HORTOLÂNDIA","IACANGA","IACRI","IARAS","IBATE",
  "IBIRA","IBIRAREMA","IBITINGA","IBIÚNA","ICEM","IEPE","IGARACU DO TIETE","IGARAPAVA",
  "IGARATA","IGUAPE","ILHA COMPRIDA","ILHA SOLTEIRA","ILHABELA","INDAIATUBA","INDIANA",
  "INDIAPORA","INUBIA PAULISTA","IPAUSSU","IPERÓ","IPEUNA","IPIGUA","IPORANGA","IPUA",
  "IRACEMAPOLIS","IRAPUA","IRAPURU","ITABERA","ITAÍ","ITAJOBI","ITAJU","ITANHAÉM",
  "ITAOCA","ITAPECERICA DA SERRA","ITAPETININGA","ITAPEVA","ITAPEVI","ITAPIRA",
  "ITAPIRAPUA PAULISTA","ITÁPOLIS","ITAPORANGA","ITAPUÍ","ITAPURA","ITAQUAQUECETUBA",
  "ITARARÉ","ITARIRI","ITATIBA","ITATINGA","ITIRAPINA","ITIRAPUA","ITOBI","ITU","ITUPEVA",
  "ITUVERAVA","JABORANDI","JABOTICABAL","JACAREÍ","JACI","JACUPIRANGA","JAGUARIÚNA",
  "JALES","JAMBEIRO","JANDIRA","JARDINÓPOLIS","JARINU","JAÚ","JERIQUARA","JOANÓPOLIS",
  "JOAO RAMALHO","JOSÉ BONIFÁCIO","JULIO MESQUITA","JUMIRIM","JUNDIAI","JUNQUEIRÓPOLIS",
  "JUQUIA","JUQUITIBA","LAGOINHA","LARANJAL PAULISTA","LAVINIA","LAVRINHAS","LEME",
  "LENÇÓIS PAULISTA","LIMEIRA","LINDOIA","LINS","LORENA","LOURDES","LOUVEIRA","LUCELIA",
  "LUCIANOPOLIS","LUIS ANTONIO","LUIZIANIA","LUPERCIO","LUTECIA","MACATUBA","MACAUBAL",
  "MACEDONIA","MAGDA","MAIRINQUE","MAIRIPORÃ","MANDURI","MARABA PAULISTA","MARACAÍ",
  "MARAPOAMA","MARIAPOLIS","MARÍLIA","MARINOPOLIS","MARTINOPOLIS","MATÃO","MAUÁ",
  "MENDONÇA","MERIDIANO","MESÓPOLIS","MIGUELOPOLIS","MINEIROS DO TIETE","MIRA ESTRELA",
  "MIRACATU","MIRANDOPOLIS","MIRANTE DO PARANAPANEMA","MIRASSOL","MIRASSOLANDIA","MOCOCA",
  "MOGI DAS CRUZES","MOGI GUAÇU","MOGI MIRIM","MOMBUCA","MONCOES","MONGAGUA",
  "MONTE ALEGRE DO SUL","MONTE ALTO","MONTE APRAZÍVEL","MONTE AZUL PAULISTA","MONTE CASTELO",
  "MONTE MOR","MONTEIRO LOBATO","MORRO AGUDO","MORUNGABA","MOTUCA","MURUTINGA DO SUL",
  "NANTES","NARANDIBA","NATIVIDADE DA SERRA","NAZARE PAULISTA","NEVES PAULISTA","NHANDEARA",
  "NIPOA","NOVA ALIANCA","NOVA CAMPINA","NOVA CANAA PAULISTA","NOVA CASTILHO","NOVA EUROPA",
  "NOVA GRANADA","NOVA GUATAPORANGA","NOVA INDEPENDÊNCIA","NOVA LUZITANIA","NOVA ODESSA",
  "NOVAIS","NOVO HORIZONTE","NUPORANGA","OCAUCU","OLEO","OLÍMPIA","ONDA VERDE","ORIENTE",
  "ORINDIUVA","ORLÂNDIA","OSASCO","OSCAR BRESSANE","OSVALDO CRUZ","OURINHOS","OURO VERDE",
  "OUROESTE","PACAEMBU","PALESTINA","PALMARES PAULISTA","PALMEIRA D'OESTE","PALMITAL",
  "PANORAMA","PARAGUAÇU PAULISTA","PARAIBUNA","PARAISO","PARANAPANEMA","PARANAPUA",
  "PARAPUA","PARDINHO","PARIQUERA-ACU","PARISI","PATROCINIO PAULISTA","PAULICEIA",
  "PAULINIA","PAULISTANIA","PAULO DE FARIA","PEDERNEIRAS","PEDRA BELA","PEDRANOPOLIS",
  "PEDREGULHO","PEDREIRA","PEDRINHAS PAULISTA","PEDRO DE TOLEDO","PENÁPOLIS",
  "PEREIRA BARRETO","PEREIRAS","PERUÍBE","PIACATU","PIEDADE","PILAR DO SUL",
  "PINDAMONHANGABA","PINDORAMA","PINHALZINHO","PIQUEROBI","PIQUETE","PIRACAIA",
  "PIRACICABA","PIRAJU","PIRAJUÍ","PIRANGI","PIRAPORA DO BOM JESUS","PIRAPOZINHO",
  "PIRASSUNUNGA","PIRATININGA","PITANGUEIRAS","PLANALTO","PLATINA","POA","POLONI",
  "POMPEIA","PONGAI","PONTAL","PONTALINDA","PONTES GESTAL","POPULINA","PORANGABA",
  "PORTO FELIZ","PORTO FERREIRA","POTIM","POTIRENDABA","PRACINHA","PRADOPOLIS",
  "PRAIA GRANDE","PRATANIA","PRESIDENTE ALVES","PRESIDENTE BERNARDES","PRESIDENTE EPITACIO",
  "PRESIDENTE PRUDENTE","PRESIDENTE VENCESLAU","PROMISSÃO","QUADRA","QUATA","QUEIROZ",
  "QUELUZ","QUINTANA","RAFARD","RANCHARIA","REDENCAO DA SERRA","REGENTE FEIJO",
  "REGINÓPOLIS","REGISTRO","RESTINGA","RIBEIRA","RIBEIRÃO BONITO","RIBEIRÃO BRANCO",
  "RIBEIRÃO CORRENTE","RIBEIRÃO DO SUL","RIBEIRÃO DOS ÍNDIOS","RIBEIRÃO GRANDE",
  "RIBEIRÃO PIRES","RIBEIRÃO PRETO","RIFAINA","RINCAO","RINOPOLIS","RIO CLARO",
  "RIO DAS PEDRAS","RIO GRANDE DA SERRA","RIOLANDIA","RIVERSUL","ROSANA","ROSEIRA",
  "RUBIACEA","RUBINEIA","SABINO","SAGRES","SALES","SALES OLIVEIRA","SALESOPOLIS",
  "SALMOURAO","SALTINHO","SALTO","SALTO DE PIRAPORA","SALTO GRANDE","SANDOVALINA",
  "SANTA ADELIA","SANTA ALBERTINA","SANTA BÁRBARA D'OESTE","SANTA BRANCA",
  "SANTA CLARA D'OESTE","SANTA CRUZ DA CONCEICAO","SANTA CRUZ DA ESPERANCA",
  "SANTA CRUZ DAS PALMEIRAS","SANTA CRUZ DO RIO PARDO","SANTA ERNESTINA","SANTA FE DO SUL",
  "SANTA GERTRUDES","SANTA ISABEL","SANTA LUCIA","SANTA MARIA DA SERRA","SANTA MERCEDES",
  "SANTA RITA DO PASSA QUATRO","SANTA RITA D'OESTE","SANTA ROSA DE VITERBO","SANTA SALETE",
  "SANTANA DA PONTE PENSA","SANTANA DE PARNAÍBA","SANTO ANASTACIO","SANTO ANDRÉ",
  "SANTO ANTONIO DA ALEGRIA","SANTO ANTÔNIO DE POSSE","SANTO ANTONIO DO ARACANGUA",
  "SANTO ANTÔNIO DO JARDIM","SANTO ANTONIO DO PINHAL","SANTO EXPEDITO",
  "SANTOPOLIS DO AGUAPEI","SANTOS","SÃO BENTO DO SAPUCAI","SÃO BERNARDO DO CAMPO",
  "SÃO CAETANO DO SUL","SÃO CARLOS","SÃO FRANCISCO","SÃO JOÃO DA BOA VISTA",
  "SÃO JOAO DAS DUAS PONTES","SÃO JOAO DE IRACEMA","SÃO JOAO DO PAU D'ALHO",
  "SÃO JOAQUIM DA BARRA","SÃO JOSE DA BELA VISTA","SÃO JOSÉ DO BARREIRO",
  "SÃO JOSE DO RIO PARDO","SÃO JOSE DO RIO PRETO","SÃO JOSE DOS CAMPOS",
  "SÃO LOURENCO DA SERRA","SÃO LUIZ DO PARAITINGA","SÃO MANUEL","SÃO MIGUEL ARCANJO",
  "SÃO PAULO","SÃO PEDRO","SÃO PEDRO DO TURVO","SÃO ROQUE","SÃO SEBASTIÃO",
  "SÃO SEBASTIÃO DA GRAMA","SÃO SIMAO","SÃO VICENTE","SARAPUÍ","SARUTAIA",
  "SEBASTIANOPOLIS DO SUL","SERRA AZUL","SERRA NEGRA","SERRANA","SERTÃOZINHO",
  "SETE BARRAS","SEVERINIA","SILVEIRAS","SOCORRO","SOROCABA","SUD MENNUCCI","SUMARÉ",
  "SUZANÁPOLIS","SUZANO","TABAPUÃ","TABATINGA","TABOÃO DA SERRA","TACIBA","TAGUAI",
  "TAIACU","TAIUVA","TAMBAU","TANABI","TAPIRAÍ","TAPIRATIBA","TAQUARAL","TAQUARITINGA",
  "TAQUARITUBA","TAQUARIVAI","TARABAI","TARUMÃ","TATUÍ","TAUBATÉ","TEJUPA",
  "TEODORO SAMPAIO","TERRA ROXA","TIETÊ","TIMBURI","TORRE DE PEDRA","TORRINHA","TRABIJU",
  "TREMEMBÉ","TRES FRONTEIRAS","TUIUTI","TUPÃ","TUPI PAULISTA","TURIUBA","TURMALINA",
  "UBARANA","UBATUBA","UBIRAJARA","UCHÔA","UNIAO PAULISTA","URANIA","URU","URUPÊS",
  "VALENTIM GENTIL","VALINHOS","VALPARAISO","VARGEM","VARGEM GRANDE DO SUL",
  "VARGEM GRANDE PAULISTA","VÁRZEA PAULISTA","VERA CRUZ","VINHEDO","VIRADOURO",
  "VISTA ALEGRE DO ALTO","VITORIA BRASIL","VOTORANTIM","VOTUPORANGA","ZACARIAS"
]

/* ─── Cores oficiais Facilita SP ─────────────────────────────────────────── */
const COR = {
  preto:      '#111111',
  vermelho:   '#E30613',
  vermelhoEsc:'#B00010',
  branco:     '#FFFFFF',
  cinzaFundo: '#F2F2F2',
  cinzaCard:  '#FFFFFF',
  cinzaBorda: '#E0E0E0',
  cinzaTexto: '#555555',
  cinzaHint:  '#999999',
  vermClaro:  '#FFF0F0',
  vermBorda:  '#FFAAAA',
}

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'facilita'

/* ─── Estilos reutilizáveis ──────────────────────────────────────────────── */
const inp = {
  width:'100%', fontSize:'16px', padding:'13px 14px', borderRadius:'8px',
  border:`1px solid ${COR.cinzaBorda}`, background:COR.cinzaCard,
  color:COR.preto, boxSizing:'border-box', outline:'none',
  WebkitAppearance:'none',
}
const lbl = {
  display:'block', fontSize:'11px', fontWeight:'600', color:COR.cinzaTexto,
  marginBottom:'5px', textTransform:'uppercase', letterSpacing:'0.05em',
}
const card = {
  background:COR.cinzaCard, borderRadius:'12px',
  border:`1px solid ${COR.cinzaBorda}`, padding:'20px',
}

/* ─── Logo inline ────────────────────────────────────────────────────────── */
const Logo = ({ size = 1 }) => (
  <div style={{display:'flex',alignItems:'center',gap:4*size+'px'}}>
    <span style={{
      fontStyle:'italic', fontWeight:'800', fontSize:22*size+'px', lineHeight:1,
      color:COR.branco, letterSpacing:'-0.5px', textTransform:'uppercase',
    }}>FACILITA</span>
    <span style={{
      fontStyle:'italic', fontWeight:'800', fontSize:22*size+'px', lineHeight:1,
      color:COR.vermelho, letterSpacing:'-0.5px', textTransform:'uppercase',
    }}>SP</span>
    <span style={{
      fontWeight:'700', fontSize:9*size+'px', color:COR.vermelho,
      letterSpacing:'0.15em', textTransform:'uppercase', alignSelf:'flex-end',
      marginBottom:2*size+'px', marginLeft:2*size+'px',
    }}>MUNICÍPIOS</span>
  </div>
)

/* ─── Cabeçalho ──────────────────────────────────────────────────────────── */
const Header = ({ children }) => (
  <div style={{background:COR.preto, padding:'14px 16px',
    display:'flex', justifyContent:'space-between', alignItems:'center'}}>
    <Logo />
    {children}
  </div>
)

/* ─── Spinner ────────────────────────────────────────────────────────────── */
const Spinner = ({ color = COR.vermelho, size = 20 }) => (
  <div style={{
    width:size, height:size, border:`2px solid rgba(255,255,255,0.3)`,
    borderTopColor:color, borderRadius:'50%', animation:'spin 0.7s linear infinite',
    flexShrink:0,
  }}/>
)

/* ════════════════════════════════════════════════════════════════════════════
   APP PRINCIPAL
════════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [view,     setView]    = useState('kiosk')
  const [search,   setSearch]  = useState('')
  const [selected, setSel]     = useState(null)
  const [creds,    setCreds]   = useState([])
  const [loading,  setLoad]    = useState(true)
  const [dbError,  setDbErr]   = useState(null)

  // Formulário
  const [nome,     setNome]    = useState('')
  const [doc,      setDoc]     = useState('')
  const [cargo,    setCargo]   = useState('')
  const [consent,  setConsent] = useState(false)
  const [submitting, setSub]   = useState(false)
  const [formErr,  setFormErr] = useState('')

  // Assinatura
  const canvasRef = useRef(null)
  const [drawing, setDraw]    = useState(false)
  const [hasSig,  setHasSig]  = useState(false)
  const lastPos   = useRef(null)

  // Admin
  const [adminPwd, setAP] = useState('')
  const [adminErr, setAE] = useState(false)
  const [adminSearch, setAS] = useState('')
  const [adminTab, setATab]  = useState('presentes')

  /* ── Supabase: carga inicial + tempo real ── */
  useEffect(() => {
    supabase.from('credenciamentos').select('*').order('created_at')
      .then(({ data, error }) => {
        if (error) { setDbErr(error.message); setLoad(false); return }
        setCreds(data || [])
        setLoad(false)
      })

    const ch = supabase.channel('cred-rt')
      .on('postgres_changes',
        { event:'INSERT', schema:'public', table:'credenciamentos' },
        p => setCreds(prev => prev.find(r => r.id === p.new.id) ? prev : [...prev, p.new])
      ).subscribe()

    return () => supabase.removeChannel(ch)
  }, [])

  /* ── Helpers ── */
  const isCred   = m => creds.some(r => r.municipio === m)
  const pendentes = MUNICIPIOS.filter(m => !isCred(m))
  const norm      = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase()
  const filtered  = MUNICIPIOS.filter(m => norm(m).includes(norm(search)))

  /* ── Assinatura ── */
  const xy = (e, cv) => {
    const r = cv.getBoundingClientRect()
    const s = e.touches ? e.touches[0] : e
    return { x:(s.clientX-r.left)*(cv.width/r.width), y:(s.clientY-r.top)*(cv.height/r.height) }
  }
  const startDraw = e => { e.preventDefault(); const cv=canvasRef.current; if(!cv)return; setDraw(true); lastPos.current=xy(e,cv) }
  const onDraw    = e => {
    e.preventDefault(); if(!drawing||!canvasRef.current)return
    const cv=canvasRef.current, ctx=cv.getContext('2d'), pos=xy(e,cv)
    ctx.beginPath(); ctx.moveTo(lastPos.current.x,lastPos.current.y)
    ctx.lineTo(pos.x,pos.y); ctx.strokeStyle=COR.preto; ctx.lineWidth=2.5
    ctx.lineCap='round'; ctx.lineJoin='round'; ctx.stroke()
    lastPos.current=pos; setHasSig(true)
  }
  const stopDraw = () => setDraw(false)
  const clearSig = () => {
    const cv=canvasRef.current; if(!cv)return
    cv.getContext('2d').clearRect(0,0,cv.width,cv.height); setHasSig(false)
  }

  /* ── Abrir formulário ── */
  const openForm = m => {
    if (isCred(m)) return
    setSel(m); setNome(''); setDoc(''); setCargo(''); setConsent(false)
    setHasSig(false); setFormErr('')
    setView('form')
    setTimeout(() => { const cv=canvasRef.current; if(cv) cv.getContext('2d').clearRect(0,0,cv.width,cv.height) }, 60)
  }

  /* ── Submeter ── */
  const handleSubmit = async () => {
    if (!nome.trim()||!doc.trim()||!cargo.trim()) { setFormErr('Preencha todos os campos obrigatórios.'); return }
    if (!hasSig)    { setFormErr('A assinatura é obrigatória.'); return }
    if (!consent)   { setFormErr('É necessário aceitar o termo de consentimento.'); return }
    if (submitting) return
    setSub(true); setFormErr('')
    const assinatura = canvasRef.current.toDataURL()
    const { error } = await supabase.from('credenciamentos').insert({
      municipio: selected, nome: nome.trim(),
      documento: doc.trim(), cargo: cargo.trim(),
      assinatura, consentimento: true,
    })
    setSub(false)
    if (error) { setFormErr('Erro ao salvar. Tente novamente.'); return }
    setView('success')
    setTimeout(() => { setView('kiosk'); setSearch(''); setSel(null) }, 6000)
  }

  /* ── Admin ── */
  const tryAdmin = () => adminPwd === ADMIN_PASS ? (setView('admin'), setAE(false)) : setAE(true)

  /* ── Exportar CSV ── */
  const exportCSV = () => {
    const bom  = '\uFEFF'
    const hdr  = ['Município','Nome','CPF/RG','Cargo','Horário','Consentimento'].join(';')
    const rows = creds.map(r =>
      [`"${r.municipio}"`,`"${r.nome}"`,`"${r.documento}"`,`"${r.cargo}"`,
       `"${new Date(r.created_at).toLocaleString('pt-BR')}"`,`"Sim"`].join(';')
    )
    const url = URL.createObjectURL(new Blob([bom+[hdr,...rows].join('\n')],{type:'text/csv;charset=utf-8;'}))
    const a = Object.assign(document.createElement('a'),{href:url,download:'credenciamento_facilita_sp_23062025.csv'})
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
  }

  /* ════════════════════════════════════════
     LOADING
  ════════════════════════════════════════ */
  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',
      alignItems:'center',justifyContent:'center',background:COR.preto}}>
      <Logo />
      <div style={{marginTop:28}}><Spinner color={COR.vermelho} size={32}/></div>
    </div>
  )

  if (dbError) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',
      justifyContent:'center',background:COR.cinzaFundo,padding:20}}>
      <div style={{...card,maxWidth:360,textAlign:'center'}}>
        <i className="ti ti-wifi-off" style={{fontSize:40,color:COR.vermelho,display:'block',marginBottom:12}}/>
        <p style={{fontWeight:600,marginBottom:8}}>Erro de conexão</p>
        <p style={{fontSize:13,color:COR.cinzaTexto,marginBottom:16}}>{dbError}</p>
        <button onClick={()=>window.location.reload()} style={{
          padding:'11px 24px',background:COR.vermelho,color:COR.branco,
          border:'none',borderRadius:8,cursor:'pointer',fontSize:14,fontWeight:600}}>
          Tentar novamente
        </button>
      </div>
    </div>
  )

  /* ════════════════════════════════════════
     KIOSK — tela principal
  ════════════════════════════════════════ */
  if (view === 'kiosk') return (
    <div style={{minHeight:'100vh',background:COR.cinzaFundo,fontFamily:'Inter,sans-serif'}}>
      <Header>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
          <span style={{background:COR.vermelho,color:COR.branco,borderRadius:20,
            padding:'4px 12px',fontSize:12,fontWeight:700,whiteSpace:'nowrap'}}>
            {creds.length} / {MUNICIPIOS.length}
          </span>
          <button onClick={()=>{setAP('');setAE(false);setView('adminLogin')}}
            style={{background:'transparent',border:'1px solid rgba(255,255,255,0.25)',
            color:'rgba(255,255,255,0.7)',borderRadius:6,padding:'3px 10px',
            fontSize:11,cursor:'pointer'}}>
            Operador
          </button>
        </div>
      </Header>

      {/* Barra de busca */}
      <div style={{background:COR.preto,padding:'0 16px 14px',borderBottom:`3px solid ${COR.vermelho}`}}>
        <div style={{position:'relative'}}>
          <i className="ti ti-search" style={{position:'absolute',left:13,top:'50%',
            transform:'translateY(-50%)',fontSize:18,color:COR.cinzaHint}}/>
          <input type="text" inputMode="search" placeholder="Buscar município..."
            value={search} onChange={e=>setSearch(e.target.value)} autoFocus
            style={{...inp,paddingLeft:42,paddingRight:search?40:14,
              background:'#222',color:COR.branco,border:'1px solid #333',fontSize:16}}/>
          {search && (
            <button onClick={()=>setSearch('')} aria-label="Limpar"
              style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',
              background:'none',border:'none',color:COR.cinzaHint,cursor:'pointer',fontSize:22,lineHeight:1}}>×</button>
          )}
        </div>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.4)',marginTop:6}}>
          {filtered.length} município{filtered.length!==1?'s':''} · {creds.length} credenciado{creds.length!==1?'s':''}
        </div>
      </div>

      {/* Lista */}
      <div style={{padding:'12px 16px',maxWidth:640,margin:'0 auto'}}>
        {filtered.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px 20px'}}>
            <i className="ti ti-map-pin-off" style={{fontSize:40,color:COR.cinzaHint,display:'block',marginBottom:12}}/>
            <p style={{color:COR.cinzaTexto}}>Nenhum município encontrado</p>
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {filtered.map(m => {
              const done = isCred(m)
              return (
                <button key={m} onClick={()=>!done&&openForm(m)}
                  style={{padding:'14px 16px',borderRadius:10,cursor:done?'default':'pointer',
                    border:`1px solid ${done?COR.vermBorda:COR.cinzaBorda}`,
                    background:done?COR.vermClaro:COR.cinzaCard,
                    display:'flex',alignItems:'center',justifyContent:'space-between',
                    textAlign:'left',width:'100%',transition:'border-color 0.15s'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    {done
                      ? <i className="ti ti-circle-check" style={{fontSize:20,color:COR.vermelho,flexShrink:0}}/>
                      : <i className="ti ti-map-pin" style={{fontSize:18,color:COR.cinzaHint,flexShrink:0}}/>
                    }
                    <span style={{fontSize:14,fontWeight:500,
                      color:done?COR.vermelhoEsc:COR.preto,lineHeight:1.3}}>
                      {m}
                    </span>
                  </div>
                  {!done && <i className="ti ti-chevron-right" style={{fontSize:16,color:COR.cinzaHint,flexShrink:0}}/>}
                  {done && <span style={{fontSize:11,color:COR.vermelho,fontWeight:600,whiteSpace:'nowrap'}}>Credenciado</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  /* ════════════════════════════════════════
     FORMULÁRIO
  ════════════════════════════════════════ */
  if (view === 'form') {
    const valid = nome.trim()&&doc.trim()&&cargo.trim()&&hasSig&&consent
    return (
      <div style={{minHeight:'100vh',background:COR.cinzaFundo,fontFamily:'Inter,sans-serif'}}>
        <Header>
          <button onClick={()=>{setView('kiosk');setSel(null)}}
            style={{background:'none',border:'none',color:'rgba(255,255,255,0.7)',
            cursor:'pointer',fontSize:13,display:'flex',alignItems:'center',gap:4}}>
            <i className="ti ti-arrow-left" style={{fontSize:16}}/> Voltar
          </button>
        </Header>

        {/* Faixa do município */}
        <div style={{background:COR.vermelho,padding:'12px 16px'}}>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.7)',textTransform:'uppercase',
            letterSpacing:'0.06em',marginBottom:2}}>Credenciamento</div>
          <div style={{fontSize:18,fontWeight:700,color:COR.branco}}>{selected}</div>
        </div>

        <div style={{padding:'16px',maxWidth:540,margin:'0 auto'}}>

          {/* Dados pessoais */}
          <div style={{...card,marginBottom:12}}>
            <p style={{fontSize:13,fontWeight:600,color:COR.preto,marginBottom:14}}>
              Dados do representante
            </p>
            <div style={{marginBottom:12}}>
              <label style={lbl}>Nome completo *</label>
              <input value={nome} onChange={e=>setNome(e.target.value)}
                placeholder="Nome completo" style={inp} autoFocus/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:0}}>
              <div>
                <label style={lbl}>CPF ou RG *</label>
                <input value={doc} onChange={e=>setDoc(e.target.value)}
                  placeholder="000.000.000-00" style={inp} inputMode="numeric"/>
              </div>
              <div>
                <label style={lbl}>Cargo / Função *</label>
                <input value={cargo} onChange={e=>setCargo(e.target.value)}
                  placeholder="Ex: Prefeito" style={inp}/>
              </div>
            </div>
          </div>

          {/* Assinatura */}
          <div style={{...card,marginBottom:12}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <p style={{fontSize:13,fontWeight:600,color:COR.preto}}>Assinatura *</p>
              {hasSig && (
                <button onClick={clearSig} style={{fontSize:12,color:COR.cinzaTexto,
                  background:'none',border:'none',cursor:'pointer',textDecoration:'underline'}}>
                  Limpar
                </button>
              )}
            </div>
            <canvas ref={canvasRef} width={500} height={150}
              onMouseDown={startDraw} onMouseMove={onDraw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
              onTouchStart={startDraw} onTouchMove={onDraw} onTouchEnd={stopDraw}
              style={{width:'100%',height:140,border:`1px solid ${hasSig?'#aaa':COR.cinzaBorda}`,
              borderRadius:8,background:COR.branco,touchAction:'none',cursor:'crosshair',display:'block'}}/>
            {!hasSig && (
              <p style={{fontSize:11,color:COR.cinzaHint,marginTop:4}}>
                Assine com o dedo (toque) ou com o mouse
              </p>
            )}
          </div>

          {/* Consentimento LGPD */}
          <div style={{...card,marginBottom:16,
            border:`1px solid ${consent?COR.vermBorda:COR.cinzaBorda}`,
            background:consent?COR.vermClaro:'#fff'}}>
            <label style={{display:'flex',gap:12,alignItems:'flex-start',cursor:'pointer'}}>
              <div style={{marginTop:2,flexShrink:0}}>
                <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}
                  style={{width:18,height:18,accentColor:COR.vermelho,cursor:'pointer'}}/>
              </div>
              <span style={{fontSize:13,color:COR.preto,lineHeight:1.6}}>
                Autorizo o uso dos meus dados pessoais (nome, documento e cargo) pela{' '}
                <strong>Secretaria de Desenvolvimento Econômico do Estado de São Paulo</strong>{' '}
                para fins internos e estatísticos relacionados ao evento de entrega de selos do{' '}
                <strong>Programa Facilita SP Municípios</strong>. Os dados não serão
                compartilhados com terceiros.
              </span>
            </label>
          </div>

          {/* Erro */}
          {formErr && (
            <div style={{background:COR.vermClaro,border:`1px solid ${COR.vermBorda}`,
              borderRadius:8,padding:'10px 14px',marginBottom:12,
              fontSize:13,color:COR.vermelhoEsc,display:'flex',gap:8,alignItems:'center'}}>
              <i className="ti ti-alert-circle" style={{fontSize:16,flexShrink:0}}/>
              {formErr}
            </div>
          )}

          {/* Botões */}
          <div style={{display:'flex',gap:10}}>
            <button onClick={()=>{setView('kiosk');setSel(null)}}
              style={{flex:1,padding:'13px',borderRadius:8,border:`1px solid ${COR.cinzaBorda}`,
              background:'transparent',cursor:'pointer',fontSize:14,color:COR.cinzaTexto,fontWeight:500}}>
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={submitting}
              style={{flex:2,padding:'13px',borderRadius:8,border:'none',fontWeight:700,
              background:valid&&!submitting?COR.vermelho:'#ccc',
              color:COR.branco,cursor:valid&&!submitting?'pointer':'not-allowed',
              fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
              {submitting
                ? <><Spinner color={COR.branco} size={16}/> Salvando...</>
                : 'Confirmar credenciamento'
              }
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ════════════════════════════════════════
     SUCESSO
  ════════════════════════════════════════ */
  if (view === 'success') return (
    <div style={{minHeight:'100vh',background:COR.preto,display:'flex',
      flexDirection:'column',alignItems:'center',justifyContent:'center',
      padding:32,fontFamily:'Inter,sans-serif',textAlign:'center'}}>
      <Logo />
      <div style={{width:80,height:80,borderRadius:'50%',background:COR.vermelho,
        display:'flex',alignItems:'center',justifyContent:'center',margin:'32px auto 20px'}}>
        <i className="ti ti-check" style={{fontSize:42,color:COR.branco}}/>
      </div>
      <div style={{fontSize:22,fontWeight:700,color:COR.branco,marginBottom:8}}>
        Credenciamento confirmado!
      </div>
      <div style={{fontSize:16,color:COR.vermelho,fontWeight:600,marginBottom:20}}>{selected}</div>
      <div style={{fontSize:13,color:'rgba(255,255,255,0.5)'}}>Retornando ao início...</div>
    </div>
  )

  /* ════════════════════════════════════════
     LOGIN ADMIN
  ════════════════════════════════════════ */
  if (view === 'adminLogin') return (
    <div style={{minHeight:'100vh',background:COR.cinzaFundo,display:'flex',
      alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif'}}>
      <div style={{...card,width:340,maxWidth:'calc(100% - 32px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:22}}>
          <div style={{width:44,height:44,borderRadius:'50%',background:COR.preto,
            display:'flex',alignItems:'center',justifyContent:'center'}}>
            <i className="ti ti-lock" style={{fontSize:20,color:COR.vermelho}}/>
          </div>
          <div>
            <div style={{fontSize:16,fontWeight:600,color:COR.preto}}>Área do Operador</div>
            <div style={{fontSize:12,color:COR.cinzaTexto}}>Acesso restrito</div>
          </div>
        </div>
        <label style={lbl}>Senha</label>
        <input type="password" value={adminPwd} onChange={e=>setAP(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&tryAdmin()} placeholder="••••••••"
          style={{...inp,marginBottom:6,border:`1px solid ${adminErr?COR.vermelho:COR.cinzaBorda}`}}/>
        {adminErr && <p style={{fontSize:12,color:COR.vermelho,marginBottom:10}}>Senha incorreta.</p>}
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button onClick={()=>setView('kiosk')}
            style={{flex:1,padding:'11px',border:`1px solid ${COR.cinzaBorda}`,borderRadius:8,
            background:'transparent',cursor:'pointer',fontSize:13,color:COR.cinzaTexto}}>
            Cancelar
          </button>
          <button onClick={tryAdmin}
            style={{flex:1,padding:'11px',border:'none',borderRadius:8,
            background:COR.preto,color:COR.branco,cursor:'pointer',fontSize:13,fontWeight:600}}>
            Entrar
          </button>
        </div>
      </div>
    </div>
  )

  /* ════════════════════════════════════════
     PAINEL ADMIN
  ════════════════════════════════════════ */
  if (view === 'admin') {
    const pct       = Math.round(creds.length / MUNICIPIOS.length * 100)
    const filtCreds = adminSearch
      ? creds.filter(r => norm(r.municipio).includes(norm(adminSearch)) || r.nome.toLowerCase().includes(adminSearch.toLowerCase()))
      : creds
    const filtPend  = pendentes.filter(m => !adminSearch || norm(m).includes(norm(adminSearch)))

    return (
      <div style={{minHeight:'100vh',background:COR.cinzaFundo,fontFamily:'Inter,sans-serif'}}>
        <Header>
          <div style={{display:'flex',gap:8}}>
            <button onClick={exportCSV}
              style={{background:COR.vermelho,color:COR.branco,border:'none',borderRadius:8,
              padding:'7px 14px',cursor:'pointer',fontSize:12,fontWeight:700,
              display:'flex',alignItems:'center',gap:6}}>
              <i className="ti ti-download" style={{fontSize:14}}/> CSV
            </button>
            <button onClick={()=>setView('kiosk')}
              style={{background:'transparent',border:'1px solid rgba(255,255,255,0.25)',
              color:'rgba(255,255,255,0.7)',borderRadius:8,padding:'7px 12px',
              fontSize:12,cursor:'pointer'}}>
              Quiosque
            </button>
          </div>
        </Header>

        {/* Métricas */}
        <div style={{background:COR.preto,padding:'12px 16px',
          borderBottom:`3px solid ${COR.vermelho}`,display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
          {[
            {label:'Total',      val:MUNICIPIOS.length, cor:COR.branco},
            {label:'Credenciados', val:creds.length,     cor:COR.vermelho},
            {label:'Pendentes',  val:pendentes.length,  cor:'rgba(255,255,255,0.5)'},
            {label:'Presença',   val:pct+'%',           cor:COR.vermelho},
          ].map(({label,val,cor})=>(
            <div key={label} style={{background:'#1a1a1a',borderRadius:8,
              padding:'8px 14px',border:'1px solid #333',minWidth:80}}>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',
                letterSpacing:'0.05em',marginBottom:2}}>{label}</div>
              <div style={{fontSize:22,fontWeight:700,color:cor}}>{val}</div>
            </div>
          ))}
          <div style={{flex:1,minWidth:140,background:'#1a1a1a',borderRadius:8,
            padding:'8px 14px',border:'1px solid #333'}}>
            <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',
              letterSpacing:'0.05em',marginBottom:5}}>Progresso</div>
            <div style={{height:7,background:'#333',borderRadius:4,overflow:'hidden'}}>
              <div style={{height:'100%',width:pct+'%',background:COR.vermelho,
                borderRadius:4,transition:'width 0.5s'}}/>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:'rgba(255,255,255,0.4)'}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:COR.vermelho,
              animation:'pulse 2s ease-in-out infinite'}}/>
            Tempo real
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
          </div>
        </div>

        {/* Tabs */}
        <div style={{background:COR.cinzaCard,borderBottom:`1px solid ${COR.cinzaBorda}`,
          display:'flex',padding:'0 16px'}}>
          {[{id:'presentes',label:`Credenciados (${creds.length})`},{id:'pendentes',label:`Pendentes (${pendentes.length})`}].map(t=>(
            <button key={t.id} onClick={()=>setATab(t.id)}
              style={{padding:'12px 16px',border:'none',cursor:'pointer',fontSize:13,fontWeight:500,
              borderBottom:adminTab===t.id?`2px solid ${COR.vermelho}`:'2px solid transparent',
              background:'transparent',color:adminTab===t.id?COR.preto:COR.cinzaTexto,marginBottom:'-1px'}}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{padding:'14px 16px',maxWidth:1100,margin:'0 auto'}}>
          <div style={{position:'relative',marginBottom:12}}>
            <i className="ti ti-search" style={{position:'absolute',left:12,top:'50%',
              transform:'translateY(-50%)',fontSize:15,color:COR.cinzaHint}}/>
            <input value={adminSearch} onChange={e=>setAS(e.target.value)}
              placeholder="Buscar por município ou nome..."
              style={{...inp,paddingLeft:36}}/>
          </div>

          {/* Tabela credenciados */}
          {adminTab==='presentes' && (
            filtCreds.length===0
              ? <div style={{textAlign:'center',padding:40,color:COR.cinzaTexto,fontSize:14}}>
                  {creds.length===0?'Nenhum credenciamento ainda.':'Nenhum resultado.'}
                </div>
              : <div style={{...card,overflow:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:13,tableLayout:'fixed'}}>
                    <thead>
                      <tr style={{background:COR.cinzaFundo}}>
                        {[['Município','22%'],['Nome','24%'],['CPF/RG','15%'],['Cargo','18%'],['Horário','10%'],['Assinatura','11%']].map(([h,w])=>(
                          <th key={h} style={{padding:'9px 12px',textAlign:'left',fontWeight:600,
                            color:COR.cinzaTexto,borderBottom:`1px solid ${COR.cinzaBorda}`,
                            width:w,fontSize:11,textTransform:'uppercase',letterSpacing:'0.04em'}}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtCreds.map((r,i)=>(
                        <tr key={r.id} style={{borderBottom:`1px solid ${COR.cinzaBorda}`,
                          background:i%2===0?COR.cinzaCard:COR.cinzaFundo}}>
                          <td style={{padding:'9px 12px',fontWeight:600,overflow:'hidden',
                            textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:12}}>{r.municipio}</td>
                          <td style={{padding:'9px 12px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.nome}</td>
                          <td style={{padding:'9px 12px',fontFamily:'monospace',fontSize:11,
                            overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.documento}</td>
                          <td style={{padding:'9px 12px',color:COR.cinzaTexto,overflow:'hidden',
                            textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:12}}>{r.cargo}</td>
                          <td style={{padding:'9px 12px',fontSize:11,color:COR.cinzaTexto,whiteSpace:'nowrap'}}>
                            {new Date(r.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}
                          </td>
                          <td style={{padding:'9px 12px',textAlign:'center'}}>
                            {r.assinatura&&<img src={r.assinatura} style={{height:28,maxWidth:80,objectFit:'contain'}} alt="assinatura"/>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
          )}

          {/* Pendentes */}
          {adminTab==='pendentes' && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:8}}>
              {filtPend.map(m=>(
                <div key={m} style={{...card,display:'flex',alignItems:'center',
                  justifyContent:'space-between',padding:'10px 14px'}}>
                  <span style={{fontSize:12,color:COR.cinzaTexto}}>{m}</span>
                  <button onClick={()=>openForm(m)}
                    style={{background:'none',border:'none',cursor:'pointer',color:COR.vermelho,
                    fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:4,whiteSpace:'nowrap'}}>
                    Credenciar
                  </button>
                </div>
              ))}
              {filtPend.length===0&&<p style={{color:COR.cinzaTexto,gridColumn:'1/-1',
                textAlign:'center',padding:40}}>Todos credenciados!</p>}
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
