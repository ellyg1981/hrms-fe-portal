Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)
foreach ($y in @(195, 200, 205, 208, 212)) {
    [Console]::WriteLine("y=$y")
    $line = ""
    for ($x = 0; $x -lt $img.Width; $x += 10) {
        $c = $img.GetPixel($x, $y)
        $line += ("{0:X2}{1:X2}{2:X2}" -f $c.R,$c.G,$c.B) + " "
        if ($x % 100 -eq 90) { $line += "| " }
    }
    [Console]::WriteLine($line)
}
$img.Dispose()
