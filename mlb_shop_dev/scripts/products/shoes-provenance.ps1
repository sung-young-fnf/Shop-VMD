$root = [System.IO.Path]::GetFullPath("$PSScriptRoot/../..")
$selected = @('M26N3ACVSP46N','M26N3ACVS026N','M25N3ASXD015N','M25N3ASHVT35N')
$rejected = @('M25N3ARNR025N','M25N3ARNR045N','M25N3ARNR055N','M25N3ARNSPE5N','M25N3ASHC055N','M25N3ASHW075N','M25N3ASXT015N','M25N3ASXT025N','M25N3ASXT035N','M26N3ACVSP16N','M26N3ACVWL16N','M26N3ACVWL26N','M26N3ASHWC26N','M26N3ASHWC36N','M26N3ASHWC46N','M26N3ASXC016N','M26N3ASXC026N','M26N3ASXCB16N','M26N3ASXCB26N','M26N3ASXCE26N','M26N3ASXDP26N','M26N3ASXEE16N','M26N3ASXMJ76N','M26N3ASXMJS6N','M26S3ASDPA363')
$rows = foreach ($row in (Import-Csv "$root/reference/shoes/manifest.csv")) {
  $id = [System.IO.Path]::GetFileNameWithoutExtension($row.FILE)
  $status = if ($selected -contains $id) {'selected-individually-inspected'} elseif ($rejected -contains $id) {'rejected-human-or-worn'} else {'not-selected-product-only-contact-sheet'}
  [pscustomobject]@{sku=$id;file=$row.FILE;status=$status;reason= $(if($rejected -contains $id){'Visible human, legs or worn footwear in catalog photo'}elseif($selected -contains $id){'Human-free lateral shoe with intact product logo and complete main silhouette'}else{'Outside bounded four-product assortment; not admitted to runtime'});sourceUrl=$row.IMG_URL;sourceSha256=(Get-FileHash "$root/reference/shoes/$($row.FILE)" -Algorithm SHA256).Hash; runtimeFile=$(if($selected -contains $id){"products/shoes/$id.png"}else{$null});runtimeSha256=$(if($selected -contains $id){(Get-FileHash "$root/public/products/shoes/$id.png" -Algorithm SHA256).Hash}else{$null})}
}
$listed = @($rows | ForEach-Object file)
$unlisted = @(Get-ChildItem "$root/reference/shoes" -Filter *.png | Where-Object Name -NotIn $listed | ForEach-Object {
  [pscustomobject]@{sku=$_.BaseName;file=$_.Name;status='not-selected-missing-manifest-row';reason='Product-only contact-sheet image, no manifest row; not admitted to runtime';sourceUrl=$null;sourceSha256=(Get-FileHash $_.FullName -Algorithm SHA256).Hash;runtimeFile=$null;runtimeSha256=$null}
})
@($rows) + $unlisted | ConvertTo-Json -Depth 4 | Set-Content "$root/evidence/products/shoes/provenance.json" -Encoding utf8
$rows | Group-Object status | Select-Object Name,Count
