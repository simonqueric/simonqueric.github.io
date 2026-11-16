(() => {
  const $=id=>document.getElementById(id), form=$('entry-form'), fields=ContentModel.fields;
  const key='academic-editor-draft-v1:'+location.pathname;
  let data,active=-1,formDirty=false,unexported=false,storedDraft=null;
  const status=message=>$('status').textContent=message;
  const clone=value=>JSON.parse(JSON.stringify(value));
  const blank=()=>Object.fromEntries(fields.map(k=>[k,k==='kind'?'publication':k==='linkLabel'?'Paper':'']));
  try {data=ContentModel.validate(window.ACADEMIC_CONTENT);} catch(e){data={version:1,entries:[]};status('Could not load content.js: '+e.message+' Import a valid file or create new entries.');}
  try {const saved=localStorage.getItem(key);if(saved){storedDraft=ContentModel.validate(JSON.parse(saved));if(JSON.stringify(storedDraft)!==JSON.stringify(data))$('restore-box').hidden=false;}}catch(_){}
  function stash(){$('restore-box').hidden=true;try{localStorage.setItem(key,JSON.stringify(data));status('Draft saved in this browser. Export content.js to update your website.');}catch(_){status('Draft kept for this session only. Browser storage is unavailable—export before closing.');}}
  function read(){const e={};fields.forEach(k=>e[k]=form.elements.namedItem(k).value.trim());return e;}
  function validateForm(){if(!form.reportValidity())return null;try{return ContentModel.validate({version:1,entries:[read()]}).entries[0];}catch(e){$('form-error').textContent=e.message;return null;}}
  function syncKind(){const talk=form.elements.kind.value==='talk';document.querySelectorAll('[data-research]').forEach(n=>n.hidden=talk);document.querySelectorAll('[data-talk]').forEach(n=>n.hidden=!talk);form.elements.year.required=!talk;form.elements.date.required=talk;form.elements.imageAlt.required=!!form.elements.image.value.trim();}
  function preview(){syncKind();const target=$('entry-preview');target.replaceChildren();try{const item=ContentModel.validate({version:1,entries:[read()]}).entries[0];target.append(ContentView.article(item));}catch(_){const p=document.createElement('p');p.className='help';p.textContent='Enter a title and year (or talk month), plus a description for any image, to preview this entry.';target.append(p);}}
  function allowSwitch(){return !formDirty||confirm('Discard unsaved changes in this entry? Save the entry first to keep them.');}
  function select(index,force=false){if(!force&&!allowSwitch())return;active=index;const e=index<0?blank():data.entries[index];fields.forEach(k=>form.elements.namedItem(k).value=e[k]||'');formDirty=false;$('form-title').textContent=index<0?'New entry':'Edit entry';$('delete').disabled=index<0;$('form-error').textContent='';list();preview();}
  function list(){const target=$('entry-list');target.replaceChildren();data.entries.forEach((e,i)=>{
    const card=document.createElement('div');card.className='entry-card'+(i===active?' active':'');
    const button=document.createElement('button');button.type='button';button.className='entry-select';button.textContent=e.title;button.addEventListener('click',()=>select(i));
    const label=document.createElement('p');label.textContent=({publication:'Publication',preprint:'Preprint',talk:'Talk'})[e.kind]+' · '+(e.date||e.year);
    const controls=document.createElement('div');controls.className='order-buttons';
    for(const [delta,labelText] of [[-1,'Move up'],[1,'Move down']]){const b=document.createElement('button');b.type='button';b.textContent=labelText;const siblings=data.entries.map((x,j)=>x.kind===e.kind?j:-1).filter(j=>j>=0),position=siblings.indexOf(i),other=siblings[position+delta];b.disabled=other===undefined;b.addEventListener('click',()=>{if(!allowSwitch())return;[data.entries[i],data.entries[other]]=[data.entries[other],data.entries[i]];unexported=true;stash();select(other,true);});controls.append(b);}
    card.append(button,label,controls);target.append(card);
  });if(!data.entries.length)target.textContent='No entries yet. Add your first publication or talk.';}
  form.addEventListener('input',()=>{formDirty=true;$('form-error').textContent='';preview();});
  form.addEventListener('change',()=>{formDirty=true;preview();});
  form.addEventListener('submit',event=>{event.preventDefault();const e=validateForm();if(!e)return;if(active<0){data.entries.push(e);active=data.entries.length-1;}else data.entries[active]=e;unexported=true;stash();select(active,true);});
  $('add').addEventListener('click',()=>select(-1));
  $('delete').addEventListener('click',()=>{if(active<0||!confirm('Delete this entry from the draft?'))return;data.entries.splice(active,1);unexported=true;stash();select(data.entries.length?Math.min(active,data.entries.length-1):-1,true);});
  $('remove-image').addEventListener('click',()=>{form.elements.image.value='';form.elements.imageAlt.value='';formDirty=true;preview();});
  $('image-upload').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;const types=['image/png','image/jpeg','image/webp','image/gif','image/svg+xml'];if(file.size>2000000||!types.includes(file.type)){status('Choose an SVG, PNG, JPEG, WebP, or GIF image up to 2 MB.');event.target.value='';return;}const reader=new FileReader();reader.onload=()=>{form.elements.image.value=reader.result;formDirty=true;preview();status('Image embedded in this entry. Add its description, then save the entry.');};reader.onerror=()=>status('Could not read the image. Try another file.');reader.readAsDataURL(file);event.target.value='';});
  $('export').addEventListener('click',()=>{if(formDirty){status('Save this entry to the draft before exporting.');$('form-title').scrollIntoView({behavior:'smooth',block:'start'});return;}try{const blob=new Blob([ContentModel.serialize(data)],{type:'text/javascript;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='content.js';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);unexported=false;status('Export requested. Replace public/content.js with the downloaded file; commit it to GitLab to publish.');}catch(e){status('Export failed: '+e.message);}});
  $('import').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>20000000)throw Error('Choose a content file smaller than 20 MB.');const imported=ContentModel.parse(await file.text());if((formDirty||unexported)&&!confirm('Replace the current draft with the imported content?'))return;data=imported;unexported=true;stash();select(data.entries.length?0:-1,true);status('Imported '+data.entries.length+' entries. Review and export to publish.');}catch(e){status('Import failed: '+e.message);}finally{event.target.value='';}});
  $('restore').addEventListener('click',()=>{if(!allowSwitch())return;data=clone(storedDraft);unexported=true;select(data.entries.length?0:-1,true);$('restore-box').hidden=true;status('Browser draft restored. Export it when ready.');});
  $('discard').addEventListener('click',()=>{try{localStorage.removeItem(key);}catch(_){}storedDraft=null;$('restore-box').hidden=true;status('Previous browser draft discarded.');});
  window.addEventListener('beforeunload',event=>{if(formDirty||unexported){event.preventDefault();event.returnValue='';}});
  select(data.entries.length?0:-1,true);if($('status').textContent==='Loading content…')status('Loaded '+data.entries.length+' entries from content.js.');
})();
