Add-Type -AssemblyName System.Drawing
$root=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$source=Join-Path $root 'reference/clothes'
$dest=Join-Path $root 'public/products/clothes'
$evidence=Join-Path $root 'evidence/products/clothes'
New-Item -ItemType Directory -Force -Path $dest | Out-Null
$ids=@('M26F3ATSM0764','M26F3ATSV1664','M26F3ATSV0664','M26F3AMTV0164')
$manifest=Import-Csv (Join-Path $source 'manifest.csv')
$provenance=foreach($id in $ids) {
  $path=Join-Path $source "$id.png"
  Copy-Item -LiteralPath $path -Destination (Join-Path $dest "$id-original.png")
  $original=[System.Drawing.Image]::FromFile($path)
  $rgba=[System.Drawing.Bitmap]::new($original.Width,$original.Height,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics=[System.Drawing.Graphics]::FromImage($rgba)
  $graphics.DrawImageUnscaled($original,0,0)
  $rgba.Save((Join-Path $dest "$id.png"),[System.Drawing.Imaging.ImageFormat]::Png)
  $crop=$rgba.Clone([System.Drawing.Rectangle]::new(290,380,320,380),[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $crop.Save((Join-Path $evidence "$id-torso.png"),[System.Drawing.Imaging.ImageFormat]::Png)
  $crop.Dispose()
  $record=$manifest | Where-Object FILE -eq "$id.png"
  [PSCustomObject]@{id=$id; file=$record.FILE; sourceUrl=$record.IMG_URL; sha256=(Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash; width=$original.Width; height=$original.Height; admission='Product only; individually viewed'; transformation='Lossless RGBA decode; original retained'; cornerAlpha=$rgba.GetPixel(0,0).A}
  $graphics.Dispose();$rgba.Dispose();$original.Dispose()
}
$provenance | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $evidence 'provenance.json') -Encoding utf8
