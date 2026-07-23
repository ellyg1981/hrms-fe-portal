Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)

# Sample around photo region: x=670-900, y=270-530
# Check left edge, right edge, top, bottom for white/border
function showPixel($x, $y, $label) {
    $c = $img.GetPixel($x, $y)
    [Console]::WriteLine("$label x=$x y=$y : R=$($c.R) G=$($c.G) B=$($c.B)")
}

showPixel 670 300 "photo left edge top"
showPixel 670 400 "photo left edge mid"
showPixel 670 500 "photo left edge bottom"
showPixel 900 300 "photo right edge top"
showPixel 900 400 "photo right edge mid"
showPixel 900 500 "photo right edge bottom"
showPixel 750 270 "photo top edge"
showPixel 750 525 "photo bottom edge"
showPixel 710 350 "photo interior"
$img.Dispose()
