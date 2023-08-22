//express server to listen in 3000 port
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const isUrl=require('is-url')
const cors = require('cors');
const https = require('https');
const axios=require('axios')


const agent = new https.Agent({
    rejectUnauthorized: false
  });

  const axiosInstance = axios.create({
    httpsAgent: agent
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('dist'));


const isValidUrl=(url)=>{
    return isUrl(url)
}


app.get("/numbers",async(req,res)=>{
    const urls=req.query.url;
    const validUrls=[];
    urls.map((url)=>{
        if(isValidUrl(url)){
            validUrls.push(url)
        }
    })
    let numbers=[]
    await Promise.all(
    validUrls.map(async(url)=>{
        try{
            const response=await axiosInstance.get(url)
            response.data.numbers.map(number=>{
                numbers.push(number)
            })
        }
        catch(err){
            console.log(err)
        }
    }))
    try{
        const uniqueNumbers=new Set(numbers)
    const finalNumbers=[...uniqueNumbers].sort((a,b)=>a-b)
    res.send(finalNumbers)
    }
    catch(err){ 
        console.log(err)
        res.send(err)
    }    
})


app.listen(port, () => console.log(`App listenign at port ${port}`));