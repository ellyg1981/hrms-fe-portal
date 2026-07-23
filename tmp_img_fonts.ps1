Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)

function TextBox($xmin, $xmax, $ymin, $ymax, $label, $bright=$false) {
    $minY = 10000; $maxY = 0; $minX = 10000; $maxX = 0; $any = $false
    for ($y = $ymin; $y -lt $ymax; $y++) {
        for ($x = $xmin; $x -lt $xmax; $x++) {
            $c = $img.GetPixel($x, $y)
            $lum = 0.299*$c.R + 0.587*$c.G + 0.114*$c.B
            $match = if ($bright) { $lum -gt 200 } else { $lum -lt 120 }
            if ($match) {
                $any = $true
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
            }
        }
    }
    if ($any) {
        [Console]::WriteLine("$label : x=$minX-$maxX y=$minY-$maxY width=$($maxX-$minX) height=$($maxY-$minY)")
    } else {
        [Console]::WriteLine("$label : not found")
    }
}

# Header white text (bright pixels on dark bg)
TextBox 200 800 20 180 "Header line 1" -bright $true
TextBox 200 800 60 180 "Header line 2" -bright $true
TextBox 200 800 100 180 "Header line 3" -bright $true

# Title and fields dark text on light bg
TextBox 250 620 228 247 "Title Swahili"
TextBox 270 620 268 285 "Title English"
TextBox 180 480 324 344 "Field1 ID"
TextBox 180 510 377 397 "Field2 Given"
TextBox 180 420 426 446 "Field3 Surname"
TextBox 180 600 524 544 "Field5 Rank"

$img.Dispose()
