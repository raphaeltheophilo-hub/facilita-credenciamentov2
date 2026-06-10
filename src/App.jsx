import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase.js'

const LOGO_SRC = 'data:image/png;base64,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Ans8AF6LDqC72Qu+jqt0TXnLmEBzSfHBRaKaV7q+P0My640U5KEoS4SVRSta65yTTWfCx4M9uidRC31NZLR9QyBvE5sjwHOA7cexSI6l6jSmnLRjnPPAHj1D9o78lGd71XfbxB1FbXOMJ7Y2NDGu9uO1eUur9QSz00z67L6Ykwnq2+bkYPd4LbUo1qtuVsHJ27etk2yVRaeNRqSUbvjdrleWFa2ML19iSNZXXSVNfYPpqKeaspGh8TWtJaMnI5ZwTy715aOvp1NqSsr2QuhpKSnEULXdpLnZLj6/NCiG63Crula+srpjLO8AOcQB2DA7FlWa/wB1s8E0NuquoZMcyANBzyx3hQei/l2Tz+hbh11y3J1ZwtR5NtRiuUrJqPJ3zbHnwSxYZXXjRdy+jpWtq55akZzgh7nHGf7uFx2hNH3yLUtNV1tJJSQUr+NznkZcR2AeK5Wy3u6Wad01uq3wOf8AXA5td7QeS2Vy1tqSvpzBLcDHG4YcImBhI9o5qS09WHKMGrM1S6k2rWR09fWwn8Wj2UbcZNO6bvlZWf3Oyv1+u7NYyVtgoZLhS00QpagRsLmudkuIyOwjPavDcu2W6p0sy/vofo+4PLC5h5OcXdrXDvPfnt5LiLBqq82OndT2+oYyJ7+NzXRh2T2Z5+xei/X+7Xt7XXKrdKGfUYAGtb7AEjpZxnFrCXnyzGq6q0mo0VeFXlOdW7UWo8YSfmL+rC/u/wAzVoiK+efBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAf/Z'

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

/* ─── Design tokens ─────────────────────────────────────────────────────── */
const T = {
  // Backgrounds
  bgPage:  '#060C18',
  bgCard:  'rgba(12,20,40,0.96)',
  bgCard2: 'rgba(8,14,30,0.98)',
  bgGlass: 'rgba(255,255,255,0.04)',
  // Brand
  red:     '#E8001C',
  redGlow: 'rgba(232,0,28,0.25)',
  redHover:'#C5001A',
  // Text
  textPrimary:  '#FFFFFF',
  textSecondary:'rgba(255,255,255,0.60)',
  textHint:     'rgba(255,255,255,0.35)',
  // Borders
  border:  'rgba(255,255,255,0.10)',
  borderHover:'rgba(255,255,255,0.22)',
  // Admin table (light)
  tBg:    '#FFFFFF',
  tAlt:   '#F8F9FB',
  tHead:  '#0F1E3A',
  tText:  '#1A2233',
  tMuted: '#5A6478',
  tBorder:'#E4E8EF',
}

/* ─── Global styles ─────────────────────────────────────────────────────── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Montserrat', sans-serif; background: ${'#060C18'}; color: #fff; -webkit-font-smoothing: antialiased; }
  input, button, select, textarea { font-family: 'Montserrat', sans-serif; }
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  ::-webkit-scrollbar { width: 5px; } 
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
`

/* ─── Component helpers ─────────────────────────────────────────────────── */
const inp = {
  width:'100%', fontSize:'15px', padding:'13px 15px',
  borderRadius:'10px', border:'1px solid rgba(255,255,255,0.12)',
  boxSizing:'border-box', background:'rgba(255,255,255,0.97)',
  color:'#111827', fontFamily:'Montserrat, sans-serif',
  fontWeight:'500', outline:'none', WebkitAppearance:'none',
}
const label = {
  display:'block', fontSize:'10px', fontWeight:'700',
  color:'rgba(255,255,255,0.45)', marginBottom:'7px',
  textTransform:'uppercase', letterSpacing:'0.10em',
  fontFamily:'Montserrat, sans-serif',
}
const btnP = {
  width:'100%', padding:'15px', borderRadius:'12px', border:'none',
  background:T.red, color:'#fff', fontSize:'14px', fontWeight:'800',
  cursor:'pointer', letterSpacing:'0.04em', textTransform:'uppercase',
  boxShadow:`0 8px 28px ${T.redGlow}, 0 2px 8px rgba(0,0,0,0.3)`,
  fontFamily:'Montserrat, sans-serif',
}
const btnS = {
  width:'100%', padding:'14px', borderRadius:'12px',
  border:'1px solid rgba(255,255,255,0.14)',
  background:'rgba(255,255,255,0.05)',
  color:'rgba(255,255,255,0.60)', fontSize:'14px', fontWeight:'600',
  cursor:'pointer', fontFamily:'Montserrat, sans-serif',
}
const card = {
  background:T.bgCard, borderRadius:'18px',
  border:'1px solid rgba(255,255,255,0.09)',
  padding:'22px', boxShadow:'0 20px 60px rgba(0,0,0,0.40)',
}

