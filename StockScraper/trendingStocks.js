const request = require('request');
const cheerio=require('cheerio');
const path=require('path')
const fs=require('fs')
const xlsx=require('xlsx')

function getTrendingStocks(url) {
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
    let descEl=$('div[data-test="watchlist-name"]').text(); 
    
    console.log(descEl);

    let table=$('.simpTblRow');

    console.log(table.length);

    for(let j=0;j<table.length;j++)
    {
        let allCols=$(table[j]).find('td');
        //console.log(allCols.text());
        let symbol=$(allCols[0]).text().trim();
        let name=$(allCols[1]).text().trim();
        let lastPrice=$(allCols[2]).text().trim();
        let MarketTime=$(allCols[3]).text().trim();
        let change=$(allCols[4]).text().trim();
        let percentageChange=$(allCols[5]).text().trim();
        let volume=$(allCols[6]).text().trim();
        let marketCap=$(allCols[7]).text().trim();

       // console.log(`${symbol}|${name}|${lastPrice}|${MarketTime}|${change}|${percentageChange}|${volume}|${marketCap}`)

        processStocks(descEl,symbol,name,lastPrice,MarketTime,change,percentageChange,volume,marketCap);
    }
            
}

function processStocks(title,symbol,name,lastPrice,marketTime,change,percentageChange,volume,marketCap)
{
    let stockPath=path.join(__dirname,"Stocks");
    //dirCreator(teamPath)
    let filePath=path.join(stockPath,title+'.xlsx');
    let content=excelReader(filePath,title);

    let stockObj={
        SYMBOL:symbol,
        NAME:name,
        LAST_PRICE:lastPrice,
        MARKET_TIME:marketTime,
        CHANGE:change,
        PERCENTAGE_CHANGE:percentageChange,
        VOLUME:volume,
        MARKET_CAP:marketCap,
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
    gts:getTrendingStocks
}