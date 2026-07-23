Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)
$w = 120
$h = [int]($img.Height * $w / $img.Width)
$bitmap = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.DrawImage($img, 0, 0, $w, $h)
$g.Dispose()
$chars = ' .:-=+*#%@'
$sb = New-Object System.Text.StringBuilder
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $c = $bitmap.GetPixel($x, $y)
        $lum = 0.299 * $c.R + 0.587 * $c.G + 0.114 * $c.B
        $idx = [int]($lum / 255 * ($chars.Length - 1))
        [void]$sb.Append($chars[$chars.Length - 1 - $idx])
    }
    [void]$sb.AppendLine()
}
[Console]::WriteLine("Image size: $($img.Width)x$($img.Height) -> ASCII ${w}x${h}")
[Console]::Write($sb.ToString())
$img.Dispose()
$bitmap.Dispose()
