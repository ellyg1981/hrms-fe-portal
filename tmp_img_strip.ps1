Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)
$w = $img.Width
foreach ($y in @(200, 201, 202, 203, 204, 205, 206, 207, 208)) {
    [Console]::Write("y=$y ")
    for ($x = 0; $x -lt $w; $x += 10) {
        $c = $img.GetPixel($x, $y)
        $r=$c.R; $g=$c.G; $b=$c.B
        # classify
        $cls = ''
        if ($r -lt 20 -and $g -lt 20 -and $b -lt 20) { $cls = 'k' } # black
        elseif ($r -lt 20 -and $g -gt 80 -and $b -lt 20) { $cls = 'g' } # green
        elseif ($r -gt 200 -and $g -gt 200 -and $b -lt 50) { $cls = 'y' } # yellow
        elseif ($r -lt 60 -and $g -lt 40 -and $b -gt 150) { $cls = 'b' } # blue
        elseif (0.299*$r+0.587*$g+0.114*$b -lt 40) { $cls = 'K' }
        else { $cls = '.' }
        [Console]::Write($cls)
    }
    [Console]::WriteLine()
}
$img.Dispose()
