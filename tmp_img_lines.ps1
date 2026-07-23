Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)
$xmin = 180; $xmax = 620
$ymin = 220; $ymax = 600
$darkThresh = 110

$lines = @()
$inLine = $false
$lineStart = 0
for ($y = $ymin; $y -lt $ymax; $y++) {
    $cnt = 0
    for ($x = $xmin; $x -lt $xmax; $x++) {
        $c = $img.GetPixel($x, $y)
        $lum = 0.299*$c.R + 0.587*$c.G + 0.114*$c.B
        if ($lum -lt $darkThresh) { $cnt++ }
    }
    if ($cnt -gt 8) {
        if (-not $inLine) { $lineStart = $y; $inLine = $true }
    } else {
        if ($inLine) {
            $lines += @{ start=$lineStart; end=($y-1); count=$cnt }
            $inLine = $false
        }
    }
}
foreach ($ln in $lines) {
    $ys = $ln.start; $ye = $ln.end
    $minX = 10000; $maxX = 0
    for ($y = $ys; $y -le $ye; $y++) {
        for ($x = $xmin; $x -lt $xmax; $x++) {
            $c = $img.GetPixel($x, $y)
            $lum = 0.299*$c.R + 0.587*$c.G + 0.114*$c.B
            if ($lum -lt $darkThresh -and $x -lt $minX) { $minX = $x }
            if ($lum -lt $darkThresh -and $x -gt $maxX) { $maxX = $x }
        }
    }
    Write-Host "y $($ln.start)-$($ln.end)  x $minX-$maxX"
}
$img.Dispose()
