import sharp from 'sharp';
await sharp('../mlb_shop_dev/reference/shoes-detail/M26N3ACVSP46N/gallery-0.png').extract({left:198,top:988,width:1600,height:660}).flatten({background:'#f7f6f2'}).resize(600,280,{fit:'contain',background:'#f7f6f2'}).png().toFile('evidence/reference-side-normalized.png');
await sharp('evidence/front.png').extract({left:202,top:392,width:550,height:216}).resize(600,280,{fit:'contain',background:'#f7f6f2'}).png().toFile('evidence/actual-side-normalized.png');
