Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)

function ScanColumn($x, $ymin, $ymax, $label, $bright=$false) {
    [Console]::WriteLine("`n$label x=$x")
    for ($y = $ymin; $y -lt $ymax; $y+=2) {
        $c = $img.GetPixel($x, $y)
        $lum = 0.299*$c.R + 0.587*$c.G + 0.114*$c.B
        $ch = if ($bright) { if ($lum -gt 200) { '#' } else { '.' } } else { if ($lum -lt 120) { '#' } else { '.' } }
        [Console]::Write($ch)
    }
    [Console]::WriteLine()
}

ScanColumn 500 20 180 "Header center" -bright $true
ScanColumn 440 220 300 "Title center" -bright $false
ScanColumn 220 320 380 "Field1 left" -bright $false
ScanColumn 220 420 470 "Field3 left" -bright $false
$img.Dispose()
