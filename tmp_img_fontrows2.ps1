Add-Type -AssemblyName System.Drawing
$path = "d:\projects\HRMS-Staff\src\assets\images\id.png"
$img = [System.Drawing.Image]::FromFile($path)

function RowProfile($xmin, $xmax, $ymin, $ymax, $label, $bright=$false) {
    [Console]::WriteLine("`n$label")
    for ($y = $ymin; $y -lt $ymax; $y+=2) {
        $cnt = 0
        for ($x = $xmin; $x -lt $xmax; $x++) {
            $c = $img.GetPixel($x, $y)
            $lum = 0.299*$c.R + 0.587*$c.G + 0.114*$c.B
            if ($bright -and $lum -gt 200) { $cnt++ }
            elseif (-not $bright -and $lum -lt 120) { $cnt++ }
        }
        $bar = ''
        if ($cnt -gt 0) { $bar = '#' * [Math]::Min([int]($cnt / 5), 80) }
        [Console]::WriteLine("y {0,3}: {1,3} {2}" -f $y, $cnt, $bar)
    }
}

RowProfile 400 600 20 180 "Header text profile" -bright $true
RowProfile 300 600 220 300 "Title text profile" -bright $false
RowProfile 180 480 320 360 "Field1 profile" -bright $false
$img.Dispose()
