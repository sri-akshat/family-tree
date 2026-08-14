const root = window.VERIFIED_TREE;
const tree = document.getElementById('tree');
const stage = document.getElementById('stage');
const collapsed = new Set();
let zoom = 0.9;

function makeNode(item) {
  const node = document.createElement('div');
  node.className = 'node';

  const person = document.createElement('div');
  person.className = 'person';

  const card = document.createElement('div');
  card.className = item.group ? 'card group-card' : 'card';

  const name = document.createElement('div');
  name.className = 'name';
  name.textContent = item.name;
  card.appendChild(name);

  if (item.relation) {
    const relation = document.createElement('div');
    relation.className = 'relation';
    relation.textContent = item.relation;
    card.appendChild(relation);
  }

  if (item.spouse) {
    const spouse = document.createElement('div');
    spouse.className = 'spouse';
    spouse.textContent = 'Spouse: ' + item.spouse;
    card.appendChild(spouse);
  }

  person.appendChild(card);

  const kids = item.children || [];
  if (kids.length) {
    const toggle = document.createElement('button');
    toggle.className = 'toggle';
    toggle.textContent = collapsed.has(item.id) ? '+' : '−';
    toggle.addEventListener('click', function () {
      if (collapsed.has(item.id)) collapsed.delete(item.id);
      else collapsed.add(item.id);
      render();
    });
    person.appendChild(toggle);
  }

  node.appendChild(person);

  if (kids.length && !collapsed.has(item.id)) {
    const children = document.createElement('div');
    children.className = 'children';
    kids.forEach(function (kid) {
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
  tree.innerHTML = '';
  tree.appendChild(makeNode(root));
}

function setZoom(value) {
  zoom = Math.max(0.4, Math.min(1.5, value));
  stage.style.transform = 'scale(' + zoom + ')';
  document.getElementById('zoomLabel').textContent = Math.round(zoom * 100) + '%';
}

document.getElementById('expand').addEventListener('click', function () {
  collapsed.clear();
  render();
});

document.getElementById('collapse').addEventListener('click', function () {
  function collect(item) {
    if ((item.children || []).length && item.id !== root.id) collapsed.add(item.id);
    (item.children || []).forEach(collect);
  }
  collect(root);
  render();
});

document.getElementById('zoomIn').addEventListener('click', function () { setZoom(zoom + 0.1); });
document.getElementById('zoomOut').addEventListener('click', function () { setZoom(zoom - 0.1); });
document.getElementById('reset').addEventListener('click', function () {
  collapsed.clear();
  setZoom(0.9);
  render();
});

render();
setZoom(0.9);
