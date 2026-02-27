const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'client/src/components/holidays/WhereToGo.jsx');
let content = fs.readFileSync(targetFile, 'utf8');

content = content.replaceAll(
    'https://images.unsplash.com/photo-1544411047-c4cb3b7d1e8c?w=800',
    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800'
);
content = content.replaceAll(
    'https://images.unsplash.com/photo-1533587900720-63eb5caeeeba?w=800',
    'https://images.unsplash.com/photo-1531366936337-7785f0eb6bb2?w=800'
);
content = content.replaceAll(
    'https://images.unsplash.com/photo-1522616212176-381c13cb8972?w=800',
    'https://images.unsplash.com/photo-1513374268616-2a62fffa5840?w=800'
);
content = content.replaceAll(
    'https://images.unsplash.com/photo-1516024161749-fabe7cf4795e?w=800',
    'https://images.unsplash.com/photo-1523805009022-de90d3def9b6?w=800'
);

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Fixed exactly 4 known broken image references across all months.');
