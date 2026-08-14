const STORAGE_KEY = 'family-tree-draft-v1';
const BASE_TREE = window.VERIFIED_TREE;
let root = loadTree();
let editMode = false;
let zoom = 0.9;
const collapsed = new Set();

const tree = document.getElementById('tree');
const stage = document.getElementById('stage');
const zoomLabel = document.getElementById('zoomLabel');

function clone(value) { return JSON.parse(JSON.stringify(value)); }

function loadTree() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : clone(BASE_TREE);
  } catch (error) {
    return clone(BASE_TREE);
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(root));
  const status = document.getElementById('editStatus');
  if (status) status.textContent = 'Saved locally';
}

function findNode(id, item = root, parent = null) {
  if (item.id === id) return { item, parent };
  for (const child of item.children || []) {
    const found = findNode(id, child, item);
    if (found) return found;
  }
  return null;
}

function uniqueId(name) {
  const base = (name || 'person').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'person';
  let id = base;
  let n = 2;
  while (findNode(id)) id = base + '-' + n++;
  return id;
}

function textLine(className, text) {
  const el = document.createElement('div');
  el.className = className;
  el.textContent = text;
  return el;
}

function makeNode(item) {
  const node = document.createElement('div');
  node.className = 'node';
  const person = document.createElement('div');
  person.className = 'person';

  const card = document.createElement(editMode ? 'button' : 'div');
  card.className = (item.group ? 'card group-card' : 'card') + (editMode ? ' editable-card' : '');
  if (editMode) {
    card.type = 'button';
    card.title = 'Edit ' + item.name;
    card.addEventListener('click', () => openEditor(item.id));
  }
  card.appendChild(textLine('name', item.name));
  if (item.relation) card.appendChild(textLine('relation', item.relation));
  if (item.spouse) card.appendChild(textLine('spouse', 'Spouse: ' + item.spouse));
  person.appendChild(card);

  const kids = item.children || [];
  if (kids.length) {
    const toggle = document.createElement('button');
    toggle.className = 'toggle';
    toggle.type = 'button';
    toggle.textContent = collapsed.has(item.id) ? '+' : '−';
    toggle.addEventListener('click', () => {
      collapsed.has(item.id) ? collapsed.delete(item.id) : collapsed.add(item.id);
      render();
    });
    person.appendChild(toggle);
  }

  node.appendChild(person);
  if (kids.length && !collapsed.has(item.id)) {
    const children = document.createElement('div');
    children.className = 'children';
    kids.forEach(kid => {
      const child = document.createElement('div');
      child.className = 'child';
      child.appendChild(makeNode(kid));
      children.appendChild(child);
    });
    node.appendChild(children);
  }
  return node;
}

function render() {
  tree.replaceChildren(makeNode(root));
  document.body.classList.toggle('edit-mode', editMode);
  const editButton = document.getElementById('editMode');
  if (editButton) editButton.textContent = editMode ? 'Done editing' : 'Edit tree';
}

function setZoom(value) {
  zoom = Math.max(0.4, Math.min(1.5, value));
  stage.style.transform = 'scale(' + zoom + ')';
  zoomLabel.textContent = Math.round(zoom * 100) + '%';
}

function ensureEditor() {
  if (document.getElementById('editorPanel')) return;
  const panel = document.createElement('aside');
  panel.id = 'editorPanel';
  panel.className = 'editor-panel';
  panel.hidden = true;
  panel.innerHTML = `
    <div class="editor-head"><strong>Edit person</strong><button id="editorClose" type="button">×</button></div>
    <label>Name<input id="editName"></label>
    <label>Relation to parent<input id="editRelation" placeholder="Son, Sister, Father..."></label>
    <label>Spouse<input id="editSpouse" placeholder="Optional"></label>
    <div class="editor-actions">
      <button id="editorSave" type="button">Save</button>
      <button id="editorAdd" type="button">+ Add child</button>
      <button id="editorDelete" type="button" class="danger">Delete</button>
    </div>
    <div id="editStatus" class="editor-status">Changes autosave on this device</div>`;
  document.body.appendChild(panel);
  document.getElementById('editorClose').addEventListener('click', () => panel.hidden = true);
}

let editingId = null;
function openEditor(id) {
  ensureEditor();
  const found = findNode(id);
  if (!found) return;
  editingId = id;
  document.getElementById('editName').value = found.item.name || '';
  document.getElementById('editRelation').value = found.item.relation || '';
  document.getElementById('editSpouse').value = found.item.spouse || '';
  document.getElementById('editorDelete').disabled = !found.parent;
  document.getElementById('editorPanel').hidden = false;
}

function saveEditor() {
  const found = findNode(editingId);
  if (!found) return;
  const name = document.getElementById('editName').value.trim();
  if (!name) return;
  found.item.name = name;
  const relation = document.getElementById('editRelation').value.trim();
  const spouse = document.getElementById('editSpouse').value.trim();
  if (relation) found.item.relation = relation; else delete found.item.relation;
  if (spouse) found.item.spouse = spouse; else delete found.item.spouse;
  persist();
  render();
}

function addChild() {
  const found = findNode(editingId);
  if (!found) return;
  const child = { id: uniqueId('new-person'), name: 'New person', relation: 'Child' };
  if (!found.item.children) found.item.children = [];
  found.item.children.push(child);
  collapsed.delete(found.item.id);
  persist();
  render();
  openEditor(child.id);
  document.getElementById('editName').select();
}

function deleteNode() {
  const found = findNode(editingId);
  if (!found || !found.parent) return;
  if (!confirm('Delete ' + found.item.name + ' and everyone nested under this node?')) return;
  found.parent.children = (found.parent.children || []).filter(child => child.id !== editingId);
  persist();
  document.getElementById('editorPanel').hidden = true;
  render();
}

function exportJson() {
  const blob = new Blob([JSON.stringify(root, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'family-tree-edited.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function resetEdits() {
  if (!confirm('Discard all edits saved on this device and reload the repository version?')) return;
  localStorage.removeItem(STORAGE_KEY);
  root = clone(BASE_TREE);
  document.getElementById('editorPanel')?.setAttribute('hidden', '');
  render();
}

ensureEditor();
document.getElementById('editorSave').addEventListener('click', saveEditor);
document.getElementById('editorAdd').addEventListener('click', addChild);
document.getElementById('editorDelete').addEventListener('click', deleteNode);
document.getElementById('editMode').addEventListener('click', () => { editMode = !editMode; render(); if (!editMode) document.getElementById('editorPanel').hidden = true; });
document.getElementById('exportData').addEventListener('click', exportJson);
document.getElementById('resetEdits').addEventListener('click', resetEdits);
document.getElementById('expand').addEventListener('click', () => { collapsed.clear(); render(); });
document.getElementById('collapse').addEventListener('click', () => {
  function collect(item) { if ((item.children || []).length && item.id !== root.id) collapsed.add(item.id); (item.children || []).forEach(collect); }
  collect(root); render();
});
document.getElementById('zoomIn').addEventListener('click', () => setZoom(zoom + 0.1));
document.getElementById('zoomOut').addEventListener('click', () => setZoom(zoom - 0.1));
document.getElementById('reset').addEventListener('click', () => { collapsed.clear(); setZoom(0.9); render(); });

render();
setZoom(0.9);
