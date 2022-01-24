---
title: WWDC 2015 predictions recap
header-img: img/wwdc-2015-bg.png
date: 2015-06-08T17:38:00Z
tags:
  - WWDC
---

Now that all the announcements from WWDC have happened lets see how well I did in my [predictions](2015-06-05-WWDC-2015-Predictions.md).
<!-- excerpt -->
I've organized them by if I got them right or wrong. I've also included an extra section for an item that I had thoughts on but I didn't write about.

## Predictions I got right 👍

### iOS 9

iOS 9 was announced and it's mainly a performance and maintenance release. Metal being used under Core Graphics and Core Animation is a big help in the performance department. Some small improvements in battery life were made. They are also lowering the upgrade size to make it easier to get users on the latest version.

Like I predicted, they did't drop support for 32-bit. Because major GPU improvements are tied to when 64-bit was made available though, they made it possible to specify that your app is 64-bit only. This will help with people that are releasing games and the like that require better GPUs.

### OS 10.11

El Capitan is the next version of OS X, and it's also mainly a performance and maintenance release. Metal was introduced for the Mac, and it is also underpinning Core Graphics and Core Animation, which will greatly help with performance. There were other performance tweaks made as well.

Yes, I got the name wrong. Also, I plan on calling it Elc ("Elk") for short.

### Apple Watch Native SDK

watchOS 2 along with improved WatchKit were announced, meaning native watch apps. I need to dig into it more, but I feel there are a couple things still not possible, like OpenGL or true access to the Digital Crown. If true it's quite sad.

### Apple Streaming Music (Beats 2.0)

Apple Music had the most time dedicated to it in the Keynote. Enough said.

### Apple Pay improvements

Loyalty programs made it into Apple Pay. So did store cards. Passbook is now (correctly) renamed to Wallet.

### Swift 2.0

The Swift announcement was more than I expected, with the Open Source part of it being the big "surprise" of WWDC. I still haven't confirmed if it's ABI stable yet, or if it's going to be included in the operating systems. I would have expected them to announce those things, so I can assume they still aren't available.

### Objective-C improvements

I was completely wrong on what improvements were to be made, but they did some really nice ones, like generics in Objective-C 😍.

### San Fransisco system font

The new San Fransisco font is used everywhere. There is even a session covering it. I need to install 10.11 before I judge the OS X one.

### Swift Cocoa frameworks

No Swift Cocoa frameworks where announced. Like I thought, Swift isn't stable enough yet. That, or Objective-C interoperability isn't big enough yet. Or many other reasons.

### Siri integration

Siri Integration might not ever happen, which is sad. We did get the Spotlight integrations though, so that's sort of a win.

### Force Touch API on iOS

These won't be announced until the new hardware. Nothing new here.

### Any hardware at all

Not much to say. There is always just too much software to talk about.

### UXKit

I was secretly hoping I was wrong on UXKit. I feel this is 1-2 years out still. Swift needs to become the main language of both developers and Apple Engineers before they can solidify the framework for the next decade or two.

## Predictions I got wrong 👎

### NFC APIs

I hope I was just one year too soon on predicting NFC APIs, and that they wanted tho prevent Apple Pay/Wallet competition just a bit longer. This really should be a public API.

### TVKit

Someone messed up with AppleTV/TVKit. With the latest developer portal you now have limits per device type on how many devices you can register. This means 100 iPhones and 100 Apple Watches, etc. Right now it's listing Apple TV's though as well:

https://twitter.com/andrewe/status/607995057585680384

## Prediction I didn't make 😐

### UI testing

Last year I really thought we were going to get UI testing with XCTest. I thought XCTest was a great new foundation to finally get some UI testing love in Xcode. Instead we got performance tests. I was so caught up in thinking of other things that I forgot to predict that UI tests would finally make an appearance this year.
