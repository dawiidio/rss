import { promises } from 'node:fs';
const { cp } = promises;

async function main() {
    await cp('static/styles.css', 'lib/styles.css');
}

main();
