Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)
function ColorName($c) {
    $r=$c.R; $g=$c.G; $b=$c.B
    $max=[Math]::Max($r,[Math]::Max($g,$b)); $min=[Math]::Min($r,[Math]::Min($g,$b))
    if ($max-$min -lt 30) { if ($max -lt 60) { return 'K' } elseif ($max -gt 200) { return 'W' } else { return 'G' } }
    if ($g -gt $r+20 -and $g -gt $b+20) { return 'Gn' }
    if ($r -gt 180 -and $g -gt 180 -and $b -lt 120) { return 'Y' }
    if ($r -gt $g+30 -and $r -gt $b+30) { return 'R' }
    if ($b -gt $r+30) { return 'Bu' }
    return 'C'
}
foreach ($y in @(190, 380, 600)) {
    [Console]::WriteLine("Row y=$y")
    $line = ""
    for ($x = 0; $x -lt $img.Width; $x += 20) {
        $c = $img.GetPixel($x, $y)
        $line += (ColorName $c)
    }
    [Console]::WriteLine($line)
}
$img.Dispose()
