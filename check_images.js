const https = require('https');
const fs = require('fs');

const fileContent = fs.readFileSync('client/src/components/holidays/WhereToGo.jsx', 'utf8');
const urls = [...fileContent.matchAll(/https:\/\/images\.unsplash\.com\/[^\s'"]+/g)].map(m => m[0]);

const uniqueUrls = [...new Set(urls)];

function checkUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            if (res.statusCode >= 400 && res.statusCode !== 403) {
                console.log('FAILED:', url, res.statusCode);
            }
            resolve();
        }).on('error', (e) => {
            console.log('ERROR:', url, e.message);
            resolve();
        });
    });
}

async function run() {
    console.log('Checking ' + uniqueUrls.length + ' URLs...');
    for (const url of uniqueUrls) {
        await checkUrl(url);
    }
    console.log('Done.');
}

run();
