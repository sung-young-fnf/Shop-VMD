Add-Type -AssemblyName System.Drawing
$files = @(Get-ChildItem "$PSScriptRoot/../../reference/shoes" -Filter *.png)
$out = [System.IO.Path]::GetFullPath("$PSScriptRoot/../../evidence/products/shoes")
New-Item -ItemType Directory -Force $out | Out-Null
for ($page = 0; $page -lt 3; $page++) {
  $bitmap = [System.Drawing.Bitmap]::new(1200, 1440)
  $g = [System.Drawing.Graphics]::FromImage($bitmap)
  $g.Clear([System.Drawing.Color]::White)
  $font = [System.Drawing.Font]::new('Arial', 10)
  for ($j = 0; $j -lt 36; $j++) {
    $i = $page * 36 + $j
    if ($i -ge $files.Count) { break }
    $img = [System.Drawing.Image]::FromFile($files[$i].FullName)
    $x = ($j % 6) * 200
    $y = [Math]::Floor($j / 6) * 240
    $g.DrawImage($img, $x, $y, 200, 200)
    $g.DrawString($files[$i].BaseName, $font, [System.Drawing.Brushes]::Black, $x + 3, $y + 205)
    $img.Dispose()
  }
  $bitmap.Save("$out/contact-$page.png", [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $font.Dispose(); $bitmap.Dispose()
}
