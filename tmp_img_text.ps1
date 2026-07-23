Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)
$w = $img.Width
$bodyTop = 220
$bodyBottom = 600
$darkThresh = 120

# count dark pixels per row in body
$rowCounts = New-Object int[] ($bodyBottom - $bodyTop)
$colCounts = New-Object int[] $w
for ($y = $bodyTop; $y -lt $bodyBottom; $y++) {
    $yy = $y - $bodyTop
    $cnt = 0
    for ($x = 0; $x -lt $w; $x++) {
        $c = $img.GetPixel($x, $y)
        $lum = 0.299*$c.R + 0.587*$c.G + 0.114*$c.B
        if ($lum -lt $darkThresh) { $cnt++; $colCounts[$x]++ }
    }
    $rowCounts[$yy] = $cnt
}

Write-Host "Text lines in body (y range and dark count):"
$inLine = $false
$lineStart = 0
for ($yy = 0; $yy -lt $rowCounts.Length; $yy++) {
    $cnt = $rowCounts[$yy]
    $y = $bodyTop + $yy
    if ($cnt -gt 15) {
        if (-not $inLine) { $lineStart = $y; $inLine = $true }
    } else {
        if ($inLine) {
            Write-Host "y $lineStart-$($y-1) peak $cnt"
            $inLine = $false
        }
    }
}

# Column dark counts over body
Write-Host "`nColumn dark counts over body (every 20px):"
for ($x = 0; $x -lt $w; $x += 20) {
    $cnt = 0
    for ($xx = $x; $xx -lt [Math]::Min($x+20, $w); $xx++) { $cnt += $colCounts[$xx] }
    $bar = ''
    if ($cnt -gt 0) { $bar = '#' * [Math]::Min([int]($cnt / 50), 80) }
    Write-Host "x $x : $cnt $bar"
}

$img.Dispose()
