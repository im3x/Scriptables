const FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']();
await Promise.all([*|FILES|*].map(async js => {
  const REQ = new Request(`http://*|IP_ADDRESS|*/Scripts/${encodeURIComponent(js)}`);
  const RES = await REQ.load();
  FILE_MGR.write(FILE_MGR.joinPath(FILE_MGR.documentsDirectory(), js), RES);
}));
FILE_MGR.remove(module.filename);
Safari.open("scriptable:///open?scriptName="+encodeURIComponent('「源码」小组件示例'));