import sharp from 'sharp';
async function normalize(input,output,region){
 let img=sharp(input);if(region)img=img.extract(region);
 const {data,info}=await img.removeAlpha().raw().toBuffer({resolveWithObject:true});let x0=info.width,y0=info.height,x1=0,y1=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const i=(y*info.width+x)*info.channels;if(data[i]+data[i+1]+data[i+2]<270){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}}
 await sharp(data,{raw:info}).extract({left:x0,top:y0,width:x1-x0+1,height:y1-y0+1}).resize(480,480,{fit:'contain',background:'#f7f6f2'}).png().toFile(output);
}
await normalize('public/assets/reference-5.jpg','evidence/reference-front-normalized.png');
await normalize('evidence/front.png','evidence/actual-front-normalized.png',{left:0,top:215,width:952,height:560});
