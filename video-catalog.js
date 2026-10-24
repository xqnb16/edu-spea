/* One card per playable clip; old lesson IDs keep their progress. */
(function(){
const ids=['countryside-chapter-01','countryside-chapter-02','countryside-chapter-03'];
window.VlogCatalog.forEach(c=>{const i=ids.indexOf(c.id);if(i>=0)Object.assign(c,{part:i+1,parts:3,sourceLabel:'英伦乡村早晨',groupId:'countryside'});if(c.id==='countryside-morning-01')c.hideFromHome=true});
window.HomeVideoMode='videos';
})();
