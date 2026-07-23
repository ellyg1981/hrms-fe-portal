Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)
foreach ($y in @(160, 180, 190, 200, 220, 600)) {
    [Console]::WriteLine("y=$y")
    $line = ""
    for ($x = 0; $x -lt $img.Width; $x += 50) {
        $c = $img.GetPixel($x, $y)
        $line += "{0:X2}{1:X2}{2:X2} " -f $c.R,$c.G,$c.B
    }
    [Console]::WriteLine($line)
}
$img.Dispose()
