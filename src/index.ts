#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import prompts from 'prompts';
import ejs from 'ejs';
import { fileURLToPath } from 'node:url';

export const generateProject = (options: any, rootDir: string, __dir: string) => {
    const templateDir = path.resolve(__dir, '../templates');
    if (!fs.existsSync(templateDir)) {
        throw new Error(`Could not locate templates directory at ${templateDir}`);
    }

    if (!fs.existsSync(rootDir)) {
        fs.mkdirSync(rootDir, { recursive: true });
    }

    const copyAndRender = (src: string, dest: string) => {
        const stats = fs.statSync(src);
        const itemName = path.basename(src);

        if (options.language === 'js' && (itemName.includes('tsconfig') || itemName.includes('vite-env.d.ts'))) {
            return;
        }

        if (stats.isDirectory()) {
            fs.mkdirSync(dest, { recursive: true });
            fs.readdirSync(src).forEach(childItemName => {
                copyAndRender(path.join(src, childItemName), path.join(dest, childItemName));
            });
        } else {
            if (src.endsWith('.ejs')) {
                const content = fs.readFileSync(src, 'utf-8');
                const rendered = ejs.render(content, options);
                let finalDest = dest.replace(/\.ejs$/, '');
                if (finalDest.endsWith('.react')) {
                    finalDest = finalDest.replace(/\.react$/, options.language === 'ts' ? '.tsx' : '.jsx');
                } else if (finalDest.endsWith('.logic')) {
                    finalDest = finalDest.replace(/\.logic$/, options.language === 'ts' ? '.ts' : '.js');
                } else if (itemName === '_gitignore.ejs') {
                    finalDest = path.join(path.dirname(finalDest), '.gitignore');
                }
                fs.writeFileSync(finalDest, rendered);
            } else {
                let finalDest = dest;
                if (itemName === '_gitignore') {
                    finalDest = path.join(path.dirname(dest), '.gitignore');
                }
                fs.copyFileSync(src, finalDest);
            }
        }
    };

    copyAndRender(path.join(templateDir, 'base'), rootDir);

    if (options.state !== 'none') {
        const stateSrc = path.join(templateDir, 'state', options.state);
        if (fs.existsSync(stateSrc)) {
            copyAndRender(stateSrc, path.join(rootDir, 'src', 'store'));
        }
    }

    if (options.tailwind) {
        copyAndRender(path.join(templateDir, 'config', 'tailwind'), rootDir);
    } else {
        copyAndRender(path.join(templateDir, 'config', 'standard-css'), rootDir);
    }

    if (options.eslint) {
        copyAndRender(path.join(templateDir, 'config', 'eslint'), rootDir);
    }

    const structureTpl = path.join(templateDir, 'structure', options.structure);
    if (fs.existsSync(structureTpl)) {
        copyAndRender(structureTpl, path.join(rootDir, 'src'));
    }
};

const printBanner = () => {
    console.clear();
    console.log('\x1b[1m\x1b[36m%s\x1b[0m', 'Create Scalable React App');
    console.log('\x1b[32m%s\x1b[0m', 'Dynamic Enterprise React Scaffolder');
    console.log('');
};

async function init() {
    printBanner();

    let targetDir = process.argv[2];
    
    if (!targetDir) {
        const res = await prompts({
            type: 'text',
            name: 'projectName',
            message: 'Project name:',
            initial: 'scalable-react-app',
            validate: (dir) => {
                if (dir.trim().length === 0) return 'Project name cannot be empty';
                if (/^[.]$/.test(dir) || /^[a-zA-Z0-9_-]+$/.test(dir)) return true;
                return 'Project name must consist of letters, numbers, dashes, and underscores only';
            }
        });

        if (!res.projectName) {
            console.log('\x1b[31m%s\x1b[0m', 'Operation cancelled.');
            process.exit(1);
        }
        targetDir = res.projectName;
    }

    const cwd = process.cwd();
    const root = path.join(cwd, targetDir);

    if (fs.existsSync(root) && fs.readdirSync(root).length > 0) {
        console.log('\x1b[31m%s\x1b[0m', `Error: Directory ${targetDir} is not empty.`);
        process.exit(1);
    }

    const answers = await prompts([
        { type: 'select', name: 'language', message: 'Language', choices: [{ title: 'TypeScript', value: 'ts' }, { title: 'JavaScript', value: 'js' }], initial: 0 },
        { type: 'select', name: 'state', message: 'State Management', choices: [{ title: 'Redux Toolkit', value: 'redux' }, { title: 'Zustand', value: 'zustand' }, { title: 'None', value: 'none' }], initial: 0 },
        { type: 'confirm', name: 'tailwind', message: 'Tailwind CSS (Utility-first styling)', initial: true },
        { type: 'confirm', name: 'router', message: 'React Router DOM', initial: true },
        { type: 'confirm', name: 'eslint', message: 'ESLint + Prettier', initial: true },
        { type: 'confirm', name: 'testing', message: 'Testing (Jest + React Testing Library)', initial: false },
        { type: 'select', name: 'structure', message: 'Folder Structure', choices: [{ title: 'Feature-based (recommended)', value: 'feature' }, { title: 'Flat', value: 'flat' }], initial: 0 }
    ]);

    if (Object.keys(answers).length !== 7) {
        console.log('\x1b[31m%s\x1b[0m', 'Operation cancelled.');
        process.exit(1);
    }

    const options = { projectName: targetDir, ...answers };

    console.log(`\nScaffolding project in \x1b[33m${root}\x1b[0m...`);

    try {
        generateProject(options, root, __dirname);
        console.log(`\n\x1b[32mDone. Now run:\x1b[0m\n`);
        if (root !== cwd) {
            console.log(`  cd ${targetDir}`);
        }
        console.log(`  npm install`);
        console.log(`  npm run dev`);
        console.log();
    } catch(err) {
        console.error('\x1b[31m%s\x1b[0m', 'Generation failed:', err);
        process.exit(1);
    }
}

// Only run init if executed directly (e.g. CLI via node index.js)
if (require.main === module) {
    init().catch((e) => {
        console.error('\x1b[31m%s\x1b[0m', 'Error scaffolding the project', e);
    });
}
