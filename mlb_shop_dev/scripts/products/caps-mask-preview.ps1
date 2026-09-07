Add-Type -AssemblyName System.Drawing
$root = 'C:/Users/AC1143/Project/Project/shop_vmd/mlb_shop_dev'
$files = Get-ChildItem "$root/public/products/caps" -Filter '*-albedo.png'
$sheet = New-Object System.Drawing.Bitmap(1500, 300)
$g = [System.Drawing.Graphics]::FromImage($sheet)
$g.Clear([System.Drawing.Color]::FromArgb(95,105,120))
$font = New-Object System.Drawing.Font('Arial', 10)
for ($i=0; $i -lt $files.Count; $i++) {
  $source = [System.Drawing.Bitmap]::FromFile($files[$i].FullName)
  $g.DrawImage($source,$i*250+10,15,$source.Width,$source.Height)
  $g.DrawString($files[$i].BaseName,$font,[System.Drawing.Brushes]::White,$i*250+5,250)
  $source.Dispose()
}
$sheet.Save("$root/evidence/products/caps/embroidery-mask-review.png")
$g.Dispose()
$sheet.Dispose()
