Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)
$cols = 20
$rows = 18
$cellW = [int]($img.Width / $cols)
$cellH = [int]($img.Height / $rows)
[Console]::WriteLine("Grid cell size: ${cellW}x${cellH}")
for ($ry = 0; $ry -lt $rows; $ry++) {
    $line = ""
    for ($rx = 0; $rx -lt $cols; $rx++) {
        $x = $rx * $cellW
        $y = $ry * $cellH
        $sumR = 0; $sumG = 0; $sumB = 0; $n = 0
        for ($py = $y; $py -lt [Math]::Min($y + $cellH, $img.Height); $py += 4) {
            for ($px = $x; $px -lt [Math]::Min($x + $cellW, $img.Width); $px += 4) {
                $c = $img.GetPixel($px, $py)
                $sumR += $c.R; $sumG += $c.G; $sumB += $c.B; $n++
            }
        }
        if ($n -eq 0) { $n = 1 }
        $r = [int]($sumR / $n); $g = [int]($sumG / $n); $b = [int]($sumB / $n)
        $lum = 0.299*$r + 0.587*$g + 0.114*$b
        $ch = if ($lum -lt 40) { '@' } elseif ($lum -lt 80) { '#' } elseif ($lum -lt 120) { '+' } elseif ($lum -lt 160) { ':' } elseif ($lum -lt 200) { '.' } elseif ($lum -lt 230) { '-' } else { ' ' }
        $hex = "{0:X2}{1:X2}{2:X2}" -f $r,$g,$b
        $line += "$ch$hex "
    }
    [Console]::WriteLine($line)
}
$img.Dispose()
