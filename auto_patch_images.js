const https = require('https');
const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'client/src/components/holidays/WhereToGo.jsx');
let fileContent = fs.readFileSync(targetFile, 'utf8');

const urlsMatches = fileContent.matchAll(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+\?w=800/g);
const urls = [];
for (const match of urlsMatches) {
    urls.push(match[0]);
}
const uniqueUrls = [...new Set(urls)];

const fallbackUrls = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
    'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800',
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800'
];

let fallbackIndex = 0;

function checkUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            resolve(res.statusCode);
        }).on('error', (e) => {
            resolve(500);
        });
    });
}

async function fixBrokenImages() {
    let modified = false;
    for (const url of uniqueUrls) {
        const status = await checkUrl(url);
        if (status >= 400 && status !== 403) {
            console.log('Broken URL found: ' + url + ' (Status: ' + status + ')');
            const fallback = fallbackUrls[fallbackIndex % fallbackUrls.length];
            fallbackIndex++;
            console.log('Replacing with: ' + fallback);
            fileContent = fileContent.split(url).join(fallback);
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(targetFile, fileContent, 'utf8');
        console.log('Successfully patched WhereToGo.jsx with working images.');
    } else {
        console.log('All images are valid. No changes made.');
    }
}

fixBrokenImages();
