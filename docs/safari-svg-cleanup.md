# Safari SVG Cleanup

I have multiple 48x48 SVG app icons that look blurry on Safari/iPhone.

For each SVG, apply the same Safari-safe cleanup pattern:

1. Add a proper viewBox if missing:
   viewBox="0 0 48 48"

2. Remove any outer/global SVG filters applied to the whole icon, especially patterns like:
   <g filter="url(#...)">
   wrapping the full icon/background/border.

3. Remove inner SVG filters used for shadows/glows, especially filters containing:
   - feGaussianBlur
   - feOffset
   - feDropShadow
   - feMorphology
   - fractional values like x="3.875", y="5.25", dy="2.25", stdDeviation="2.25"

   Do not keep these filters unless absolutely necessary.

4. Remove clipPath usage if it is only clipping the full 48x48 rounded rectangle icon container, for example:
   <g clip-path="url(#...)">
   ...
   <clipPath>
     <rect width="48" height="48" rx="12"/>
   </clipPath>

   Instead, keep the base rounded rect directly:
   <rect width="48" height="48" fill="..." rx="12"/>

5. Add this to the root SVG:
   shape-rendering="geometricPrecision"

6. Keep gradients, fills, opacity, paths, and the border stroke unless they are directly causing blur.

7. After removing filters/clipPaths, also remove unused <filter> and <clipPath> definitions from <defs>.

8. Preserve:
   - width="48"
   - height="48"
   - all path shapes
   - all colors
   - all gradients
   - the 46x46 border rect, if present:
     <rect width="46" height="46" x="1" y="1" ... rx="11"/>

The goal is to avoid Safari rasterizing the SVG into blurry offscreen layers. Prefer simple vector shapes over SVG filters and clip paths.

## Examples

Before:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none"><g filter="url(#a)"><g clip-path="url(#b)"><rect width="48" height="48" fill="#c6005c" rx="12"/><path fill="url(#c)" d="M0 0h48v48H0z"/><g filter="url(#d)"><path fill="url(#e)" d="M25.603 11.275a6 6 0 0 0-8.485 0L8.632 19.76a6 6 0 0 0 0 8.485l8.486 8.486a6 6 0 0 0 8.485 0l4.049-4.049a9.003 9.003 0 0 1 .407-16.945q-.105-.11-.213-.22z"/><path fill="url(#f)" d="M29.652 32.685a9 9 0 1 0 .408-16.946c4.472 4.701 4.4 12.138-.214 16.752z" opacity=".5"/></g></g><rect width="46" height="46" x="1" y="1" stroke="url(#g)" stroke-width="2" rx="11"/></g><defs><linearGradient id="c" x1="24" x2="26" y1="0" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></linearGradient><linearGradient id="e" x1="18.467" x2="18.467" y1="9.518" y2="38.488" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></linearGradient><linearGradient id="f" x1="35.771" x2="35.771" y1="15.285" y2="33.285" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></linearGradient><linearGradient id="g" x1="24" x2="24" y1="0" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><filter id="a" width="48" height="54" x="0" y="-3" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="-3"/><feGaussianBlur stdDeviation="1.5"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend in2="shape" result="effect1_innerShadow_3051_46853"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="3"/><feGaussianBlur stdDeviation="1.5"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0"/><feBlend in2="effect1_innerShadow_3051_46853" result="effect2_innerShadow_3051_46853"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feMorphology in="SourceAlpha" radius="1" result="effect3_innerShadow_3051_46853"/><feOffset/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/><feBlend in2="effect2_innerShadow_3051_46853" result="effect3_innerShadow_3051_46853"/></filter><filter id="d" width="41.25" height="42" x="3.875" y="5.25" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feMorphology in="SourceAlpha" radius="1.5" result="effect1_dropShadow_3051_46853"/><feOffset dy="2.25"/><feGaussianBlur stdDeviation="2.25"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0.1 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_3051_46853"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_3051_46853" result="shape"/></filter><clipPath id="b"><rect width="48" height="48" fill="#fff" rx="12"/></clipPath></defs></svg>
```

After:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" shape-rendering="geometricPrecision"><rect width="48" height="48" fill="#c6005c" rx="12"/><path fill="url(#a)" d="M0 0h48v48H0z"/><path fill="url(#b)" d="M25.603 11.275a6 6 0 0 0-8.485 0L8.632 19.76a6 6 0 0 0 0 8.485l8.486 8.486a6 6 0 0 0 8.485 0l4.049-4.049a9.003 9.003 0 0 1 .407-16.945q-.105-.11-.213-.22z"/><path fill="url(#d)" d="M29.652 32.685a9 9 0 1 0 .408-16.946c4.472 4.701 4.4 12.138-.214 16.752z" opacity=".5"/><rect width="46" height="46" x="1" y="1" stroke="url(#g)" stroke-width="2" rx="11"/><defs><linearGradient id="a" x1="24" x2="26" y1="0" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></linearGradient><linearGradient id="b" x1="18.467" x2="18.467" y1="9.518" y2="38.488" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></linearGradient><linearGradient id="d" x1="35.771" x2="35.771" y1="15.285" y2="33.285" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></linearGradient><linearGradient id="g" x1="24" x2="24" y1="0" y2="48" gradientUnits="userSpaceOnUse"><stop stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs></svg>
```

**Do not try to “fix” Safari blur by just adding CSS. First remove SVG filters and unnecessary clip paths. Those are the main causes.**
