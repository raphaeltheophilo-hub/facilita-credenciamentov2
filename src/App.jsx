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

const C = {
  black:'#111111', red:'#CC0000', white:'#FFFFFF',
  gray50:'#F7F7F7', gray100:'#EEEEEE', gray300:'#CCCCCC',
  gray500:'#888888', gray700:'#333333', border:'#DDDDDD',
}
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'facilita'

const S = {
  inp:{width:'100%',fontSize:'16px',padding:'12px 14px',borderRadius:'8px',
    border:`1px solid ${C.border}`,boxSizing:'border-box',background:C.white,color:C.gray700,WebkitAppearance:'none'},
  label:{display:'block',fontSize:'12px',fontWeight:'600',color:C.gray500,marginBottom:'6px',
    textTransform:'uppercase',letterSpacing:'0.05em'},
  btnP:{width:'100%',padding:'15px',borderRadius:'8px',border:'none',background:C.red,
    color:C.white,fontSize:'15px',fontWeight:'700',cursor:'pointer'},
  btnS:{width:'100%',padding:'14px',borderRadius:'8px',border:`1px solid ${C.border}`,
    background:'transparent',color:C.gray500,fontSize:'14px',cursor:'pointer'},
  card:{background:C.white,borderRadius:'10px',border:`1px solid ${C.border}`,padding:'20px'},
}

