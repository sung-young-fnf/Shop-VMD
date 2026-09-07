Add-Type -AssemblyName System.Drawing
$root = [System.IO.Path]::GetFullPath("$PSScriptRoot/../..")
$ids = @('M26N3ACVSP46N','M26N3ACVS026N','M25N3ASXD015N','M25N3ASHVT35N')
foreach ($id in $ids) {
  $image = [System.Drawing.Image]::FromFile("$root/reference/shoes/$id.png")
  $rgba = [System.Drawing.Bitmap]::new($image.Width, $image.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($rgba)
  $g.DrawImageUnscaled($image, 0, 0)
  $rgba.Save("$root/evidence/products/shoes/$id-rgba.png", [System.Drawing.Imaging.ImageFormat]::Png)
  $bounds = switch ($id) {
    'M26N3ACVSP46N' { @(90,446,720,292) }
    'M26N3ACVS026N' { @(90,433,720,307) }
    'M25N3ASXD015N' { @(89,416,720,360) }
    'M25N3ASHVT35N' { @(90,425,720,340) }
  }
  $crop = [System.Drawing.Bitmap]::new($bounds[2], $bounds[3], [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $cg = [System.Drawing.Graphics]::FromImage($crop)
  $cg.Clear([System.Drawing.Color]::White)
  $cg.DrawImage($image, [System.Drawing.Rectangle]::new(0,0,$bounds[2],$bounds[3]), [System.Drawing.Rectangle]::new($bounds[0],$bounds[1],$bounds[2],$bounds[3]), [System.Drawing.GraphicsUnit]::Pixel)
  $crop.Save("$root/evidence/products/shoes/$id-crop.png", [System.Drawing.Imaging.ImageFormat]::Png)
  $cg.Dispose(); $crop.Dispose()
  $g.Dispose(); $rgba.Dispose(); $image.Dispose()
}
