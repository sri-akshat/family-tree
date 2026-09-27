const DATA = window.FAMILY_DATA;
const people = DATA.people;
const tree = document.getElementById('tree');
const stage = document.getElementById('stage');
const details = document.getElementById('details');
const search = document.getElementById('search');
const zoomLabel = document.getElementById('zoomLabel');
const collapsed = new Set();
let rootId = DATA.defaultRoot;
let zoom = 1;

function names(ids) {
  return (ids || []).map(id => people[id] && people[id].name).filter(Boolean);
}

function makeNode(id, seen) {
  const person = people[id];
  if (!person) return document.createDocumentFragment();
  const visited = new Set(seen || []);
  visited.add(id);

  const node = document.createElement('div');
  node.className = 'node';

  const personWrap = document.createElement('div');
  personWrap.className = 'person';

  const card = document.createElement('button');
  card.className = 'card';
  card.type = 'button';
  const label = document.createElement('div');
  label.className = 'name';
  label.textContent = person.name;
  card.appendChild(label);
  card.addEventListener('click', function () { showPerson(id); });
  personWrap.appendChild(card);

  const childIds = (person.childIds || []).filter(childId => people[childId] && !visited.has(childId));
  if (childIds.length) {
    const toggle = document.createElement('button');
    toggle.className = 'toggle';
    toggle.type = 'button';
    toggle.textContent = collapsed.has(id) ? '+' : '-';
    toggle.addEventListener('click', function () {
      if (collapsed.has(id)) collapsed.delete(id); else collapsed.add(id);
      render();
    });
    personWrap.appendChild(toggle);
  }

  node.appendChild(personWrap);

  if (childIds.length && !collapsed.has(id)) {
    const children = document.createElement('div');
    children.className = 'children';
    childIds.forEach(function (childId) {
      const child = document.createElement('div');
      child.className = 'child';
      child.appendChild(makeNode(childId, visited));
      children.appendChild(child);
    });
    node.appendChild(children);
  }
  return node;
}

function render() {
  tree.replaceChildren(makeNode(rootId));
}

function addDetail(label, values) {
  if (!values.length) return;
  const p = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = label + ': ';
  p.appendChild(strong);
  p.appendChild(document.createTextNode(values.join(', ')));
  details.appendChild(p);
}

function showPerson(id) {
  const person = people[id];
  details.replaceChildren();
  const close = document.createElement('button');
  close.className = 'close';
  close.type = 'button';
  close.textContent = 'x';
  close.addEventListener('click', function () { details.hidden = true; });
  const title = document.createElement('h2');
  title.textContent = person.name;
  details.appendChild(close);
  details.appendChild(title);
  addDetail('Spouse', names(person.spouseIds));
  addDetail('Parents', names(person.parentIds));
  addDetail('Children', names(person.childIds));
  addDetail('Siblings', names(person.siblingIds));
  details.hidden = false;
}

function setZoom(value) {
  zoom = Math.max(0.5, Math.min(1.7, value));
  stage.style.transform = 'scale(' + zoom + ')';
  zoomLabel.textContent = Math.round(zoom * 100) + '%';
}

search.addEventListener('input', function () {
  const q = search.value.trim().toLowerCase();
  if (!q) {
    rootId = DATA.defaultRoot;
    render();
    return;
  }
  const match = Object.values(people).find(person => person.name.toLowerCase().includes(q));
  if (match) {
    rootId = match.id;
    collapsed.delete(match.id);
    render();
  }
});

document.getElementById('expand').addEventListener('click', function () { collapsed.clear(); render(); });
document.getElementById('collapse').addEventListener('click', function () {
  Object.values(people).forEach(person => { if ((person.childIds || []).length) collapsed.add(person.id); });
  render();
});
document.getElementById('zoomIn').addEventListener('click', function () { setZoom(zoom + 0.1); });
document.getElementById('zoomOut').addEventListener('click', function () { setZoom(zoom - 0.1); });
document.getElementById('reset').addEventListener('click', function () {
  rootId = DATA.defaultRoot;
  collapsed.clear();
  search.value = '';
  setZoom(1);
  render();
});

render();
setZoom(1);
