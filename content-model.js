/* Shared validation and serialization; imports are parsed as data, never executed. */
(function (root) {
  const fields = ['kind','title','authors','year','date','venue','type','abstract','url','linkLabel','image','imageAlt'];
  function safeURL(value, image = false) {
    if (!value) return '';
    if (/^[\u0000-\u0020\u007f]|[\u0000-\u001f\u007f\\]/.test(value)) throw Error('Links cannot contain control characters or backslashes.');
    if (image && /^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,[A-Za-z0-9+/=]+$/.test(value)) return value;
    if (/^https?:\/\//i.test(value)) { new URL(value); return value; }
    if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('//') || value.startsWith('/')) throw Error('Use an https:// URL or a relative filename, such as figures/paper.svg.');
    return value;
  }
  function validate(value) {
    if (!value || value.version !== 1 || !Array.isArray(value.entries) || value.entries.length > 500) throw Error('Choose a version 1 content file with up to 500 entries.');
    return {version:1, entries:value.entries.map((item,index) => {
      if (!item || typeof item !== 'object') throw Error(`Entry ${index+1} is invalid.`);
      const e = {};
      for (const key of fields) {
        if (item[key] != null && typeof item[key] !== 'string') throw Error(`Entry ${index+1}: ${key} must be text.`);
        e[key] = (item[key] || '').trim();
        if (e[key].length > (key === 'image' ? 3000000 : 30000)) throw Error(`Entry ${index+1}: ${key} is too long.`);
      }
      if (!['publication','preprint','talk'].includes(e.kind) || !e.title) throw Error(`Entry ${index+1} needs a category and title.`);
      if (e.kind !== 'talk' && !/^\d{4}$/.test(e.year)) throw Error(`Entry ${index+1} needs a four-digit year.`);
      if (e.kind === 'talk' && !/^\d{4}-(0[1-9]|1[0-2])$/.test(e.date)) throw Error(`Entry ${index+1} needs a date in YYYY-MM format.`);
      safeURL(e.url); safeURL(e.image,true);
      if (e.image && !e.imageAlt) throw Error(`Entry ${index+1} needs an image description.`);
      return e;
    })};
  }
  function parse(source) {
    let text = source.trim();
    if (text.startsWith('window.ACADEMIC_CONTENT')) {
      const match = text.match(/^window\.ACADEMIC_CONTENT\s*=\s*([\s\S]*?);?\s*$/);
      if (!match) throw Error('Invalid content file.');
      text = match[1];
    }
    return validate(JSON.parse(text));
  }
  function serialize(value) { return 'window.ACADEMIC_CONTENT = '+JSON.stringify(validate(value),null,2)+';\n'; }
  root.ContentModel = {validate,parse,serialize,safeURL,fields};
})(typeof window === 'undefined' ? globalThis : window);
