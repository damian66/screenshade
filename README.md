# MacOS Menu Bar Shade App

The minimum screen brightness level was sometimes still to bright to me, usually when reading or watching at night. I decided to build something that would allow me to dim the screen even more. I used to read about Swift basics few years ago but with a JavaScript, a language that I am using daily while coding. 
  
<img src="/resources/screenshade-1.0.0.gif" width="50%" height="50%"/>  

**[Video Preview](https://streamable.com/68ccpw)**

## Electron app with native Menu class

- Used empty BrowserWindow with black opaque background (`rgba()`). It works well across multiple workspaces but is rendered as separate app when opening a mission control. Also, mouse cursor is above the shade which can look odd but could be viewed as a feature, not a bug ;)
- Native Menu does not allow custom content. I had to give up the slider input component in favor of increase/decrease menu items which was still bad because the menu was collapsing after every click. Adding 5 more to control opacity level was a UX rescue. I used 10%, 25%, 50%, 75%, and 90% values.
- Shortcuts work only when the status bar menu is opened. It is not acceptable because setting opacity to 90% could make it difficult to turn off. It seems that the `acceleratorWorksWhenHidden` MenuItem option is not working as expected for tray-only applications. 
- At the moment, there is no preferences menu. My plan is to allow editing shortcuts and opacity levels + some functionality like open at startup etc.

---

### Electron DMG Sizes with different formats

> Sizes below were calculated for the first prototype and are different from the current version of the app. Keeping just for reference.

I used Electron Forge to create a DMG file for the application. It supports different image formats and I was not able to find much information about them no the internet so I decided to try each of them to compare the output size. 

None of them satisfies me, the lowest size is still horrendously big for a simple application like this one. However, I like numbers generated with ULFO format.

See the table below with format sizes ordered ascending. 

| Format  | Size     | Description |
| ------- | -------: | ----------- |
| UDBZ    | 71.93MB  | `bzip2 compressed image (OS X 10.4+ only)` |
| ULFO    | 77.77MB  | `LZFSE compressed image` |
| UDZO    | 78.54MB  | `zlib-compressed image` |
| UDCO    | 96.13MB  | `ADC-compressed image` |
| UDRO    | 186.18MB | `non-compressed read-only image` |
| UDRW    | 314.00MB | `non-compressed read/write image` |

Little amount information that I found about these formats:
- http://disktype.sourceforge.net/doc/ch03s13.html#fmt_apple_images
- https://forensicswiki.xyz/wiki/index.php?title=DMG#Types_of_Format
