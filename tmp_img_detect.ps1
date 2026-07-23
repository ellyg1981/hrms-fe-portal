Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)
$w = $img.Width; $h = $img.Height
$bgR=206; $bgG=204; $bgB=255

function Bounds($predicate) {
    $minX=$w; $maxX=0; $minY=$h; $maxY=0; $any=$false
    for ($y=0; $y -lt $h; $y+=2) {
        for ($x=0; $x -lt $w; $x+=2) {
            $c = $img.GetPixel($x,$y)
            if (& $predicate $c) {
                if ($x -lt $minX) { $minX=$x }; if ($x -gt $maxX) { $maxX=$x }
                if ($y -lt $minY) { $minY=$y }; if ($y -gt $maxY) { $maxY=$y }
                $any=$true
            }
        }
    }
    if ($any) { [pscustomobject]@{left=$minX; top=$minY; right=$maxX; bottom=$maxY; width=($maxX-$minX); height=($maxY-$minY)} } else { $null }
}

# QR: dark pixels in left upper body
$qr = Bounds { param($c); $x=$args[0].X; $y=$args[0].Y; $c = $args[0]
    $lum = 0.299*$c.R+0.587*$c.G+0.114*$c.B
    return ($lum -lt 100 -and $c.X -lt 220 -and $c.Y -gt 200 -and $c.Y -lt 450)
}
Write-Host "QR dark bounds: $qr"

# Photo: pixels significantly different from background lavender, right side
$photo = Bounds { param($c)
    $dx = [Math]::Abs($c.R - $bgR) + [Math]::Abs($c.G - $bgG) + [Math]::Abs($c.B - $bgB)
    return ($dx -gt 80 -and $c.X -gt 600 -and $c.Y -gt 220 -and $c.Y -lt 600)
}
Write-Host "Photo difference bounds: $photo"

# Header strip: bright green/yellow/blue near y=200, central
foreach ($scanY in @(200, 204)) {
    Write-Host "`nStrip row y=$scanY colors (every 20px):"
    $line = ""
    for ($x=0; $x -lt $w; $x+=20) {
        $c = $img.GetPixel($x, $scanY)
        $line += ("{0:X2}{1:X2}{2:X2} " -f $c.R,$c.G,$c.B)
    }
    Write-Host $line
}

$img.Dispose()
