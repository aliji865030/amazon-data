const axios=require("axios")
const cheerio=require("cheerio");
const xlsx=require("xlsx");

const fs=require("node:fs");

const url="https://www.amazon.in/s?k=mobile+phones&crid=3P3KGSJE5GDO6&sprefix=mobile+phones%2Caps%2C377&ref=nb_sb_noss_1"

const headers={
    "content-type":"text/html"
}

const getData=async (url)=>{
    try{
         const response= await axios.get(url,{
            headers
         });
         const responsedData=response.data;
         fs.writeFileSync("amazonData.txt",responsedData)
    }
    catch(error){
        console.log(error);
    }
}

// getData(url);

const getAmazonData=()=>{
       return fs.readFileSync("amazonData.txt",{encoding:"utf-8"})
}

const pageData=getAmazonData();

const $=cheerio.load(pageData)
const mainData=[];
$("div[data-asin]")
.each((index,element)=>{

    const price = $(element).find("span.a-price-whole").first().text();
    const productTitle = $(element).find("span.a-text-normal").first().text();
    const prime=$(element).find("span.s-prime").first().text()
    const freeDelivery=$(element).find("span.a-color-base").first().text()

    
    if(price){
        mainData.push({
            title:productTitle,
            price: price.trim() + $(element).find("span.a-price-symbol").first().text(),
            prime:prime?"yes":"no",
            freeDelivery:freeDelivery?"yes":"no",
         })
    }
})

// console.log(mainData);


const workBook=xlsx.utils.book_new();
const workSheet=xlsx.utils.json_to_sheet(mainData);

xlsx.utils.book_append_sheet(workBook,workSheet,"sheet1");
xlsx.writeFile(workBook,"product.xlsx");