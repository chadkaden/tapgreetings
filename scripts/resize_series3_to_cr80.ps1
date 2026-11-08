Add-Type -AssemblyName System.Drawing

$imgDir = "G:\Server\projects\tapgreetings\assets\img\cr80"
$targetWidth = 1735
$targetHeight = 2752

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]95)

for ($num = 17; $num -le 24; $num++) {
    $code = "{0:D3}" -f $num
    foreach ($side in @("front", "back")) {
        $fileName = "$code-$side.jpg"
        $filePath = Join-Path $imgDir $fileName
        if (Test-Path $filePath) {
            $srcImg = [System.Drawing.Image]::FromFile($filePath)
            $origW = $srcImg.Width
            $origH = $srcImg.Height

            $destBitmap = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
            $destBitmap.SetResolution($srcImg.HorizontalResolution, $srcImg.VerticalResolution)

            $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

            $graphics.DrawImage($srcImg, 0, 0, $targetWidth, $targetHeight)
            $srcImg.Dispose()
            $graphics.Dispose()

            $tempPath = "$filePath.tmp.jpg"
            $destBitmap.Save($tempPath, $jpegCodec, $encoderParams)
            $destBitmap.Dispose()

            Move-Item -Path $tempPath -Destination $filePath -Force
            Write-Host "Processed $fileName : ($origW x $origH) -> ($targetWidth x $targetHeight)"

            # Also update assets/img/ if it exists
            $rootImgPath = "G:\Server\projects\tapgreetings\assets\img\$fileName"
            if (Test-Path $rootImgPath) {
                Copy-Item -Path $filePath -Destination $rootImgPath -Force
            }
        } else {
            Write-Warning "File not found: $filePath"
        }
    }
}
Write-Host "All Series 3 cards resized to CR80 dimensions (1735x2752) successfully!"
