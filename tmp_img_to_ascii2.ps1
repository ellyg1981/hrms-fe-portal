Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)
[Console]::WriteLine("ImageSize: $($img.Width) x $($img.Height)")

$w = 80
$h = [int]($img.Height * $w / $img.Width)
$bitmap = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.DrawImage($img, 0, 0, $w, $h)
$g.Dispose()

$chars = '@%#*+=-:. '
function ColorName($c) {
    if ($c.A -lt 128) { return 'T' }
    $r = $c.R; $g = $c.G; $b = $c.B
    $max = [Math]::Max($r, [Math]::Max($g, $b))
    $min = [Math]::Min($r, [Math]::Min($g, $b))
    if ($max - $min -lt 30) {
        if ($max -lt 64) { return 'K' }
        if ($max -gt 200) { return 'W' }
        return 'G'
    }
    if ($g -gt $r + 20 -and $g -gt $b + 20) { return 'G' }
    if ($r -gt $g + 30 -and $r -gt $b + 30) { return 'R' }
    if ($b -gt $r + 30 -and $b -gt $g + 30) { return 'B' }
    if ($r -gt 200 -and $g -gt 200 -and $b -lt 120) { return 'Y' }
    return 'C'
}

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
[Console]::Write($sb.ToString())

function RegionColor($rx, $ry, $rw, $rh) {
    $sumR = 0; $sumG = 0; $sumB = 0; $n = 0
    for ($y = $ry; $y -lt $ry + $rh; $y++) {
        for ($x = $rx; $x -lt $rx + $rw; $x++) {
            $c = $bitmap.GetPixel($x, $y)
            $sumR += $c.R; $sumG += $c.G; $sumB += $c.B; $n++
        }
    }
    [pscustomobject]@{R=[int]($sumR/$n); G=[int]($sumG/$n); B=[int]($sumB/$n); Hex="#{0:X2}{1:X2}{2:X2}" -f [int]($sumR/$n),[int]($sumG/$n),[int]($sumB/$n)}
}

[Console]::WriteLine("RegionAvgColors (W=$w H=$h):")
[Console]::WriteLine("Header:      " + (RegionColor 0 0 $w ([int]($h*0.12)) | Out-String))
[Console]::WriteLine("Strip:       " + (RegionColor 0 ([int]($h*0.12)) $w ([int]($h*0.06)) | Out-String))
[Console]::WriteLine("Title:       " + (RegionColor 0 ([int]($h*0.18)) $w ([int]($h*0.12)) | Out-String))
[Console]::WriteLine("BodyLeft:    " + (RegionColor 0 ([int]($h*0.30)) ([int]($w*0.28)) ([int]($h*0.55)) | Out-String))
[Console]::WriteLine("BodyCenter:  " + (RegionColor ([int]($w*0.28)) ([int]($h*0.30)) ([int]($w*0.52)) ([int]($h*0.55)) | Out-String))
[Console]::WriteLine("BodyRight:   " + (RegionColor ([int]($w*0.80)) ([int]($h*0.30)) ([int]($w*0.20)) ([int]($h*0.55)) | Out-String))
[Console]::WriteLine("Photo:       " + (RegionColor ([int]($w*0.75)) ([int]($h*0.55)) ([int]($w*0.22)) ([int]($h*0.35)) | Out-String))

$img.Dispose()
$bitmap.Dispose()
