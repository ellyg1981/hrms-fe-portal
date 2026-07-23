Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)

function FindLines($xmin, $xmax, $ymin, $ymax, $label) {
    $w = $img.Width
    $counts = @()
    for ($y = $ymin; $y -lt $ymax; $y++) {
        $cnt = 0
        for ($x = $xmin; $x -lt $xmax; $x++) {
            $c = $img.GetPixel($x, $y)
            $lum = 0.299*$c.R + 0.587*$c.G + 0.114*$c.B
            if ($lum -lt 110) { $cnt++ }
        }
        $counts += $cnt
    }
    Write-Host "`n$label (x=$xmin-$xmax, y=$ymin-$ymax) text lines:"
    $inLine = $false
    $lineStart = 0
    for ($i = 0; $i -lt $counts.Length; $i++) {
        $y = $ymin + $i
        $cnt = $counts[$i]
        if ($cnt -gt 8) {
            if (-not $inLine) { $lineStart = $y; $inLine = $true }
        } else {
            if ($inLine) {
                Write-Host "  y $lineStart-$($y-1)"
                $inLine = $false
            }
        }
    }
}

FindLines 180 620 220 600 "Center fields"
FindLines 20 160 220 420 "Left QR"
FindLines 660 980 260 540 "Right photo"

$img.Dispose()
