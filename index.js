#!/usr/bin/env node

const i3 = require('i3').createClient({ path: process.env.I3SOCK });

const walk = (nodes, cb) => {
  for (const node of nodes) {
    cb(node);
    if (node.nodes) {
      walk(node.nodes, cb);
    }
  }
}

const setOpacity = (id, opacity) => i3.command(`[con_id=${id}] opacity ${opacity}`);
const up = (id) => setOpacity(id, 1);
const down = (id) => setOpacity(id, 0.9);

const watchedWindowEvents = new Set(['focus']);
let prev = null;

i3.tree((err, root) => {
  walk([root], ({ type, id, focused }) => {
    if (type === 'con') {
      if (focused) {
        prev = id;
        up(id);
      } else {
        down(id);
      }
    }
  });
});

i3.on('window', ({ change, container: { id } }) => {
  if(watchedWindowEvents.has(change)) {
    down(prev);
    up(id);
    prev = id;
  }
});
