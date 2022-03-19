const request = require('request');
const cheerio=require('cheerio');
const fs=require('fs');
const path=require('path');
const trendingStocks=require('./trendingStocks');
const crypto=require('./crypto');
const mostActive=require('./mostActive');
const gainers=require('./gainers');
const losers=require('./losers');
const etfs=require('./etfs');
const mutualFunds=require('./mutualFunds');
const currencies=require('./currencies');
const commodities=require('./commodities');
const openInterests=require('./openInterests');
const impliedVolatility=require('./impliedVolatality');

let stockPath=path.join(__dirname,"Stocks");

const url='https://finance.yahoo.com/';

function dirCreator(path){
    if(fs.existsSync(path)==false){
        fs.mkdirSync(path);
    }
}

dirCreator(stockPath);

request(url,cb);

function cb(error,response,html){
    
    if(error){
        console.log(error);
    }else{
        extractLink(html);
    }
}

function extractLink(html){
    let $=cheerio.load(html);
    let sectionEl=$('section[data-yaft-module]>header>a');
    console.log(sectionEl.length);
    for(let i=1;i<sectionEl.length;i++)
    {
        //let anchorEl=$('a[title="Trending Tickers"]'); //Attribute-->a[attr]
        let href=$(sectionEl[i]).attr('href');
        console.log(href);
        let fullLink='https://finance.yahoo.com'+href
        if(href=='/trending-tickers'){
            trendingStocks.gts(fullLink);
        }else if(href=='/cryptocurrencies'){
            crypto.gc(fullLink)
        }else if(href=='/most-active'){
            mostActive.ma(fullLink)
        }else if(href=='/gainers'){
            gainers.gg(fullLink)
        }else if(href=='/losers'){
            losers.gl(fullLink)
        }else if(href=='/etfs'){
            etfs.ge(fullLink)
        }else if(href=='/currencies'){
            currencies.gc(fullLink)
        }else if(href=='/commodities'){
            commodities.gc(fullLink)
        }else if(href=='/options/highest-open-interest'){
            openInterests.gi(fullLink)
        }else if(href=='/options/highest-implied-volatility'){
            impliedVolatility.gi(fullLink)
        }else if(href=='/mutualfunds'){
            mutualFunds.gm(fullLink)
        }
    }
    
}