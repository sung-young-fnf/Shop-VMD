Add-Type -AssemblyName System.Drawing
$root = 'C:/Users/AC1143/Project/Project/shop_vmd/mlb_shop_dev'
$selected = @(
  @('M21N3ACP7701N',300,460,130,160,470,520),
  @('M22N3ACP0802N',265,410,175,220,480,520),
  @('M24N3ACPVL64N',267,462,225,160,530,520),
  @('M25N3ACP8805N',299,413,115,195,480,520),
  @('M26N3ACPB296N',280,461,137,190,480,530),
  @('M26N3ACPB336N',288,429,145,200,485,520)
)
$output = New-Item -ItemType Directory -Force "$root/public/products/caps"
$evidence = New-Item -ItemType Directory -Force "$root/evidence/products/caps"
$manifest = Import-Csv "$root/reference/caps/manifest.csv"
$records = foreach ($item in $selected) {
  $id = $item[0]
  $source = [System.Drawing.Bitmap]::FromFile("$root/reference/caps/$id.png")
  $normalized = $source.Clone([System.Drawing.Rectangle]::new(0,0,$source.Width,$source.Height), [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $normalized.Save("$root/evidence/products/caps/$id-rgba.png")
  $normalized.Dispose()
  $crop = $source.Clone([System.Drawing.Rectangle]::new($item[1],$item[2],$item[3],$item[4]), [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  for ($y=0; $y -lt $crop.Height; $y++) {
    for ($x=0; $x -lt $crop.Width; $x++) {
      $pixel = $crop.GetPixel($x,$y)
      $distance = [math]::Min([math]::Min($x,$crop.Width-1-$x),[math]::Min($y,$crop.Height-1-$y))
      $luma = .2126*$pixel.R + .7152*$pixel.G + .0722*$pixel.B
      $signal = switch ($id) {
        'M24N3ACPVL64N' { [math]::Min(($pixel.G - .83*$pixel.R)/12, ($luma-202)/18) }
        'M26N3ACPB336N' { ($pixel.B - .875*$pixel.R)/7 }
        'M26N3ACPB296N' { ($pixel.G-75)/60 }
        default { ($luma-75)/55 }
      }
      $coverage = [math]::Clamp($signal,0,1)
      $coverage = $coverage*$coverage*(3-2*$coverage)
      $alpha = [int]($pixel.A*$coverage*[math]::Min(1,$distance/3))
      if ($pixel.A -lt 250) { $alpha = 0 }
      if ($id -eq 'M26N3ACPB336N' -and $x -lt (55-.45*$y)) { $alpha = 0 }
      $crop.SetPixel($x,$y,[System.Drawing.Color]::FromArgb($alpha,$pixel.R,$pixel.G,$pixel.B))
    }
  }
  $crop.Save("$root/public/products/caps/$id.png")
  $sample = $source.GetPixel($item[5],$item[6])
  [pscustomobject]@{id=$id;file="$id.png";source="reference/caps/$id.png";sha256=(Get-FileHash "$root/reference/caps/$id.png").Hash;crop=@($item[1],$item[2],$item[3],$item[4]);baseColor=('#{0:X2}{1:X2}{2:X2}' -f $sample.R,$sample.G,$sample.B);sourceUrl=($manifest | Where-Object PRDT_CD -eq $id).IMG_URL;admission='Product-only image individually visually inspected; no human pixels';method='Original embroidery RGB isolated with SKU-specific source-color/luminance alpha, smoothstep edge feather and preserved source alpha. Background fabric removed after manager rectangular-patch rejection. Runtime mild de-lighting preserves this alpha.'}
  $source.Dispose()
  $crop.Dispose()
}
$records | ConvertTo-Json -Depth 6 | Set-Content "$root/evidence/products/caps/provenance.json"
