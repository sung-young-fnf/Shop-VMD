Add-Type -AssemblyName System.Drawing
$root = [System.IO.Path]::GetFullPath("$PSScriptRoot/../..")
$reports = foreach ($id in @('M26N3ACVSP46N','M26N3ACVS026N','M25N3ASXD015N','M25N3ASHVT35N')) {
  $bounds = switch ($id) {
    'M26N3ACVSP46N' { @(90,446,720,292) }
    'M26N3ACVS026N' { @(90,433,720,307) }
    'M25N3ASXD015N' { @(89,416,720,360) }
    'M25N3ASHVT35N' { @(90,425,720,340) }
  }
  $source = [System.Drawing.Bitmap]::FromFile("$root/reference/shoes/$id.png")
  $contour = switch ($id) {
    'M26N3ACVSP46N' { @(@(0,244),@(20,260),@(60,273),@(120,284),@(220,291),@(400,291),@(600,291),@(680,283),@(719,251)) }
    'M26N3ACVS026N' { @(@(0,233),@(20,263),@(60,280),@(120,294),@(220,302),@(400,306),@(600,304),@(680,285),@(719,249)) }
    'M25N3ASXD015N' { @(@(0,290),@(20,315),@(60,335),@(120,353),@(200,359),@(400,359),@(600,359),@(680,353),@(719,334)) }
    'M25N3ASHVT35N' { @(@(0,248),@(20,274),@(60,307),@(120,332),@(200,338),@(310,339),@(390,323),@(460,328),@(550,338),@(640,339),@(690,312),@(719,281)) }
  }
  $result = [System.Drawing.Bitmap]::new($bounds[2], $bounds[3], [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $removed = 0; $transparent = 0; $opaque = 0; $bottoms = @()
  for ($x = 0; $x -lt $bounds[2]; $x++) {
    $segment = 0
    while ($segment -lt ($contour.Count - 2) -and $x -gt $contour[$segment + 1][0]) { $segment++ }
    $a = $contour[$segment]; $b = $contour[$segment + 1]
    $bottom = [Math]::Ceiling($a[1] + ($b[1] - $a[1]) * ($x - $a[0]) / ($b[0] - $a[0]))
    $bottoms += $bottom
    for ($y = 0; $y -lt $bounds[3]; $y++) {
      $p = $source.GetPixel($x + $bounds[0], $y + $bounds[1])
      $alpha = $p.A
      if ($bottom -ge 0 -and $y -gt ($bottom + 1)) { if ($alpha -gt 0) { $removed++ }; $alpha = 0 }
      if ($alpha -eq 0) { $transparent++ } else { $opaque++ }
      $result.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
    }
  }
  $result.Save("$root/public/products/shoes/$id.png", [System.Drawing.Imaging.ImageFormat]::Png)
  if ($transparent -eq 0 -or $opaque -eq 0) { throw "Invalid product alpha mask: $id" }
  [pscustomobject]@{sku=$id;crop=$bounds;method='Original RGB and alpha preserved above continuous visually authored lower outsole contour; alpha only removed below contour plus one pixel margin. No color classification.';controlPoints=$contour;shadowPixelsRemoved=$removed;transparentPixels=$transparent;foregroundPixels=$opaque;bottomContour=$bottoms}
  $source.Dispose(); $result.Dispose()
}
$reports | ConvertTo-Json -Depth 5 | Set-Content "$root/evidence/products/shoes/alpha-restoration.json" -Encoding utf8
$reports | Select-Object sku,shadowPixelsRemoved,transparentPixels,foregroundPixels
