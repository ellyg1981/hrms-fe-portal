Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)
$w = $img.Width
Write-Host "Right edge x=$($w-10) colors (y every 10):"
for ($y=220; $y -lt 600; $y+=10) {
    $c = $img.GetPixel($w-10, $y)
    [Console]::WriteLine("y=$y : " + $c.R.ToString('X2') + $c.G.ToString('X2') + $c.B.ToString('X2'))
}
$img.Dispose()
