import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase.js'

/* ─── Lista de municípios ─────────────────────────────────────────────────── */
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

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'facilita'

/* ─── Estilos base ───────────────────────────────────────────────────────── */
const c = {
  blue:    '#1e3a5f',
  gold:    '#f5c842',
  white:   '#ffffff',
  bg:      '#f0f4f8',
  card:    '#ffffff',
  border:  '#e2e8f0',
  text:    '#1e293b',
  muted:   '#64748b',
  hint:    '#94a3b8',
  green:   '#16a34a',
  greenBg: '#f0fdf4',
  greenBd: '#86efac',
  red:     '#ef4444',
}

const inp = {
  width:'100%', fontSize:'15px', padding:'10px 14px',
  borderRadius:'8px', border:`1px solid ${c.border}`,
  boxSizing:'border-box', background:c.white, color:c.text,
}

/* ─── Componente principal ───────────────────────────────────────────────── */
export default function App() {
  const [view,     setView]    = useState('kiosk')
  const [search,   setSearch]  = useState('')
  const [selected, setSel]     = useState(null)
  const [creds,    setCreds]   = useState([])
  const [loading,  setLoad]    = useState(true)
  const [error,    setError]   = useState(null)

  // Formulário
  const [nome,  setNome]  = useState('')
  const [doc,   setDoc]   = useState('')
  const [cargo, setCargo] = useState('')
  const [submitting, setSub] = useState(false)

  // Admin
  const [adminPwd, setAP]  = useState('')
  const [adminErr, setAE]  = useState(false)
  const [adminSearch, setAS] = useState('')
  const [adminTab, setATab]  = useState('presentes')

  // Assinatura
  const canvasRef  = useRef(null)
  const [drawing,  setDraw]   = useState(false)
  const [hasSig,   setHasSig] = useState(false)
  const lastPos    = useRef(null)

  /* ── Carregar dados + subscrição em tempo real ── */
  useEffect(() => {
    supabase
      .from('credenciamentos')
      .select('*')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) { setError(error.message); setLoad(false); return }
        setCreds(data || [])
        setLoad(false)
      })

    const channel = supabase
      .channel('credenciamentos-changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'credenciamentos' },
        payload => setCreds(prev => {
          if (prev.find(r => r.id === payload.new.id)) return prev
          return [...prev, payload.new]
        })
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  /* ── Helpers ── */
  const isCred   = m => creds.some(r => r.municipio === m)
  const filtered = MUNICIPIOS.filter(m =>
    m.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
     .includes(search.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''))
  )
  const pendentes = MUNICIPIOS.filter(m => !isCred(m))

  /* ── Assinatura ── */
  const getXY = (e, cv) => {
    const r = cv.getBoundingClientRect()
    const s = e.touches ? e.touches[0] : e
    return { x:(s.clientX-r.left)*(cv.width/r.width), y:(s.clientY-r.top)*(cv.height/r.height) }
  }
  const startDraw = e => { e.preventDefault(); const cv=canvasRef.current; if(!cv)return; setDraw(true); lastPos.current=getXY(e,cv) }
  const onDraw    = e => {
    e.preventDefault(); if(!drawing||!canvasRef.current)return
    const cv=canvasRef.current, ctx=cv.getContext('2d'), pos=getXY(e,cv)
    ctx.beginPath(); ctx.moveTo(lastPos.current.x,lastPos.current.y)
    ctx.lineTo(pos.x,pos.y); ctx.strokeStyle=c.blue; ctx.lineWidth=2.5
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
    setSel(m); setNome(''); setDoc(''); setCargo(''); setHasSig(false)
    setView('form')
    setTimeout(() => { const cv=canvasRef.current; if(cv) cv.getContext('2d').clearRect(0,0,cv.width,cv.height) }, 50)
  }

  /* ── Submeter ── */
  const handleSubmit = async () => {
    if (!nome.trim()||!doc.trim()||!cargo.trim()||!hasSig||submitting) return
    setSub(true)
    const assinatura = canvasRef.current.toDataURL()
    const { error } = await supabase.from('credenciamentos').insert({
      municipio: selected,
      nome:      nome.trim(),
      documento: doc.trim(),
      cargo:     cargo.trim(),
      assinatura,
    })
    setSub(false)
    if (error) { alert('Erro ao salvar: ' + error.message); return }
    setView('success')
    setTimeout(() => { setView('kiosk'); setSearch(''); setSel(null) }, 5000)
  }

  /* ── Login admin ── */
  const tryAdmin = () => {
    if (adminPwd === ADMIN_PASS) { setView('admin'); setAE(false) }
    else setAE(true)
  }

  /* ── Exportar CSV ── */
  const exportCSV = () => {
    const bom  = '\uFEFF'
    const hdr  = ['Município','Nome','CPF/RG','Cargo','Horário'].join(';')
    const rows = creds.map(r =>
      [`"${r.municipio}"`,`"${r.nome}"`,`"${r.documento}"`,`"${r.cargo}"`,
       `"${new Date(r.created_at).toLocaleString('pt-BR')}"`].join(';')
    )
    const csv = bom+[hdr,...rows].join('\n')
    const url = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}))
    const a = Object.assign(document.createElement('a'),{href:url,download:'credenciamento_facilita_sp.csv'})
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
  }

  /* ════════════════════════════════════════════════
     LOADING
  ════════════════════════════════════════════════ */
  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:c.bg}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:'36px',height:'36px',border:`3px solid ${c.blue}`,borderTopColor:'transparent',
          borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 14px'}}/>
        <p style={{color:c.muted,fontSize:'14px'}}>Carregando sistema...</p>
      </div>
    </div>
  )

  if (error) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:c.bg,padding:'20px'}}>
      <div style={{background:c.white,borderRadius:'12px',padding:'32px',maxWidth:'400px',textAlign:'center',border:`1px solid ${c.border}`}}>
        <i className="ti ti-alert-circle" style={{fontSize:'40px',color:c.red,display:'block',marginBottom:'12px'}}/>
        <p style={{fontWeight:'600',marginBottom:'8px'}}>Erro de conexão</p>
        <p style={{fontSize:'13px',color:c.muted,marginBottom:'16px'}}>{error}</p>
        <button onClick={()=>window.location.reload()} style={{padding:'10px 24px',background:c.blue,color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontSize:'14px'}}>
          Tentar novamente
        </button>
      </div>
    </div>
  )

  /* ════════════════════════════════════════════════
     CABEÇALHO COMPARTILHADO
  ════════════════════════════════════════════════ */
  const Header = ({ subtitle, children }) => (
    <div style={{background:c.blue,padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'10px'}}>
      <div>
        <div style={{color:c.gold,fontSize:'11px',fontWeight:'600',letterSpacing:'0.07em',textTransform:'uppercase',marginBottom:'3px'}}>
          Secretaria de Desenvolvimento Econômico · Estado de São Paulo
        </div>
        <div style={{color:'white',fontSize:'18px',fontWeight:'600'}}>Programa Facilita SP — Entrega de Selos</div>
        {subtitle && <div style={{color:'#93b5d1',fontSize:'12px',marginTop:'2px'}}>{subtitle}</div>}
      </div>
      {children}
    </div>
  )

  /* ════════════════════════════════════════════════
     KIOSK
  ════════════════════════════════════════════════ */
  if (view === 'kiosk') return (
    <div style={{minHeight:'100vh',background:c.bg,fontFamily:'Inter,sans-serif'}}>
      <Header subtitle="Credenciamento · 23 de junho de 2025">
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'8px'}}>
          <span style={{background:c.gold,color:c.blue,borderRadius:'20px',padding:'5px 14px',fontSize:'13px',fontWeight:'600',whiteSpace:'nowrap'}}>
            {creds.length} / {MUNICIPIOS.length} credenciados
          </span>
          <button onClick={()=>{setAP('');setAE(false);setView('adminLogin')}}
            style={{background:'transparent',border:'1px solid rgba(255,255,255,0.3)',color:'rgba(255,255,255,0.8)',
            borderRadius:'6px',padding:'4px 12px',fontSize:'11px',cursor:'pointer'}}>
            Área do Operador
          </button>
        </div>
      </Header>

      <div style={{background:'white',padding:'14px 20px',borderBottom:`1px solid ${c.border}`,position:'sticky',top:0,zIndex:10}}>
        <div style={{maxWidth:'600px',margin:'0 auto',position:'relative'}}>
          <i className="ti ti-search" style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'16px',color:c.hint}}/>
          <input type="text" placeholder="Digite o nome do seu município..." value={search}
            onChange={e=>setSearch(e.target.value)} autoFocus
            style={{...inp,paddingLeft:'38px',paddingRight:search?'36px':'14px',fontSize:'16px'}}/>
          {search && (
            <button onClick={()=>setSearch('')} aria-label="Limpar"
              style={{position:'absolute',right:'10px',top:'50%',transform:'translateY(-50%)',
              background:'none',border:'none',color:c.hint,cursor:'pointer',fontSize:'22px',lineHeight:1}}>×</button>
          )}
        </div>
        <div style={{maxWidth:'600px',margin:'5px auto 0',fontSize:'11px',color:c.hint}}>
          {filtered.length} município{filtered.length!==1?'s':''} · {creds.length} credenciado{creds.length!==1?'s':''}
        </div>
      </div>

      <div style={{padding:'16px 20px',maxWidth:'900px',margin:'0 auto'}}>
        {filtered.length === 0 ? (
          <div style={{textAlign:'center',padding:'60px 20px'}}>
            <i className="ti ti-map-pin-off" style={{fontSize:'40px',color:c.hint,display:'block',marginBottom:'12px'}}/>
            <p style={{color:c.muted}}>Nenhum município encontrado para "<strong>{search}</strong>"</p>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'8px'}}>
            {filtered.map(m => {
              const done = isCred(m)
              return (
                <button key={m} onClick={()=>!done&&openForm(m)}
                  style={{padding:'12px 14px',borderRadius:'8px',cursor:done?'default':'pointer',
                    border:`1px solid ${done?c.greenBd:c.border}`,
                    background:done?c.greenBg:c.white,
                    display:'flex',alignItems:'center',justifyContent:'space-between',
                    textAlign:'left',transition:'border-color 0.15s,background 0.15s'}}>
                  <span style={{fontSize:'12px',fontWeight:'500',color:done?c.green:c.text,lineHeight:'1.3'}}>{m}</span>
                  {done
                    ? <i className="ti ti-circle-check-filled" style={{fontSize:'18px',color:c.green,flexShrink:0,marginLeft:'6px'}}/>
                    : <i className="ti ti-chevron-right" style={{fontSize:'15px',color:c.hint,flexShrink:0,marginLeft:'6px'}}/>
                  }
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  /* ════════════════════════════════════════════════
     FORMULÁRIO
  ════════════════════════════════════════════════ */
  if (view === 'form') {
    const valid = nome.trim()&&doc.trim()&&cargo.trim()&&hasSig
    return (
      <div style={{minHeight:'100vh',background:c.bg,fontFamily:'Inter,sans-serif'}}>
        <Header subtitle={`Credenciamento · ${selected}`}/>
        <div style={{padding:'24px 20px',maxWidth:'520px',margin:'0 auto'}}>
          <div style={{background:c.white,borderRadius:'12px',border:`1px solid ${c.border}`,padding:'24px',marginBottom:'16px'}}>
            <h2 style={{fontSize:'16px',fontWeight:'600',marginBottom:'20px',color:c.text}}>Dados do Representante</h2>

            <div style={{marginBottom:'14px'}}>
              <label style={{display:'block',fontSize:'11px',fontWeight:'600',color:c.muted,marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.05em'}}>
                Nome completo *
              </label>
              <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome completo do representante"
                style={inp} autoFocus/>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'14px'}}>
              <div>
                <label style={{display:'block',fontSize:'11px',fontWeight:'600',color:c.muted,marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.05em'}}>
                  CPF ou RG *
                </label>
                <input value={doc} onChange={e=>setDoc(e.target.value)} placeholder="000.000.000-00" style={inp}/>
              </div>
              <div>
                <label style={{display:'block',fontSize:'11px',fontWeight:'600',color:c.muted,marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.05em'}}>
                  Cargo / Função *
                </label>
                <input value={cargo} onChange={e=>setCargo(e.target.value)} placeholder="Ex: Prefeito" style={inp}/>
              </div>
            </div>

            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                <label style={{fontSize:'11px',fontWeight:'600',color:c.muted,textTransform:'uppercase',letterSpacing:'0.05em'}}>
                  Assinatura *
                </label>
                {hasSig && <button onClick={clearSig} style={{fontSize:'12px',color:c.muted,background:'none',border:'none',cursor:'pointer',textDecoration:'underline'}}>Limpar</button>}
              </div>
              <canvas ref={canvasRef} width={480} height={160}
                onMouseDown={startDraw} onMouseMove={onDraw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                onTouchStart={startDraw} onTouchMove={onDraw} onTouchEnd={stopDraw}
                style={{width:'100%',height:'140px',border:`1px solid ${hasSig?'#94a3b8':c.border}`,
                borderRadius:'8px',background:c.white,touchAction:'none',cursor:'crosshair',display:'block'}}/>
              {!hasSig && <p style={{fontSize:'11px',color:c.hint,marginTop:'4px'}}>Assine com o dedo ou o mouse no campo acima</p>}
            </div>
          </div>

          <div style={{display:'flex',gap:'10px'}}>
            <button onClick={()=>{setView('kiosk');setSel(null)}}
              style={{flex:'1',padding:'12px',borderRadius:'8px',border:`1px solid ${c.border}`,background:'transparent',cursor:'pointer',fontSize:'14px',color:c.muted}}>
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={!valid||submitting}
              style={{flex:'2',padding:'12px',borderRadius:'8px',border:'none',
              background:valid&&!submitting?c.blue:'#94a3b8',color:'white',
              cursor:valid&&!submitting?'pointer':'not-allowed',fontSize:'14px',fontWeight:'600',
              display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
              {submitting
                ? <><div style={{width:'14px',height:'14px',border:'2px solid white',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/> Salvando...</>
                : <><i className="ti ti-circle-check"/> Confirmar Credenciamento</>
              }
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ════════════════════════════════════════════════
     SUCESSO
  ════════════════════════════════════════════════ */
  if (view === 'success') return (
    <div style={{minHeight:'100vh',background:c.bg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif'}}>
      <div style={{textAlign:'center',padding:'40px',animation:'fadeIn 0.4s ease'}}>
        <div style={{width:'80px',height:'80px',borderRadius:'50%',background:c.greenBg,border:`2px solid ${c.greenBd}`,
          display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
          <i className="ti ti-check" style={{fontSize:'38px',color:c.green}}/>
        </div>
        <div style={{fontSize:'22px',fontWeight:'700',color:c.text,marginBottom:'6px'}}>Credenciamento confirmado!</div>
        <div style={{fontSize:'16px',color:c.green,fontWeight:'600',marginBottom:'16px'}}>{selected}</div>
        <div style={{fontSize:'13px',color:c.hint}}>Retornando ao início em instantes...</div>
      </div>
    </div>
  )

  /* ════════════════════════════════════════════════
     LOGIN ADMIN
  ════════════════════════════════════════════════ */
  if (view === 'adminLogin') return (
    <div style={{minHeight:'100vh',background:c.bg,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,sans-serif'}}>
      <div style={{background:c.white,borderRadius:'12px',border:`1px solid ${c.border}`,padding:'32px',width:'340px',maxWidth:'calc(100% - 32px)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'22px'}}>
          <div style={{width:'44px',height:'44px',borderRadius:'50%',background:'#dbeafe',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <i className="ti ti-lock" style={{fontSize:'20px',color:'#1e40af'}}/>
          </div>
          <div>
            <div style={{fontSize:'16px',fontWeight:'600',color:c.text}}>Área do Operador</div>
            <div style={{fontSize:'13px',color:c.muted}}>Painel administrativo</div>
          </div>
        </div>
        <label style={{display:'block',fontSize:'11px',fontWeight:'600',color:c.muted,marginBottom:'5px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Senha</label>
        <input type="password" value={adminPwd} onChange={e=>setAP(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&tryAdmin()} placeholder="••••••••"
          style={{...inp,marginBottom:'6px',border:`1px solid ${adminErr?c.red:c.border}`}}/>
        {adminErr && <p style={{fontSize:'12px',color:c.red,marginBottom:'10px'}}>Senha incorreta.</p>}
        <div style={{display:'flex',gap:'8px',marginTop:'12px'}}>
          <button onClick={()=>setView('kiosk')} style={{flex:'1',padding:'10px',border:`1px solid ${c.border}`,borderRadius:'8px',background:'transparent',cursor:'pointer',fontSize:'13px',color:c.muted}}>Cancelar</button>
          <button onClick={tryAdmin} style={{flex:'1',padding:'10px',border:'none',borderRadius:'8px',background:c.blue,color:'white',cursor:'pointer',fontSize:'13px',fontWeight:'600'}}>Entrar</button>
        </div>
      </div>
    </div>
  )

  /* ════════════════════════════════════════════════
     PAINEL ADMIN
  ════════════════════════════════════════════════ */
  if (view === 'admin') {
    const pct      = Math.round(creds.length/MUNICIPIOS.length*100)
    const filtCreds = adminSearch
      ? creds.filter(r=>r.municipio.includes(adminSearch.toUpperCase())||r.nome.toLowerCase().includes(adminSearch.toLowerCase()))
      : creds
    const filtPend = pendentes.filter(m=>!adminSearch||m.includes(adminSearch.toUpperCase()))

    return (
      <div style={{minHeight:'100vh',background:c.bg,fontFamily:'Inter,sans-serif'}}>
        <Header subtitle="Painel Administrativo — tempo real">
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            <button onClick={exportCSV}
              style={{background:c.gold,color:c.blue,border:'none',borderRadius:'8px',padding:'8px 14px',cursor:'pointer',fontSize:'13px',fontWeight:'600',display:'flex',alignItems:'center',gap:'6px'}}>
              <i className="ti ti-download"/> Exportar CSV
            </button>
            <button onClick={()=>setView('kiosk')}
              style={{background:'transparent',border:'1px solid rgba(255,255,255,0.3)',color:'rgba(255,255,255,0.8)',borderRadius:'8px',padding:'8px 14px',fontSize:'12px',cursor:'pointer'}}>
              Quiosque
            </button>
          </div>
        </Header>

        {/* Métricas */}
        <div style={{padding:'16px 20px',background:'white',borderBottom:`1px solid ${c.border}`,display:'flex',gap:'12px',flexWrap:'wrap',alignItems:'center'}}>
          {[
            {label:'Total', val:MUNICIPIOS.length, color:c.text},
            {label:'Credenciados', val:creds.length, color:c.green},
            {label:'Pendentes', val:pendentes.length, color:'#d97706'},
            {label:'Presença', val:pct+'%', color:c.blue},
          ].map(({label,val,color})=>(
            <div key={label} style={{background:c.bg,borderRadius:'8px',padding:'10px 18px',border:`1px solid ${c.border}`}}>
              <div style={{fontSize:'11px',color:c.muted,marginBottom:'2px',textTransform:'uppercase',letterSpacing:'0.05em'}}>{label}</div>
              <div style={{fontSize:'22px',fontWeight:'700',color}}>{val}</div>
            </div>
          ))}
          <div style={{flex:1,minWidth:'160px',background:c.bg,borderRadius:'8px',padding:'10px 18px',border:`1px solid ${c.border}`}}>
            <div style={{fontSize:'11px',color:c.muted,marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.05em'}}>Progresso</div>
            <div style={{height:'8px',background:c.border,borderRadius:'4px',overflow:'hidden'}}>
              <div style={{height:'100%',width:pct+'%',background:c.green,borderRadius:'4px',transition:'width 0.5s'}}/>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'6px',fontSize:'12px',color:c.muted}}>
            <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#22c55e',animation:'pulse 2s ease-in-out infinite'}}/>
            Atualização em tempo real
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
          </div>
        </div>

        {/* Tabs */}
        <div style={{background:'white',borderBottom:`1px solid ${c.border}`,padding:'0 20px',display:'flex',gap:'0'}}>
          {[{id:'presentes',label:`Credenciados (${creds.length})`},{id:'pendentes',label:`Pendentes (${pendentes.length})`}].map(t=>(
            <button key={t.id} onClick={()=>setATab(t.id)}
              style={{padding:'12px 18px',border:'none',borderBottom:adminTab===t.id?`2px solid ${c.blue}`:'2px solid transparent',
              background:'transparent',cursor:'pointer',fontSize:'13px',fontWeight:adminTab===t.id?'600':'400',
              color:adminTab===t.id?c.blue:c.muted,marginBottom:'-1px'}}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{padding:'16px 20px',maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{position:'relative',marginBottom:'14px'}}>
            <i className="ti ti-search" style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'15px',color:c.hint}}/>
            <input value={adminSearch} onChange={e=>setAS(e.target.value)}
              placeholder="Buscar por município ou nome..."
              style={{...inp,paddingLeft:'36px',background:'white'}}/>
          </div>

          {/* Tabela credenciados */}
          {adminTab==='presentes' && (
            filtCreds.length===0
              ? <div style={{textAlign:'center',padding:'50px',color:c.muted}}>
                  {creds.length===0?'Nenhum credenciamento registrado ainda.':'Nenhum resultado.'}
                </div>
              : <div style={{background:'white',borderRadius:'10px',border:`1px solid ${c.border}`,overflow:'hidden'}}>
                  <div style={{overflowX:'auto'}}>
                    <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px',tableLayout:'fixed'}}>
                      <thead>
                        <tr style={{background:c.bg}}>
                          {[['Município','22%'],['Nome','24%'],['CPF / RG','15%'],['Cargo','18%'],['Horário','10%'],['Assinatura','11%']].map(([h,w])=>(
                            <th key={h} style={{padding:'10px 12px',textAlign:'left',fontWeight:'600',color:c.muted,
                              borderBottom:`1px solid ${c.border}`,width:w,fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.04em'}}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtCreds.map((r,i)=>(
                          <tr key={r.id} style={{borderBottom:`1px solid ${c.border}`,background:i%2===0?'white':c.bg}}>
                            <td style={{padding:'10px 12px',fontWeight:'600',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'12px'}}>{r.municipio}</td>
                            <td style={{padding:'10px 12px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.nome}</td>
                            <td style={{padding:'10px 12px',fontFamily:'monospace',fontSize:'11px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.documento}</td>
                            <td style={{padding:'10px 12px',color:c.muted,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'12px'}}>{r.cargo}</td>
                            <td style={{padding:'10px 12px',fontSize:'11px',color:c.muted,whiteSpace:'nowrap'}}>
                              {new Date(r.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}
                            </td>
                            <td style={{padding:'10px 12px',textAlign:'center'}}>
                              {r.assinatura&&<img src={r.assinatura} style={{height:'28px',maxWidth:'80px',objectFit:'contain'}} alt="assinatura"/>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
          )}

          {/* Grid pendentes */}
          {adminTab==='pendentes' && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'7px'}}>
              {filtPend.map(m=>(
                <div key={m} style={{background:'white',padding:'9px 14px',borderRadius:'8px',border:`1px solid ${c.border}`,
                  display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span style={{fontSize:'12px',color:c.muted}}>{m}</span>
                  <button onClick={()=>openForm(m)}
                    style={{background:'none',border:'none',cursor:'pointer',color:c.blue,fontSize:'11px',fontWeight:'600',
                    padding:'2px 8px',borderRadius:'4px',whiteSpace:'nowrap'}}>
                    Credenciar
                  </button>
                </div>
              ))}
              {filtPend.length===0&&<p style={{color:c.muted,fontSize:'14px',gridColumn:'1/-1',textAlign:'center',padding:'40px'}}>Todos credenciados!</p>}
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
