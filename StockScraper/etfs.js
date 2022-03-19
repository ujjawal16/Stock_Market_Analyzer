const request = require('request');
const cheerio=require('cheerio');
const path=require('path')
const fs=require('fs')
const xlsx=require('xlsx')

function getEtfs(url) {
    request(url, cb);
}

function cb(error,response,html){
    if(error){
        console.log(error);
    }else{
        extractLink(html);
    }
}

function extractLink(html){
   
    let $=cheerio.load(html);
    //console.log(html);
    let descEl="ETFS"; 
    console.log(descEl);
    let table=$('.simpTblRow');

    console.log(table.length);

    for(let j=0;j<table.length;j++)
    {
        let allCols=$(table[j]).find('td');
        //console.log(allCols.text());
        let symbol=$(allCols[0]).text().trim();
        let name=$(allCols[1]).text().trim();
        let price=$(allCols[2]).text().trim();
        let change=$(allCols[3]).text().trim();
        let percentageChange=$(allCols[4]).text().trim();
        let volume=$(allCols[5]).text().trim();

        //console.log(`${symbol}|${name}|${lastPrice}|${MarketTime}|${change}|${percentageChange}|${volume}|${marketCap}`)

        processEtfs(descEl,symbol,name,price,change,percentageChange,volume);
    }
            
}

function processEtfs(title,symbol,name,price,change,percentageChange,volume)
{
    let stockPath=path.join(__dirname,"Stocks");
    //dirCreator(teamPath)
    let filePath=path.join(stockPath,title+'.xlsx');
    let content=excelReader(filePath,title);

    let stockObj={
        SYMBOL:symbol,
        NAME:name,
        PRICE:price,
        CHANGE:change,
        PERCENTAGE_CHANGE:percentageChange,
        VOLUME:volume
    }

    content.push(stockObj);
    excelWriter(filePath , title , content );
}

function excelWriter(fileName,sheetName,jsonData)
{
    let newWB = xlsx.utils.book_new();     
    let newWS = xlsx.utils.json_to_sheet(jsonData);
    xlsx.utils.book_append_sheet(newWB, newWS,sheetName);
    xlsx.writeFile(newWB,fileName);
}

function excelReader(fileName,sheetName)
{
    if(fs.existsSync(fileName)==false)
    {
        return []
    }
    let wb = xlsx.readFile(fileName);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

module.exports={
    ge:getEtfs
}