function Header({subtitle,right}) {
  return (
    <div style={{background:C.black}}>
      <div style={{padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <img src={LOGO_SRC} alt="Facilita SP Municípios" style={{height:'46px',display:'block'}}/>
        {right}
      </div>
      {subtitle && (
        <div style={{background:'#1c1c1c',padding:'8px 16px',borderTop:'1px solid #2a2a2a'}}>
          <p style={{color:'#aaa',fontSize:'12px',margin:0}}>{subtitle}</p>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [view,setSV]=useState('busca'),[search,setSR]=useState(''),[selected,setSel]=useState(null)
  const [creds,setCreds]=useState([]),[loading,setLoad]=useState(true),[error,setErr]=useState(null)
  const [nome,setNome]=useState(''),[doc,setDoc]=useState(''),[cargo,setCargo]=useState('')
  const [consent,setConsent]=useState(false),[submitting,setSub]=useState(false)
  const [adminPwd,setAP]=useState(''),[adminErr,setAE]=useState(false)
  const [adminSrch,setAS]=useState(''),[adminTab,setATab]=useState('presentes')
  const cvRef=useRef(null),[drawing,setDraw]=useState(false),[hasSig,setHasSig]=useState(false)
  const lp=useRef(null)

  useEffect(()=>{
    supabase.from('credenciamentos').select('*').order('created_at',{ascending:true})
      .then(({data,error})=>{if(error){setErr(error.message);setLoad(false);return};setCreds(data||[]);setLoad(false)})
    const ch=supabase.channel('rt').on('postgres_changes',{event:'INSERT',schema:'public',table:'credenciamentos'},
      p=>setCreds(prev=>prev.find(r=>r.id===p.new.id)?prev:[...prev,p.new])).subscribe()
    return ()=>supabase.removeChannel(ch)
  },[])

  const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase()
  const isCred = m => false
  const filtered=MUNICIPIOS.filter(m=>norm(m).includes(norm(search)))
  const pendentes=MUNICIPIOS.filter(m=>!isCred(m))

  const gxy=(e,cv)=>{const r=cv.getBoundingClientRect(),s=e.touches?e.touches[0]:e;return{x:(s.clientX-r.left)*(cv.width/r.width),y:(s.clientY-r.top)*(cv.height/r.height)}}
  const sd=e=>{e.preventDefault();const cv=cvRef.current;if(!cv)return;setDraw(true);lp.current=gxy(e,cv)}
  const od=e=>{e.preventDefault();if(!drawing||!cvRef.current)return;const cv=cvRef.current,ctx=cv.getContext('2d'),pos=gxy(e,cv);ctx.beginPath();ctx.moveTo(lp.current.x,lp.current.y);ctx.lineTo(pos.x,pos.y);ctx.strokeStyle=C.black;ctx.lineWidth=2.5;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();lp.current=pos;setHasSig(true)}
  const ed=()=>setDraw(false)
  const clrSig=()=>{const cv=cvRef.current;if(cv)cv.getContext('2d').clearRect(0,0,cv.width,cv.height);setHasSig(false)}

  const openForm=m=>{if(isCred(m))return;setSel(m);setNome('');setDoc('');setCargo('');setConsent(false);setHasSig(false);setSV('form');setTimeout(()=>{const cv=cvRef.current;if(cv)cv.getContext('2d').clearRect(0,0,cv.width,cv.height)},60)}

  const handleSubmit=async()=>{
    if(!nome.trim()||!doc.trim()||!cargo.trim()||!hasSig||!consent||submitting)return
    setSub(true)
    const assinatura=cvRef.current.toDataURL()
    const{error}=await supabase.from('credenciamentos').insert({municipio:selected,nome:nome.trim(),documento:doc.trim(),cargo:cargo.trim(),assinatura})
    setSub(false)
    if(error){alert('Erro: '+error.message);return}
    setSV('sucesso')
    setTimeout(()=>{setSV('busca');setSR('');setSel(null)},5000)
  }

  const tryAdmin=()=>{if(adminPwd===ADMIN_PASS){setSV('admin');setAE(false)}else setAE(true)}

  const exportCSV=()=>{
    const bom='\uFEFF',hdr=['Município','Nome','CPF/RG','Cargo','Horário'].join(';')
    const rows=creds.map(r=>[`"${r.municipio}"`,`"${r.nome}"`,`"${r.documento}"`,`"${r.cargo}"`,`"${new Date(r.created_at).toLocaleString('pt-BR')}"`].join(';'))
    const csv=bom+[hdr,...rows].join('\n'),url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}))
    const a=Object.assign(document.createElement('a'),{href:url,download:'credenciamento_facilita_sp.csv'})
    document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url)
  }

  if(loading)return(<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{textAlign:'center'}}><div style={{width:'36px',height:'36px',border:`3px solid ${C.red}`,borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite',margin:'0 auto 14px'}}/><p style={{color:C.gray500}}>Carregando...</p><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div></div>)
  if(error)return(<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}><div style={{...S.card,maxWidth:'360px',textAlign:'center'}}><p style={{color:C.red,fontWeight:'700',marginBottom:'8px'}}>Erro de conexão</p><p style={{fontSize:'13px',color:C.gray500,marginBottom:'16px'}}>{error}</p><button onClick={()=>window.location.reload()} style={S.btnP}>Tentar novamente</button></div></div>)

  /* BUSCA */
  if(view==='busca')return(
    <div style={{minHeight:'100vh',background:C.gray50}}>
      <Header subtitle="Credenciamento · 23 de junho de 2025" right={
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'6px'}}>
          <span style={{background:C.red,color:C.white,borderRadius:'20px',padding:'4px 12px',fontSize:'12px',fontWeight:'700',whiteSpace:'nowrap'}}>{creds.length} / {MUNICIPIOS.length}</span>
          <button onClick={()=>{setAP('');setAE(false);setSV('adminLogin')}} style={{background:'transparent',border:'1px solid #444',color:'#aaa',borderRadius:'6px',padding:'3px 10px',fontSize:'11px',cursor:'pointer'}}>Operador</button>
        </div>
      }/>
      <div style={{background:C.white,padding:'12px 16px',position:'sticky',top:0,zIndex:10,borderBottom:`1px solid ${C.border}`}}>
        <div style={{position:'relative'}}>
          <i className="ti ti-search" style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'18px',color:C.gray300}} aria-hidden="true"/>
          <input type="text" placeholder="Buscar seu município..." value={search} onChange={e=>setSR(e.target.value)} autoFocus
            style={{...S.inp,paddingLeft:'42px',paddingRight:search?'40px':'14px',fontSize:'17px'}}/>
          {search&&<button onClick={()=>setSR('')} style={{position:'absolute',right:'10px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:C.gray300,cursor:'pointer',fontSize:'24px',lineHeight:1}} aria-label="Limpar">×</button>}
        </div>
        <p style={{fontSize:'12px',color:C.gray300,marginTop:'6px'}}>{filtered.length} município{filtered.length!==1?'s':''} · {creds.length} credenciado{creds.length!==1?'s':''}</p>
      </div>
      <div style={{padding:'12px 16px'}}>
        {filtered.length===0?(<div style={{textAlign:'center',padding:'60px 20px'}}><i className="ti ti-map-pin-off" style={{fontSize:'40px',color:C.gray300,display:'block',marginBottom:'10px'}} aria-hidden="true"/><p style={{color:C.gray500}}>Nenhum município para "<strong>{search}</strong>"</p></div>):(
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {filtered.map(m=>{const done=isCred(m);return(
              <button key={m} onClick={()=>!done&&openForm(m)}
                style={{padding:'14px 16px',borderRadius:'8px',cursor:done?'default':'pointer',
                  border:`1px solid ${done?C.gray300:C.border}`,background:done?C.gray100:C.white,
                  display:'flex',alignItems:'center',justifyContent:'space-between',textAlign:'left',width:'100%'}}>
                <span style={{fontSize:'14px',fontWeight:'600',color:done?C.gray500:C.gray700}}>{m}</span>
                {done
                  ?<i className="ti ti-circle-check" style={{fontSize:'20px',color:C.gray500,flexShrink:0,marginLeft:'8px'}} aria-hidden="true"/>
                  :<i className="ti ti-chevron-right" style={{fontSize:'18px',color:C.gray300,flexShrink:0,marginLeft:'8px'}} aria-hidden="true"/>
                }
              </button>
            )})}
          </div>
        )}
      </div>
    </div>
  )

  /* FORMULÁRIO */
  if(view==='form'){const valid=nome.trim()&&doc.trim()&&cargo.trim()&&hasSig&&consent;return(
    <div style={{minHeight:'100vh',background:C.gray50}}>
      <Header subtitle={selected} right={<button onClick={()=>{setSV('busca');setSel(null)}} style={{background:'transparent',border:'1px solid #444',color:'#aaa',borderRadius:'6px',padding:'6px 12px',fontSize:'13px',cursor:'pointer'}}>← Voltar</button>}/>
      <div style={{padding:'16px'}}>
        <div style={S.card}>
          <p style={{fontSize:'16px',fontWeight:'700',color:C.gray700,marginBottom:'20px'}}>Dados do representante</p>
          <div style={{marginBottom:'14px'}}>
            <label style={S.label}>Nome completo *</label>
            <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome completo" style={S.inp} autoFocus/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'14px'}}>
            <div><label style={S.label}>CPF ou RG *</label><input value={doc} onChange={e=>setDoc(e.target.value)} placeholder="000.000.000-00" style={S.inp}/></div>
            <div><label style={S.label}>Cargo *</label><input value={cargo} onChange={e=>setCargo(e.target.value)} placeholder="Ex: Prefeito" style={S.inp}/></div>
          </div>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
              <label style={S.label}>Assinatura *</label>
              {hasSig&&<button onClick={clrSig} style={{fontSize:'12px',color:C.gray500,background:'none',border:'none',cursor:'pointer',textDecoration:'underline'}}>Limpar</button>}
            </div>
            <canvas ref={cvRef} width={480} height={150}
              onMouseDown={sd} onMouseMove={od} onMouseUp={ed} onMouseLeave={ed}
              onTouchStart={sd} onTouchMove={od} onTouchEnd={ed}
              style={{width:'100%',height:'130px',border:`1px solid ${hasSig?C.gray500:C.border}`,borderRadius:'8px',background:C.white,touchAction:'none',cursor:'crosshair',display:'block'}}/>
            {!hasSig&&<p style={{fontSize:'12px',color:C.gray300,marginTop:'5px'}}>Assine com o dedo no campo acima</p>}
          </div>
        </div>

        <div style={{...S.card,marginTop:'12px',background:'#fafafa'}}>
          <label style={{display:'flex',gap:'12px',alignItems:'flex-start',cursor:'pointer'}}>
            <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}
              style={{width:'22px',height:'22px',marginTop:'1px',flexShrink:0,accentColor:C.red}}/>
            <span style={{fontSize:'13px',color:C.gray700,lineHeight:'1.55'}}>
              Autorizo o uso dos meus dados pela <strong>Secretaria de Desenvolvimento Econômico do Estado de São Paulo</strong> para fins internos e estatísticos, em conformidade com a <strong>LGPD (Lei nº 13.709/2018)</strong>. Os dados não serão compartilhados com terceiros.
            </span>
          </label>
        </div>

        <div style={{marginTop:'14px'}}>
          <button onClick={handleSubmit} disabled={!valid||submitting}
            style={{...S.btnP,background:valid&&!submitting?C.red:'#ccc',cursor:valid&&!submitting?'pointer':'not-allowed',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',marginBottom:'10px'}}>
            {submitting?<><div style={{width:'16px',height:'16px',border:'2px solid white',borderTopColor:'transparent',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/> Salvando...</>:'Confirmar credenciamento'}
          </button>
          <button onClick={()=>{setSV('busca');setSel(null)}} style={S.btnS}>Cancelar</button>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )}

  /* SUCESSO */
  if(view==='sucesso')return(
    <div style={{minHeight:'100vh',background:C.gray50}}>
      <Header/>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 70px)',padding:'40px 20px'}}>
        <div style={{textAlign:'center',maxWidth:'320px'}}>
          <div style={{width:'80px',height:'80px',borderRadius:'50%',background:C.black,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
            <i className="ti ti-check" style={{fontSize:'40px',color:C.white}} aria-hidden="true"/>
          </div>
          <p style={{fontSize:'22px',fontWeight:'700',color:C.gray700,marginBottom:'8px'}}>Credenciamento confirmado!</p>
          <p style={{fontSize:'16px',color:C.red,fontWeight:'700',marginBottom:'16px'}}>{selected}</p>
          <p style={{fontSize:'14px',color:C.gray300}}>Retornando ao início em instantes...</p>
        </div>
      </div>
    </div>
  )

  /* LOGIN ADMIN */
  if(view==='adminLogin')return(
    <div style={{minHeight:'100vh',background:C.gray50}}>
      <Header/>
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 70px)',padding:'20px'}}>
        <div style={{...S.card,width:'340px',maxWidth:'100%'}}>
          <p style={{fontSize:'18px',fontWeight:'700',color:C.gray700,marginBottom:'20px'}}>Área do Operador</p>
          <label style={S.label}>Senha</label>
          <input type="password" value={adminPwd} onChange={e=>setAP(e.target.value)} onKeyDown={e=>e.key==='Enter'&&tryAdmin()} placeholder="••••••••" style={{...S.inp,marginBottom:'6px',border:`1px solid ${adminErr?C.red:C.border}`}}/>
          {adminErr&&<p style={{fontSize:'12px',color:C.red,marginBottom:'10px'}}>Senha incorreta.</p>}
          <div style={{display:'flex',gap:'10px',marginTop:'14px'}}>
            <button onClick={()=>setSV('busca')} style={{...S.btnS,flex:1}}>Cancelar</button>
            <button onClick={tryAdmin} style={{...S.btnP,flex:1,width:'auto'}}>Entrar</button>
          </div>
        </div>
      </div>
    </div>
  )

  /* PAINEL ADMIN */
  if(view==='admin'){
    const pct=Math.round(creds.length/MUNICIPIOS.length*100)
    const filtC=adminSrch?creds.filter(r=>norm(r.municipio).includes(norm(adminSrch))||r.nome.toLowerCase().includes(adminSrch.toLowerCase())):creds
    const filtP=pendentes.filter(m=>!adminSrch||norm(m).includes(norm(adminSrch)))
    return(
      <div style={{minHeight:'100vh',background:C.gray50}}>
        <Header subtitle="Painel administrativo · tempo real" right={
          <div style={{display:'flex',gap:'8px'}}>
            <button onClick={exportCSV} style={{background:C.red,color:C.white,border:'none',borderRadius:'6px',padding:'8px 12px',cursor:'pointer',fontSize:'13px',fontWeight:'700',display:'flex',alignItems:'center',gap:'5px'}}><i className="ti ti-download" aria-hidden="true"/> CSV</button>
            <button onClick={()=>setSV('busca')} style={{background:'transparent',border:'1px solid #444',color:'#aaa',borderRadius:'6px',padding:'8px 12px',fontSize:'12px',cursor:'pointer'}}>Quiosque</button>
          </div>
        }/>
        <div style={{padding:'16px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))',gap:'10px'}}>
          {[{l:'Total',v:MUNICIPIOS.length,c:C.gray700},{l:'Credenciados',v:creds.length,c:C.red},{l:'Pendentes',v:pendentes.length,c:C.gray700},{l:'Presença',v:pct+'%',c:C.gray700}].map(({l,v,c})=>(
            <div key={l} style={{...S.card,padding:'12px 14px'}}>
              <p style={{fontSize:'11px',color:C.gray300,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'4px'}}>{l}</p>
              <p style={{fontSize:'24px',fontWeight:'700',color:c}}>{v}</p>
            </div>
          ))}
        </div>
        <div style={{padding:'0 16px 24px'}}>
          <div style={{height:'6px',background:C.gray100,borderRadius:'3px',overflow:'hidden',marginBottom:'14px'}}>
            <div style={{height:'100%',width:pct+'%',background:C.red,borderRadius:'3px',transition:'width 0.4s'}}/>
          </div>
          <div style={{display:'flex',borderBottom:`1px solid ${C.border}`,marginBottom:'14px'}}>
            {[{id:'presentes',l:`Credenciados (${creds.length})`},{id:'pendentes',l:`Pendentes (${pendentes.length})`}].map(t=>(
              <button key={t.id} onClick={()=>setATab(t.id)}
                style={{padding:'10px 16px',border:'none',borderBottom:adminTab===t.id?`2px solid ${C.red}`:'2px solid transparent',
                background:'transparent',cursor:'pointer',fontSize:'13px',fontWeight:adminTab===t.id?'700':'400',
                color:adminTab===t.id?C.red:C.gray500,marginBottom:'-1px'}}>
                {t.l}
              </button>
            ))}
          </div>
          <div style={{position:'relative',marginBottom:'12px'}}>
            <i className="ti ti-search" style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'15px',color:C.gray300}} aria-hidden="true"/>
            <input value={adminSrch} onChange={e=>setAS(e.target.value)} placeholder="Buscar..." style={{...S.inp,paddingLeft:'36px'}}/>
          </div>
          {adminTab==='presentes'&&(filtC.length===0?<p style={{color:C.gray300,textAlign:'center',padding:'40px'}}>{creds.length===0?'Nenhum credenciamento ainda.':'Nenhum resultado.'}</p>:(
            <div style={{background:C.white,borderRadius:'10px',border:`1px solid ${C.border}`,overflow:'hidden'}}>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px',tableLayout:'fixed'}}>
                  <thead><tr style={{background:C.gray50}}>{[['Município','22%'],['Nome','24%'],['CPF/RG','15%'],['Cargo','18%'],['Horário','10%'],['Ass.','11%']].map(([h,w])=>(
                    <th key={h} style={{padding:'10px 12px',textAlign:'left',fontWeight:'700',color:C.gray500,borderBottom:`1px solid ${C.border}`,width:w,fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.04em'}}>{h}</th>
                  ))}</tr></thead>
                  <tbody>{filtC.map((r,i)=>(
                    <tr key={r.id} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?C.white:C.gray50}}>
                      <td style={{padding:'10px 12px',fontWeight:'700',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'12px',color:C.gray700}}>{r.municipio}</td>
                      <td style={{padding:'10px 12px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:C.gray700}}>{r.nome}</td>
                      <td style={{padding:'10px 12px',fontFamily:'monospace',fontSize:'11px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:C.gray500}}>{r.documento}</td>
                      <td style={{padding:'10px 12px',color:C.gray500,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:'12px'}}>{r.cargo}</td>
                      <td style={{padding:'10px 12px',fontSize:'11px',color:C.gray300,whiteSpace:'nowrap'}}>{new Date(r.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</td>
                      <td style={{padding:'10px 12px',textAlign:'center'}}>{r.assinatura&&<img src={r.assinatura} style={{height:'26px',maxWidth:'76px',objectFit:'contain'}} alt="ass."/>}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          ))}
          {adminTab==='pendentes'&&(
            <div style={{display:'flex',flexDirection:'column',gap:'7px'}}>
              {filtP.map(m=>(<div key={m} style={{...S.card,padding:'10px 14px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontSize:'13px',color:C.gray500}}>{m}</span>
                <button onClick={()=>openForm(m)} style={{background:C.red,border:'none',cursor:'pointer',color:C.white,fontSize:'11px',fontWeight:'700',padding:'4px 10px',borderRadius:'5px',whiteSpace:'nowrap'}}>Credenciar</button>
              </div>))}
              {filtP.length===0&&<p style={{color:C.gray300,textAlign:'center',padding:'40px'}}>Todos credenciados!</p>}
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}
