(function () {
  const el = (tag, cls, text) => { const n=document.createElement(tag); if(cls)n.className=cls; if(text)n.textContent=text; return n; };
  function title(e,tag) {
    const heading = el(tag);
    if (e.url) {
      const link = el('a', '', e.title);
      link.href = e.url;
      heading.append(link);
    } else {
      heading.textContent = e.title;
    }
    if(!e.image)return heading;
    const row=el('div','entry-title-row'),figure=el('figure','entry-figure'),img=el('img');
    img.src=e.image;img.alt=e.imageAlt;img.loading='lazy';
    img.addEventListener('error',()=>{figure.remove();row.classList.remove('entry-title-row');});
    figure.append(img);row.append(heading,figure);return row;
  }
  function extras(e,container) {
    if(e.abstract){const d=el('details'),s=el('summary','',e.kind==='talk'?'Read description':'Read abstract');d.append(s,el('p','',e.abstract));container.append(d);}
  }
  function article(e) {
    const a=el('article',e.kind==='talk'?'talk':'publication');
    if(e.kind==='talk'){
      const t=el('time');t.dateTime=e.date;
      const [year,month]=e.date.split('-');t.append(document.createTextNode(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(month)-1]),el('br'),el('strong','',year));
      const body=el('div');if(e.type)body.append(el('p','eyebrow',e.type));body.append(title(e,'h3'));if(e.venue)body.append(el('p','',e.venue));extras(e,body);a.append(t,body);
    }else{
      const meta=el('div','item-meta');
      meta.append(
      el('span', '', e.kind === 'preprint' ? '' : (e.type || 'Publication')),
      el('span', '', e.year)
      );
      a.append(meta,title(e,'h4'));if(e.authors)a.append(el('p','',e.authors));if(e.venue)a.append(el('p','venue',e.venue));extras(e,a);
    }
    return a;
  }
  window.ContentView={article};
  if(!document.getElementById('publications-list'))return;
  try{
    const data=ContentModel.validate(window.ACADEMIC_CONTENT);
    for(const [kind,id] of [['publication','publications-list'],['preprint','preprints-list'],['talk','talks-list']]){
      const target=document.getElementById(id),items=data.entries.filter(e=>e.kind===kind);target.replaceChildren();
      if(!items.length)target.append(el('p','empty-list','No entries yet.'));
      items.forEach(e=>target.append(article(e)));
    }
  }catch(error){const notice=document.getElementById('content-error');notice.hidden=false;notice.textContent='Publications and talks could not load. Check content.js: '+error.message;}
})();
