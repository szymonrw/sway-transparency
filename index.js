#!/usr/bin/env node

const i3 = require('i3').createClient({ path: process.env.I3SOCK });

const watchedWindowEvens = new Set(['focus']);

let prev = null;

i3.on('window', (event) => {
  if(watchedWindowEvens.has(event.change)) {
    i3.command(`[con_id=${prev}] opacity 0.90`);
    i3.command('opacity 1');
    prev = event.container.id;
  }
});
