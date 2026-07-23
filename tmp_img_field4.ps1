Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)
$srcX=100; $srcY=460; $srcW=800; $srcH=80
$outW=80; $outH=8
$bitmap = New-Object System.Drawing.Bitmap($outW, $outH)
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.DrawImage($img, [System.Drawing.Rectangle]::FromLTRB(0,0,$outW,$outH), [System.Drawing.Rectangle]::FromLTRB($srcX,$srcY,$srcX+$srcW,$srcY+$srcH), [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$chars = ' .:-=+*#%@'
for ($y=0; $y -lt $outH; $y++) {
    $line = ""
    for ($x=0; $x -lt $outW; $x++) {
        $c = $bitmap.GetPixel($x,$y)
        $lum = 0.299*$c.R + 0.587*$c.G + 0.114*$c.B
        $idx = [int]($lum / 255 * ($chars.Length-1))
        $line += $chars[$chars.Length-1-$idx]
    }
    [Console]::WriteLine($line)
}
$img.Dispose(); $bitmap.Dispose()