/* ─── Badge (pill vermelho) ─────────────────────────────────────────────── */
const Badge = ({ children, style={} }) => (
  <span style={{
    display:'inline-block', background:T.red, color:'#fff',
    borderRadius:'6px', padding:'6px 14px',
    fontSize:'11px', fontWeight:'800', letterSpacing:'0.08em',
    textTransform:'uppercase', ...style
  }}>{children}</span>
)

/* ─── Stat card ─────────────────────────────────────────────────────────── */
const Stat = ({ label:l, value, accent=false }) => (
  <div style={{
    background: accent ? `linear-gradient(135deg, ${T.red} 0%, #8B0010 100%)` : T.bgCard,
    borderRadius:'14px',
    border: accent ? 'none' : '1px solid rgba(255,255,255,0.09)',
    padding:'16px 18px',
    boxShadow: accent ? `0 8px 28px ${T.redGlow}` : '0 4px 20px rgba(0,0,0,0.30)',
  }}>
    <p style={{ fontSize:'10px', fontWeight:'700', color: accent ? 'rgba(255,255,255,0.75)' : T.textHint,
      textTransform:'uppercase', letterSpacing:'0.10em', marginBottom:'8px' }}>{l}</p>
    <p style={{ fontSize:'28px', fontWeight:'900', color:'#fff', lineHeight:1 }}>{value}</p>
  </div>
)

/* ─── Header ────────────────────────────────────────────────────────────── */
const Header = ({ subtitle, right }) => (
  <div style={{
    background:'rgba(4,8,20,0.98)', backdropFilter:'blur(20px) saturate(180%)',
    borderBottom:'1px solid rgba(255,255,255,0.08)',
    position:'relative', overflow:'hidden',
  }}>
    {/* decorative accents */}
    <div style={{ position:'absolute', right:'-40px', top:'-70px', width:'180px', height:'180px',
      border:'14px solid rgba(232,0,28,0.65)', borderRadius:'44px', pointerEvents:'none' }}/>
    <div style={{ position:'absolute', left:'-60px', bottom:'-60px', width:'140px', height:'140px',
      border:'10px solid rgba(232,0,28,0.20)', borderRadius:'36px', pointerEvents:'none' }}/>
    <div style={{ padding:'14px 18px', display:'flex', alignItems:'center',
      justifyContent:'space-between', position:'relative', zIndex:1 }}>
      <img src={LOGO_SRC} alt="Facilita SP Municípios" style={{ height:'44px', display:'block' }}/>
      {right}
    </div>
    {subtitle && (
      <div style={{ background:'rgba(255,255,255,0.03)', padding:'8px 18px',
        borderTop:'1px solid rgba(255,255,255,0.06)', position:'relative', zIndex:1 }}>
        <p style={{ color:T.textSecondary, fontSize:'11px', fontWeight:'700', margin:0,
          letterSpacing:'0.08em', textTransform:'uppercase' }}>{subtitle}</p>
      </div>
    )}
  </div>
)

