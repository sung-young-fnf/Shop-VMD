Add-Type -AssemblyName System.Drawing
$root = [System.IO.Path]::GetFullPath("$PSScriptRoot/../..")
$original = [System.Drawing.Bitmap]::FromFile("$root/reference/shoes/M25N3ASXD015N.png")
$runtime = [System.Drawing.Bitmap]::FromFile("$root/public/products/shoes/M25N3ASXD015N.png")
foreach ($point in @(@(350,730),@(390,740),@(430,740),@(470,745),@(650,740))) {
  $source = $original.GetPixel($point[0],$point[1])
  $actual = $runtime.GetPixel($point[0]-89,$point[1]-416)
  if ($source.A -lt 250 -or $actual.A -ne $source.A -or $actual.R -ne $source.R -or $actual.G -ne $source.G -or $actual.B -ne $source.B) {
    throw "Real opaque white outsole pixel changed at $($point[0]),$($point[1])"
  }
}
$original.Dispose(); $runtime.Dispose()
$reports = Get-Content "$root/evidence/products/shoes/alpha-restoration.json" -Raw | ConvertFrom-Json
foreach ($report in $reports) {
  $source = [System.Drawing.Bitmap]::FromFile("$root/reference/shoes/$($report.sku).png")
  $actual = [System.Drawing.Bitmap]::FromFile("$root/public/products/shoes/$($report.sku).png")
  for ($x=0;$x -lt $actual.Width;$x+=7) {
    for ($y=0;$y -le [Math]::Min($actual.Height-1,$report.bottomContour[$x]);$y+=7) {
      $a=$source.GetPixel($x+$report.crop[0],$y+$report.crop[1]); $b=$actual.GetPixel($x,$y)
      if ($a.ToArgb() -ne $b.ToArgb()) { throw "Source RGBA changed above lower contour for $($report.sku) at $x,$y" }
    }
  }
  $source.Dispose(); $actual.Dispose()
}
Write-Output 'PASS: five previously damaged white-sole pixels opaque and unchanged; sampled RGBA above continuous boundaries preserved for all four SKUs.'
