const fs = require('fs');
const path = require('path');

const interfaceFile = 'interfaces.ts';
const outputDir = './models';

const content = fs.readFileSync(interfaceFile, 'utf-8');

const interfaceRegex = /interface\s+(\w+)\s+\{/g;
let match;
while ((match = interfaceRegex.exec(content))) {
    const interfaceName = match[1];

  // Chuyển đổi camelCase/PascalCase sang snake_case
  const fileName = interfaceName
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase() + '.model.ts';


  const filePath = path.join(outputDir, fileName);

  let startIndex = match.index;
    let endIndex = content.indexOf('}', startIndex) + 1;

    let bracketCount=1;
    for(let i = startIndex+1; i<content.length;i++){
        if(content[i] === '{'){
            bracketCount++;
        }
         if(content[i] === '}'){
            bracketCount--;
        }
        if(bracketCount===0){
             endIndex=i+1;
            break;
        }
    }

    const interfaceContent = content.substring(startIndex, endIndex);

  fs.writeFileSync(filePath, interfaceContent);
    console.log(`Created ${filePath}`);
}

//ensure models folder exist
fs.mkdirSync(outputDir,{recursive:true})