/* ════════════════════════════════════════════════════════════════════════
   APP
════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [view,setSV]         = useState('busca')
  const [search,setSR]       = useState('')
  const [selected,setSel]    = useState(null)
  const [creds,setCreds]     = useState([])
  const [loading,setLoad]    = useState(true)
  const [error,setErr]       = useState(null)
  const [nome,setNome]       = useState('')
  const [doc,setDoc]         = useState('')
  const [cargo,setCargo]     = useState('')
  const [telefone,setTel]    = useState('')
  const [email,setEmail]     = useState('')
  const [consent,setConsent] = useState(false)
  const [submitting,setSub]  = useState(false)
  const [adminPwd,setAP]     = useState('')
  const [adminErr,setAE]     = useState(false)
  const [adminSrch,setAS]    = useState('')
  const [adminTab,setATab]   = useState('registros')
  const cvRef                = useRef(null)
  const [drawing,setDraw]    = useState(false)
  const [hasSig,setHasSig]   = useState(false)
  const lp                   = useRef(null)

  /* Supabase */
  useEffect(() => {
    supabase.from('credenciamentos').select('*').order('created_at',{ascending:true})
      .then(({data,error}) => { if(error){setErr(error.message);setLoad(false);return}; setCreds(data||[]); setLoad(false) })
    const ch = supabase.channel('rt')
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'credenciamentos'},
        p => setCreds(prev => prev.find(r=>r.id===p.new.id) ? prev : [...prev,p.new]))
      .subscribe()
    return () => supabase.removeChannel(ch)
  },[])

  const norm     = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase()
  const filtered = MUNICIPIOS.filter(m => norm(m).includes(norm(search)))
  const munSet   = new Set(creds.map(r => r.municipio))
  const semReg   = MUNICIPIOS.filter(m => !munSet.has(m))

  /* Canvas */
  const gxy = (e,cv) => { const r=cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e; return{x:(s.clientX-r.left)*(cv.width/r.width),y:(s.clientY-r.top)*(cv.height/r.height)} }
  const sd  = e => { e.preventDefault(); const cv=cvRef.current; if(!cv)return; setDraw(true); lp.current=gxy(e,cv) }
  const od  = e => { e.preventDefault(); if(!drawing||!cvRef.current)return; const cv=cvRef.current,ctx=cv.getContext('2d'),pos=gxy(e,cv); ctx.beginPath(); ctx.moveTo(lp.current.x,lp.current.y); ctx.lineTo(pos.x,pos.y); ctx.strokeStyle='#1a1a2e'; ctx.lineWidth=2.5; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.stroke(); lp.current=pos; setHasSig(true) }
  const ed  = () => setDraw(false)
  const clrSig = () => { const cv=cvRef.current; if(cv)cv.getContext('2d').clearRect(0,0,cv.width,cv.height); setHasSig(false) }

  const openForm = m => { setSel(m); setNome(''); setDoc(''); setCargo(''); setTel(''); setEmail(''); setConsent(false); setHasSig(false); setSV('form'); setTimeout(()=>{ const cv=cvRef.current; if(cv)cv.getContext('2d').clearRect(0,0,cv.width,cv.height) },60) }

  const handleSubmit = async () => {
    if(!nome.trim()||!doc.trim()||!cargo.trim()||!telefone.trim()||!email.trim()||!hasSig||!consent||submitting)return
    setSub(true)
    const assinatura = cvRef.current.toDataURL()
    const{error} = await supabase.from('credenciamentos').insert({municipio:selected,nome:nome.trim(),documento:doc.trim(),cargo:cargo.trim(),telefone:telefone.trim(),email:email.trim(),assinatura})
    setSub(false)
    if(error){alert('Erro: '+error.message);return}
    setSV('sucesso')
    setTimeout(()=>{ setSV('busca'); setSR(''); setSel(null) },30000)
  }

  const tryAdmin = () => { if(adminPwd===ADMIN_PASS){setSV('admin');setAE(false)}else setAE(true) }

  const exportCSV = () => {
    const bom='\uFEFF', hdr=['Município','Nome','CPF','Cargo','WhatsApp','E-mail','Horário'].join(';')
    const rows=creds.map(r=>[`"${r.municipio}"`,`"${r.nome}"`,`"${r.documento}"`,`"${r.cargo}"`,`"${r.telefone||''}"`  ,`"${r.email||''}"`  ,`"${new Date(r.created_at).toLocaleString('pt-BR')}"`].join(';'))
    const csv=bom+[hdr,...rows].join('\n'),url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}))
    const a=Object.assign(document.createElement('a'),{href:url,download:'credenciamento_facilita_sp.csv'})
    document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url)
  }

  /* Loading */
  if(loading)return(
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:T.bgPage}}>
      <style>{G}</style>
      <div style={{textAlign:'center'}}>
        <div style={{width:'40px',height:'40px',border:`3px solid ${T.red}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 16px'}}/>
        <p style={{color:T.textSecondary,fontSize:'13px',fontWeight:'600',letterSpacing:'0.06em'}}>CARREGANDO</p>
      </div>
    </div>
  )
  if(error)return(
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:T.bgPage}}>
      <style>{G}</style>
      <div style={{...card,maxWidth:'360px',textAlign:'center'}}>
        <p style={{color:T.red,fontWeight:'800',marginBottom:'8px',fontSize:'16px'}}>Erro de conexão</p>
        <p style={{fontSize:'13px',color:T.textSecondary,marginBottom:'18px'}}>{error}</p>
        <button onClick={()=>window.location.reload()} style={btnP}>Tentar novamente</button>
      </div>
    </div>
  )

  /* ═══════════════════ BUSCA ═══════════════════ */
  if(view==='busca')return(
    <div style={{minHeight:'100vh',background:T.bgPage}}>
      <style>{G}</style>
      <Header subtitle="Credenciamento · 02 de julho de 2026" right={
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'7px'}}>
          <Badge>{creds.length} credenciamento{creds.length!==1?'s':''}</Badge>
          <button onClick={()=>{setAP('');setAE(false);setSV('adminLogin')}}
            style={{background:'transparent',border:'1px solid rgba(255,255,255,0.20)',color:T.textSecondary,
            borderRadius:'8px',padding:'4px 12px',fontSize:'11px',fontWeight:'600',cursor:'pointer',letterSpacing:'0.04em'}}>
            OPERADOR
          </button>
        </div>
      }/>

      {/* Hero */}
      <div style={{padding:'24px 18px 14px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',right:'20px',top:'12px',width:'90px',height:'90px',
          border:`8px solid rgba(232,0,28,0.22)`,borderRadius:'22px',pointerEvents:'none'}}/>
        <p style={{fontSize:'10px',fontWeight:'800',color:T.red,letterSpacing:'0.14em',
          textTransform:'uppercase',marginBottom:'8px'}}>Facilita SP Municípios · Evento 23/06</p>
        <h1 style={{fontSize:'22px',fontWeight:'900',color:'#fff',lineHeight:1.25,marginBottom:'8px'}}>
          Credenciamento<br/>
          <span style={{color:T.red}}>Online</span>
        </h1>
        <p style={{color:T.textSecondary,fontSize:'13px',fontWeight:'500',lineHeight:1.5}}>
          Localize seu município e registre os dados do representante.
        </p>
      </div>

      {/* Search sticky */}
      <div style={{background:'rgba(4,8,20,0.95)',backdropFilter:'blur(16px)',padding:'12px 18px',
        position:'sticky',top:0,zIndex:10,borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
        <div style={{position:'relative'}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.30)"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Buscar município..." value={search}
            onChange={e=>setSR(e.target.value)} autoFocus
            style={{...inp,paddingLeft:'42px',paddingRight:search?'42px':'15px'}}/>
          {search&&<button onClick={()=>setSR('')} style={{position:'absolute',right:'10px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'rgba(255,255,255,0.35)',cursor:'pointer',fontSize:'22px',lineHeight:1}} aria-label="Limpar">×</button>}
        </div>
        <p style={{fontSize:'11px',color:T.textHint,marginTop:'8px',fontWeight:'500'}}>
          {filtered.length} município{filtered.length!==1?'s':''} encontrado{filtered.length!==1?'s':''}
        </p>
      </div>

      {/* Lista */}
      <div style={{padding:'14px 18px 40px'}}>
        {filtered.length===0?(
          <div style={{textAlign:'center',padding:'60px 20px'}}>
            <div style={{fontSize:'40px',marginBottom:'12px',opacity:0.3}}>📍</div>
            <p style={{color:T.textSecondary,fontWeight:'600'}}>Nenhum resultado para "<strong>{search}</strong>"</p>
          </div>
        ):(
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {filtered.map(m => {
              const count = creds.filter(r=>r.municipio===m).length
              return(
                <button key={m} onClick={()=>openForm(m)}
                  style={{padding:'15px 18px',borderRadius:'12px',cursor:'pointer',
                    border:'1px solid rgba(255,255,255,0.09)',
                    background:count>0?'rgba(232,0,28,0.06)':' rgba(12,20,40,0.85)',
                    display:'flex',alignItems:'center',justifyContent:'space-between',
                    textAlign:'left',width:'100%',transition:'border-color 0.15s'}}>
                  <span style={{fontSize:'13px',fontWeight:'700',color:'#fff',letterSpacing:'0.02em'}}>{m}</span>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',flexShrink:0,marginLeft:'10px'}}>
                    {count>0&&(
                      <span style={{background:T.red,color:'#fff',borderRadius:'20px',
                        padding:'2px 9px',fontSize:'11px',fontWeight:'800'}}>
                        {count}
                      </span>
                    )}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(255,255,255,0.28)" strokeWidth="2.5" strokeLinecap="round">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  /* ═══════════════════ FORMULÁRIO ═══════════════════ */
  if(view==='form'){
    const valid=nome.trim()&&doc.trim()&&cargo.trim()&&telefone.trim()&&email.trim()&&hasSig&&consent
    return(
      <div style={{minHeight:'100vh',background:T.bgPage}}>
        <style>{G}</style>
        <Header subtitle={selected} right={
          <button onClick={()=>{setSV('busca');setSel(null)}}
            style={{background:'transparent',border:'1px solid rgba(255,255,255,0.18)',
            color:T.textSecondary,borderRadius:'8px',padding:'7px 14px',
            fontSize:'12px',fontWeight:'600',cursor:'pointer'}}>
            ← Voltar
          </button>
        }/>
        <div style={{padding:'18px'}}>

          {/* Card dados */}
          <div style={{...card,marginBottom:'14px'}}>
            <div style={{marginBottom:'20px',paddingBottom:'16px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
              <Badge>Dados do Representante</Badge>
              <p style={{color:T.textHint,fontSize:'12px',marginTop:'8px',fontWeight:'500'}}>
                Preencha todos os campos com atenção.
              </p>
            </div>

            <div style={{marginBottom:'14px'}}>
              <label style={label}>Nome completo *</label>
              <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome completo do representante" style={inp} autoFocus/>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'14px'}}>
              <div>
                <label style={label}>CPF *</label>
                <input value={doc} onChange={e=>{
                  let v=e.target.value.replace(/\D/g,'').slice(0,11)
                  if(v.length>9)v=v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/,'$1.$2.$3-$4')
                  else if(v.length>6)v=v.replace(/(\d{3})(\d{3})(\d{1,3})/,'$1.$2.$3')
                  else if(v.length>3)v=v.replace(/(\d{3})(\d{1,3})/,'$1.$2')
                  setDoc(v)
                }} placeholder="000.000.000-00" style={inp} inputMode="numeric"/>
              </div>
              <div>
                <label style={label}>Cargo *</label>
                <input value={cargo} onChange={e=>setCargo(e.target.value)} placeholder="Ex: Prefeito" style={inp}/>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'18px'}}>
              <div>
                <label style={label}>WhatsApp *</label>
                <input value={telefone} onChange={e=>{
                  let v=e.target.value.replace(/\D/g,'').slice(0,11)
                  if(v.length>6)v=v.replace(/(\d{2})(\d{5})(\d{1,4})/,'($1) $2-$3')
                  else if(v.length>2)v=v.replace(/(\d{2})(\d{1,5})/,'($1) $2')
                  setTel(v)
                }} placeholder="(11) 99999-9999" style={inp} inputMode="numeric"/>
              </div>
              <div>
                <label style={label}>E-mail *</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@prefeitura.sp.gov.br" style={inp}/>
              </div>
            </div>

            {/* Assinatura */}
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                <label style={{...label,marginBottom:0}}>Assinatura digital *</label>
                {hasSig&&<button onClick={clrSig} style={{fontSize:'12px',color:T.textSecondary,background:'none',border:'none',cursor:'pointer',textDecoration:'underline',fontFamily:'Montserrat,sans-serif'}}>Limpar</button>}
              </div>
              <div style={{position:'relative',borderRadius:'12px',overflow:'hidden',border:`1px solid ${hasSig?'rgba(255,255,255,0.35)':' rgba(255,255,255,0.10)'}`}}>
                {!hasSig&&(
                  <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none',zIndex:1}}>
                    <p style={{color:'rgba(0,0,0,0.30)',fontSize:'13px',fontWeight:'600',textAlign:'center'}}>
                      ✍ Assine aqui com o dedo
                    </p>
                  </div>
                )}
                <canvas ref={cvRef} width={480} height={150}
                  onMouseDown={sd} onMouseMove={od} onMouseUp={ed} onMouseLeave={ed}
                  onTouchStart={sd} onTouchMove={od} onTouchEnd={ed}
                  style={{width:'100%',height:'130px',background:'#fff',touchAction:'none',cursor:'crosshair',display:'block'}}/>
              </div>
            </div>
          </div>

          {/* LGPD */}
          <div style={{...card,background:T.bgCard2,marginBottom:'16px',border:'1px solid rgba(232,0,28,0.18)'}}>
            <label style={{display:'flex',gap:'14px',alignItems:'flex-start',cursor:'pointer'}}>
              <div style={{position:'relative',flexShrink:0,marginTop:'2px'}}>
                <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}
                  style={{width:'22px',height:'22px',accentColor:T.red,cursor:'pointer'}}/>
              </div>
              <span style={{fontSize:'12px',color:'rgba(255,255,255,0.80)',lineHeight:'1.65',fontWeight:'500'}}>
                Autorizo o uso dos meus dados pela{" "}
                <strong style={{color:'#fff'}}>Secretaria de Desenvolvimento Econômico do Estado de São Paulo</strong>{" "}
                para fins internos e estatísticos, em conformidade com a{" "}
                <strong style={{color:'#fff'}}>LGPD (Lei nº 13.709/2018)</strong>.{" "}
                Os dados não serão compartilhados com terceiros.
              </span>
            </label>
          </div>

          <button onClick={handleSubmit} disabled={!valid||submitting}
            style={{...btnP,opacity:valid&&!submitting?1:0.45,cursor:valid&&!submitting?'pointer':'not-allowed',
            display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',marginBottom:'10px'}}>
            {submitting
              ?<><div style={{width:'16px',height:'16px',border:'2px solid rgba(255,255,255,0.5)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/> Salvando...</>
              :'Confirmar credenciamento'}
          </button>
          <button onClick={()=>{setSV('busca');setSel(null)}} style={btnS}>Cancelar</button>
        </div>
      </div>
    )
  }

  /* ═══════════════════ SUCESSO ═══════════════════ */
  if(view==='sucesso')return(
    <div style={{minHeight:'100vh',background:T.bgPage,position:'relative',overflow:'hidden'}}>
      <style>{G}</style>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 15% 10%, rgba(232,0,28,0.18) 0%, transparent 50%), radial-gradient(ellipse at 85% 80%, rgba(232,0,28,0.12) 0%, transparent 50%)',pointerEvents:'none'}}/>
      <Header/>
      <div style={{position:'relative',zIndex:1,display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 70px)',padding:'30px 18px'}}>
        <div style={{...card,width:'100%',maxWidth:'720px',border:'1px solid rgba(232,0,28,0.30)',animation:'fadeUp 0.4s ease'}}>

          {/* check icon */}
          <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'20px'}}>
            <div style={{width:'52px',height:'52px',borderRadius:'50%',background:`linear-gradient(135deg,${T.red},#8B0010)`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:`0 8px 24px ${T.redGlow}`}}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <div>
              <Badge style={{marginBottom:'6px'}}>Credenciamento confirmado</Badge>
              <p style={{color:T.textSecondary,fontSize:'13px',fontWeight:'500'}}>Registro salvo com sucesso</p>
            </div>
          </div>

          {/* dados */}
          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'14px',padding:'18px',marginBottom:'16px'}}>
            <p style={{fontSize:'10px',fontWeight:'800',color:T.red,letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'14px'}}>Dados registrados</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'14px'}}>
              {[['Município',selected],['Nome',nome],['CPF',doc],['Cargo',cargo],['WhatsApp',telefone],['E-mail',email]].map(([l,v])=>(
                <div key={l}>
                  <p style={{fontSize:'10px',color:T.textHint,textTransform:'uppercase',letterSpacing:'0.10em',fontWeight:'700',marginBottom:'4px'}}>{l}</p>
                  <p style={{fontSize:'14px',color:'#fff',fontWeight:'700'}}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          <p style={{fontSize:'12px',color:T.textHint,marginBottom:'18px',fontWeight:'500'}}>
            Esta tela retorna ao início automaticamente em 30 segundos.
          </p>
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
            <button onClick={()=>window.print()} style={{...btnP,width:'auto',padding:'13px 22px',fontSize:'13px'}}>Imprimir / PDF</button>
            <button onClick={()=>{setSV('busca');setSR('');setSel(null)}} style={{...btnS,width:'auto',padding:'13px 22px',fontSize:'13px'}}>Voltar ao início</button>
          </div>
        </div>
      </div>
    </div>
  )

  /* ═══════════════════ LOGIN ADMIN ═══════════════════ */
  if(view==='adminLogin')return(
    <div style={{minHeight:'100vh',background:T.bgPage,display:'flex',flexDirection:'column'}}>
      <style>{G}</style>
      <Header/>
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
        <div style={{...card,width:'340px',maxWidth:'100%'}}>
          <div style={{marginBottom:'22px'}}>
            <Badge>Área do Operador</Badge>
            <p style={{color:T.textSecondary,fontSize:'13px',marginTop:'10px',fontWeight:'500'}}>
              Acesso restrito à equipe da Secretaria.
            </p>
          </div>
          <label style={label}>Senha de acesso</label>
          <input type="password" value={adminPwd} onChange={e=>setAP(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&tryAdmin()} placeholder="••••••••"
            style={{...inp,marginBottom:'6px',border:`1px solid ${adminErr?T.red:'rgba(255,255,255,0.12)'}`}}/>
          {adminErr&&<p style={{fontSize:'12px',color:T.red,marginBottom:'10px',fontWeight:'600'}}>Senha incorreta. Tente novamente.</p>}
          <div style={{display:'flex',gap:'10px',marginTop:'16px'}}>
            <button onClick={()=>setSV('busca')} style={{...btnS,flex:1}}>Cancelar</button>
            <button onClick={tryAdmin} style={{...btnP,flex:1,width:'auto'}}>Entrar</button>
          </div>
        </div>
      </div>
    </div>
  )

  /* ═══════════════════ PAINEL ADMIN ═══════════════════ */
  if(view==='admin'){
    const filtC=adminSrch?creds.filter(r=>norm(r.municipio).includes(norm(adminSrch))||r.nome.toLowerCase().includes(adminSrch.toLowerCase())||(r.email||'').toLowerCase().includes(adminSrch.toLowerCase())||(r.telefone||'').includes(adminSrch)):creds
    const filtSem=semReg.filter(m=>!adminSrch||norm(m).includes(norm(adminSrch)))
    const pct=Math.min(100,Math.round(munSet.size/MUNICIPIOS.length*100))

    return(
      <div style={{minHeight:'100vh',background:T.bgPage}}>
        <style>{G}</style>
        <Header subtitle="Painel administrativo · tempo real" right={
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
            <div style={{display:'flex',alignItems:'center',gap:'5px',marginRight:'4px'}}>
              <div style={{width:'7px',height:'7px',borderRadius:'50%',background:'#22c55e',animation:'pulse 2s ease-in-out infinite'}}/>
              <span style={{fontSize:'10px',color:T.textHint,fontWeight:'600'}}>AO VIVO</span>
            </div>
            <button onClick={exportCSV}
              style={{...btnP,width:'auto',padding:'9px 14px',fontSize:'12px',display:'flex',alignItems:'center',gap:'6px'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              CSV
            </button>
            <button onClick={()=>setSV('busca')}
              style={{...btnS,width:'auto',padding:'9px 14px',fontSize:'12px'}}>
              Quiosque
            </button>
          </div>
        }/>

        {/* Stats */}
        <div style={{padding:'18px 18px 12px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:'10px'}}>
          <Stat label="Total municípios" value={MUNICIPIOS.length}/>
          <Stat label="Credenciamentos" value={creds.length} accent/>
          <Stat label="Com registro" value={munSet.size}/>
          <Stat label="Sem registro" value={semReg.length}/>
        </div>

        {/* Progress */}
        <div style={{padding:'0 18px 16px'}}>
          <div style={{background:'rgba(255,255,255,0.06)',borderRadius:'12px',padding:'14px 16px'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'10px'}}>
              <span style={{fontSize:'11px',fontWeight:'700',color:T.textSecondary,textTransform:'uppercase',letterSpacing:'0.08em'}}>
                Cobertura de municípios
              </span>
              <span style={{fontSize:'16px',fontWeight:'900',color:T.red}}>{pct}%</span>
            </div>
            <div style={{height:'8px',background:'rgba(255,255,255,0.10)',borderRadius:'4px',overflow:'hidden'}}>
              <div style={{height:'100%',width:pct+'%',background:`linear-gradient(90deg,${T.red},#FF6B6B)`,borderRadius:'4px',transition:'width 0.5s ease'}}/>
            </div>
          </div>
        </div>

        {/* Tabs + search */}
        <div style={{padding:'0 18px 18px'}}>
          <div style={{display:'flex',borderBottom:'1px solid rgba(255,255,255,0.08)',marginBottom:'14px'}}>
            {[{id:'registros',l:`Registros (${creds.length})`},{id:'sem',l:`Sem registro (${semReg.length})`}].map(t=>(
              <button key={t.id} onClick={()=>setATab(t.id)}
                style={{padding:'11px 18px',border:'none',
                borderBottom:adminTab===t.id?`2px solid ${T.red}`:'2px solid transparent',
                background:'transparent',cursor:'pointer',fontSize:'13px',fontWeight:adminTab===t.id?'800':'500',
                color:adminTab===t.id?T.red:T.textSecondary,marginBottom:'-1px',letterSpacing:'0.02em'}}>
                {t.l}
              </button>
            ))}
          </div>
          <div style={{position:'relative',marginBottom:'14px'}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.30)"
              strokeWidth="2.5" strokeLinecap="round"
              style={{position:'absolute',left:'13px',top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input value={adminSrch} onChange={e=>setAS(e.target.value)}
              placeholder="Buscar município, nome ou e-mail..."
              style={{...inp,paddingLeft:'38px'}}/>
          </div>

          {/* Tabela registros — fundo BRANCO para máxima legibilidade */}
          {adminTab==='registros'&&(
            filtC.length===0
              ?<div style={{textAlign:'center',padding:'50px',color:T.textHint}}>
                <div style={{fontSize:'32px',marginBottom:'10px',opacity:0.4}}>📋</div>
                <p style={{fontWeight:'600'}}>{creds.length===0?'Nenhum credenciamento ainda.':'Nenhum resultado.'}</p>
               </div>
              :<div style={{background:'#fff',borderRadius:'14px',overflow:'hidden',boxShadow:'0 4px 30px rgba(0,0,0,0.35)',marginBottom:'8px'}}>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px',tableLayout:'fixed',fontFamily:'Montserrat,sans-serif'}}>
                    <thead>
                      <tr style={{background:'#0F1E3A'}}>
                        {[['Município','16%'],['Nome','18%'],['CPF','12%'],['Cargo','13%'],['WhatsApp','12%'],['E-mail','17%'],['Horário','7%'],['Ass.','5%']].map(([h,w])=>(
                          <th key={h} style={{padding:'12px 14px',textAlign:'left',fontWeight:'800',
                            color:'#fff',width:w,fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.10em',
                            borderBottom:'2px solid rgba(232,0,28,0.60)'}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtC.map((r,i)=>(
                        <tr key={r.id} style={{borderBottom:`1px solid #EEF0F4`,background:i%2===0?'#fff':'#F8F9FB'}}>
                          <td style={{padding:'11px 14px',fontWeight:'800',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'12px',color:'#1A2233'}}>{r.municipio}</td>
                          <td style={{padding:'11px 14px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'#1A2233',fontWeight:'600'}}>{r.nome}</td>
                          <td style={{padding:'11px 14px',fontFamily:'monospace',fontSize:'11px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'#4A5568'}}>{r.documento}</td>
                          <td style={{padding:'11px 14px',color:'#4A5568',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'12px',fontWeight:'500'}}>{r.cargo}</td>
                          <td style={{padding:'11px 14px',fontSize:'12px',color:'#4A5568',whiteSpace:'nowrap',fontWeight:'500'}}>{r.telefone||'-'}</td>
                          <td style={{padding:'11px 14px',fontSize:'12px',color:'#4A5568',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontWeight:'500'}}>{r.email||'-'}</td>
                          <td style={{padding:'11px 14px',fontSize:'11px',color:'#718096',whiteSpace:'nowrap',fontWeight:'600'}}>{new Date(r.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</td>
                          <td style={{padding:'11px 14px',textAlign:'center'}}>{r.assinatura&&<img src={r.assinatura} style={{height:'26px',maxWidth:'76px',objectFit:'contain'}} alt="ass."/>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
          )}

          {/* Sem registro */}
          {adminTab==='sem'&&(
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))',gap:'8px',marginBottom:'24px'}}>
              {filtSem.map(m=>(
                <div key={m} style={{...card,padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'8px'}}>
                  <span style={{fontSize:'12px',color:T.textSecondary,fontWeight:'600'}}>{m}</span>
                  <button onClick={()=>openForm(m)}
                    style={{background:T.red,border:'none',cursor:'pointer',color:'#fff',
                    fontSize:'11px',fontWeight:'800',padding:'5px 12px',borderRadius:'6px',
                    whiteSpace:'nowrap',flexShrink:0,fontFamily:'Montserrat,sans-serif'}}>
                    Registrar
                  </button>
                </div>
              ))}
              {filtSem.length===0&&(
                <div style={{gridColumn:'1/-1',textAlign:'center',padding:'50px'}}>
                  <div style={{fontSize:'32px',marginBottom:'10px'}}>🎉</div>
                  <p style={{color:T.textSecondary,fontWeight:'700'}}>Todos os municípios têm registro!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}
