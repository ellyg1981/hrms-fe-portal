Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)
$w = $img.Width; $h = $img.Height
$darkThresh = 120
$rowCounts = @()
$colCounts = New-Object int[] $w
for ($y = 0; $y -lt $h; $y++) {
    $cnt = 0
    for ($x = 0; $x -lt $w; $x++) {
        $c = $img.GetPixel($x, $y)
        $lum = 0.299*$c.R + 0.587*$c.G + 0.114*$c.B
        if ($lum -lt $darkThresh) { $cnt++; $colCounts[$x]++ }
    }
    $rowCounts += $cnt
}
Write-Host "Row dark pixel counts (threshold $darkThresh):"
for ($y = 0; $y -lt $h; $y += 8) {
    $cnt = $rowCounts[$y]
    $bar = ''
    if ($cnt -gt 0) { $bar = '#' * [Math]::Min([int]($cnt / 30), 80) }
    Write-Host "y $([string]$y).PadLeft(4): $([string]$cnt).PadLeft(4)  $bar"
}

Write-Host "`nColumn dark pixel counts (every 20px):"
for ($x = 0; $x -lt $w; $x += 20) {
    $cnt = 0
    for ($xx = $x; $xx -lt [Math]::Min($x+20, $w); $xx++) { $cnt += $colCounts[$xx] }
    $bar = ''
    if ($cnt -gt 0) { $bar = '#' * [Math]::Min([int]($cnt / 80), 80) }
    Write-Host "x $([string]$x).PadLeft(4): $([string]$cnt).PadLeft(5)  $bar"
}
$img.Dispose()
